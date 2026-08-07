/**
 * Datas em horário de Brasília.
 *
 * A Vercel roda em UTC. Um lead que chega às 22h de Brasília é 01h do dia
 * SEGUINTE em UTC — sem tratar isso, todo relatório diário fica com 3 horas de
 * conversão no balde errado, e o corte de "dias rodados" erra por um.
 */

const TZ = 'America/Sao_Paulo';

/** 'AAAA-MM-DD' no fuso de Brasília. Aceita Date, ISO ou nada (= agora). */
export function dia(quando) {
  const d = quando ? new Date(quando) : new Date();
  if (Number.isNaN(d.getTime())) return dia();
  // 'sv-SE' formata como AAAA-MM-DD, que é o que a gente quer.
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

/** Timestamp ISO em UTC — é assim que tudo é gravado. */
export function agora() {
  return new Date().toISOString();
}

/** Dias corridos entre duas datas 'AAAA-MM-DD', inclusivo nas duas pontas. */
export function diasEntre(de, ate) {
  if (!de || !ate) return 0;
  const a = Date.parse(de + 'T00:00:00Z');
  const b = Date.parse(ate + 'T00:00:00Z');
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return Math.floor((b - a) / 86400000) + 1;
}

/** Formata para leitura humana: 06/08/2026 14:32 */
export function humano(quando) {
  const d = quando ? new Date(quando) : new Date();
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: TZ,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}
