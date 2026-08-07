/**
 * Aviso no Slack via Incoming Webhook (env `AB_SLACK_WEBHOOK`).
 *
 * Sem webhook configurado a função NÃO quebra: devolve {enviado:false} e a
 * mensagem montada. É de propósito — o job de análise não pode falhar por causa
 * do Slack, senão um webhook expirado derruba a análise inteira.
 *
 * Antipeeking também vale aqui: o Slack só é acionado quando o veredito MUDA.
 * Aviso diário de "ainda rodando" treina o time a ignorar o canal, e aviso
 * diário de "B está ganhando" é exatamente o peeking que a trava existe pra
 * impedir.
 */

import { fmtP } from './estatistica.js';

const CORES = {
  vencedor: '#FFB600',      // Selective Yellow
  'sem efeito detectado': '#59327A',
  'inconclusivo — encerrar': '#59327A',
  'SRM — resultado suspeito': '#FF5959', // Carnation
};

export function montarMensagem(teste, analise, urlPainel) {
  const v = analise.veredito;
  const emoji = v === 'vencedor' ? ':trophy:' : v.startsWith('SRM') ? ':rotating_light:' : ':checkered_flag:';
  const linhas = [];

  linhas.push(`${emoji} *${teste.nome}* — \`${teste.slug}\``);
  linhas.push(`Veredito: *${v}*`);
  linhas.push(analise.motivo);
  linhas.push('');

  const tabela = [analise.controle, ...(analise.comparacoes || [])]
    .filter(Boolean)
    .map((c) => {
      const taxa = (c.taxa * 100).toFixed(2);
      const marca = analise.vencedor === c.chave ? ' :trophy:' : '';
      const p = c.p_horizonte_fixo !== undefined
        ? `  ·  p=${fmtP(c.p_horizonte_fixo)} (sempre-válido ${fmtP(c.p_sempre_valido)})`
        : '  ·  controle';
      return `• *${c.chave}* ${c.nome} — ${c.conv}/${c.n} = *${taxa}%*${p}${marca}`;
    });
  linhas.push(...tabela);

  if (v === 'vencedor' && analise.rota) {
    linhas.push('');
    linhas.push(`_Rota de decisão: ${analise.rota}. Rodou ${analise.dias_rodados} dias._`);
  }
  if (v.startsWith('SRM')) {
    linhas.push('');
    linhas.push('_Não olhe a conversão ainda. Divisão de tráfego torta = algum braço está perdendo gente antes de contar._');
  }
  if (urlPainel) {
    linhas.push('');
    linhas.push(`<${urlPainel}|Abrir no painel>`);
  }

  return {
    text: `${teste.nome}: ${v}`,
    attachments: [{ color: CORES[v] || '#59327A', text: linhas.join('\n'), mrkdwn_in: ['text'] }],
  };
}

export async function avisar(teste, analise, opts = {}) {
  const webhook = opts.webhook || process.env.AB_SLACK_WEBHOOK;
  const msg = montarMensagem(teste, analise, opts.urlPainel || process.env.AB_URL_PAINEL);

  // `configurado` separa duas coisas que parecem a mesma e não são:
  //   não configurado  → não há o que enviar; o veredito PODE ser persistido
  //   configurado e falhou → o aviso se perdeu; NÃO persistir, tentar de novo
  // Sem essa distinção, um ambiente sem webhook re-notificaria pra sempre
  // (foi o que a simulação pegou no passo 9).
  if (!webhook) {
    return { enviado: false, configurado: false, motivo: 'AB_SLACK_WEBHOOK não configurado', msg };
  }
  try {
    const r = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
    });
    const txt = await r.text();
    // O webhook do Slack devolve o literal "ok" no corpo. 200 com outro corpo
    // (ex.: "invalid_payload") NÃO é sucesso — checar só o status engana.
    const ok = r.ok && txt.trim().toLowerCase() === 'ok';
    return { enviado: ok, configurado: true, status: r.status, resposta: txt.slice(0, 200), msg };
  } catch (e) {
    return { enviado: false, configurado: true, motivo: String(e), msg };
  }
}
