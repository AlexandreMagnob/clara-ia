/**
 * Prova o caminho do Slack de ponta a ponta SEM postar em canal de verdade.
 *
 * Sobe um receptor local que se comporta como um Incoming Webhook do Slack
 * (inclusive respondendo o literal `ok`), aponta `AB_SLACK_WEBHOOK` pra ele e
 * roda o job de análise. Mostra exatamente o JSON que chega.
 *
 * Também testa os dois modos de falha que importam:
 *   - webhook devolvendo `invalid_payload` com HTTP 200 (o Slack faz isso!)
 *   - webhook fora do ar
 * Nos dois, o veredito NÃO pode ser persistido — senão o aviso se perde pra
 * sempre e ninguém fica sabendo do vencedor.
 *
 *   node testes/slack-local.js
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.dirname(AQUI);
const DIR = path.join(RAIZ, 'dados-slack');

process.env.AB_STORE = 'arquivo';
process.env.AB_DIR = DIR;
process.env.AB_URL_PAINEL = 'https://ab-cardapioweb.vercel.app/';

const { criarStore } = await import('../lib/store.js');
const { analisarTeste } = await import('../lib/analise.js');
const { avisar } = await import('../lib/slack.js');

const bloco = (s) => { console.log('\n' + '─'.repeat(78)); console.log(s); console.log('─'.repeat(78)); };

// ── receptor que finge ser o Slack ──────────────────────────────────────────
let modo = 'ok';
const recebidos = [];
const slackFalso = http.createServer((req, res) => {
  let b = '';
  req.on('data', (c) => { b += c; });
  req.on('end', () => {
    recebidos.push({ headers: req.headers, corpo: b });
    if (modo === 'ok') { res.writeHead(200, { 'Content-Type': 'text/plain' }); return res.end('ok'); }
    if (modo === 'invalido') { res.writeHead(200, { 'Content-Type': 'text/plain' }); return res.end('invalid_payload'); }
    res.writeHead(500); res.end('erro');
  });
});
await new Promise((r) => slackFalso.listen(0, r));
const PORTA = slackFalso.address().port;
const WEBHOOK = `http://localhost:${PORTA}/services/T000/B000/xxx`;

// ── monta um teste com vencedor claro ───────────────────────────────────────
if (fs.existsSync(DIR)) fs.rmSync(DIR, { recursive: true, force: true });
fs.mkdirSync(DIR, { recursive: true });
const store = criarStore();

const teste = {
  slug: 'hero-lp-sql',
  nome: 'Hero da LP de SQL: painel vs. cardápio digital',
  hipotese: 'Se o hero mostrar o cardápio digital, a conversão sobe.',
  jira: 'GWT-3256',
  status: 'rodando',
  seed: 'hero-lp-sql',
  cobertura: 1,
  baseline: 0.1,
  mde: 0.5,
  alfa: 0.05,
  poder: 0.8,
  min_dias: 7,
  max_dias: 30,
  ultimo_veredito: null,
  variantes: [
    { chave: 'A', nome: 'controle (painel)', url: 'https://lp.cardapioweb.com/sql', peso: 0.5, ordem: 0 },
    { chave: 'B', nome: 'cardápio digital', url: 'https://lp.cardapioweb.com/sql-b', peso: 0.5, ordem: 1 },
  ],
};
await store.salvarTeste(teste);

// 10 dias, 900 por braço, A=10% e B=15%
const hoje = new Date();
let seq = 0;
for (let d = 9; d >= 0; d--) {
  const data = new Date(hoje); data.setDate(data.getDate() - d);
  const dia = data.toISOString().slice(0, 10);
  for (const [chave, taxa] of [['A', 0.10], ['B', 0.15]]) {
    for (let i = 0; i < 90; i++) {
      const vid = ('v' + (seq++)).padEnd(16, '0');
      await store.registrarEvento({ teste: teste.slug, variante: chave, visitante: vid, tipo: 'assignment', criado_em: dia + 'T14:00:00.000Z', dia, bot: false });
      if (Math.random() < taxa) {
        await store.registrarEvento({ teste: teste.slug, variante: chave, visitante: vid, tipo: 'conversion', criado_em: dia + 'T14:05:00.000Z', dia, bot: false });
      }
    }
  }
}

const analise = await analisarTeste(store, teste);

bloco('VEREDITO');
console.log(`   ${analise.veredito.toUpperCase()} · vencedor: ${analise.vencedor} · rota: ${analise.rota}`);
console.log(`   ${analise.motivo}`);

// ── 1. webhook saudável ─────────────────────────────────────────────────────
bloco('1. WEBHOOK SAUDÁVEL — o que chega no Slack');
process.env.AB_SLACK_WEBHOOK = WEBHOOK;
modo = 'ok';
const r1 = await avisar(teste, analise);
console.log(`   enviado: ${r1.enviado} · HTTP ${r1.status} · resposta: "${r1.resposta}"`);
console.log(`\n   POST ${WEBHOOK.replace(/\/services\/.*/, '/services/…')}`);
console.log(`   Content-Type: ${recebidos[0].headers['content-type']}\n`);
console.log('   ── corpo (JSON exato) ────────────────────────────────────────');
console.log(JSON.stringify(JSON.parse(recebidos[0].corpo), null, 2).split('\n').map((l) => '   ' + l).join('\n'));
console.log('\n   ── como aparece no canal ─────────────────────────────────────');
const att = JSON.parse(recebidos[0].corpo).attachments[0];
console.log(`   ┃ (barra ${att.color})`);
for (const l of att.text.split('\n')) console.log('   ┃ ' + l);

// ── 2. HTTP 200 mentiroso ───────────────────────────────────────────────────
bloco('2. WEBHOOK DEVOLVENDO 200 COM "invalid_payload"');
console.log('   O Slack responde 200 mesmo recusando o payload. Quem checa só o');
console.log('   status acha que enviou.');
modo = 'invalido';
const r2 = await avisar(teste, analise);
console.log(`\n   HTTP ${r2.status} · resposta: "${r2.resposta}"`);
console.log(`   enviado: ${r2.enviado}  ${r2.enviado === false ? '← correto, o corpo foi conferido' : '← ERRADO, engoliu a falha'}`);

// ── 3. webhook fora do ar ───────────────────────────────────────────────────
bloco('3. WEBHOOK FORA DO AR');
const antes = process.env.AB_SLACK_WEBHOOK;
process.env.AB_SLACK_WEBHOOK = 'http://localhost:1/nao-existe';
const r3 = await avisar(teste, analise);
console.log(`   enviado: ${r3.enviado} · configurado: ${r3.configurado} · motivo: ${String(r3.motivo).slice(0, 70)}`);
console.log(`   ${r3.enviado === false && r3.configurado === true
  ? 'correto — "configurado mas falhou" faz o job tentar de novo amanhã'
  : 'ERRADO'}`);
process.env.AB_SLACK_WEBHOOK = antes;

// ── 4. sem webhook ──────────────────────────────────────────────────────────
bloco('4. SEM WEBHOOK CONFIGURADO');
delete process.env.AB_SLACK_WEBHOOK;
const r4 = await avisar(teste, analise);
console.log(`   enviado: ${r4.enviado} · configurado: ${r4.configurado}`);
console.log(`   ${r4.configurado === false
  ? 'correto — "não configurado" ≠ "falhou": o job persiste o veredito e não re-notifica pra sempre'
  : 'ERRADO'}`);

bloco('RESUMO');
const checagens = [
  ['Envio chega com o JSON certo', r1.enviado === true && recebidos.length > 0],
  ['200 com "invalid_payload" é tratado como FALHA', r2.enviado === false],
  ['Webhook fora do ar = falha reentrante', r3.enviado === false && r3.configurado === true],
  ['Sem webhook = não é falha', r4.configurado === false],
  ['Cor da barra é o amarelo da CW', att.color === '#FFB600'],
  ['Mensagem traz o vencedor', att.text.includes(':trophy:')],
];
for (const [n, ok] of checagens) console.log(`   ${ok ? '[x]' : '[!]'} ${n.padEnd(52, '.')} ${ok ? 'OK' : 'FALHOU'}`);
const falhas = checagens.filter(([, ok]) => !ok).length;
console.log(`\n   ${checagens.length - falhas}/${checagens.length} passaram.`);
console.log('\n   Para o print no canal de verdade: defina AB_SLACK_WEBHOOK e rode');
console.log('   `node scripts/analisar.js`. Este teste prova tudo, menos o Slack real.');

// Fecha esperando de verdade. `process.exit()` logo depois de `.close()` faz o
// libuv abortar no Windows ("UV_HANDLE_CLOSING"), com o processo já tendo dado
// o resultado certo — parece falha e não é.
await new Promise((r) => slackFalso.close(r));
process.exitCode = falhas ? 1 : 0;
