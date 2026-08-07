/**
 * Testes de unidade.  Rodar:  node --test testes/
 */

import test from 'node:test';
import assert from 'node:assert/strict';

process.env.AB_DOMINIOS_PERMITIDOS = 'cardapioweb.com';
delete process.env.AB_PERMITIR_HTTP;

import { fnv32a, hash, faixas, escolherVariante, atribuir } from '../lib/hash.js';
import {
  checarSRM, zTestProporcoes, amostraMinima, msprt, avaliar, VEREDITOS,
  montarSerieComparada, normalQuantil, chi2P, alfaAjustado,
} from '../lib/estatistica.js';
import { urlPermitida, validarTeste, normalizarTeste, montarDestino } from '../lib/config.js';
import { ehBot, ehPrefetch } from '../lib/bots.js';
import { agregar } from '../lib/store.js';
import { dia, diasEntre } from '../lib/tempo.js';
import { segredoConfere } from '../lib/http.js';
import { montarMensagem } from '../lib/slack.js';

// ─────────────────────────────────────────────────────────────────────────────
test('fnv32a bate com os vetores conhecidos do FNV-1a de 32 bits', () => {
  assert.equal(fnv32a(''), 2166136261);        // 0x811c9dc5
  assert.equal(fnv32a('a'), 3826002220);       // 0xe40c292c
  assert.equal(fnv32a('foobar'), 3214735720);  // 0xbf9cf968
});

test('hash é determinístico e fica em [0,1)', () => {
  for (const v of ['abc', 'x'.repeat(200), '123', 'ç~é', '']) {
    const a = hash('semente', v);
    const b = hash('semente', v);
    assert.equal(a, b, 'mesmo par tem que dar o mesmo hash');
    if (v !== '') {
      assert.ok(a >= 0 && a < 1, `${a} fora de [0,1)`);
    }
  }
  assert.equal(hash('s', ''), null);
  assert.equal(hash('s', null), null);
  assert.equal(hash('s', undefined), null);
});

test('seeds diferentes dão atribuições diferentes (não enviesa em paralelo)', () => {
  let iguais = 0;
  const N = 5000;
  for (let i = 0; i < N; i++) {
    const a = hash('teste-1', 'v' + i) < 0.5;
    const b = hash('teste-2', 'v' + i) < 0.5;
    if (a === b) iguais++;
  }
  // Independentes → ~50% de coincidência. Correlacionados → perto de 100%.
  assert.ok(Math.abs(iguais / N - 0.5) < 0.03, `coincidência ${iguais / N}`);
});

test('faixas respeitam peso e cobertura', () => {
  assert.deepEqual(faixas(2, 1, [0.5, 0.5]), [[0, 0.5], [0.5, 1]]);
  const f = faixas(2, 0.5, [0.4, 0.6]);
  assert.equal(f[0][0], 0);
  assert.ok(Math.abs(f[0][1] - 0.2) < 1e-9);
  assert.ok(Math.abs(f[1][0] - 0.4) < 1e-9);
  assert.ok(Math.abs(f[1][1] - 0.7) < 1e-9);
});

test('faixas caem pra peso igual quando a configuração é inválida', () => {
  for (const ruim of [null, [0.5], [0.3, 0.3], ['a', 'b'], [1, 1], [-1, 2]]) {
    assert.deepEqual(faixas(2, 1, ruim), [[0, 0.5], [0.5, 1]]);
  }
});

test('escolherVariante devolve -1 fora da cobertura', () => {
  const f = faixas(2, 0.5, [0.5, 0.5]); // [[0,0.25],[0.5,0.75]]
  assert.equal(escolherVariante(0.1, f), 0);
  assert.equal(escolherVariante(0.6, f), 1);
  assert.equal(escolherVariante(0.3, f), -1);
  assert.equal(escolherVariante(0.9, f), -1);
  assert.equal(escolherVariante(null, f), -1);
});

test('atribuição de 90/10 respeita o peso', () => {
  const t = {
    slug: 'p', seed: 'p', cobertura: 1,
    variantes: [
      { chave: 'A', peso: 0.9, ordem: 0, url: 'https://cardapioweb.com/a' },
      { chave: 'B', peso: 0.1, ordem: 1, url: 'https://cardapioweb.com/b' },
    ],
  };
  const c = { A: 0, B: 0 };
  for (let i = 0; i < 20000; i++) c[atribuir(t, 'v' + i).chave]++;
  assert.ok(Math.abs(c.B / 20000 - 0.1) < 0.01, `B ficou com ${c.B / 20000}`);
});

// ─────────────────────────────────────────────────────────────────────────────
test('SRM pega divisão torta e ignora divisão sadia', () => {
  assert.equal(checarSRM([5000, 5000], [1, 1]).ok, true);
  assert.equal(checarSRM([5100, 4900], [1, 1]).ok, true);
  assert.equal(checarSRM([5500, 4500], [1, 1]).ok, false); // clássico de redirect quebrado
  assert.equal(checarSRM([9000, 1000], [0.9, 0.1]).ok, true); // 90/10 configurado
  assert.equal(checarSRM([5000, 5000], [0.9, 0.1]).ok, false); // 50/50 num teste 90/10
});

test('SRM não opina com amostra minúscula', () => {
  const r = checarSRM([3, 1], [1, 1]);
  assert.equal(r.aplicavel, false);
  assert.equal(r.ok, true);
});

test('SRM sem tráfego não quebra', () => {
  const r = checarSRM([0, 0], [1, 1]);
  assert.equal(r.ok, true);
  assert.equal(r.aplicavel, false);
});

test('z-test: sem diferença dá p=1; diferença grande dá p pequeno', () => {
  assert.equal(zTestProporcoes(50, 500, 50, 500).p, 1);
  assert.ok(zTestProporcoes(50, 1000, 100, 1000).p < 1e-4);
});

test('z-test aguenta zero conversão nos dois braços', () => {
  const r = zTestProporcoes(0, 100, 0, 100);
  assert.equal(r.valido, false);
  assert.equal(r.p, 1);
});

test('z-test aguenta n=0', () => {
  assert.equal(zTestProporcoes(0, 0, 0, 0).valido, false);
});

test('amostra mínima cresce quando o MDE cai', () => {
  assert.ok(amostraMinima(0.1, 0.1) > amostraMinima(0.1, 0.3));
  assert.equal(amostraMinima(0, 0.2), null);
  assert.equal(amostraMinima(1, 0.2), null);
  assert.equal(amostraMinima(0.1, 0), null);
  assert.equal(amostraMinima(0.1, -1), null);
});

test('mSPRT é mais conservador que o horizonte fixo (é o ponto dele)', () => {
  const fixo = zTestProporcoes(100, 1000, 130, 1000).p;
  const seq = msprt(100, 1000, 130, 1000, 0.02).p;
  assert.ok(seq > fixo, `sequencial ${seq} tinha que ser > fixo ${fixo}`);
});

test('mSPRT devolve p=1 em entrada degenerada', () => {
  assert.equal(msprt(0, 0, 0, 0, 0.02).p, 1);
  assert.equal(msprt(0, 100, 0, 100, 0.02).p, 1);
  assert.equal(msprt(10, 100, 10, 100, 0).p, 1);
});

test('normalQuantil e chi2P nos extremos', () => {
  assert.equal(normalQuantil(0), -Infinity);
  assert.equal(normalQuantil(1), Infinity);
  assert.equal(chi2P(0, 1), 1);
  assert.equal(chi2P(-5, 1), 1);
});

test('montarSerieComparada acumula certo', () => {
  const s = montarSerieComparada({
    A: [{ dia: '2026-08-01', n: 10, conv: 1 }, { dia: '2026-08-02', n: 20, conv: 3 }],
    B: [{ dia: '2026-08-02', n: 15, conv: 5 }],
  }, 'A', 'B');
  assert.equal(s.length, 2);
  assert.deepEqual(s[0], { dia: '2026-08-01', nA: 10, convA: 1, nB: 0, convB: 0 });
  assert.deepEqual(s[1], { dia: '2026-08-02', nA: 30, convA: 4, nB: 15, convB: 5 });
});

// ─────────────────────────────────────────────────────────────────────────────
function cenario(over = {}) {
  const dias = over.dias ?? 10;
  const nA = over.nA ?? 6000; const cA = over.cA ?? 600;
  const nB = over.nB ?? 6000; const cB = over.cB ?? 780;
  const serie = (n, c) => Array.from({ length: dias }, (_, i) => ({
    dia: `2026-08-${String(i + 1).padStart(2, '0')}`,
    n: Math.round(n / dias), conv: Math.round(c / dias),
  }));
  return {
    variantes: [
      { chave: 'A', nome: 'controle', n: nA, conv: cA },
      { chave: 'B', nome: 'variante', n: nB, conv: cB },
    ],
    serieDiaria: { A: serie(nA, cA), B: serie(nB, cB) },
    diasRodados: dias,
    config: { baseline: 0.1, mde: 0.2, minDias: 7, maxDias: 30, pesos: [0.5, 0.5], ...(over.config || {}) },
  };
}

test('veredito: efeito real com amostra e prazo → vencedor', () => {
  const r = avaliar(cenario());
  assert.equal(r.veredito, VEREDITOS.VENCEDOR);
  assert.equal(r.vencedor, 'B');
  assert.equal(r.pode_decidir, true);
});

test('trava de ciclo mínimo segura vencedor de 2 dias', () => {
  const r = avaliar(cenario({ dias: 2 }));
  assert.equal(r.veredito, VEREDITOS.RODANDO);
  assert.equal(r.pode_decidir, false);
  assert.match(r.motivo, /ciclo mínimo/);
});

test('trava de amostra segura efeito aparente em amostra pequena', () => {
  const r = avaliar(cenario({ nA: 100, cA: 10, nB: 100, cB: 18 }));
  assert.notEqual(r.veredito, VEREDITOS.VENCEDOR);
});

test('SRM tranca o veredito mesmo com efeito enorme', () => {
  const r = avaliar(cenario({ nA: 6000, cA: 600, nB: 4000, cB: 800 }));
  assert.equal(r.veredito, VEREDITOS.SRM);
  assert.equal(r.pode_decidir, false);
});

test('variante significativamente pior faz o CONTROLE vencer', () => {
  const r = avaliar(cenario({ cA: 780, cB: 600 }));
  assert.equal(r.veredito, VEREDITOS.VENCEDOR);
  assert.equal(r.vencedor, 'A');
  assert.match(r.motivo, /PIOR/);
});

test('sem efeito e prazo estourado → inconclusivo, com ordem de encerrar', () => {
  const r = avaliar(cenario({ dias: 30, cA: 600, cB: 605 }));
  assert.equal(r.veredito, VEREDITOS.INCONCLUSIVO);
  assert.equal(r.pode_decidir, true);
});

test('sem tráfego nenhum não quebra', () => {
  const r = avaliar({ variantes: [{ chave: 'A', nome: 'a', n: 0, conv: 0 }, { chave: 'B', nome: 'b', n: 0, conv: 0 }], serieDiaria: {}, diasRodados: 0, config: {} });
  assert.equal(r.veredito, VEREDITOS.SEM_DADO);
  assert.equal(r.pode_decidir, false);
});

test('teste com 1 variante só é recusado', () => {
  const r = avaliar({ variantes: [{ chave: 'A', nome: 'a', n: 10, conv: 1 }], serieDiaria: {}, diasRodados: 1, config: {} });
  assert.equal(r.veredito, VEREDITOS.SEM_DADO);
});

test('conversão > atribuição não gera taxa acima de 100% sem quebrar', () => {
  const r = avaliar(cenario({ nA: 100, cA: 150, nB: 100, cB: 10 }));
  assert.ok(Number.isFinite(r.controle.taxa));
});

// ─────────────────────────────────────────────────────────────────────────────
test('urlPermitida barra domínio parecido, protocolo errado e credencial', () => {
  assert.equal(urlPermitida('https://cardapioweb.com/x').ok, true);
  assert.equal(urlPermitida('https://lp.cardapioweb.com/x').ok, true);
  assert.equal(urlPermitida('http://cardapioweb.com/x').ok, false);
  assert.equal(urlPermitida('https://cardapioweb.com.invasor.net/x').ok, false);
  assert.equal(urlPermitida('https://evil.com/?cardapioweb.com').ok, false);
  assert.equal(urlPermitida('https://user:pass@cardapioweb.com/x').ok, false);
  assert.equal(urlPermitida('javascript:alert(1)').ok, false);
  assert.equal(urlPermitida('//cardapioweb.com/x').ok, false);
  assert.equal(urlPermitida('').ok, false);
  assert.equal(urlPermitida(null).ok, false);
});

const testeBom = {
  slug: 'hero-lp-sql', nome: 'Hero da LP de SQL',
  baseline: 0.1237, mde: 0.2,
  variantes: [
    { chave: 'A', nome: 'atual', url: 'https://lp.cardapioweb.com/sql', peso: 0.5 },
    { chave: 'B', nome: 'novo', url: 'https://lp.cardapioweb.com/sql-b', peso: 0.5 },
  ],
};

test('validarTeste aceita configuração boa', () => {
  assert.equal(validarTeste(testeBom).ok, true);
});

test('validarTeste recusa peso que não soma 1, slug ruim e 1 variante', () => {
  assert.equal(validarTeste({ ...testeBom, variantes: [{ ...testeBom.variantes[0], peso: 0.3 }, { ...testeBom.variantes[1], peso: 0.3 }] }).ok, false);
  assert.equal(validarTeste({ ...testeBom, slug: 'AB Teste!' }).ok, false);
  assert.equal(validarTeste({ ...testeBom, variantes: [testeBom.variantes[0]] }).ok, false);
  assert.equal(validarTeste({ ...testeBom, variantes: [testeBom.variantes[0], { ...testeBom.variantes[1], chave: 'A' }] }).ok, false);
});

test('validarTeste trava mudança de peso/seed/variante com o teste rodando', () => {
  const anterior = { ...normalizarTeste(testeBom), status: 'rodando' };
  const mudaPeso = { ...testeBom, variantes: [{ ...testeBom.variantes[0], peso: 0.7 }, { ...testeBom.variantes[1], peso: 0.3 }] };
  assert.equal(validarTeste(mudaPeso, { anterior }).ok, false);

  const mudaSeed = { ...testeBom, seed: 'outra' };
  assert.equal(validarTeste(mudaSeed, { anterior }).ok, false);

  const addVar = { ...testeBom, variantes: [...testeBom.variantes, { chave: 'C', nome: 'c', url: 'https://lp.cardapioweb.com/c', peso: 0.34 }] };
  assert.equal(validarTeste(addVar, { anterior }).ok, false);

  const mudaUrl = { ...testeBom, variantes: [{ ...testeBom.variantes[0], url: 'https://lp.cardapioweb.com/outra' }, testeBom.variantes[1]] };
  assert.equal(validarTeste(mudaUrl, { anterior }).ok, false);
});

test('mudar nome/hipótese com o teste rodando é permitido', () => {
  const anterior = { ...normalizarTeste(testeBom), status: 'rodando' };
  assert.equal(validarTeste({ ...testeBom, nome: 'Outro nome', hipotese: 'nova' }, { anterior }).ok, true);
});

// ── achados do QA adversarial (06/08/2026) ─────────────────────────────────

test('[P0] reordenar variantes com o teste rodando é bloqueado', () => {
  // Passava pela validação, reatribuía 100% dos visitantes (todo mundo passava
  // a VER a outra página e seguia CONTADO no braço antigo, porque o dedupe
  // barra a segunda atribuição) e não acendia SRM — a divisão continua 50/50.
  const anterior = { ...normalizarTeste(testeBom), status: 'rodando' };
  const invertido = {
    ...testeBom,
    variantes: [
      { ...testeBom.variantes[1], ordem: 0 },
      { ...testeBom.variantes[0], ordem: 1 },
    ],
  };
  const r = validarTeste(invertido, { anterior });
  assert.equal(r.ok, false);
  assert.match(r.erros.join(' '), /reordenar/);
});

test('[P1] mudar baseline/MDE/alfa/poder/dias com o teste rodando é bloqueado', () => {
  // A amostra alvo é recalculada a cada análise a partir de baseline e MDE.
  // Com o MDE solto, aumentar o número derrubava a amostra alvo e a trava de
  // evidência abria na hora: vencedor fabricado num campo de formulário.
  const anterior = { ...normalizarTeste(testeBom), status: 'rodando' };
  for (const [campo, valor] of [
    ['mde', 0.4], ['baseline', 0.05], ['alfa', 0.2],
    ['poder', 0.5], ['min_dias', 1], ['max_dias', 60],
  ]) {
    const r = validarTeste({ ...testeBom, [campo]: valor }, { anterior });
    assert.equal(r.ok, false, `${campo} devia estar travado`);
  }
});

test('[P1] correção de Šidák aperta o corte quando há vários desafiantes', () => {
  assert.equal(alfaAjustado(0.05, 1), 0.05);
  assert.ok(alfaAjustado(0.05, 3) < 0.05);
  assert.ok(Math.abs(alfaAjustado(0.05, 3) - 0.016952) < 1e-5);
  assert.ok(Math.abs(alfaAjustado(0.05, 5) - 0.010206) < 1e-5);
  // 1 - (1-a)^(1/k) elevado de volta a k tem que devolver o alfa global
  for (const k of [1, 2, 3, 5, 8]) {
    assert.ok(Math.abs((1 - Math.pow(1 - alfaAjustado(0.05, k), k)) - 0.05) < 1e-12);
  }
});

test('[P2] concentração de IP tranca o veredito', () => {
  const c = cenario();
  const semIp = avaliar(c);
  assert.equal(semIp.veredito, VEREDITOS.VENCEDOR);

  const comIp = avaliar({ ...c, saude: { concentracao_ip: 0.4, ips_distintos: 12 } });
  assert.equal(comIp.pode_decidir, false);
  assert.match(comIp.motivo, /um único IP/);

  // NAT de operadora é legítimo: uns poucos por cento não podem trancar.
  const nat = avaliar({ ...c, saude: { concentracao_ip: 0.04, ips_distintos: 900 } });
  assert.equal(nat.veredito, VEREDITOS.VENCEDOR);
});

test('[P1] conversão gravada ANTES da atribuição é descartada', () => {
  // Caso real: conferir a variante com ?cwforce=B e preencher o formulário. A
  // conversão ficava órfã e era ADOTADA no dia em que aquele mesmo navegador
  // clicasse num anúncio de verdade.
  const r = agregar([
    { teste: 't', variante: 'B', visitante: 'v1', tipo: 'conversion', criado_em: '2026-08-01T10:00:00Z', dia: '2026-08-01' },
    { teste: 't', variante: 'A', visitante: 'v1', tipo: 'assignment', criado_em: '2026-08-05T09:00:00Z', dia: '2026-08-05' },
  ]);
  assert.equal(r.porVariante.A.n, 1);
  assert.equal(r.porVariante.A.conv, 0, 'conversão de antes da atribuição não pode contar');
  assert.equal(r.saude.conversoes_anteriores_a_atribuicao, 1);
});

test('conversão DEPOIS da atribuição continua contando', () => {
  const r = agregar([
    { teste: 't', variante: 'A', visitante: 'v1', tipo: 'assignment', criado_em: '2026-08-01T10:00:00Z', dia: '2026-08-01' },
    { teste: 't', variante: 'A', visitante: 'v1', tipo: 'conversion', criado_em: '2026-08-01T10:05:00Z', dia: '2026-08-01' },
  ]);
  assert.equal(r.porVariante.A.conv, 1);
});

test('agregar mede concentração de IP', () => {
  const base = { teste: 't', tipo: 'assignment', dia: '2026-08-01', bot: false };
  const evs = [
    ...Array.from({ length: 8 }, (_, i) => ({ ...base, variante: 'A', visitante: 'a' + i, criado_em: '2026-08-01T10:00:0' + i + 'Z', ip_hash: 'mesmo' })),
    ...Array.from({ length: 2 }, (_, i) => ({ ...base, variante: 'B', visitante: 'b' + i, criado_em: '2026-08-01T11:00:0' + i + 'Z', ip_hash: 'outro' + i })),
  ];
  const r = agregar(evs);
  assert.equal(r.saude.ips_distintos, 3);
  assert.ok(Math.abs(r.saude.concentracao_ip - 0.8) < 1e-9);
});

test('montarDestino preserva UTM, marca a variante e não deixa sobrescrever o interno', () => {
  const v = { chave: 'B', url: 'https://lp.cardapioweb.com/sql-b?fixo=1' };
  const d = new URL(montarDestino(v, '/t/x?utm_source=meta&utm_campaign=c1&cwab=falso&fixo=9', {
    slug: 'x', vid: 'abc123abc123abc1', referrer: 'https://www.facebook.com/algo',
  }));
  assert.equal(d.searchParams.get('utm_source'), 'meta');
  assert.equal(d.searchParams.get('utm_campaign'), 'c1');
  assert.equal(d.searchParams.get('cwab'), 'x:B');       // não foi falsificado
  assert.equal(d.searchParams.get('fixo'), '1');          // config vence
  assert.equal(d.searchParams.get('cwvid'), 'abc123abc123abc1');
  assert.equal(d.searchParams.get('cwref'), 'https://www.facebook.com');
});

test('montarDestino não vaza parâmetro interno pra LP (inclusive o ?s= do rewrite da Vercel)', () => {
  const v = { chave: 'B', url: 'https://lp.cardapioweb.com/sql-b' };
  // É assim que a URL chega depois do rewrite `/t/:slug` → `/api/t?s=:slug`
  const d = new URL(montarDestino(v, '/api/t?s=hero-lp-sql&utm_source=meta&cwforce=A&cwref=x', {
    slug: 'hero-lp-sql', vid: 'abc123abc123abc1',
  }));
  assert.equal(d.searchParams.get('s'), null, 'o slug interno não pode ir pra LP');
  assert.equal(d.searchParams.get('cwforce'), null);
  assert.equal(d.searchParams.get('utm_source'), 'meta', 'UTM continua passando');
  assert.equal(d.searchParams.get('cwab'), 'hero-lp-sql:B');
});

test('montarDestino aguenta referrer lixo', () => {
  const v = { chave: 'A', url: 'https://lp.cardapioweb.com/a' };
  assert.doesNotThrow(() => montarDestino(v, '/t/x', { slug: 'x', referrer: 'nao-e-url' }));
});

// ─────────────────────────────────────────────────────────────────────────────
test('detecção de bot', () => {
  assert.equal(ehBot('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'), true);
  assert.equal(ehBot('AdsBot-Google (+http://www.google.com/adsbot.html)'), true);
  assert.equal(ehBot('facebookexternalhit/1.1'), true);
  assert.equal(ehBot('python-requests/2.31.0'), true);
  assert.equal(ehBot('curl/8.4.0'), true);
  assert.equal(ehBot(''), true);
  assert.equal(ehBot(null), true);
  assert.equal(ehBot('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'), false);
  assert.equal(ehBot('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'), false);
});

test('detecção de prefetch', () => {
  assert.equal(ehPrefetch({ 'sec-purpose': 'prefetch;prerender' }), true);
  assert.equal(ehPrefetch({ purpose: 'prefetch' }), true);
  assert.equal(ehPrefetch({}), false);
});

// ─────────────────────────────────────────────────────────────────────────────
test('agregar: denominador é atribuição, conversão vai pra variante atribuída', () => {
  const evs = [
    { teste: 't', variante: 'A', visitante: 'v1', tipo: 'assignment', criado_em: '2026-08-01T10:00:00Z', dia: '2026-08-01' },
    { teste: 't', variante: 'B', visitante: 'v2', tipo: 'assignment', criado_em: '2026-08-01T11:00:00Z', dia: '2026-08-01' },
    // v1 diz que é da B, mas foi atribuído à A: a conversão tem que ir pra A
    { teste: 't', variante: 'B', visitante: 'v1', tipo: 'conversion', criado_em: '2026-08-01T12:00:00Z', dia: '2026-08-01' },
    // visitante nunca atribuído: descartado
    { teste: 't', variante: 'B', visitante: 'v9', tipo: 'conversion', criado_em: '2026-08-01T12:00:00Z', dia: '2026-08-01' },
  ];
  const r = agregar(evs);
  assert.equal(r.porVariante.A.n, 1);
  assert.equal(r.porVariante.A.conv, 1);
  assert.equal(r.porVariante.B.conv, 0);
  assert.equal(r.saude.conversoes_orfas, 1);
});

test('agregar: conversão repetida do mesmo visitante conta 1', () => {
  const base = { teste: 't', dia: '2026-08-01' };
  const r = agregar([
    { ...base, variante: 'A', visitante: 'v1', tipo: 'assignment', criado_em: '2026-08-01T10:00:00Z' },
    { ...base, variante: 'A', visitante: 'v1', tipo: 'conversion', criado_em: '2026-08-01T11:00:00Z' },
    { ...base, variante: 'A', visitante: 'v1', tipo: 'conversion', criado_em: '2026-08-01T11:30:00Z' },
  ]);
  assert.equal(r.porVariante.A.conv, 1);
});

test('agregar: primeira atribuição manda se o visitante aparecer 2x', () => {
  const base = { teste: 't', dia: '2026-08-01' };
  const r = agregar([
    { ...base, variante: 'A', visitante: 'v1', tipo: 'assignment', criado_em: '2026-08-01T10:00:00Z' },
    { ...base, variante: 'B', visitante: 'v1', tipo: 'assignment', criado_em: '2026-08-01T10:05:00Z' },
  ]);
  assert.equal(r.porVariante.A.n, 1);
  assert.equal(r.porVariante.B, undefined);
});

test('agregar: bot é ignorado', () => {
  const base = { teste: 't', dia: '2026-08-01', criado_em: '2026-08-01T10:00:00Z' };
  const r = agregar([
    { ...base, variante: 'A', visitante: 'v1', tipo: 'assignment', bot: true },
    { ...base, variante: 'A', visitante: 'v2', tipo: 'assignment', bot: false },
  ]);
  assert.equal(r.porVariante.A.n, 1);
  assert.equal(r.saude.bots_ignorados, 1);
});

test('agregar: dias rodados é o tempo corrido, não o nº de dias com dado', () => {
  const r = agregar([
    { teste: 't', variante: 'A', visitante: 'v1', tipo: 'assignment', criado_em: '2026-08-01T10:00:00Z', dia: '2026-08-01' },
    { teste: 't', variante: 'A', visitante: 'v2', tipo: 'assignment', criado_em: '2026-08-08T10:00:00Z', dia: '2026-08-08' },
  ]);
  assert.equal(r.diasRodados, 8);
  assert.equal(r.diasComDado, 2);
});

// ─────────────────────────────────────────────────────────────────────────────
test('dia usa o fuso de Brasília', () => {
  // 02:30 UTC de 07/08 ainda é 06/08 em Brasília (UTC-3)
  assert.equal(dia('2026-08-07T02:30:00Z'), '2026-08-06');
  assert.equal(dia('2026-08-07T03:30:00Z'), '2026-08-07');
});

test('dia aguenta entrada inválida sem quebrar', () => {
  assert.match(dia('lixo'), /^\d{4}-\d{2}-\d{2}$/);
});

test('diasEntre é inclusivo', () => {
  assert.equal(diasEntre('2026-08-01', '2026-08-01'), 1);
  assert.equal(diasEntre('2026-08-01', '2026-08-07'), 7);
  assert.equal(diasEntre(null, '2026-08-07'), 0);
});

// ─────────────────────────────────────────────────────────────────────────────
test('segredoConfere não aceita vazio nem tamanho diferente', () => {
  assert.equal(segredoConfere('abc', 'abc'), true);
  assert.equal(segredoConfere('abc', 'abd'), false);
  assert.equal(segredoConfere('ab', 'abc'), false);
  assert.equal(segredoConfere('', ''), false);
  assert.equal(segredoConfere(undefined, 'abc'), false);
  assert.equal(segredoConfere('abc', undefined), false);
  assert.equal(segredoConfere('abc', null), false);
});

test('mensagem do Slack sai montada com o veredito', () => {
  const a = avaliar(cenario());
  const m = montarMensagem({ slug: 'x', nome: 'Teste X' }, a, 'https://painel');
  assert.match(m.text, /vencedor/);
  assert.ok(m.attachments[0].text.includes('Teste X'));
  assert.equal(m.attachments[0].color, '#FFB600'); // amarelo da CW
});
