/**
 * Popula `dados/` com testes de demonstração, um em cada estado interessante.
 * Serve pra conhecer o painel sem esperar tráfego real.
 *
 *   node scripts/semear-demo.js
 *
 * Apaga e recria os dados locais. Não toca em produção.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DIR = process.env.AB_DIR || path.join(RAIZ, 'dados');
process.env.AB_STORE = 'arquivo';
process.env.AB_DIR = DIR;

const { criarStore } = await import('../lib/store.js');

if (fs.existsSync(DIR)) fs.rmSync(DIR, { recursive: true, force: true });
fs.mkdirSync(DIR, { recursive: true });
const store = criarStore();

const diaAtras = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

let seq = 0;
// ATENÇÃO: id de visitante tem que ser único de verdade. A primeira versão
// usava `('d'+seq).padEnd(16,'0')`, que colide — 'd1' e 'd10' viram os dois
// 'd1'+14 zeros. A deduplicação da plataforma engoliu as repetidas (fez o certo)
// e a demonstração ficou com menos gente do que devia. Hex com padStart não colide.
const novoVid = () => (seq++).toString(16).padStart(16, '0');

async function popular(slug, dias, arms) {
  for (let d = dias - 1; d >= 0; d--) {
    const dia = diaAtras(d);
    for (const [chave, porDia, taxa] of arms) {
      for (let i = 0; i < porDia; i++) {
        const vid = novoVid();
        // ip_hash variado: a trava "origem do tráfego" mede concentração de IP,
        // e sem isso a demonstração pareceria 100% de um IP só.
        const ipHash = (seq * 2654435761 % 4294967296).toString(16).padStart(8, '0');
        await store.registrarEvento({ teste: slug, variante: chave, visitante: vid, tipo: 'assignment', criado_em: dia + 'T15:00:00.000Z', dia, bot: false, ip_hash: ipHash });
        await store.registrarEvento({ teste: slug, variante: chave, visitante: vid, tipo: 'view', criado_em: dia + 'T15:00:02.000Z', dia, bot: false });
        if (Math.random() < taxa) {
          await store.registrarEvento({ teste: slug, variante: chave, visitante: vid, tipo: 'conversion', criado_em: dia + 'T15:02:00.000Z', dia, bot: false });
        }
      }
    }
  }
}

const comum = { status: 'rodando', cobertura: 1, alfa: 0.05, poder: 0.8, min_dias: 7, max_dias: 30, ultimo_veredito: null };

// 1 — vencedor claro
await store.salvarTeste({
  ...comum, slug: 'hero-lp-sql',
  nome: 'Hero da LP de SQL: painel vs. cardápio digital',
  hipotese: 'Se o hero mostrar o cardápio digital em vez do painel de gestão, a conversão sobe, porque o dono do restaurante reconhece na hora o que vai receber.',
  jira: 'GWT-3256', seed: 'hero-lp-sql', baseline: 0.1237, mde: 0.3,
  iniciado_em: diaAtras(11) + 'T09:00:00.000Z',
  variantes: [
    { chave: 'A', nome: 'controle (painel)', url: 'https://lp.cardapioweb.com/sql', peso: 0.5, ordem: 0 },
    { chave: 'B', nome: 'cardápio digital', url: 'https://lp.cardapioweb.com/sql-hero-b', peso: 0.5, ordem: 1 },
  ],
});
await popular('hero-lp-sql', 11, [['A', 145, 0.1237], ['B', 145, 0.176]]);

// 2 — rodando, ainda sem prazo nem amostra
await store.salvarTeste({
  ...comum, slug: 'form-tql-2-campos',
  nome: 'Formulário da TQL com 2 campos em vez de 5',
  hipotese: 'Menos campo, mais envio — mesmo pagando com lead menos qualificado.',
  jira: 'GWT-2742', seed: 'form-tql-2-campos', baseline: 0.2017, mde: 0.2,
  iniciado_em: diaAtras(3) + 'T09:00:00.000Z',
  variantes: [
    { chave: 'A', nome: 'controle (5 campos)', url: 'https://lp.cardapioweb.com/tql', peso: 0.5, ordem: 0 },
    { chave: 'B', nome: '2 campos', url: 'https://lp.cardapioweb.com/tql-curto', peso: 0.5, ordem: 1 },
  ],
});
await popular('form-tql-2-campos', 4, [['A', 55, 0.2017], ['B', 55, 0.221]]);

// 3 — SRM: a variante B está perdendo tráfego antes de contar
await store.salvarTeste({
  ...comum, slug: 'video-lp-meta',
  nome: 'Vídeo no topo da LP de Meta Ads',
  hipotese: 'Vídeo de 20s explicando o produto aumenta a conversão.',
  jira: 'GWT-2781', seed: 'video-lp-meta', baseline: 0.1237, mde: 0.25,
  iniciado_em: diaAtras(9) + 'T09:00:00.000Z',
  variantes: [
    { chave: 'A', nome: 'controle (imagem)', url: 'https://lp.cardapioweb.com/meta', peso: 0.5, ordem: 0 },
    { chave: 'B', nome: 'vídeo', url: 'https://lp.cardapioweb.com/meta-video', peso: 0.5, ordem: 1 },
  ],
});
await popular('video-lp-meta', 9, [['A', 100, 0.1237], ['B', 68, 0.152]]);

// 4 — demonstração do roteador, apontando pras LPs de mentira do dev-server.
// É este que os prints de roteamento usam.
if (process.env.AB_PERMITIR_HTTP === '1') {
  const p = process.env.AB_PORTA_DEV || '3100';
  await store.salvarTeste({
    ...comum, slug: 'demo-roteamento',
    nome: 'Demonstração do roteamento (LPs locais)',
    hipotese: 'Teste de fumaça do roteador — LPs servidas pelo próprio dev-server.',
    jira: 'GWT-3256', seed: 'demo-roteamento', baseline: 0.1, mde: 0.5,
    variantes: [
      { chave: 'A', nome: 'controle', url: `http://localhost:${p}/lp/controle`, peso: 0.5, ordem: 0 },
      { chave: 'B', nome: 'variante-b', url: `http://localhost:${p}/lp/variante-b`, peso: 0.5, ordem: 1 },
    ],
  });
}

const testes = await store.listarTestes();
console.log(`semeado em ${DIR}`);
for (const t of testes) console.log(`  ${t.slug.padEnd(22)} ${t.status}  ${t.nome}`);
console.log('\nsuba o painel:  node testes/dev-server.js --porta 3100   (token: dev-token)');
