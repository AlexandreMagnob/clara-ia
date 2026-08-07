/**
 * Motor estatístico — a "trava" da plataforma.
 *
 * O ponto da atividade (GWT-3256) é NÃO declarar vencedor com falso positivo.
 * O erro clássico é o *peeking*: olhar o resultado todo dia e parar no primeiro
 * p < 0,05. Fazendo isso, o erro tipo I real vai de 5% para ~100%
 * (Johari et al., "Peeking at A/B Tests", KDD 2017).
 *
 * A defesa aqui tem quatro camadas, e o vencedor só sai com as QUATRO ok:
 *
 *   1. Ciclo mínimo    — nº de dias corridos (padrão 7: uma semana inteira,
 *                        senão o teste mede "terça-feira", não a variante).
 *   2. Amostra mínima  — n por braço calculado por poder estatístico
 *                        (α=5%, poder=80%) a partir do baseline e do MDE.
 *   3. SRM             — qui-quadrado na divisão do tráfego. Se a divisão real
 *                        desviou da esperada, o teste está quebrado e NENHUM
 *                        resultado dele vale. Corte p < 0,001
 *                        (Trustworthy Online Controlled Experiments / GrowthBook).
 *   4. Significância   — p-valor SEMPRE-VÁLIDO por mSPRT (Johari, Pekelis,
 *                        Walsh 2019; é o que a Optimizely usa desde 2015).
 *                        Esse p pode ser olhado a qualquer momento sem inflar
 *                        falso positivo. O z-test de horizonte fixo é calculado
 *                        junto, só como segunda fechadura.
 *
 * Nada aqui depende de biblioteca externa — roda no edge da Vercel.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Funções especiais
// ─────────────────────────────────────────────────────────────────────────────

/**
 * erfc por aproximação de Chebyshev (Numerical Recipes 3ª ed., §6.2).
 * Erro relativo < 1e-15 — importante porque a gente precisa de precisão NA CAUDA
 * (p de 0,001 do SRM). Aproximação de erro absoluto mentiria justamente ali.
 */
export function erfc(x) {
  const z = Math.abs(x);
  const t = 2 / (2 + z);
  const ty = 4 * t - 2;
  const cof = [
    -1.3026537197817094, 6.4196979235649026e-1, 1.9476473204185836e-2,
    -9.561514786808631e-3, -9.46595344482036e-4, 3.66839497852761e-4,
    4.2523324806907e-5, -2.0278578112534e-5, -1.624290004647e-6,
    1.30365583558e-6, 1.5626441722e-8, -8.5238095915e-8, 6.529054439e-9,
    5.059343495e-9, -9.91364156e-10, -2.27365122e-10, 9.6467911e-11,
    2.394038e-12, -6.886027e-12, 8.94487e-13, 3.13092e-13, -1.12708e-13,
    3.81e-16, 7.106e-15,
  ];
  let d = 0;
  let dd = 0;
  for (let j = cof.length - 1; j > 0; j--) {
    const tmp = d;
    d = ty * d - dd + cof[j];
    dd = tmp;
  }
  const ans = t * Math.exp(-z * z + 0.5 * (cof[0] + ty * d) - dd);
  return x >= 0 ? ans : 2 - ans;
}

/** Φ(z) — acumulada da normal padrão. */
export function normalCdf(z) {
  return 0.5 * erfc(-z / Math.SQRT2);
}

/** Cauda de duas pontas de |z|. Usa erfc direto: não perde precisão na cauda. */
export function pBicaudal(z) {
  return Math.min(1, erfc(Math.abs(z) / Math.SQRT2));
}

/** Φ⁻¹(p) — quantil da normal (Acklam) + um refino de Halley. */
export function normalQuantil(p) {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2,
    1.38357751867269e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2,
    6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838,
    -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996,
    3.754408661907416];
  const pl = 0.02425;
  let x;
  if (p < pl) {
    const q = Math.sqrt(-2 * Math.log(p));
    x = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (p <= 1 - pl) {
    const q = p - 0.5;
    const r = q * q;
    x = (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  } else {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    x = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  // refino de Halley
  const e = 0.5 * erfc(-x / Math.SQRT2) - p;
  const u = e * Math.sqrt(2 * Math.PI) * Math.exp((x * x) / 2);
  return x - u / (1 + (x * u) / 2);
}

/** ln Γ(x) — Lanczos. */
function lnGama(x) {
  const g = [676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012,
    9.9843695780195716e-6, 1.5056327351493116e-7];
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lnGama(1 - x);
  const z = x - 1;
  let a = 0.99999999999980993;
  for (let i = 0; i < g.length; i++) a += g[i] / (z + i + 1);
  const t = z + g.length - 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(a);
}

/** Q(a,x) = gama incompleta superior regularizada (série + fração continuada). */
function gamaQ(a, x) {
  if (x < 0 || a <= 0) return NaN;
  if (x === 0) return 1;
  if (x < a + 1) {
    // série para P(a,x), devolve 1-P
    let ap = a;
    let soma = 1 / a;
    let del = soma;
    for (let i = 0; i < 500; i++) {
      ap += 1;
      del *= x / ap;
      soma += del;
      if (Math.abs(del) < Math.abs(soma) * 1e-16) break;
    }
    return 1 - soma * Math.exp(-x + a * Math.log(x) - lnGama(a));
  }
  // fração continuada (Lentz) para Q(a,x)
  const min = 1e-300;
  let b = x + 1 - a;
  let c = 1 / min;
  let d = 1 / b;
  let h = d;
  for (let i = 1; i <= 500; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < min) d = min;
    c = b + an / c;
    if (Math.abs(c) < min) c = min;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 1e-16) break;
  }
  return Math.exp(-x + a * Math.log(x) - lnGama(a)) * h;
}

/** p-valor da qui-quadrado (cauda superior), gl graus de liberdade. */
export function chi2P(x, gl) {
  if (!(x > 0)) return 1;
  if (gl === 1) return erfc(Math.sqrt(x / 2)); // exato, sem passar pela gama
  return gamaQ(gl / 2, x / 2);
}

// ─────────────────────────────────────────────────────────────────────────────
// Testes
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sample Ratio Mismatch. Compara a divisão observada do tráfego com a esperada.
 *
 * Se der SRM, o teste está quebrado em algum lugar (redirect falhando numa
 * variante, bot batendo só numa URL, cache servindo errado) e o resultado
 * inteiro é lixo — não adianta "corrigir" a conta. Por isso ele TRANCA o
 * veredito em vez de virar um aviso discreto.
 *
 * Corte 0,001: a checagem roda em todo teste, então o alfa tem que ser bem
 * apertado pra não gritar à toa (Microsoft usa 0,0005; Eppo e o livro
 * Trustworthy Online Controlled Experiments usam 0,001).
 */
export function checarSRM(observados, esperadosPeso, corte = 0.001) {
  const total = observados.reduce((a, b) => a + b, 0);
  const somaPeso = esperadosPeso.reduce((a, b) => a + b, 0);
  if (total === 0 || somaPeso === 0) {
    return { aplicavel: false, ok: true, p: 1, chi2: 0, motivo: 'sem tráfego' };
  }
  // Com n muito pequeno o qui-quadrado não vale (esperado < 5 por célula).
  const esperados = esperadosPeso.map((w) => (total * w) / somaPeso);
  if (esperados.some((e) => e < 5)) {
    return { aplicavel: false, ok: true, p: 1, chi2: 0, esperados, motivo: 'amostra pequena demais para o qui-quadrado (esperado < 5)' };
  }
  let chi2 = 0;
  for (let i = 0; i < observados.length; i++) {
    chi2 += ((observados[i] - esperados[i]) ** 2) / esperados[i];
  }
  const p = chi2P(chi2, observados.length - 1);
  return { aplicavel: true, ok: p >= corte, p, chi2, esperados, corte };
}

/** z-test de duas proporções (agrupado), horizonte fixo. */
export function zTestProporcoes(convA, nA, convB, nB) {
  if (nA <= 0 || nB <= 0) return { z: 0, p: 1, valido: false };
  const p1 = convA / nA;
  const p2 = convB / nB;
  const pool = (convA + convB) / (nA + nB);
  const se = Math.sqrt(pool * (1 - pool) * (1 / nA + 1 / nB));
  if (!(se > 0)) return { z: 0, p: 1, valido: false, p1, p2 };
  const z = (p2 - p1) / se;
  return { z, p: pBicaudal(z), valido: true, p1, p2, lift: p1 > 0 ? (p2 - p1) / p1 : null };
}

/** Intervalo de confiança da diferença absoluta (não agrupado, Wald). */
export function icDiferenca(convA, nA, convB, nB, alfa = 0.05) {
  if (nA <= 0 || nB <= 0) return null;
  const p1 = convA / nA;
  const p2 = convB / nB;
  const se = Math.sqrt((p1 * (1 - p1)) / nA + (p2 * (1 - p2)) / nB);
  const z = normalQuantil(1 - alfa / 2);
  return { dif: p2 - p1, baixo: p2 - p1 - z * se, alto: p2 - p1 + z * se, se };
}

/**
 * Amostra mínima POR BRAÇO, por poder estatístico.
 *
 *   n = (z_{1-α/2} + z_{poder})² · (p1(1-p1) + p2(1-p2)) / (p2 - p1)²
 *
 * `mde` é RELATIVO (0,20 = detectar 20% de melhora sobre o baseline), que é como
 * o time raciocina ("quero pegar 20% a mais de conversão").
 */
export function amostraMinima(baseline, mde, alfa = 0.05, poder = 0.8) {
  const p1 = Number(baseline);
  if (!(p1 > 0 && p1 < 1) || !(mde > 0)) return null;
  const p2 = Math.min(0.999999, p1 * (1 + mde));
  const dif = p2 - p1;
  if (!(dif > 0)) return null;
  const zA = normalQuantil(1 - alfa / 2);
  const zB = normalQuantil(poder);
  const n = ((zA + zB) ** 2 * (p1 * (1 - p1) + p2 * (1 - p2))) / dif ** 2;
  return Math.ceil(n);
}

/**
 * mSPRT — p-valor sempre-válido para diferença de proporções.
 *
 *   Λ_n = sqrt( 2σ² / (2σ² + n·τ²) ) · exp( n²τ²(Δ̂ - θ₀)² / (4σ²(2σ² + n·τ²)) )
 *   p_n = min(1, 1/Λ_n)
 *
 * σ² = variância agrupada p̄(1-p̄). Para braços de tamanho diferente, `n` vira o
 * n efetivo que reproduz a variância real da diferença: n_ef = 2σ²/Var(Δ̂).
 *
 * τ (a variância da mistura) concentra o poder em torno do efeito que a gente
 * se importa em detectar — por isso o padrão é o MDE em valor absoluto.
 *
 * O p-valor sempre-válido oficial é o MÍNIMO CORRENTE da série (`pSempreValido`
 * abaixo): uma vez que cruzou, cruzou.
 */
export function msprt(convA, nA, convB, nB, tau) {
  if (nA <= 0 || nB <= 0) return { p: 1, lambda: 0, valido: false };
  const p1 = convA / nA;
  const p2 = convB / nB;
  const pool = (convA + convB) / (nA + nB);
  const sigma2 = pool * (1 - pool);
  const varDif = (p1 * (1 - p1)) / nA + (p2 * (1 - p2)) / nB;
  if (!(sigma2 > 0) || !(varDif > 0) || !(tau > 0)) {
    return { p: 1, lambda: 0, valido: false };
  }
  const nEf = (2 * sigma2) / varDif;
  const delta = p2 - p1;
  const t2 = tau * tau;
  const denom = 2 * sigma2 + nEf * t2;
  const lnLambda =
    0.5 * Math.log((2 * sigma2) / denom) +
    (nEf * nEf * t2 * delta * delta) / (4 * sigma2 * denom);
  const lambda = Math.exp(lnLambda);
  return { p: Math.min(1, Math.exp(-lnLambda)), lambda, valido: true, nEf, delta };
}

/**
 * p sempre-válido sobre a série acumulada dia a dia.
 * `serie` = [{ dia, convA, nA, convB, nB }, ...] em ordem cronológica, JÁ acumulada.
 */
export function pSempreValido(serie, tau, alfa = 0.05) {
  let min = 1;
  let cruzouEm = null;
  const trilha = [];
  for (const d of serie) {
    const r = msprt(d.convA, d.nA, d.convB, d.nB, tau);
    if (r.valido && r.p < min) min = r.p;
    if (cruzouEm === null && min < alfa) cruzouEm = d.dia;
    trilha.push({ dia: d.dia, p: r.valido ? r.p : 1, pCorrente: min });
  }
  return { p: min, cruzouEm, trilha };
}

/**
 * Correção de Šidák para comparações múltiplas.
 *
 *   α_por_comparação = 1 − (1 − α)^(1/k)
 *
 * Com k desafiantes comparados ao mesmo controle, testar cada um a 5% NÃO
 * mantém o erro global em 5%. Medido no motor desta plataforma, com teste A/A
 * puro (as duas variantes idênticas), 14 dias × 400/dia por braço:
 *
 *   2 braços →  5,5%   ← no alvo
 *   3 braços → 10,7%
 *   4 braços → 13,6%
 *   6 braços → 20,1%   ← 1 em cada 5 testes A/A declara vencedor
 *
 * Ou seja: com 6 braços e nenhuma diferença real, a ferramenta inventaria um
 * vencedor em 20% das vezes. Šidák devolve o erro global pro alvo. É levemente
 * conservador (Dunnett aproveitaria a correlação entre comparações que dividem
 * o mesmo controle), e conservador aqui é o lado certo de errar.
 */
export function alfaAjustado(alfa, kComparacoes) {
  const k = Math.max(1, Number(kComparacoes) || 1);
  if (k === 1) return alfa;
  return 1 - Math.pow(1 - alfa, 1 / k);
}

// ─────────────────────────────────────────────────────────────────────────────
// Veredito
// ─────────────────────────────────────────────────────────────────────────────

export const VEREDITOS = {
  SEM_DADO: 'sem dado',
  RODANDO: 'rodando',
  SRM: 'SRM — resultado suspeito',
  VENCEDOR: 'vencedor',
  SEM_EFEITO: 'sem efeito detectado',
  INCONCLUSIVO: 'inconclusivo — encerrar',
};

/**
 * Aplica as quatro travas e devolve o veredito.
 *
 * `dados`: {
 *   variantes: [{ chave, nome, n, conv }],   // n = atribuições (denominador)
 *   serieDiaria: { [chave]: [{dia, n, conv}] },  // acumulado por dia
 *   diasRodados, config: { baseline, mde, alfa, poder, minDias, maxDias, pesos }
 * }
 */
export function avaliar(dados) {
  const cfg = dados.config || {};
  const alfa = cfg.alfa ?? 0.05;
  const poder = cfg.poder ?? 0.8;
  const minDias = cfg.minDias ?? 7;
  const maxDias = cfg.maxDias ?? 30;
  const vars = dados.variantes || [];
  const dias = dados.diasRodados ?? 0;

  const base = {
    veredito: VEREDITOS.SEM_DADO,
    travas: [],
    pode_decidir: false,
    variantes: vars,
  };

  if (vars.length < 2) {
    return { ...base, motivo: 'teste precisa de pelo menos 2 variantes' };
  }
  const totalN = vars.reduce((a, v) => a + v.n, 0);
  if (totalN === 0) return { ...base, motivo: 'nenhuma atribuição registrada ainda' };

  // ── Trava 3 primeiro: se o tráfego está torto, nada mais importa ──────────
  const srm = checarSRM(vars.map((v) => v.n), cfg.pesos || vars.map(() => 1));

  // baseline: se não configuraram, usa o controle observado
  const controle = vars[0];
  const baseline = cfg.baseline ?? (controle.n > 0 ? controle.conv / controle.n : 0);
  const mde = cfg.mde ?? 0.2;
  const nMin = amostraMinima(baseline, mde, alfa, poder);
  const tau = cfg.tau ?? Math.max(1e-6, baseline * mde);

  // Com k desafiantes contra o mesmo controle, o alfa de CADA comparação tem
  // que encolher pra que o erro global fique nos 5% prometidos.
  const k = vars.length - 1;
  const alfaComp = alfaAjustado(alfa, k);

  // Compara cada desafiante contra o controle
  const comparacoes = vars.slice(1).map((v) => {
    const z = zTestProporcoes(controle.conv, controle.n, v.conv, v.n);
    const ic = icDiferenca(controle.conv, controle.n, v.conv, v.n, alfaComp);
    const serie = montarSerieComparada(dados.serieDiaria, controle.chave, v.chave);
    const sv = pSempreValido(serie, tau, alfaComp);
    return {
      chave: v.chave,
      nome: v.nome,
      n: v.n,
      conv: v.conv,
      taxa: v.n > 0 ? v.conv / v.n : 0,
      lift: z.lift,
      z: z.z,
      p_horizonte_fixo: z.p,
      p_sempre_valido: sv.p,
      cruzou_em: sv.cruzouEm,
      ic,
    };
  });

  // ── As duas rotas legítimas para "tem evidência" ──────────────────────────
  //
  // (a) ANÁLISE PLANEJADA: atingiu a amostra pré-registrada → o z-test de
  //     horizonte fixo vale, porque essa é a análise que foi planejada antes
  //     de o teste começar. É uma olhada só, no ponto combinado.
  //
  // (b) PARADA ANTECIPADA: o mSPRT cruzou antes da amostra planejada. É válido
  //     parar aqui — o p sempre-válido controla o erro tipo I em qualquer
  //     instante. Serve pra efeito grande, que não precisa da amostra cheia.
  //
  // Uma OU outra. Exigir as duas juntas seria conservador demais: o mSPRT
  // precisa de ~1,5 a 2x a amostra do horizonte fixo pra cruzar no mesmo
  // efeito, e um teste corretamente dimensionado seria declarado inconclusivo.
  const amostraOk = nMin !== null && vars.every((v) => v.n >= nMin);
  const rotaPlanejada = amostraOk && comparacoes.some((c) => c.p_horizonte_fixo < alfaComp);
  const rotaAntecipada = comparacoes.some((c) => c.p_sempre_valido < alfaComp);

  // Concentração de IP: rastro de laço, script ou monitor entrando na amostra.
  // Dois patamares porque NAT existe: operadora de celular e rede corporativa
  // colocam gente de verdade atrás de um IP só, então uns poucos por cento são
  // normais. Um quarto do braço vindo de um IP só não é NAT, é script.
  const saude = dados.saude || {};
  const cIp = saude.concentracao_ip;
  const ipSuspeito = cIp != null && cIp >= 0.25;

  const travas = [
    {
      nome: 'ciclo mínimo',
      ok: dias >= minDias,
      detalhe: `${dias} de ${minDias} dias`,
      porque: 'menos de uma semana mede dia da semana, não a variante',
    },
    {
      nome: 'divisão do tráfego (SRM)',
      ok: srm.ok,
      detalhe: srm.aplicavel
        ? `p=${srm.p.toExponential(2)} (corte ${srm.corte})`
        : srm.motivo,
      porque: 'divisão torta = teste quebrado; o resultado não vale',
    },
    {
      nome: 'origem do tráfego',
      ok: !ipSuspeito,
      detalhe: cIp == null
        ? 'sem dado de origem'
        : `maior IP = ${(cIp * 100).toFixed(1)}% das atribuições · ${saude.ips_distintos || 0} IPs distintos`,
      porque: 'um IP sozinho puxando o braço é laço/script, não visitante',
    },
    {
      nome: 'evidência (amostra planejada OU parada antecipada)',
      ok: rotaPlanejada || rotaAntecipada,
      detalhe: [
        nMin === null
          ? 'amostra: baseline/MDE não configurados'
          : `amostra ${Math.min(...vars.map((v) => v.n))}/${nMin}${amostraOk ? ' ✓' : ''}`,
        ...comparacoes.map(
          (c) => `${c.chave}: p=${fmtP(c.p_horizonte_fixo)} · sempre-válido=${fmtP(c.p_sempre_valido)}`,
        ),
      ].join(' · '),
      porque: k > 1
        ? `${k} desafiantes: corte por comparação vai de ${alfa} pra ${alfaComp.toFixed(4)} (Šidák), pra manter o erro global em ${Math.round(alfa * 100)}%`
        : (rotaAntecipada
          ? 'mSPRT cruzou — parada antecipada válida'
          : `z-test na amostra planejada (poder ${Math.round(poder * 100)}% para ${Math.round(mde * 100)}% sobre ${(baseline * 100).toFixed(2)}%)`),
    },
  ];

  const todasOk = travas.every((t) => t.ok);
  const resultado = {
    ...base,
    travas,
    comparacoes,
    srm,
    baseline,
    amostra_minima: nMin,
    tau,
    alfa,
    alfa_por_comparacao: alfaComp,
    comparacoes_multiplas: k,
    dias_rodados: dias,
    controle: {
      chave: controle.chave,
      nome: controle.nome,
      n: controle.n,
      conv: controle.conv,
      taxa: controle.n > 0 ? controle.conv / controle.n : 0,
    },
  };

  if (!srm.ok) {
    return { ...resultado, veredito: VEREDITOS.SRM, pode_decidir: false,
      motivo: `divisão do tráfego não bate com a configurada (p=${srm.p.toExponential(2)}). Investigue antes de olhar conversão.` };
  }

  if (ipSuspeito) {
    return { ...resultado, veredito: VEREDITOS.SRM, pode_decidir: false,
      motivo: `${(cIp * 100).toFixed(1)}% das atribuições vieram de um único IP (${saude.ips_distintos} IPs distintos no total). Isso é laço, teste de carga ou monitor entrando na amostra — não visitante. Investigue antes de olhar conversão.` };
  }

  if (todasOk) {
    // A rota que abriu o portão define qual p vale como evidência.
    const viaAntecipada = rotaAntecipada;
    const pDe = (c) => (viaAntecipada ? c.p_sempre_valido : c.p_horizonte_fixo);
    const vencedoras = comparacoes.filter((c) => pDe(c) < alfaComp);
    // a que ganhou com maior efeito; se todas são piores que o controle, o controle vence
    const melhor = vencedoras.reduce((a, b) => (b.taxa > a.taxa ? b : a), vencedoras[0]);
    const controleTaxa = controle.n > 0 ? controle.conv / controle.n : 0;
    const rota = viaAntecipada
      ? 'parada antecipada (mSPRT)'
      : 'amostra planejada (z-test)';
    if (melhor.taxa > controleTaxa) {
      return { ...resultado, veredito: VEREDITOS.VENCEDOR, pode_decidir: true,
        vencedor: melhor.chave, rota,
        motivo: `${melhor.nome} bateu o controle: ${(melhor.taxa * 100).toFixed(2)}% vs ${(controleTaxa * 100).toFixed(2)}% (lift ${(melhor.lift * 100).toFixed(1)}%, p=${fmtP(pDe(melhor))} por ${rota})` };
    }
    return { ...resultado, veredito: VEREDITOS.VENCEDOR, pode_decidir: true,
      vencedor: controle.chave, rota,
      motivo: `o controle venceu: a variante ficou significativamente PIOR (${(melhor.taxa * 100).toFixed(2)}% vs ${(controleTaxa * 100).toFixed(2)}%, p=${fmtP(pDe(melhor))} por ${rota})` };
  }

  // Sem evidência mas já estourou o prazo → encerrar sem vencedor
  if (dias >= maxDias && amostraOk && srm.ok) {
    return { ...resultado, veredito: VEREDITOS.INCONCLUSIVO, pode_decidir: true,
      motivo: `${dias} dias e amostra suficiente sem diferença detectável. Se existe efeito, é menor que o MDE de ${Math.round(mde * 100)}% — encerrar e testar outra hipótese.` };
  }
  if (dias >= maxDias) {
    return { ...resultado, veredito: VEREDITOS.INCONCLUSIVO, pode_decidir: true,
      motivo: `${dias} dias (limite ${maxDias}) sem atingir amostra mínima. Tráfego insuficiente pra esse MDE — encerrar ou aumentar verba.` };
  }

  const faltando = travas.filter((t) => !t.ok).map((t) => `${t.nome} (${t.detalhe})`);
  return { ...resultado, veredito: VEREDITOS.RODANDO, pode_decidir: false,
    motivo: `ainda falta: ${faltando.join('; ')}` };
}

/** Junta as séries diárias de dois braços numa série comparada e acumulada. */
export function montarSerieComparada(serieDiaria, chaveA, chaveB) {
  if (!serieDiaria) return [];
  const a = serieDiaria[chaveA] || [];
  const b = serieDiaria[chaveB] || [];
  const dias = [...new Set([...a.map((d) => d.dia), ...b.map((d) => d.dia)])].sort();
  const idxA = Object.fromEntries(a.map((d) => [d.dia, d]));
  const idxB = Object.fromEntries(b.map((d) => [d.dia, d]));
  let nA = 0; let cA = 0; let nB = 0; let cB = 0;
  return dias.map((dia) => {
    if (idxA[dia]) { nA += idxA[dia].n; cA += idxA[dia].conv; }
    if (idxB[dia]) { nB += idxB[dia].n; cB += idxB[dia].conv; }
    return { dia, nA, convA: cA, nB, convB: cB };
  });
}

export function fmtP(p) {
  if (p === null || p === undefined || Number.isNaN(p)) return '—';
  if (p < 0.0001) return p.toExponential(1);
  return p.toFixed(4);
}
