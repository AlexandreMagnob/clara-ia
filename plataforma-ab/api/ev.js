/**
 * INGESTÃO DE EVENTOS — o que o snippet da LP manda pra cá.
 *
 * Aceita só dois tipos: `view` e `conversion`.
 *
 * `assignment` é RECUSADO aqui, sempre. Ele só nasce no roteador, no servidor.
 * Se este endpoint aceitasse atribuição, qualquer um inflaria o denominador de
 * um braço a partir do navegador — e o denominador é o que decide a taxa de
 * conversão. Essa é a regra mais importante do arquivo.
 *
 * Sobre abuso: conversão de visitante que nunca foi atribuído é descartada na
 * agregação (`lib/store.js`), e conversão repetida do mesmo visitante é
 * deduplicada. O estrago máximo de quem forjar evento é 1 conversão por id de
 * visitante que ele já conheça — e ele só conhece o dele.
 */

import { criarStore } from '../lib/store.js';
import { dia, agora } from '../lib/tempo.js';
import { ehBot } from '../lib/bots.js';
import { dominiosPermitidos } from '../lib/config.js';
import { urlDe, lerCorpo, json, pixel, hashIp, ipDe } from '../lib/http.js';

const TIPOS_ACEITOS = new Set(['view', 'conversion']);
const RE_VID = /^[a-f0-9]{16,64}$/i;

/**
 * Freio por IP, janela deslizante de 1 minuto.
 *
 * HONESTIDADE SOBRE O QUE ISTO É: em serverless o estado não é compartilhado
 * entre invocações, então isto limita por INSTÂNCIA, não globalmente. Não segura
 * um ataque distribuído e não substitui nada.
 *
 * O que ele resolve de verdade é o caso comum e chato: laço acidental, retry em
 * loop, teste de carga, monitor mal configurado. A defesa contra amostra
 * fabricada é outra e mora na análise — concentração de `ip_hash` em
 * `lib/store.js` tranca o veredito (ver a trava "origem do tráfego").
 */
const JANELA_MS = 60_000;
const TETO_POR_JANELA = 120;
const balde = new Map();

function excedeu(chave) {
  if (!chave) return false;
  const agoraMs = Date.now();
  const reg = balde.get(chave);
  if (!reg || agoraMs - reg.inicio > JANELA_MS) {
    balde.set(chave, { inicio: agoraMs, n: 1 });
    // Poda oportunista: sem isso o Map cresce enquanto a instância viver.
    if (balde.size > 5000) {
      for (const [k, v] of balde) if (agoraMs - v.inicio > JANELA_MS) balde.delete(k);
    }
    return false;
  }
  reg.n += 1;
  return reg.n > TETO_POR_JANELA;
}

function origemPermitida(req) {
  const origem = req.headers.origin;
  if (!origem) return null; // sendBeacon/img sem Origin: segue, não é erro
  try {
    const h = new URL(origem).hostname.toLowerCase();
    const ok = dominiosPermitidos().some((d) => h === d || h.endsWith('.' + d));
    return ok ? origem : false;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  const url = urlDe(req);

  const origem = origemPermitida(req);
  if (origem) {
    res.setHeader('Access-Control-Allow-Origin', origem);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    // O sendBeacon com Blob `application/json` obriga um preflight. Sem cachear,
    // é um OPTIONS a mais em CADA conversão — e a conversão acontece no pior
    // momento possível, com a página navegando.
    res.setHeader('Access-Control-Max-Age', '86400');
  }
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  if (origem === false) return json(res, 403, { erro: 'origem não permitida' });

  if (excedeu(hashIp(ipDe(req)))) {
    return json(res, 429, { erro: 'muitas requisições' }, { 'Retry-After': '60' });
  }

  // O pixel (<img>) é o plano C do snippet: responde imagem, nunca JSON, senão
  // o navegador loga erro no console da LP.
  const viaPixel = req.method === 'GET';

  let dados;
  if (viaPixel) {
    dados = {
      teste: url.searchParams.get('t'),
      variante: url.searchParams.get('v'),
      visitante: url.searchParams.get('vid'),
      tipo: url.searchParams.get('tipo'),
      valor: url.searchParams.get('valor'),
    };
  } else if (req.method === 'POST') {
    try {
      dados = await lerCorpo(req);
    } catch (e) {
      return json(res, 400, { erro: e.message });
    }
    // `JSON.parse('null')`, `'123'` e `'"txt"'` são JSON válido e NÃO são
    // objeto. Sem esta guarda, `dados.tipo` estoura em TypeError e o endpoint
    // devolve 500 — um endpoint público não pode dar 500 com corpo malformado.
    if (dados === null || typeof dados !== 'object' || Array.isArray(dados)) {
      return json(res, 400, { erro: 'corpo tem que ser um objeto JSON' });
    }
  } else {
    return json(res, 405, { erro: 'use GET ou POST' });
  }

  const responder = (status, corpo) => (viaPixel ? pixel(res) : json(res, status, corpo));

  // ── validação ─────────────────────────────────────────────────────────────
  const tipo = String(dados.tipo || '').trim();
  if (!TIPOS_ACEITOS.has(tipo)) {
    return responder(400, { erro: `tipo inválido "${tipo}" — aceita view ou conversion` });
  }
  const slug = String(dados.teste || '').trim().toLowerCase();
  const vid = String(dados.visitante || '').trim();
  if (!slug) return responder(400, { erro: 'falta o teste' });
  if (!RE_VID.test(vid)) return responder(400, { erro: 'id de visitante inválido' });

  const ua = req.headers['user-agent'] || '';
  if (ehBot(ua)) return responder(200, { ok: true, ignorado: 'bot' });

  const store = criarStore();
  let teste;
  try {
    teste = await store.obterTeste(slug);
  } catch (e) {
    return responder(503, { erro: 'store indisponível' });
  }
  if (!teste) return responder(404, { erro: 'teste não existe' });
  if (teste.status !== 'rodando') {
    return responder(200, { ok: true, ignorado: `teste ${teste.status}` });
  }

  const chave = String(dados.variante || '').trim();
  if (!teste.variantes.some((v) => v.chave === chave)) {
    return responder(400, { erro: `variante "${chave}" não existe neste teste` });
  }

  try {
    const r = await store.registrarEvento({
      teste: slug,
      // A variante declarada fica registrada, mas a agregação usa a ATRIBUÍDA.
      // Guardar as duas é o que permite detectar divergência depois.
      variante: chave,
      visitante: vid,
      tipo,
      criado_em: agora(),
      dia: dia(),
      bot: false,
      ua: String(ua).slice(0, 300),
      ip_hash: hashIp(ipDe(req)),
      valor: dados.valor !== undefined && dados.valor !== null && dados.valor !== ''
        ? Number(dados.valor) : null,
    });
    return responder(200, { ok: true, novo: r.novo });
  } catch (e) {
    console.error('[ab] falha ao gravar evento:', e.message);
    return responder(500, { erro: 'falha ao gravar' });
  }
}
