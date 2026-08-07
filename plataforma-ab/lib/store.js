/**
 * Camada de dados. Dois drivers, mesma interface:
 *
 *   arquivo   — JSON + JSONL em disco. É o modo local: roda sem nuvem nenhuma,
 *               e é o que o kit de teste usa.
 *   supabase  — PostgREST via fetch, sem dependência. É o modo de produção.
 *
 * O driver sai de AB_STORE (padrão: arquivo).
 *
 * ── Duas decisões de integridade que moram AQUI, não na tela ───────────────
 *
 * 1. O DENOMINADOR É A ATRIBUIÇÃO, NUNCA O PAGEVIEW.
 *    A atribuição é gravada no servidor, antes do redirect. O pageview depende
 *    de JS carregar na LP — e se uma variante carrega mais devagar, ou tem mais
 *    bloqueador de script, o pageview vem enviesado A FAVOR da variante rápida.
 *    Isso é viés silencioso: a conta fecha, o número está errado. Atribuição é
 *    simétrica por construção.
 *
 * 2. CONVERSÃO É CONTADA CONTRA A VARIANTE ATRIBUÍDA, NÃO CONTRA A DECLARADA.
 *    O evento de conversão chega do navegador e diz "sou da variante B". Não dá
 *    pra confiar: dá pra editar a URL, o cookie pode ter sido copiado de outra
 *    aba, um visitante pode ter visto as duas páginas. A agregação ignora o que
 *    o evento declara e usa a atribuição gravada no servidor. Conversão de
 *    visitante que nunca foi atribuído é descartada.
 */

import fs from 'node:fs';
import path from 'node:path';
import { dia as diaBrasilia, diasEntre } from './tempo.js';

// ─────────────────────────────────────────────────────────────────────────────
// Driver: arquivo
// ─────────────────────────────────────────────────────────────────────────────

function driverArquivo(dir) {
  const dirDados = dir || process.env.AB_DIR ||
    path.join(process.cwd(), 'dados');
  const fTestes = path.join(dirDados, 'testes.json');
  const fEventos = path.join(dirDados, 'eventos.jsonl');

  function garantirDir() {
    if (!fs.existsSync(dirDados)) fs.mkdirSync(dirDados, { recursive: true });
  }

  function lerTestes() {
    garantirDir();
    if (!fs.existsSync(fTestes)) return [];
    try {
      return JSON.parse(fs.readFileSync(fTestes, 'utf8')) || [];
    } catch {
      return [];
    }
  }

  /** Escrita atômica: grava no .tmp e renomeia. Sem meio-arquivo se cair. */
  function gravarTestes(lista) {
    garantirDir();
    const tmp = fTestes + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(lista, null, 2), 'utf8');
    fs.renameSync(tmp, fTestes);
  }

  function lerEventos() {
    garantirDir();
    if (!fs.existsSync(fEventos)) return [];
    return fs
      .readFileSync(fEventos, 'utf8')
      .split('\n')
      .filter((l) => l.trim())
      .map((l) => {
        try {
          return JSON.parse(l);
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  }

  // Índice de deduplicação em memória, montado uma vez.
  let chaves = null;
  function indice() {
    if (chaves === null) {
      chaves = new Set(lerEventos().map((e) => `${e.teste}|${e.visitante}|${e.tipo}`));
    }
    return chaves;
  }

  return {
    modo: 'arquivo',
    dirDados,

    async listarTestes() {
      return lerTestes();
    },

    async obterTeste(slug) {
      return lerTestes().find((t) => t.slug === slug) || null;
    },

    async salvarTeste(teste) {
      const lista = lerTestes();
      const i = lista.findIndex((t) => t.slug === teste.slug);
      if (i >= 0) lista[i] = { ...lista[i], ...teste };
      else lista.push(teste);
      gravarTestes(lista);
      return teste;
    },

    async removerTeste(slug) {
      gravarTestes(lerTestes().filter((t) => t.slug !== slug));
    },

    async atualizarVeredito(slug, campos) {
      const lista = lerTestes();
      const i = lista.findIndex((t) => t.slug === slug);
      if (i < 0) return null;
      lista[i] = { ...lista[i], ...campos, atualizado_em: new Date().toISOString() };
      gravarTestes(lista);
      return lista[i];
    },

    /** Idempotente por (teste, visitante, tipo). Devolve {novo}. */
    async registrarEvento(ev) {
      garantirDir();
      const chave = `${ev.teste}|${ev.visitante}|${ev.tipo}`;
      if (indice().has(chave)) return { novo: false };
      indice().add(chave);
      fs.appendFileSync(fEventos, JSON.stringify(ev) + '\n', 'utf8');
      return { novo: true };
    },

    async eventosDoTeste(slug) {
      return lerEventos().filter((e) => e.teste === slug);
    },

    async limpar() {
      chaves = null;
      if (fs.existsSync(fEventos)) fs.unlinkSync(fEventos);
      if (fs.existsSync(fTestes)) fs.unlinkSync(fTestes);
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Driver: supabase (PostgREST)
// ─────────────────────────────────────────────────────────────────────────────

function driverSupabase(url, chave) {
  const base = String(url).replace(/\/$/, '') + '/rest/v1';
  const h = {
    apikey: chave,
    Authorization: `Bearer ${chave}`,
    'Content-Type': 'application/json',
  };

  async function req(caminho, opts = {}) {
    const r = await fetch(base + caminho, { ...opts, headers: { ...h, ...(opts.headers || {}) } });
    const txt = await r.text();
    if (!r.ok) throw new Error(`supabase ${r.status}: ${txt.slice(0, 300)}`);
    return txt.trim() ? JSON.parse(txt) : null;
  }

  return {
    modo: 'supabase',

    // `variantes.order=ordem.asc` NÃO é enfeite: sem ele o PostgREST devolve as
    // variantes na ordem que o Postgres quiser, e o painel regrava `ordem` pelo
    // índice da linha que recebeu. Duas leituras seguidas podem inverter A e B
    // sozinhas — que é o pior estrago possível (ver `lib/config.js`, bloco ORDEM).
    async listarTestes() {
      return (await req(
        '/ab_testes?select=*,variantes:ab_variantes(*)&variantes.order=ordem.asc&order=criado_em.desc',
      )) || [];
    },

    async obterTeste(slug) {
      const r = await req(
        `/ab_testes?slug=eq.${encodeURIComponent(slug)}&select=*,variantes:ab_variantes(*)&variantes.order=ordem.asc&limit=1`,
      );
      return r && r[0] ? r[0] : null;
    },

    async salvarTeste(teste) {
      const { variantes, ...cab } = teste;
      await req('/ab_testes?on_conflict=slug', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify(cab),
      });
      if (variantes && variantes.length) {
        // ORDEM DAS OPERAÇÕES IMPORTA: upsert primeiro, remoção depois.
        //
        // A versão anterior fazia DELETE e depois INSERT, em duas chamadas HTTP
        // sem transação. Entre elas o teste existia com ZERO variantes — e se o
        // INSERT falhasse (rede, 503, rate limit), ficava assim até alguém
        // salvar de novo, com o anúncio ativo mandando tráfego pago pro
        // fallback ou pra um 404. Um "corrigir o nome do teste" podia derrubar
        // a campanha.
        //
        // Assim nunca existe instante sem variante: o upsert atualiza as que
        // ficam, e só depois some quem realmente saiu.
        await req('/ab_variantes?on_conflict=teste_slug,chave', {
          method: 'POST',
          headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
          body: JSON.stringify(variantes.map((v) => ({ ...v, teste_slug: teste.slug }))),
        });
        const chaves = variantes.map((v) => v.chave);
        await req(
          `/ab_variantes?teste_slug=eq.${encodeURIComponent(teste.slug)}` +
          `&chave=not.in.(${chaves.map(encodeURIComponent).join(',')})`,
          { method: 'DELETE', headers: { Prefer: 'return=minimal' } },
        );
      }
      return teste;
    },

    async removerTeste(slug) {
      await req(`/ab_testes?slug=eq.${encodeURIComponent(slug)}`, { method: 'DELETE' });
    },

    /**
     * PATCH só nas colunas do cabeçalho — NÃO encosta nas variantes.
     *
     * Existe porque o job diário só precisa gravar veredito e vencedor. Se ele
     * usasse `salvarTeste`, o DELETE+INSERT de variantes rodaria todo dia em
     * teste que está no ar; uma falha entre o DELETE e o INSERT deixaria o teste
     * SEM variantes, e aí o roteador não tem pra onde mandar o tráfego do
     * anúncio. Um job de leitura não pode ter esse poder de estrago.
     */
    async atualizarVeredito(slug, campos) {
      const r = await req(`/ab_testes?slug=eq.${encodeURIComponent(slug)}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ ...campos, atualizado_em: new Date().toISOString() }),
      });
      return Array.isArray(r) ? r[0] : r;
    },

    /**
     * Dedupe no BANCO, não aqui: a tabela tem UNIQUE(teste,visitante,tipo) e o
     * Prefer ignore-duplicates faz o insert repetido virar no-op. Em serverless
     * não existe estado entre invocações, então dedupe em memória não funciona.
     */
    async registrarEvento(ev) {
      const r = await req('/ab_eventos?on_conflict=teste,visitante,tipo', {
        method: 'POST',
        headers: { Prefer: 'resolution=ignore-duplicates,return=representation' },
        body: JSON.stringify(ev),
      });
      return { novo: Array.isArray(r) && r.length > 0 };
    },

    async eventosDoTeste(slug) {
      const linhas = [];
      const passo = 1000;
      for (let off = 0; ; off += passo) {
        const p = await req(
          `/ab_eventos?teste=eq.${encodeURIComponent(slug)}&select=*&order=criado_em.asc&offset=${off}&limit=${passo}`,
        );
        if (!p || p.length === 0) break;
        linhas.push(...p);
        if (p.length < passo) break;
      }
      return linhas;
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Fábrica + agregação (comum aos dois drivers)
// ─────────────────────────────────────────────────────────────────────────────

export function criarStore(opts = {}) {
  const modo = opts.modo || process.env.AB_STORE || 'arquivo';
  if (modo === 'supabase') {
    const url = opts.url || process.env.AB_SUPABASE_URL;
    const chave = opts.chave || process.env.AB_SUPABASE_KEY;
    if (!url || !chave) {
      throw new Error('AB_STORE=supabase exige AB_SUPABASE_URL e AB_SUPABASE_KEY');
    }
    return driverSupabase(url, chave);
  }
  return driverArquivo(opts.dir);
}

/**
 * Agrega os eventos de um teste em contagem por variante e série diária.
 *
 * Aplica as duas regras de integridade descritas no topo do arquivo:
 * denominador = atribuição; conversão vai pra variante ATRIBUÍDA.
 */
export function agregar(eventos, { ignorarBots = true } = {}) {
  const evs = ignorarBots ? eventos.filter((e) => !e.bot) : eventos;

  // 1. atribuições: visitante -> variante (a primeira vence)
  const atribuicao = new Map();
  const porVariante = new Map();
  const serie = new Map(); // chave -> Map(dia -> {n, conv})

  const bump = (chave, d, campo) => {
    if (!porVariante.has(chave)) porVariante.set(chave, { n: 0, conv: 0 });
    porVariante.get(chave)[campo] += 1;
    if (!serie.has(chave)) serie.set(chave, new Map());
    const s = serie.get(chave);
    if (!s.has(d)) s.set(d, { n: 0, conv: 0 });
    s.get(d)[campo] += 1;
  };

  const ordenados = [...evs].sort((a, b) => String(a.criado_em).localeCompare(String(b.criado_em)));

  const porIp = new Map(); // ip_hash -> nº de atribuições, pra detectar amostra fabricada
  for (const e of ordenados) {
    if (e.tipo !== 'assignment') continue;
    if (atribuicao.has(e.visitante)) continue; // primeira atribuição manda
    atribuicao.set(e.visitante, { variante: e.variante, criado_em: e.criado_em });
    bump(e.variante, e.dia || diaBrasilia(e.criado_em), 'n');
    if (e.ip_hash) porIp.set(e.ip_hash, (porIp.get(e.ip_hash) || 0) + 1);
  }

  const jaConverteu = new Set();
  const orfas = [];
  let anterioresAAtribuicao = 0;
  for (const e of ordenados) {
    if (e.tipo !== 'conversion') continue;
    const atr = atribuicao.get(e.visitante);
    if (!atr) { orfas.push(e); continue; }  // conversão sem atribuição: descartada

    // Conversão gravada ANTES da atribuição não é conversão deste teste.
    // Caso real: o operador confere a variante com `?cwforce=B` (que de
    // propósito não conta) e preenche o formulário; a conversão fica órfã. No
    // dia em que aquele mesmo navegador clica num anúncio de verdade, a
    // atribuição nasce — e sem esta checagem a conversão de mentira seria
    // adotada retroativamente, porque a varredura é por tipo, não por tempo.
    if (e.criado_em && atr.criado_em &&
        String(e.criado_em) < String(atr.criado_em)) {
      anterioresAAtribuicao++;
      continue;
    }

    if (jaConverteu.has(e.visitante)) continue; // uma conversão por visitante
    jaConverteu.add(e.visitante);
    bump(atr.variante, e.dia || diaBrasilia(e.criado_em), 'conv');
  }

  const views = evs.filter((e) => e.tipo === 'view').length;
  const maiorIp = porIp.size ? Math.max(...porIp.values()) : 0;
  const dias = [...new Set(ordenados.filter((e) => e.tipo === 'assignment').map((e) => e.dia || diaBrasilia(e.criado_em)))].sort();

  return {
    porVariante: Object.fromEntries(porVariante),
    serieDiaria: Object.fromEntries(
      [...serie].map(([k, m]) => [
        k,
        [...m].sort((a, b) => a[0].localeCompare(b[0])).map(([d, v]) => ({ dia: d, ...v })),
      ]),
    ),
    dias,
    primeiroDia: dias[0] || null,
    ultimoDia: dias[dias.length - 1] || null,
    // Para a trava de ciclo mínimo vale o tempo CORRIDO, não o número de dias
    // com tráfego: um teste que rodou seg/ter e voltou no domingo seguinte já
    // atravessou a semana, e um que teve 7 dias úteis seguidos nunca viu um
    // fim de semana. `diasComDado` fica exposto separado pra diagnóstico.
    diasRodados: dias.length ? diasEntre(dias[0], dias[dias.length - 1]) : 0,
    diasComDado: dias.length,
    saude: {
      views,
      conversoes_orfas: orfas.length,
      conversoes_anteriores_a_atribuicao: anterioresAAtribuicao,
      bots_ignorados: eventos.length - evs.length,
      taxa_view_por_atribuicao:
        atribuicao.size > 0 ? views / atribuicao.size : null,
      // Concentração de IP: um único ip_hash respondendo por muita coisa é o
      // rastro de laço/script/monitor entrando na amostra. O `ip_hash` já era
      // gravado em toda linha e nunca era lido por ninguém — agora é.
      ips_distintos: porIp.size,
      concentracao_ip: atribuicao.size > 0 ? maiorIp / atribuicao.size : null,
    },
  };
}
