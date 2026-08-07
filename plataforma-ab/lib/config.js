/**
 * Definição, validação e normalização de um teste. Mais a montagem da URL de
 * destino do redirect.
 *
 * O redirect é o ponto perigoso da plataforma: um endpoint que manda o visitante
 * pra uma URL vinda de configuração é um open redirect esperando acontecer.
 * A defesa é a lista de domínios permitidos (`AB_DOMINIOS_PERMITIDOS`),
 * checada na GRAVAÇÃO e de novo no REDIRECT — porque o dado pode ter entrado
 * no banco por outro caminho que não passou pela validação.
 */

export const STATUS = ['rascunho', 'rodando', 'pausado', 'encerrado'];

const DOMINIOS_PADRAO = ['cardapioweb.com', 'lp.cardapioweb.com', 'blog.cardapioweb.com'];

export function dominiosPermitidos() {
  const env = process.env.AB_DOMINIOS_PERMITIDOS;
  if (!env) return DOMINIOS_PADRAO;
  return env.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
}

/**
 * Só https, e o host tem que ser um domínio permitido ou subdomínio dele.
 * A comparação é por rótulo (`.endsWith('.' + d)`), nunca por `includes` —
 * `includes('cardapioweb.com')` aceitaria `cardapioweb.com.invasor.net`.
 */
export function urlPermitida(url) {
  let u;
  try {
    u = new URL(String(url));
  } catch {
    return { ok: false, motivo: 'URL inválida' };
  }
  // http só existe pra rodar o kit de teste local contra o servidor de dev.
  // Em produção a variável não é definida e a regra volta a ser https e ponto.
  const permiteHttp = process.env.AB_PERMITIR_HTTP === '1';
  if (u.protocol !== 'https:' && !(permiteHttp && u.protocol === 'http:')) {
    return { ok: false, motivo: 'só https' };
  }
  if (u.username || u.password) return { ok: false, motivo: 'URL com credencial embutida' };
  const host = u.hostname.toLowerCase();
  const permitidos = dominiosPermitidos();
  const ok = permitidos.some((d) => host === d || host.endsWith('.' + d));
  return ok ? { ok: true, url: u } : { ok: false, motivo: `domínio "${host}" fora da lista permitida (${permitidos.join(', ')})` };
}

/** Parâmetros da plataforma — nunca são repassados pro destino.
 * `s` E `slug`: o rewrite da Vercel (`/t/:slug` → `/api/t?s=:slug`) injeta os
 * DOIS na query — o `s` do destino e o `slug` do segmento nomeado. Confirmado
 * em produção no smoke de 07/08: sem o `slug` aqui, a LP recebia
 * `&slug=<teste>` junto com os UTMs. */
export const PARAMS_INTERNOS = new Set(['cwab', 'cwvid', 'cwref', 'cwforce', 's', 'slug']);

const RE_SLUG = /^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/;
const RE_CHAVE = /^[A-Za-z0-9_-]{1,12}$/;

export function validarTeste(t, { anterior = null } = {}) {
  const erros = [];
  if (!t || typeof t !== 'object') return { ok: false, erros: ['teste vazio'] };

  if (!RE_SLUG.test(String(t.slug || ''))) {
    erros.push('slug: use 3 a 50 caracteres, minúsculo, número e hífen (ex.: hero-lp-sql)');
  }
  if (!t.nome || String(t.nome).trim().length < 3) erros.push('nome: obrigatório');
  if (t.status && !STATUS.includes(t.status)) {
    erros.push(`status: use um de ${STATUS.join(', ')}`);
  }

  const vars = Array.isArray(t.variantes) ? t.variantes : [];
  if (vars.length < 2) erros.push('variantes: precisa de pelo menos 2 (controle + 1)');
  if (vars.length > 6) erros.push('variantes: máximo 6 — acima disso a amostra por braço não fecha');

  const chaves = new Set();
  vars.forEach((v, i) => {
    const rot = `variante ${i + 1}`;
    if (!RE_CHAVE.test(String(v.chave || ''))) erros.push(`${rot}: chave inválida (use A, B, C…)`);
    else if (chaves.has(v.chave)) erros.push(`${rot}: chave "${v.chave}" repetida`);
    else chaves.add(v.chave);
    const p = urlPermitida(v.url);
    if (!p.ok) erros.push(`${rot} (${v.chave}): ${p.motivo}`);
    if (!(Number(v.peso) > 0)) erros.push(`${rot} (${v.chave}): peso tem que ser > 0`);
  });

  const soma = vars.reduce((a, v) => a + (Number(v.peso) || 0), 0);
  if (vars.length >= 2 && Math.abs(soma - 1) > 0.01) {
    erros.push(`pesos somam ${soma.toFixed(3)} — têm que somar 1`);
  }

  if (t.baseline !== undefined && t.baseline !== null && !(t.baseline > 0 && t.baseline < 1)) {
    erros.push('baseline: é uma proporção entre 0 e 1 (0.1237 = 12,37%)');
  }
  if (t.mde !== undefined && t.mde !== null && !(t.mde > 0 && t.mde <= 5)) {
    erros.push('mde: melhora relativa que se quer detectar, entre 0 e 5 (0.2 = 20%)');
  }
  if (t.cobertura !== undefined && !(t.cobertura > 0 && t.cobertura <= 1)) {
    erros.push('cobertura: entre 0 e 1');
  }
  if (t.min_dias !== undefined && !(Number.isInteger(t.min_dias) && t.min_dias >= 1)) {
    erros.push('min_dias: inteiro >= 1');
  }
  if (t.max_dias !== undefined && t.min_dias !== undefined && t.max_dias < t.min_dias) {
    erros.push('max_dias tem que ser >= min_dias');
  }

  // ── Configuração travada enquanto o teste roda ────────────────────────────
  //
  // Mexer em peso, seed ou conjunto de variantes com o teste no ar reatribui
  // visitante que já estava numa variante. Isso contamina os dois braços de uma
  // vez e o resultado vira lixo — sem nenhum erro aparecer em lugar nenhum.
  // Por isso é bloqueio, não aviso.
  if (anterior && anterior.status === 'rodando') {
    if (t.seed !== undefined && t.seed !== anterior.seed) {
      erros.push('seed não pode mudar com o teste rodando (reatribuiria todo mundo)');
    }
    const antesChaves = (anterior.variantes || []).map((v) => v.chave).sort().join(',');
    const agoraChaves = vars.map((v) => v.chave).sort().join(',');
    if (agoraChaves !== antesChaves) {
      erros.push('não dá pra adicionar/remover variante com o teste rodando — encerre e crie outro');
    }
    const pesoMudou = (anterior.variantes || []).some((a) => {
      const n = vars.find((v) => v.chave === a.chave);
      return n && Math.abs(Number(n.peso) - Number(a.peso)) > 1e-9;
    });
    if (pesoMudou) erros.push('não dá pra mudar peso com o teste rodando (reatribuiria visitantes)');
    if (t.cobertura !== undefined && Number(t.cobertura) !== Number(anterior.cobertura ?? 1)) {
      erros.push('não dá pra mudar cobertura com o teste rodando');
    }
    const urlMudou = (anterior.variantes || []).some((a) => {
      const n = vars.find((v) => v.chave === a.chave);
      return n && n.url !== a.url;
    });
    if (urlMudou) erros.push('não dá pra trocar a URL de uma variante com o teste rodando');

    // ── ORDEM ────────────────────────────────────────────────────────────
    // Parece cosmético e é o pior de todos. `atribuir()` monta as faixas de
    // bucket na sequência de `ordem`: inverter A e B faz 100% dos visitantes
    // passarem a receber a página do outro braço — mas a atribuição JÁ gravada
    // não muda (o dedupe barra), então eles veem B e seguem contados em A.
    // A divisão continua 50/50, o SRM não acusa, e o teste parece saudável
    // enquanto mede coisa nenhuma. Inverter a ordem também troca quem é o
    // controle, o que inverte o sinal do lift.
    //
    // Chega aqui sozinho: basta o painel reenviar as linhas em outra sequência
    // (remover e re-adicionar uma linha já faz isso).
    const ordemAntes = (anterior.variantes || [])
      .slice().sort((a, b) => a.ordem - b.ordem).map((v) => v.chave).join(',');
    const ordemAgora = vars.slice().sort((a, b) => a.ordem - b.ordem).map((v) => v.chave).join(',');
    if (ordemAntes && ordemAgora !== ordemAntes) {
      erros.push(`não dá pra reordenar as variantes com o teste rodando (era ${ordemAntes}, veio ${ordemAgora}) — isso troca o controle e manda todo mundo pra outra página`);
    }

    // ── PARÂMETROS DA ANÁLISE ────────────────────────────────────────────
    // A amostra mínima é recalculada a cada análise a partir de baseline e MDE.
    // Com eles soltos, aumentar o MDE derruba a amostra alvo e a trava de
    // evidência abre na hora: vencedor fabricado editando um campo, sem deixar
    // rastro. É o peeking que a ferramenta existe pra impedir, num formulário.
    //
    // Mudar plano de análise no meio do experimento invalida o experimento —
    // não é opinião de implementação, é o motivo de o plano ser pré-registrado.
    for (const [campo, rotulo] of [
      ['baseline', 'baseline'], ['mde', 'MDE'], ['alfa', 'alfa'],
      ['poder', 'poder'], ['min_dias', 'dias mínimos'], ['max_dias', 'dias máximos'],
    ]) {
      if (t[campo] === undefined || t[campo] === null) continue;
      const antesV = anterior[campo];
      if (antesV === undefined || antesV === null) continue;
      if (Math.abs(Number(t[campo]) - Number(antesV)) > 1e-12) {
        erros.push(`não dá pra mudar ${rotulo} com o teste rodando (era ${antesV}, veio ${t[campo]}) — isso remexe a amostra alvo e fabrica veredito`);
      }
    }
  }

  return { ok: erros.length === 0, erros };
}

export function normalizarTeste(t, { anterior = null } = {}) {
  const vars = (t.variantes || []).map((v, i) => ({
    chave: String(v.chave).trim(),
    nome: String(v.nome || v.chave).trim(),
    url: String(v.url).trim(),
    peso: Number(v.peso),
    ordem: v.ordem !== undefined ? Number(v.ordem) : i,
  }));
  return {
    slug: String(t.slug).trim().toLowerCase(),
    nome: String(t.nome).trim(),
    hipotese: t.hipotese ? String(t.hipotese).trim() : '',
    jira: t.jira ? String(t.jira).trim() : '',
    status: t.status || anterior?.status || 'rascunho',
    // A seed fixa a atribuição. Nasce do slug e nunca muda sozinha — se mudar,
    // todo mundo é resorteado.
    seed: t.seed || anterior?.seed || String(t.slug).trim().toLowerCase(),
    cobertura: t.cobertura !== undefined ? Number(t.cobertura) : (anterior?.cobertura ?? 1),
    baseline: t.baseline !== undefined && t.baseline !== null ? Number(t.baseline) : (anterior?.baseline ?? null),
    mde: t.mde !== undefined && t.mde !== null ? Number(t.mde) : (anterior?.mde ?? 0.2),
    alfa: t.alfa !== undefined ? Number(t.alfa) : (anterior?.alfa ?? 0.05),
    poder: t.poder !== undefined ? Number(t.poder) : (anterior?.poder ?? 0.8),
    min_dias: t.min_dias !== undefined ? Number(t.min_dias) : (anterior?.min_dias ?? 7),
    max_dias: t.max_dias !== undefined ? Number(t.max_dias) : (anterior?.max_dias ?? 30),
    variantes: vars.sort((a, b) => a.ordem - b.ordem),
    criado_em: anterior?.criado_em || new Date().toISOString(),
    atualizado_em: new Date().toISOString(),
    iniciado_em: anterior?.iniciado_em || null,
    encerrado_em: anterior?.encerrado_em || null,
    vencedor: t.vencedor ?? anterior?.vencedor ?? null,
    ultimo_veredito: anterior?.ultimo_veredito ?? null,
    obs: t.obs ? String(t.obs) : (anterior?.obs || ''),
  };
}

/**
 * Monta a URL final do redirect.
 *
 * - Parte da URL da variante (que já pode ter query própria).
 * - Traz os parâmetros que chegaram no anúncio (utm_*, gclid, fbclid…), porque
 *   sem eles o relatório de origem do lead quebra.
 * - Em conflito, o parâmetro da CONFIGURAÇÃO vence — ele foi escrito de
 *   propósito; o de entrada pode ser qualquer coisa.
 * - Acrescenta `cwab=<slug>:<chave>` pro snippet da LP saber onde está.
 * - `cwref` guarda o referrer original, que o redirect apagaria (o VWO faz o
 *   mesmo com `_vwo_referrer`).
 */
export function montarDestino(variante, urlEntrada, { slug, referrer, vid } = {}) {
  const destino = new URL(variante.url);
  const entrada = urlEntrada ? new URL(urlEntrada, 'https://x.invalid') : null;

  if (entrada) {
    for (const [k, v] of entrada.searchParams) {
      // Parâmetros internos não vazam pra LP. `s` está aqui porque o rewrite da
      // Vercel (`/t/:slug` → `/api/t?s=:slug`) injeta o slug na query — sem
      // filtrar, a LP receberia `?s=hero-lp-sql` em produção. Local não acontece
      // (não há rewrite), então isso não aparece no teste do dev-server.
      if (PARAMS_INTERNOS.has(k)) continue;
      if (!destino.searchParams.has(k)) destino.searchParams.set(k, v);
    }
  }
  destino.searchParams.set('cwab', `${slug}:${variante.chave}`);
  // O id do visitante viaja na URL porque a LP está em OUTRO domínio
  // (cardapioweb.com), e o cookie do roteador (vercel.app) não é legível lá.
  // É um id opaco e aleatório, não identifica pessoa.
  if (vid) destino.searchParams.set('cwvid', vid);
  if (referrer) {
    try {
      destino.searchParams.set('cwref', new URL(referrer).origin);
    } catch { /* referrer inútil, ignora */ }
  }
  return destino.toString();
}
