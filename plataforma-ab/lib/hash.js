/**
 * Atribuição determinística de variante.
 *
 * Método copiado da spec pública do GrowthBook (hashVersion 2):
 *   https://docs.growthbook.io/lib/build-your-own
 *
 *   n = fnv32a( fnv32a(seed + value) + "" )
 *   return (n % 10000) / 10000
 *
 * Por que hash e não sorteio aleatório: o mesmo visitante cai SEMPRE na mesma
 * variante, sem precisar consultar banco nem confiar em cookie de campanha.
 * Perdeu o cookie do teste? Enquanto o `cwab_vid` sobreviver, a variante é a
 * mesma. É o "sticky bucketing" saindo de graça.
 *
 * Por que a versão 2 e não a 1: a v1 (`fnv32a(value + seed) % 1000`) enviesa
 * quando dois experimentos rodam em paralelo sobre a mesma base de visitantes.
 */

/** FNV-1a de 32 bits. Multiplicação pelo primo 16777619 feita com Math.imul. */
export function fnv32a(str) {
  let h = 0x811c9dc5; // offset basis
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0; // primo FNV
  }
  return h >>> 0;
}

/** Converte (seed, valor) num float em [0,1). Retorna null se faltar valor. */
export function hash(seed, valor, versao = 2) {
  if (valor === undefined || valor === null || valor === '') return null;
  const v = String(valor);
  const s = String(seed);
  if (versao === 2) return (fnv32a(String(fnv32a(s + v))) % 10000) / 10000;
  if (versao === 1) return (fnv32a(v + s) % 1000) / 1000;
  return null;
}

/**
 * Transforma pesos + cobertura em faixas cumulativas.
 *   faixas(2, 1,   [0.5, 0.5]) -> [[0, 0.5], [0.5, 1]]
 *   faixas(2, 0.5, [0.4, 0.6]) -> [[0, 0.2], [0.4, 0.7]]
 *
 * `cobertura` < 1 deixa uma fatia do tráfego FORA do teste (segue pro controle
 * sem ser contabilizado) — útil pra subir um teste devagar.
 */
export function faixas(numVariantes, cobertura = 1, pesos = null) {
  let c = Number(cobertura);
  if (!Number.isFinite(c)) c = 1;
  c = Math.min(1, Math.max(0, c));

  let w = pesos;
  const somaOk =
    Array.isArray(w) &&
    w.length === numVariantes &&
    w.every((x) => Number.isFinite(x) && x >= 0) &&
    Math.abs(w.reduce((a, b) => a + b, 0) - 1) < 0.01;
  if (!somaOk) w = new Array(numVariantes).fill(1 / numVariantes);

  let acc = 0;
  return w.map((peso) => {
    const ini = acc;
    acc += peso;
    return [ini, ini + c * peso];
  });
}

/** Índice da variante cuja faixa contém `n`. -1 = fora do teste. */
export function escolherVariante(n, listaFaixas) {
  if (n === null || n === undefined) return -1;
  for (let i = 0; i < listaFaixas.length; i++) {
    const [ini, fim] = listaFaixas[i];
    if (n >= ini && n < fim) return i;
  }
  return -1;
}

/**
 * Atalho de alto nível: dado o teste e o id do visitante, devolve a variante.
 * Retorna null quando o visitante ficou fora da cobertura.
 */
export function atribuir(teste, visitanteId) {
  const vars = [...teste.variantes].sort((a, b) => a.ordem - b.ordem);
  const n = hash(teste.seed || teste.slug, visitanteId, 2);
  const idx = escolherVariante(n, faixas(vars.length, teste.cobertura ?? 1, vars.map((v) => v.peso)));
  return idx < 0 ? null : vars[idx];
}
