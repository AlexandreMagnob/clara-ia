/**
 * Entrada hostil no nível HTTP.
 *
 * Os testes de unidade cobrem as funções; a simulação cobre o caminho feliz.
 * Este arquivo cobre o meio: a fiação dos endpoints, que é onde mora o furo que
 * nenhum dos dois pega — corpo malformado, token errado, origem estranha,
 * tentativa de inflar a amostra pelo navegador.
 *
 * Regra de ouro daqui: **nenhuma entrada pode produzir 500**. 400 é resposta,
 * 500 é bug.
 *
 *   node testes/ataques.js
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.dirname(AQUI);
const DIR = path.join(RAIZ, 'dados-ataques');
const PORTA = 3197;
const BASE = `http://localhost:${PORTA}`;
const TOKEN = 'tok-ataques';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const checagens = [];
function checar(nome, ok, detalhe) {
  checagens.push({ nome, ok: !!ok, detalhe: detalhe == null ? '' : String(detalhe).slice(0, 160) });
}

if (fs.existsSync(DIR)) fs.rmSync(DIR, { recursive: true, force: true });
fs.mkdirSync(DIR, { recursive: true });

const servidor = spawn(process.execPath, [path.join(AQUI, 'dev-server.js'), '--porta', String(PORTA)], {
  env: {
    ...process.env,
    AB_DIR: DIR, AB_STORE: 'arquivo', AB_ADMIN_TOKEN: TOKEN, AB_CRON_SECRET: 'cron-ataques',
    AB_PERMITIR_HTTP: '1', AB_DOMINIOS_PERMITIDOS: 'cardapioweb.com,localhost',
    AB_SLACK_WEBHOOK: '',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let erroServidor = '';
servidor.stderr.on('data', (d) => { erroServidor += d; });

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
for (let i = 0; i < 100; i++) {
  try { const r = await fetch(BASE + '/api/testes', { headers: { 'X-AB-Token': TOKEN } }); if (r.status < 500) break; } catch {}
  await esperar(100);
}

const bater = async (caminho, opts = {}) => {
  const r = await fetch(BASE + caminho, {
    method: opts.method || 'GET',
    headers: { 'User-Agent': UA, ...(opts.headers || {}) },
    body: opts.body,
    redirect: 'manual',
  });
  const txt = await r.text();
  return { status: r.status, txt, headers: r.headers, local: r.headers.get('location') };
};
const comToken = (extra = {}) => ({ 'X-AB-Token': TOKEN, 'Content-Type': 'application/json', ...extra });

// ── monta um teste válido pra atacar ────────────────────────────────────────
const teste = {
  slug: 'alvo', nome: 'Alvo', status: 'rodando', baseline: 0.1, mde: 0.3,
  variantes: [
    { chave: 'A', nome: 'a', url: `http://localhost:${PORTA}/lp/controle`, peso: 0.5 },
    { chave: 'B', nome: 'b', url: `http://localhost:${PORTA}/lp/variante-b`, peso: 0.5 },
  ],
};
const criado = await bater('/api/testes', { method: 'POST', headers: comToken(), body: JSON.stringify(teste) });
checar('setup: teste criado', criado.status === 201, criado.txt);

console.log('\n═══ 1. CORPO MALFORMADO — nada pode virar 500 ═══');
for (const [nome, corpo] of [
  ['null', 'null'], ['número', '123'], ['string', '"oi"'], ['array', '[1,2,3]'],
  ['vazio', ''], ['JSON quebrado', '{"a":'], ['objeto sem campos', '{}'],
  ['tipo nulo', '{"tipo":null,"teste":"alvo","visitante":"aaaaaaaaaaaaaaaa"}'],
  ['visitante objeto', '{"tipo":"view","teste":"alvo","visitante":{"a":1}}'],
  ['slug enorme', JSON.stringify({ tipo: 'view', teste: 'x'.repeat(5000), visitante: 'a'.repeat(16) })],
]) {
  const r = await bater('/api/ev', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: corpo });
  checar(`/api/ev com ${nome} → não é 500`, r.status !== 500, `HTTP ${r.status}`);
}

console.log('═══ 2. A REGRA CRÍTICA: navegador não cria atribuição ═══');
for (const tipo of ['assignment', 'ASSIGNMENT', 'Assignment', ' assignment', 'assignment ']) {
  const r = await bater('/api/ev', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teste: 'alvo', variante: 'B', visitante: 'abcdef0123456789', tipo }),
  });
  checar(`/api/ev recusa tipo="${tipo}"`, r.status === 400, `HTTP ${r.status}: ${r.txt}`);
}

console.log('═══ 3. INFLAR A AMOSTRA PELO NAVEGADOR ═══');
// Conversão de visitante que nunca passou pelo roteador tem que ser descartada.
await bater('/api/ev', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ teste: 'alvo', variante: 'B', visitante: 'ffffffffffffffff', tipo: 'conversion' }),
});
let res = JSON.parse((await bater('/api/resultados?s=alvo', { headers: comToken() })).txt);
checar('conversão de visitante nunca atribuído não conta',
  (res.variantes.find((v) => v.chave === 'B').conv) === 0 && res.saude.conversoes_orfas === 1,
  JSON.stringify(res.saude));

// Visitante real: roteia, depois tenta declarar variante errada e converter 3x.
const ida = await bater('/t/alvo');
const u = new URL(ida.local);
const vidReal = u.searchParams.get('cwvid');
const varReal = u.searchParams.get('cwab').split(':')[1];
const varFalsa = varReal === 'A' ? 'B' : 'A';
for (let i = 0; i < 3; i++) {
  await bater('/api/ev', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teste: 'alvo', variante: varFalsa, visitante: vidReal, tipo: 'conversion' }),
  });
}
res = JSON.parse((await bater('/api/resultados?s=alvo', { headers: comToken() })).txt);
const real = res.variantes.find((v) => v.chave === varReal);
const falsa = res.variantes.find((v) => v.chave === varFalsa);
checar('conversão vai pra variante ATRIBUÍDA, não pra declarada',
  real.conv === 1 && falsa.conv === 0, `${varReal}=${real.conv} ${varFalsa}=${falsa.conv}`);
checar('3 conversões do mesmo visitante contam 1', real.conv === 1, `conv=${real.conv}`);

console.log('═══ 4. AUTENTICAÇÃO ═══');
for (const [nome, h] of [
  ['sem token', {}],
  ['token errado', { 'X-AB-Token': 'errado' }],
  ['token vazio', { 'X-AB-Token': '' }],
  ['prefixo do token certo', { 'X-AB-Token': TOKEN.slice(0, -1) }],
  ['token + lixo', { 'X-AB-Token': TOKEN + 'x' }],
]) {
  const r = await bater('/api/testes', { headers: h });
  checar(`/api/testes ${nome} → 401`, r.status === 401, `HTTP ${r.status}`);
}
const cronRuim = await bater('/api/analisar', { headers: { Authorization: 'Bearer errado' } });
checar('/api/analisar com segredo errado → 401', cronRuim.status === 401, `HTTP ${cronRuim.status}`);
const cronOk = await bater('/api/analisar', { headers: { Authorization: 'Bearer cron-ataques' } });
checar('/api/analisar com segredo certo → 200', cronOk.status === 200, `HTTP ${cronOk.status}`);

console.log('═══ 5. REDIRECT: lista de domínios ═══');
for (const [nome, url] of [
  ['domínio de fora', 'https://invasor.net/x'],
  ['sufixo enganoso', 'https://cardapioweb.com.invasor.net/x'],
  ['javascript:', 'javascript:alert(1)'],
  ['data:', 'data:text/html,<script>alert(1)</script>'],
  ['credencial embutida', 'https://user:senha@cardapioweb.com/x'],
  ['barra dupla', '//invasor.net/x'],
  ['file://', 'file:///etc/passwd'],
]) {
  const r = await bater('/api/testes', {
    method: 'POST', headers: comToken(),
    body: JSON.stringify({ ...teste, slug: 'mau', status: 'rascunho', variantes: [{ ...teste.variantes[0] }, { chave: 'B', nome: 'b', url, peso: 0.5 }] }),
  });
  checar(`URL "${nome}" é recusada na gravação`, r.status === 422, `HTTP ${r.status}`);
}

console.log('═══ 6. ROTEADOR: entrada estranha ═══');
for (const [nome, caminho] of [
  ['slug inexistente', '/t/nao-existe'],
  ['slug com traversal', '/t/..%2f..%2fetc%2fpasswd'],
  ['slug enorme', '/t/' + 'x'.repeat(3000)],
  ['slug vazio', '/t/'],
  ['cwforce inexistente', '/t/alvo?cwforce=ZZZ'],
  ['cwab falsificado', '/t/alvo?cwab=outro:Z'],
  ['param repetido', '/t/alvo?utm_source=a&utm_source=b'],
  ['unicode', '/t/alvo?utm_campaign=%F0%9F%92%A5'],
]) {
  const r = await bater(caminho);
  checar(`roteador com ${nome} → não é 500`, r.status !== 500, `HTTP ${r.status}`);
  if (r.local) {
    checar(`  destino de ${nome} fica no domínio permitido`,
      /^https?:\/\/(localhost|([a-z0-9-]+\.)?cardapioweb\.com)([:/]|$)/.test(r.local), r.local);
  }
}
// cwab da URL não pode sobrescrever a variante real
const falsificado = await bater('/t/alvo?cwab=outro:Z');
checar('cwab da entrada não sobrescreve o cwab do destino',
  falsificado.local && falsificado.local.includes('cwab=alvo%3A'), falsificado.local);

console.log('═══ 7. CONFIGURAÇÃO TRAVADA COM O TESTE RODANDO ═══');
for (const [nome, mudanca] of [
  ['peso', { variantes: [{ ...teste.variantes[0], peso: 0.8 }, { ...teste.variantes[1], peso: 0.2 }] }],
  ['URL de variante', { variantes: [{ ...teste.variantes[0], url: `http://localhost:${PORTA}/lp/outra` }, teste.variantes[1]] }],
  ['seed', { seed: 'outra-semente' }],
  ['nova variante', { variantes: [...teste.variantes.map((v) => ({ ...v, peso: 0.33 })), { chave: 'C', nome: 'c', url: `http://localhost:${PORTA}/lp/c`, peso: 0.34 }] }],
]) {
  const r = await bater('/api/testes', { method: 'POST', headers: comToken(), body: JSON.stringify({ ...teste, ...mudanca }) });
  checar(`mudar ${nome} com o teste rodando → 422`, r.status === 422, `HTTP ${r.status}: ${r.txt.slice(0, 90)}`);
}
const soNome = await bater('/api/testes', { method: 'POST', headers: comToken(), body: JSON.stringify({ ...teste, nome: 'Nome novo' }) });
checar('mudar só o nome com o teste rodando é permitido', soNome.status === 200, `HTTP ${soNome.status}`);
const apagar = await bater('/api/testes?s=alvo', { method: 'DELETE', headers: comToken() });
checar('apagar teste rodando → 409', apagar.status === 409, `HTTP ${apagar.status}`);

console.log('═══ 8. ORIGEM DO EVENTO ═══');
const origemMa = await bater('/api/ev', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Origin: 'https://invasor.net' },
  body: JSON.stringify({ teste: 'alvo', variante: 'A', visitante: 'abcdef0123456789', tipo: 'view' }),
});
checar('evento de origem não permitida → 403', origemMa.status === 403, `HTTP ${origemMa.status}`);
const origemBoa = await bater('/api/ev', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Origin: 'https://lp.cardapioweb.com' },
  body: JSON.stringify({ teste: 'alvo', variante: 'A', visitante: 'abcdef0123456789', tipo: 'view' }),
});
checar('evento de origem permitida → 200', origemBoa.status === 200, `HTTP ${origemBoa.status}`);

console.log('═══ 9. ARQUIVO ESTÁTICO ═══');
for (const caminho of [
  '/../.env', '/..%2f..%2f.env', '/../../../../etc/passwd',
  '/%2e%2e/%2e%2e/.env', '/../lib/store.js', '/../dados/testes.json',
]) {
  const r = await bater(caminho);
  const vazou = r.status === 200 && (r.txt.includes('SUPABASE') || r.txt.includes('driverArquivo') || r.txt.includes('"slug"'));
  checar(`estático "${caminho}" não vaza arquivo`, !vazou, `HTTP ${r.status}`);
}

console.log('═══ 10. CORPO GRANDE ═══');
const gigante = await bater('/api/ev', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ teste: 'alvo', variante: 'A', visitante: 'abcdef0123456789', tipo: 'view', lixo: 'x'.repeat(600 * 1024) }),
}).catch((e) => ({ status: 'conexão cortada', txt: String(e) }));
checar('corpo de 600 KB é recusado (não engolido)',
  gigante.status !== 200, `${gigante.status}`);

// ── resumo ──────────────────────────────────────────────────────────────────
console.log('\n' + '═'.repeat(78));
const falhas = checagens.filter((c) => !c.ok);
for (const c of checagens) {
  if (!c.ok) console.log(`  [!] ${c.nome}\n      └ ${c.detalhe}`);
}
console.log(`  ${checagens.length - falhas.length}/${checagens.length} checagens passaram.`);
if (erroServidor.includes('Error') || erroServidor.includes('erro:')) {
  console.log('\n  stderr do servidor (esperado vazio):');
  console.log(erroServidor.split('\n').slice(0, 12).map((l) => '    ' + l).join('\n'));
}
console.log('═'.repeat(78));

servidor.kill();
fs.rmSync(DIR, { recursive: true, force: true });
process.exitCode = falhas.length ? 1 : 0;
