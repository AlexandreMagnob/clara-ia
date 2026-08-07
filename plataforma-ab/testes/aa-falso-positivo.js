/**
 * Teste A/A: mede a taxa de falso positivo real do motor.
 *
 * Todos os braços têm EXATAMENTE a mesma taxa de conversão. Qualquer "vencedor"
 * que apareça é falso positivo, por definição. É a única forma honesta de saber
 * se a trava faz o que promete.
 *
 * Motivo de existir: o QA mediu 20,1% de falso positivo com 6 braços, contra os
 * 5% prometidos — testar k desafiantes contra o mesmo controle a 5% cada não
 * mantém o erro global em 5%. Este arquivo é o que prova que a correção de
 * Šidák resolveu, e o que vai denunciar se alguém mexer nisso depois.
 *
 *   node testes/aa-falso-positivo.js
 *   node testes/aa-falso-positivo.js --repeticoes 3000
 */

import { avaliar, alfaAjustado } from '../lib/estatistica.js';

const arg = (n, p) => { const i = process.argv.indexOf('--' + n); return i >= 0 ? Number(process.argv[i + 1]) : p; };
const REPETICOES = arg('repeticoes', 1500);
const DIAS = 14;
const POR_DIA = 400;
const TAXA = 0.12;   // igual em todos os braços — é um A/A

/** Binomial simples. */
function converte(n, p) {
  let c = 0;
  for (let i = 0; i < n; i++) if (Math.random() < p) c++;
  return c;
}

function umaRodada(nBracos) {
  const chaves = Array.from({ length: nBracos }, (_, i) => String.fromCharCode(65 + i));
  const serieDiaria = {};
  const totais = {};
  for (const ch of chaves) {
    serieDiaria[ch] = [];
    totais[ch] = { n: 0, conv: 0 };
    for (let d = 0; d < DIAS; d++) {
      const conv = converte(POR_DIA, TAXA);
      serieDiaria[ch].push({ dia: `2026-06-${String(d + 1).padStart(2, '0')}`, n: POR_DIA, conv });
      totais[ch].n += POR_DIA;
      totais[ch].conv += conv;
    }
  }
  return avaliar({
    variantes: chaves.map((ch) => ({ chave: ch, nome: ch, n: totais[ch].n, conv: totais[ch].conv })),
    serieDiaria,
    diasRodados: DIAS,
    saude: {},
    config: {
      baseline: TAXA, mde: 0.15, alfa: 0.05, poder: 0.8,
      minDias: 7, maxDias: 30, pesos: chaves.map(() => 1 / nBracos),
    },
  });
}

console.log(`Teste A/A — todos os braços com taxa idêntica de ${(TAXA * 100).toFixed(0)}%`);
console.log(`${DIAS} dias × ${POR_DIA}/dia por braço · ${REPETICOES} repetições por cenário`);
console.log(`Alvo: 5% de falso positivo (o alfa configurado).\n`);
console.log('  braços   alfa/comparação   falso positivo   medido pelo QA (antes)');
console.log('  ' + '─'.repeat(70));

const ANTES = { 2: '5,5%', 3: '10,7%', 4: '13,6%', 6: '20,1%' };
const falhas = [];

for (const nBracos of [2, 3, 4, 6]) {
  let falsos = 0;
  for (let i = 0; i < REPETICOES; i++) {
    const r = umaRodada(nBracos);
    if (r.veredito === 'vencedor') falsos++;
  }
  const taxa = falsos / REPETICOES;
  const aComp = alfaAjustado(0.05, nBracos - 1);
  // Margem de erro de Monte Carlo: ±3 desvios em torno de 5%.
  const limite = 0.05 + 3 * Math.sqrt(0.05 * 0.95 / REPETICOES);
  const ok = taxa <= limite;
  if (!ok) falhas.push(`${nBracos} braços: ${(taxa * 100).toFixed(1)}%`);
  console.log(`  ${String(nBracos).padStart(5)}   ${aComp.toFixed(4).padStart(14)}   ` +
    `${(taxa * 100).toFixed(1).padStart(12)}%   ${(ANTES[nBracos] || '—').padStart(20)}   ${ok ? '' : '<-- ACIMA DO ALVO'}`);
}

console.log('\n  ' + '─'.repeat(70));
if (falhas.length) {
  console.log(`  FALHOU: ${falhas.join(' · ')}`);
  console.log('  A correção de múltiplas comparações não está segurando.');
  process.exitCode = 1;
} else {
  console.log('  OK — o erro global fica no alvo de 5% em todos os cenários.');
  console.log('  (Šidák é levemente conservador: ficar ABAIXO de 5% é esperado.)');
}
