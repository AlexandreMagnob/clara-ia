/**
 * Roda a análise à mão, sem servidor. Mesmo caminho do cron da Vercel.
 *
 *   node scripts/analisar.js            # analisa e avisa no Slack se mudou
 *   node scripts/analisar.js --seco     # só mostra, não avisa nem grava
 *
 * Lê as variáveis do `.env` da raiz do repositório se elas não estiverem no
 * ambiente. Nunca imprime segredo.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.dirname(AQUI);

// .env da raiz do repo (dois níveis acima de scripts/)
const ENV = path.join(path.dirname(RAIZ), '.env');
if (fs.existsSync(ENV)) {
  for (const linha of fs.readFileSync(ENV, 'utf8').split('\n')) {
    const l = linha.trim();
    if (!l || l.startsWith('#') || !l.includes('=')) continue;
    const i = l.indexOf('=');
    const k = l.slice(0, i).trim();
    const v = l.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    if (!(k in process.env)) process.env[k] = v;
  }
}
process.env.AB_STORE = process.env.AB_STORE || 'arquivo';
process.env.AB_DIR = process.env.AB_DIR || path.join(RAIZ, 'dados');

const { criarStore } = await import('../lib/store.js');
const { analisarTeste } = await import('../lib/analise.js');
const { avisar } = await import('../lib/slack.js');
const { VEREDITOS } = await import('../lib/estatistica.js');

const SECO = process.argv.includes('--seco');
const AVISAVEIS = new Set([VEREDITOS.VENCEDOR, VEREDITOS.SRM, VEREDITOS.INCONCLUSIVO]);

const store = criarStore();
const testes = (await store.listarTestes()).filter((t) => t.status === 'rodando');

console.log(`store: ${store.modo}${store.dirDados ? ' (' + store.dirDados + ')' : ''}`);
console.log(`slack: ${process.env.AB_SLACK_WEBHOOK ? 'configurado' : 'NÃO configurado'}`);
console.log(`testes rodando: ${testes.length}${SECO ? '  [MODO SECO]' : ''}\n`);

for (const teste of testes) {
  const a = await analisarTeste(store, teste);
  const mudou = a.veredito !== (teste.ultimo_veredito || null);

  console.log('─'.repeat(74));
  console.log(`${teste.slug} — ${teste.nome}`);
  console.log(`  veredito: ${a.veredito}${mudou ? '  (MUDOU, era: ' + (teste.ultimo_veredito || 'nenhum') + ')' : ''}`);
  console.log(`  ${a.motivo}`);
  for (const tr of a.travas || []) {
    console.log(`  ${tr.ok ? '[x]' : '[ ]'} ${tr.nome} — ${tr.detalhe}`);
  }
  for (const v of a.variantes || []) {
    console.log(`      ${v.chave}  ${String(v.conv).padStart(5)}/${String(v.n).padStart(6)}  ` +
      `${v.n ? (v.conv / v.n * 100).toFixed(2) + '%' : '—'}`);
  }

  if (mudou && AVISAVEIS.has(a.veredito) && !SECO) {
    const r = await avisar(teste, a);
    console.log(`  slack: ${r.enviado ? 'enviado' : 'não enviado — ' + (r.motivo || r.resposta)}`);
    const pendente = r.configurado !== false && !r.enviado;
    if (!pendente) {
      await store.atualizarVeredito(teste.slug, { ultimo_veredito: a.veredito, vencedor: a.vencedor ?? teste.vencedor ?? null });
    }
  } else if (mudou && !SECO) {
    await store.salvarTeste({ ...teste, ultimo_veredito: a.veredito, vencedor: a.vencedor ?? teste.vencedor ?? null });
  }
}
console.log('─'.repeat(74));
