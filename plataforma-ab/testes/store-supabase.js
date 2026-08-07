/**
 * Testa o driver `supabase` do store contra um PostgREST de mentira.
 *
 * Por que isso existe: em desenvolvimento só o driver de ARQUIVO roda. O driver
 * do Supabase é o que vai pra produção e, sem este teste, estrearia lá. Um
 * `on_conflict` errado ou um header de `Prefer` faltando só apareceria como
 * "os números estão estranhos" duas semanas depois.
 *
 * O falso PostgREST não implementa Postgres — ele CONFERE as requisições:
 * método, caminho, query e headers. É conformidade de protocolo, não de dados.
 *
 *   node testes/store-supabase.js
 */

import http from 'node:http';

const recebidas = [];
let respostaDe = () => [200, '[]'];

const servidor = http.createServer((req, res) => {
  let corpo = '';
  req.on('data', (c) => { corpo += c; });
  req.on('end', () => {
    recebidas.push({ metodo: req.method, url: req.url, headers: req.headers, corpo });
    const [status, texto] = respostaDe(req, corpo);
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(texto);
  });
});
await new Promise((r) => servidor.listen(0, r));
const PORTA = servidor.address().port;

process.env.AB_STORE = 'supabase';
process.env.AB_SUPABASE_URL = `http://localhost:${PORTA}`;
process.env.AB_SUPABASE_KEY = 'chave-de-mentira';

const { criarStore, agregar } = await import('../lib/store.js');
const store = criarStore();

const checagens = [];
const checar = (nome, ok, detalhe) => { checagens.push({ nome, ok: !!ok, detalhe }); };
const ultima = () => recebidas[recebidas.length - 1];

console.log('driver:', store.modo, '\n');

// ── 1. autenticação em toda chamada ─────────────────────────────────────────
respostaDe = () => [200, '[]'];
await store.listarTestes();
checar('manda apikey e Authorization',
  ultima().headers.apikey === 'chave-de-mentira' &&
  ultima().headers.authorization === 'Bearer chave-de-mentira');

// ── 2. listar traz as variantes junto (sem N+1) ─────────────────────────────
checar('listarTestes faz join das variantes numa chamada só',
  ultima().url.includes('variantes:ab_variantes(*)'), ultima().url);

// ── 3. obterTeste escapa o slug ─────────────────────────────────────────────
respostaDe = () => [200, '[]'];
await store.obterTeste('slug com espaço & coisa');
checar('obterTeste escapa o slug na query',
  ultima().url.includes('slug%20com%20espa') && !ultima().url.includes(' '),
  ultima().url);

// ── 4. evento: on_conflict e Prefer corretos ────────────────────────────────
//
// Estes dois são A deduplicação em produção. Em serverless não existe estado
// entre invocações, então o índice em memória do driver de arquivo não serve —
// quem deduplica é a restrição UNIQUE do banco, acionada por este par.
respostaDe = () => [201, '[{"id":1}]'];
const r1 = await store.registrarEvento({
  teste: 't', variante: 'A', visitante: 'v1', tipo: 'assignment', dia: '2026-08-06',
});
checar('evento usa on_conflict=teste,visitante,tipo',
  ultima().url.includes('on_conflict=teste,visitante,tipo'), ultima().url);
checar('evento usa Prefer: resolution=ignore-duplicates',
  String(ultima().headers.prefer).includes('ignore-duplicates'), ultima().headers.prefer);
checar('evento pede return=representation (é como se sabe se era novo)',
  String(ultima().headers.prefer).includes('return=representation'), ultima().headers.prefer);
checar('insert novo devolve novo=true', r1.novo === true);

// ── 5. duplicata: PostgREST devolve 201 com lista VAZIA ─────────────────────
respostaDe = () => [201, '[]'];
const r2 = await store.registrarEvento({
  teste: 't', variante: 'A', visitante: 'v1', tipo: 'assignment', dia: '2026-08-06',
});
checar('duplicata devolve novo=false (corpo vazio, não erro)', r2.novo === false);

// ── 6. paginação: não pode parar no primeiro lote ───────────────────────────
//
// O PostgREST devolve no máximo 1000 linhas por vez. Um teste com mais de 1000
// eventos — que é o caso NORMAL — teria a contagem truncada sem paginar.
let pagina = 0;
respostaDe = (req) => {
  if (!req.url.includes('/ab_eventos')) return [200, '[]'];
  pagina++;
  if (pagina === 1) return [200, JSON.stringify(Array.from({ length: 1000 }, (_, i) => ({ id: i })))];
  if (pagina === 2) return [200, JSON.stringify(Array.from({ length: 250 }, (_, i) => ({ id: 1000 + i })))];
  return [200, '[]'];
};
const evs = await store.eventosDoTeste('t');
checar('pagina até o fim (1000 + 250 = 1250)', evs.length === 1250, `veio ${evs.length}`);
checar('usa offset na segunda página',
  recebidas.some((r) => r.url.includes('offset=1000')));

// ── 7. erro do banco não passa silencioso ───────────────────────────────────
respostaDe = () => [500, '{"message":"boom"}'];
let estourou = false;
try { await store.listarTestes(); } catch { estourou = true; }
checar('erro HTTP vira exceção (não devolve lista vazia calada)', estourou);

// ── 8. salvarTeste: cabeçalho e variantes separados ─────────────────────────
recebidas.length = 0;
respostaDe = () => [201, ''];
await store.salvarTeste({
  slug: 'x', nome: 'X', status: 'rodando', seed: 'x',
  variantes: [
    { chave: 'A', nome: 'a', url: 'https://lp.cardapioweb.com/a', peso: 0.5, ordem: 0 },
    { chave: 'B', nome: 'b', url: 'https://lp.cardapioweb.com/b', peso: 0.5, ordem: 1 },
  ],
});
const paraTestes = recebidas.filter((r) => r.url.includes('/ab_testes'));
const paraVariantes = recebidas.filter((r) => r.url.includes('/ab_variantes'));
checar('grava o cabeçalho em ab_testes com merge-duplicates',
  paraTestes.length === 1 && String(paraTestes[0].headers.prefer).includes('merge-duplicates'));
checar('não manda o array `variantes` dentro de ab_testes (coluna não existe)',
  paraTestes.length === 1 && !JSON.parse(paraTestes[0].corpo).variantes);
checar('apaga e reinsere as variantes (DELETE + POST)',
  paraVariantes.some((r) => r.metodo === 'DELETE') && paraVariantes.some((r) => r.metodo === 'POST'));
checar('cada variante leva o teste_slug',
  paraVariantes.filter((r) => r.metodo === 'POST')
    .every((r) => JSON.parse(r.corpo).every((v) => v.teste_slug === 'x')));

// ── 8b. o job diário NÃO pode reescrever variantes ──────────────────────────
recebidas.length = 0;
respostaDe = () => [200, '[{"slug":"x"}]'];
await store.atualizarVeredito('x', { ultimo_veredito: 'vencedor', vencedor: 'B' });
checar('atualizarVeredito usa PATCH em ab_testes',
  recebidas.length === 1 && recebidas[0].metodo === 'PATCH' && recebidas[0].url.includes('/ab_testes'));
checar('atualizarVeredito NÃO encosta em ab_variantes',
  !recebidas.some((r) => r.url.includes('/ab_variantes')));
checar('atualizarVeredito filtra pelo slug',
  recebidas[0].url.includes('slug=eq.x'), recebidas[0].url);

// ── 9. a agregação é a mesma dos dois drivers ───────────────────────────────
//
// `agregar()` roda sobre a lista de eventos, venha ela de onde vier. Se ela
// dependesse do driver, arquivo e Supabase dariam números diferentes.
const evsFake = [
  { teste: 't', variante: 'A', visitante: 'v1', tipo: 'assignment', criado_em: '2026-08-01T10:00:00Z', dia: '2026-08-01', bot: false },
  { teste: 't', variante: 'B', visitante: 'v2', tipo: 'assignment', criado_em: '2026-08-01T10:00:00Z', dia: '2026-08-01', bot: false },
  { teste: 't', variante: 'B', visitante: 'v1', tipo: 'conversion', criado_em: '2026-08-01T11:00:00Z', dia: '2026-08-01', bot: false },
];
const ag = agregar(evsFake);
checar('agregar independe do driver: conversão vai pra variante ATRIBUÍDA',
  ag.porVariante.A.conv === 1 && (ag.porVariante.B?.conv || 0) === 0);

// ── 10. falta de configuração é erro claro ──────────────────────────────────
delete process.env.AB_SUPABASE_KEY;
let msg = '';
try { criarStore({ modo: 'supabase' }); } catch (e) { msg = e.message; }
checar('sem credencial, erro explica o que falta',
  msg.includes('AB_SUPABASE_URL') && msg.includes('AB_SUPABASE_KEY'), msg);

// ── resumo ──────────────────────────────────────────────────────────────────
console.log('─'.repeat(78));
for (const c of checagens) {
  console.log(`  ${c.ok ? '[x]' : '[!]'} ${c.nome.padEnd(62, '.')} ${c.ok ? 'OK' : 'FALHOU'}`);
  if (!c.ok && c.detalhe) console.log(`      └ ${c.detalhe}`);
}
const falhas = checagens.filter((c) => !c.ok).length;
console.log('─'.repeat(78));
console.log(`  ${checagens.length - falhas}/${checagens.length} passaram.`);
console.log('\n  Isto confere o PROTOCOLO (método, caminho, headers), não o Postgres.');
console.log('  As restrições de verdade estão no schema.sql e só valem quando rodadas lá.');

await new Promise((r) => servidor.close(r));
process.exitCode = falhas ? 1 : 0;
