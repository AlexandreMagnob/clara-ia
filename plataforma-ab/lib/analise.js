/**
 * Junta store + estatística: pega os eventos de um teste e devolve o veredito.
 * Usado pelo painel (`/api/resultados`) e pelo job de análise (`/api/analisar`),
 * pra que os dois nunca discordem.
 */

import { agregar } from './store.js';
import { avaliar } from './estatistica.js';

export async function analisarTeste(store, teste) {
  const eventos = await store.eventosDoTeste(teste.slug);
  const ag = agregar(eventos);

  const variantes = [...teste.variantes]
    .sort((a, b) => a.ordem - b.ordem)
    .map((v) => ({
      chave: v.chave,
      nome: v.nome,
      url: v.url,
      peso: v.peso,
      n: ag.porVariante[v.chave]?.n || 0,
      conv: ag.porVariante[v.chave]?.conv || 0,
    }));

  const analise = avaliar({
    variantes,
    serieDiaria: ag.serieDiaria,
    diasRodados: ag.diasRodados,
    saude: ag.saude,
    config: {
      baseline: teste.baseline ?? null,
      mde: teste.mde ?? 0.2,
      alfa: teste.alfa ?? 0.05,
      poder: teste.poder ?? 0.8,
      minDias: teste.min_dias ?? 7,
      maxDias: teste.max_dias ?? 30,
      pesos: variantes.map((v) => v.peso),
    },
  });

  return {
    teste: {
      slug: teste.slug,
      nome: teste.nome,
      hipotese: teste.hipotese,
      jira: teste.jira,
      status: teste.status,
      iniciado_em: teste.iniciado_em,
      min_dias: teste.min_dias ?? 7,
      max_dias: teste.max_dias ?? 30,
      mde: teste.mde ?? 0.2,
      baseline: teste.baseline ?? null,
    },
    ...analise,
    periodo: { de: ag.primeiroDia, ate: ag.ultimoDia, dias_com_dado: ag.diasComDado },
    serieDiaria: ag.serieDiaria,
    saude: ag.saude,
  };
}

/**
 * Analisa vários testes.
 *
 * O padrão exclui `encerrado` de propósito. Cada teste analisado relê os
 * eventos dele, e no driver do Supabase isso é uma ida ao PostgREST a cada
 * 1000 linhas, em série. Analisando tudo, o custo do painel só cresce — teste
 * encerrado nunca sai da conta — até a função estourar o limite de tempo da
 * Vercel (10s no Hobby, 15s no Pro). E ela estoura em SILÊNCIO: o 504 vai pro
 * log, o painel simplesmente para de abrir e o cron para de produzir veredito.
 *
 * Teste encerrado tem resultado congelado; pra revê-lo, peça por slug.
 */
const VIVOS = new Set(['rodando', 'pausado']);

export async function analisarTodos(store, { apenasRodando = false, todos = false } = {}) {
  const testes = await store.listarTestes();
  const alvo = todos
    ? testes
    : testes.filter((t) => (apenasRodando ? t.status === 'rodando' : VIVOS.has(t.status)));
  const out = [];
  for (const t of alvo) out.push(await analisarTeste(store, t));
  return out;
}
