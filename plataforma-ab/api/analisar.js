/**
 * JOB DE ANÁLISE — o "disparo por trigger" que a atividade pede.
 *
 * Roda 1x por dia pelo Vercel Cron (ver `vercel.json`), ou à mão:
 *     node scripts/analisar.js
 *
 * Para cada teste rodando: agrega, aplica as travas, e **só avisa no Slack se o
 * veredito MUDOU** desde a última execução.
 *
 * O "só se mudou" não é economia de mensagem, é parte da trava: aviso diário de
 * "B está na frente" é exatamente o peeking que a plataforma existe pra
 * impedir. O time tem que ver o canal do Slack só quando há decisão a tomar.
 *
 * Autenticação: `Authorization: Bearer <AB_CRON_SECRET>` (é o formato que o
 * Vercel Cron manda) ou `X-AB-Token: <AB_ADMIN_TOKEN>` pra rodar manualmente.
 */

import { criarStore } from '../lib/store.js';
import { analisarTeste } from '../lib/analise.js';
import { avisar } from '../lib/slack.js';
import { VEREDITOS } from '../lib/estatistica.js';
import { json, segredoConfere, urlDe } from '../lib/http.js';

// Veredito "rodando"/"sem dado" não gera aviso: não há nada pra decidir.
const AVISAVEIS = new Set([VEREDITOS.VENCEDOR, VEREDITOS.SRM, VEREDITOS.INCONCLUSIVO]);

function autorizado(req) {
  const bearer = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  // `CRON_SECRET` (sem prefixo) é o nome que a Vercel exige pro cron dela: ela
  // manda `Authorization: Bearer $CRON_SECRET` sozinha. Sem aceitar esse nome,
  // o cron bateria aqui e tomaria 401 todo dia — em silêncio, porque ninguém
  // olha log de cron que "roda".
  for (const segredo of [process.env.AB_CRON_SECRET, process.env.CRON_SECRET]) {
    if (segredo && segredoConfere(bearer, segredo)) return true;
  }
  const admin = process.env.AB_ADMIN_TOKEN;
  if (admin && segredoConfere(req.headers['x-ab-token'] || bearer, admin)) return true;
  return false;
}

export default async function handler(req, res) {
  if (!autorizado(req)) return json(res, 401, { erro: 'não autorizado' });

  const seco = urlDe(req).searchParams.get('seco') === '1'; // não avisa nem grava
  const store = criarStore();
  const relatorio = [];

  try {
    const testes = (await store.listarTestes()).filter((t) => t.status === 'rodando');

    for (const teste of testes) {
      const a = await analisarTeste(store, teste);
      const anterior = teste.ultimo_veredito || null;
      const mudou = a.veredito !== anterior;
      const deveAvisar = mudou && AVISAVEIS.has(a.veredito);

      let slack = { enviado: false, motivo: 'sem mudança de veredito' };
      if (deveAvisar && !seco) {
        slack = await avisar(teste, a);
      } else if (deveAvisar && seco) {
        slack = { enviado: false, motivo: 'modo seco', msg: (await avisar(teste, a, { webhook: null })).msg };
      }

      if (mudou && !seco) {
        // Só persiste depois que o aviso saiu. Se o Slack estiver configurado e
        // falhar, o veredito NÃO é gravado — assim a execução seguinte tenta de
        // novo em vez de engolir a notificação pra sempre.
        //
        // Webhook AUSENTE é caso diferente de webhook QUEBRADO: sem webhook não
        // há aviso a perder, e travar a persistência aí faria o job re-notificar
        // eternamente em qualquer ambiente sem Slack.
        const slackPendente = deveAvisar && slack.configurado !== false && !slack.enviado;
        if (!slackPendente) {
          // `atualizarVeredito`, não `salvarTeste`: este job só tem permissão de
          // mexer em duas colunas. `salvarTeste` reescreveria as variantes todo
          // dia, e uma falha no meio disso deixa um teste no ar sem destino.
          await store.atualizarVeredito(teste.slug, {
            ultimo_veredito: a.veredito,
            vencedor: a.vencedor ?? teste.vencedor ?? null,
          });
        }
      }

      relatorio.push({
        slug: teste.slug,
        veredito: a.veredito,
        anterior,
        mudou,
        motivo: a.motivo,
        dias: a.dias_rodados,
        n: (a.variantes || []).map((v) => `${v.chave}:${v.n}`).join(' '),
        slack: { enviado: slack.enviado, motivo: slack.motivo || null },
      });
    }

    return json(res, 200, { ok: true, seco, analisados: relatorio.length, testes: relatorio });
  } catch (e) {
    console.error('[ab] /api/analisar:', e);
    return json(res, 500, { erro: e.message, parcial: relatorio });
  }
}
