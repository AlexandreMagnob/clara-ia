/**
 * ROTEADOR — o coração da ferramenta.
 *
 * É a URL que vai no anúncio:
 *     https://<plataforma>/t/hero-lp-sql?utm_source=meta&utm_campaign=...
 *
 * O que acontece aqui, em ordem:
 *   1. acha o teste pelo slug
 *   2. descarta bot e pré-carregamento (vão pro controle, não contam)
 *   3. pega ou cria o id do visitante (cookie `cwab_vid`)
 *   4. sorteia a variante por hash determinístico (mesmo visitante, mesma variante)
 *   5. confere de novo se a URL de destino é de domínio permitido
 *   6. grava a atribuição — ANTES de redirecionar, e é ela o denominador
 *   7. devolve 302 (nunca 301) com cache desligado
 *
 * A gravação é aguardada de propósito. Em serverless não existe "depois da
 * resposta": o processo é congelado assim que o handler retorna, e um write
 * disparado sem await simplesmente não acontece — o resultado seria perder
 * atribuição de forma irregular entre as variantes, que é SRM fabricado por nós
 * mesmos. Custa alguns ms; é o preço de um denominador confiável.
 */

import { criarStore } from '../lib/store.js';
import { atribuir } from '../lib/hash.js';
import { montarDestino, urlPermitida } from '../lib/config.js';
import { motivoExclusao } from '../lib/bots.js';
import { dia, agora } from '../lib/tempo.js';
import {
  urlDe, cookies, porCookie, redirecionar, texto, novoId, hashIp, ipDe,
} from '../lib/http.js';

const COOKIE_VID = 'cwab_vid';

export default async function handler(req, res) {
  const url = urlDe(req);

  // Só navegação de verdade entra na amostra. Um HEAD de verificador de link
  // (ou um POST perdido) rodava o fluxo inteiro e gravava atribuição de alguém
  // que nunca viu página nenhuma. HEAD ainda recebe o 302 — só não conta.
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return texto(res, 405, 'use GET');
  }
  const contaMetodo = req.method === 'GET';

  // slug vem de /t/<slug> (via rewrite do vercel.json) ou de ?s=<slug>
  const doPath = url.pathname.match(/^\/t\/([^/?]+)/);
  const slug = (doPath ? doPath[1] : url.searchParams.get('s') || '').trim().toLowerCase();

  if (!slug) return texto(res, 400, 'falta o slug do teste: /t/<slug>');

  const store = criarStore();
  let teste;
  try {
    teste = await store.obterTeste(slug);
  } catch (e) {
    // Banco fora do ar não pode derrubar a campanha: manda pro fallback.
    return desviarSeguro(res, null, `store indisponível: ${e.message}`);
  }

  if (!teste || !Array.isArray(teste.variantes) || teste.variantes.length === 0) {
    return desviarSeguro(res, null, `teste "${slug}" não existe`);
  }

  const controle = [...teste.variantes].sort((a, b) => a.ordem - b.ordem)[0];

  // Teste que não está rodando continua atendendo o anúncio — pelo controle.
  // Devolver 404 aqui mataria a campanha por causa de configuração.
  if (teste.status !== 'rodando') {
    return desviarSeguro(res, controle, `teste "${slug}" está ${teste.status}`, { url, slug });
  }

  const ua = req.headers['user-agent'] || '';
  const excluir = motivoExclusao(ua, req.headers);
  if (excluir) {
    // Bot vai pro CONTROLE de propósito: o AdsBot do Google precisa avaliar a
    // página real do anúncio, e o crawler do Facebook precisa gerar o preview
    // certo. E nada disso é contabilizado.
    return desviarSeguro(res, controle, `excluído: ${excluir}`, { url, slug });
  }

  // ── id do visitante ───────────────────────────────────────────────────────
  const ck = cookies(req);
  let vid = ck[COOKIE_VID];
  let vidNovo = false;
  if (!vid || !/^[a-f0-9]{16,64}$/i.test(vid)) {
    vid = novoId();
    vidNovo = true;
  }

  // ── variante ──────────────────────────────────────────────────────────────
  const forcada = url.searchParams.get('cwforce');
  let variante;
  let contabilizar = true;

  if (forcada) {
    // Modo de conferência manual (o print do D.O.D sai daqui). Nunca conta,
    // senão quem testa a mão envenena a amostra.
    variante = teste.variantes.find((v) => v.chave === forcada);
    contabilizar = false;
    if (!variante) return texto(res, 400, `variante "${forcada}" não existe neste teste`);
  } else {
    variante = atribuir(teste, vid);
    if (!variante) {
      // Fora da cobertura: segue pro controle sem entrar no teste. NÃO leva
      // `vid` — sem ele o snippet não acha contexto e não manda evento nenhum.
      // Antes levava, e cada visitante fora da cobertura gerava uma conversão
      // órfã: o aviso de saúde do painel acendia por desenho, todo dia,
      // treinando o time a ignorar justamente o aviso que importa.
      return desviarSeguro(res, controle, 'fora da cobertura', { url, slug, vidCookie: vid, vidNovo });
    }
  }
  if (!contaMetodo) contabilizar = false;

  // ── defesa em profundidade: a URL do banco pode não ter passado pela
  //    validação de gravação (migração, edição manual, outro cliente) ────────
  const perm = urlPermitida(variante.url);
  if (!perm.ok) {
    return texto(res, 500, `configuração inválida na variante ${variante.chave}: ${perm.motivo}`);
  }

  const destino = montarDestino(variante, url.pathname + url.search, {
    slug,
    // `cwvid` só sai quando a visita CONTA. Sem essa amarra, a conferência
    // manual com `?cwforce=B` mandava o vid pra LP, o snippet registrava uma
    // conversão que ficava órfã, e no dia em que aquele mesmo navegador
    // clicasse num anúncio de verdade a atribuição nasceria e adotaria a
    // conversão de teste. Duas consequências: a conferência do guia nunca
    // fechava (parecia `submit_success` quebrado) e lixo de QA entrava na conta.
    vid: contabilizar ? vid : null,
    referrer: req.headers.referer,
  });

  if (contabilizar) {
    try {
      // Espera a gravação, mas com teto. Aguardar é o certo (em serverless não
      // existe "depois da resposta"), só que "custa alguns ms" vale enquanto o
      // banco responde em ms. Num soluço do Supabase, sem teto, isso vira o
      // clique pago parado até a função estourar — e aí o visitante não chega
      // nem na LP. Com teto, o pior caso é perder o registro de um clique.
      await Promise.race([
        store.registrarEvento({
          teste: slug,
          variante: variante.chave,
          visitante: vid,
          tipo: 'assignment',
          criado_em: agora(),
          dia: dia(),
          bot: false,
          ua: String(ua).slice(0, 300),
          ip_hash: hashIp(ipDe(req)),
          referrer: String(req.headers.referer || '').slice(0, 300),
          utm_source: url.searchParams.get('utm_source') || null,
          utm_campaign: url.searchParams.get('utm_campaign') || null,
          utm_medium: url.searchParams.get('utm_medium') || null,
        }),
        new Promise((_, rej) =>
          setTimeout(() => rej(new Error('timeout de 800ms na gravação')), 800).unref?.()),
      ]);
    } catch (e) {
      // Perder o registro é ruim, mas segurar o visitante é pior. Segue o
      // redirect; o SRM vai denunciar se isso virar sistemático.
      console.error('[ab] falha ao gravar atribuição:', e.message);
    }
  }

  const headers = {};
  if (vidNovo || !ck[COOKIE_VID]) headers['Set-Cookie'] = porCookie(COOKIE_VID, vid);
  headers['X-AB-Variante'] = variante.chave;
  headers['X-AB-Teste'] = slug;
  if (!contabilizar) headers['X-AB-Contabilizado'] = 'nao';

  return redirecionar(res, destino, headers);
}

/**
 * Saída de emergência. Sempre existe um destino: variante de controle, ou o
 * `AB_URL_FALLBACK`. Só devolve erro se não houver nenhum dos dois — porque um
 * 404 aqui é verba de anúncio caindo numa página de erro.
 */
function desviarSeguro(res, controle, motivo, ctx = {}) {
  const headers = { 'X-AB-Motivo': String(motivo).slice(0, 120), 'X-AB-Contabilizado': 'nao' };
  // O cookie ainda é gravado (o visitante pode entrar no teste na próxima), mas
  // NENHUM caminho daqui manda `cwvid` pra LP: se a visita não conta, o snippet
  // não pode ter contexto — evento sem atribuição só produz órfã.
  if (ctx.vidCookie && ctx.vidNovo) headers['Set-Cookie'] = porCookie(COOKIE_VID, ctx.vidCookie);

  if (controle) {
    const perm = urlPermitida(controle.url);
    if (perm.ok) {
      const destino = ctx.url
        ? montarDestino(controle, ctx.url.pathname + ctx.url.search, { slug: ctx.slug, vid: null })
        : controle.url;
      return redirecionar(res, destino, headers);
    }
  }
  const fallback = process.env.AB_URL_FALLBACK;
  if (fallback && urlPermitida(fallback).ok) return redirecionar(res, fallback, headers);
  return texto(res, 404, `sem destino para este teste (${motivo})`, headers);
}
