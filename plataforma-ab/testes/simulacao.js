/**
 * Simulação ponta a ponta: anúncio → roteador → LP → formulário → análise → Slack.
 *
 * Não é mock: sobe o servidor de verdade e faz requisição HTTP de verdade
 * contra os mesmos handlers que vão pra Vercel. O que muda em relação ao mundo
 * real é só quem clica (aqui é um laço) e o relógio (os dias são espalhados
 * depois, editando o arquivo de eventos — senão dava pra esperar 10 dias).
 *
 *   node testes/simulacao.js
 *   node testes/simulacao.js --visitantes 3000
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.dirname(AQUI);
const DIR = path.join(RAIZ, 'dados-simulacao');
const PORTA = 3199;
const BASE = `http://localhost:${PORTA}`;
const TOKEN = 'sim-token';

const arg = (n, p) => { const i = process.argv.indexOf('--' + n); return i >= 0 ? process.argv[i + 1] : p; };
const VISITANTES = Number(arg('visitantes', 2000));

const UA_HUMANO = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const UA_MOBILE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

// Verdade do universo simulado: B converte mais que A. A plataforma não sabe
// disso — o teste é ela descobrir, e só depois das travas.
const TAXA = { A: 0.10, B: 0.15 };

const t = (s) => console.log(s);
const bloco = (s) => { console.log('\n' + '─'.repeat(78)); console.log(s); console.log('─'.repeat(78)); };

// O resumo do fim é montado a partir DESTA lista, não de texto fixo. Um resumo
// que imprime "OK" sem olhar o resultado é pior que não ter resumo — foi assim
// que a primeira versão deste arquivo escondeu um bug de verdade no passo 9.
const checagens = [];
function checar(nome, ok, detalhe) {
  checagens.push({ nome, ok: !!ok, detalhe: detalhe || '' });
  return !!ok;
}

let servidor;
async function subirServidor() {
  if (fs.existsSync(DIR)) fs.rmSync(DIR, { recursive: true, force: true });
  fs.mkdirSync(DIR, { recursive: true });

  servidor = spawn(process.execPath, [path.join(AQUI, 'dev-server.js'), '--porta', String(PORTA)], {
    env: {
      ...process.env,
      AB_DIR: DIR,
      AB_STORE: 'arquivo',
      AB_ADMIN_TOKEN: TOKEN,
      AB_CRON_SECRET: 'sim-cron',
      AB_PERMITIR_HTTP: '1',
      AB_DOMINIOS_PERMITIDOS: 'cardapioweb.com,localhost,127.0.0.1',
      AB_SLACK_WEBHOOK: '', // sem webhook: a mensagem é montada e mostrada aqui
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  servidor.stderr.on('data', (d) => process.stderr.write('[srv] ' + d));

  for (let i = 0; i < 100; i++) {
    try {
      const r = await fetch(BASE + '/api/testes', { headers: { 'X-AB-Token': TOKEN } });
      if (r.status < 500) return;
    } catch { /* ainda subindo */ }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error('servidor não subiu');
}

const api = async (caminho, opts = {}) => {
  const r = await fetch(BASE + caminho, {
    method: opts.method || 'GET',
    headers: { 'X-AB-Token': TOKEN, ...(opts.body ? { 'Content-Type': 'application/json' } : {}), ...(opts.headers || {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const txt = await r.text();
  let corpo = null;
  try { corpo = txt ? JSON.parse(txt) : null; } catch { corpo = txt; }
  return { status: r.status, corpo };
};

/**
 * IP de mentira, um por visitante.
 *
 * Não é enfeite: visitante de verdade vem de IP de verdade, e a plataforma tem
 * duas defesas que dependem disso — a trava de concentração de IP na análise e
 * o freio por IP em `/api/ev`. Simulando 2000 pessoas de `127.0.0.1`, as duas
 * disparam corretamente e a simulação é que estaria mentindo.
 */
function ipFalso(i) {
  // Faixa privada 10.0.0.0/8: inequivocamente falso, e com espaço de sobra pra
  // não colidir. (A primeira versão gerava 5 octetos e truncava, o que dava só
  // 254 IPs distintos para 2000 visitantes.)
  return `10.${Math.floor(i / 65024) % 254}.${Math.floor(i / 254) % 256}.${(i % 254) + 1}`;
}

/** Um visitante: bate no roteador, lê a variante do redirect, às vezes converte. */
async function visitar(slug, { ua = UA_HUMANO, cookie = null, utm = 'meta', ip = null } = {}) {
  const r = await fetch(`${BASE}/t/${slug}?utm_source=${utm}&utm_campaign=sim`, {
    redirect: 'manual',
    headers: {
      'User-Agent': ua,
      ...(ip ? { 'X-Forwarded-For': ip } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
    },
  });
  const local = r.headers.get('location');
  const setCookie = r.headers.get('set-cookie');
  if (!local) return { status: r.status, variante: null };

  const u = new URL(local);
  const cwab = u.searchParams.get('cwab');
  const vid = u.searchParams.get('cwvid');
  const variante = cwab ? cwab.split(':')[1] : null;
  return {
    status: r.status,
    variante,
    vid,
    destino: local,
    cookie: setCookie ? setCookie.split(';')[0] : cookie,
    contabilizado: r.headers.get('x-ab-contabilizado') !== 'nao',
    utmPreservado: u.searchParams.get('utm_source'),
  };
}

async function evento(slug, variante, vid, tipo, ip = null) {
  return api('/api/ev', {
    method: 'POST',
    body: { teste: slug, variante, visitante: vid, tipo },
    headers: {
      'User-Agent': UA_HUMANO,
      Origin: 'https://lp.cardapioweb.com',
      ...(ip ? { 'X-Forwarded-For': ip } : {}),
    },
  });
}

/** Espalha os eventos por N dias, mexendo direto no arquivo. */
function espalharPorDias(dias) {
  const f = path.join(DIR, 'eventos.jsonl');
  const linhas = fs.readFileSync(f, 'utf8').split('\n').filter((l) => l.trim()).map(JSON.parse);
  const hoje = new Date();
  const saida = linhas.map((e, i) => {
    const d = new Date(hoje);
    d.setDate(d.getDate() - (dias - 1) + Math.floor((i / linhas.length) * dias));
    const iso = d.toISOString().slice(0, 10);
    return { ...e, dia: iso, criado_em: iso + 'T14:00:00.000Z' };
  });
  fs.writeFileSync(f, saida.map((e) => JSON.stringify(e)).join('\n') + '\n', 'utf8');
  return saida.length;
}

// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  await subirServidor();

  bloco('1. CRIAR O TESTE');
  const teste = {
    slug: 'demo-hero-lp',
    nome: 'Hero da LP: painel vs. cardápio digital',
    hipotese: 'Se o hero mostrar o cardápio digital em vez do painel de gestão, a conversão sobe.',
    jira: 'GWT-3256',
    status: 'rodando',
    baseline: 0.10,
    mde: 0.5,
    min_dias: 7,
    max_dias: 30,
    variantes: [
      { chave: 'A', nome: 'controle (painel)', url: `http://localhost:${PORTA}/lp/controle`, peso: 0.5 },
      { chave: 'B', nome: 'cardápio digital', url: `http://localhost:${PORTA}/lp/variante-b`, peso: 0.5 },
    ],
  };
  const criado = await api('/api/testes', { method: 'POST', body: teste });
  t(`   POST /api/testes → ${criado.status}`);
  if (criado.status >= 300) { console.error(criado.corpo); process.exit(1); }
  t(`   slug: ${criado.corpo.slug} · status: ${criado.corpo.status} · seed: ${criado.corpo.seed}`);
  t(`   URL do anúncio: ${BASE}/t/${teste.slug}`);

  bloco('2. CONFERÊNCIA MANUAL DO ROTEAMENTO (?cwforce=)');
  const destinos = {};
  for (const v of ['A', 'B']) {
    const forcado = await fetch(`${BASE}/t/${teste.slug}?cwforce=${v}`, { redirect: 'manual', headers: { 'User-Agent': UA_HUMANO } });
    destinos[v] = { status: forcado.status, local: forcado.headers.get('location'), contado: forcado.headers.get('x-ab-contabilizado') !== 'nao' };
    t(`   cwforce=${v} → ${forcado.status} → ${destinos[v].local}`);
    t(`      contabilizado: ${destinos[v].contado ? 'sim (ERRADO)' : 'NÃO (correto — conferência manual não entra na amostra)'}`);
  }
  checar('Roteamento 302 serve variantes diferentes',
    destinos.A.status === 302 && destinos.B.status === 302 &&
    destinos.A.local !== destinos.B.local &&
    String(destinos.A.local).includes('/lp/controle') && String(destinos.B.local).includes('/lp/variante-b'));
  checar('Conferência manual (cwforce) não entra na amostra',
    !destinos.A.contado && !destinos.B.contado);

  bloco('3. GRUDE (sticky): o mesmo visitante cai sempre na mesma variante');
  const primeiro = await visitar(teste.slug);
  const vistas = [primeiro.variante];
  for (let i = 0; i < 5; i++) {
    const r = await visitar(teste.slug, { cookie: primeiro.cookie });
    vistas.push(r.variante);
  }
  t(`   6 visitas do mesmo cookie: ${vistas.join(' ')}`);
  const grudou = new Set(vistas).size === 1 && vistas[0] != null;
  t(`   ${grudou ? 'OK — grudou' : 'FALHA — variou'}`);
  checar('Grude: mesmo visitante cai sempre na mesma variante', grudou, vistas.join(' '));
  checar('UTM preservado no redirect', primeiro.utmPreservado === 'meta', String(primeiro.utmPreservado));

  bloco('4. BOT E PRÉ-CARREGAMENTO SÃO EXCLUÍDOS');
  let botsOk = true;
  for (const [nome, ua] of [['Googlebot', 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'],
    ['AdsBot-Google', 'AdsBot-Google (+http://www.google.com/adsbot.html)'],
    ['facebookexternalhit', 'facebookexternalhit/1.1']]) {
    const r = await fetch(`${BASE}/t/${teste.slug}`, { redirect: 'manual', headers: { 'User-Agent': ua } });
    const contado = r.headers.get('x-ab-contabilizado') !== 'nao';
    const proControle = String(r.headers.get('location')).includes('/lp/controle');
    if (contado || !proControle) botsOk = false;
    t(`   ${nome.padEnd(22)} → ${r.status} · contabilizado: ${contado ? 'SIM (ERRADO!)' : 'NÃO'} · vai pro controle: ${proControle ? 'sim' : 'não'}`);
  }
  const pf = await fetch(`${BASE}/t/${teste.slug}`, { redirect: 'manual', headers: { 'User-Agent': UA_HUMANO, 'Sec-Purpose': 'prefetch;prerender' } });
  const pfContado = pf.headers.get('x-ab-contabilizado') !== 'nao';
  t(`   prefetch do navegador  → ${pf.status} · contabilizado: ${pfContado ? 'SIM (ERRADO!)' : 'NÃO'}`);
  checar('Bot vai pro controle e não é contabilizado', botsOk);
  checar('Prefetch do navegador não é contabilizado', !pfContado);

  bloco(`5. TRÁFEGO: ${VISITANTES} visitantes do anúncio`);
  t(`   taxa real do universo simulado: A=${(TAXA.A * 100).toFixed(0)}%  B=${(TAXA.B * 100).toFixed(0)}%`);
  const inicio = Date.now();
  const contagem = { A: 0, B: 0 };
  const conv = { A: 0, B: 0 };
  const LOTE = 50;
  for (let i = 0; i < VISITANTES; i += LOTE) {
    const lote = [];
    for (let j = 0; j < LOTE && i + j < VISITANTES; j++) {
      const ip = ipFalso(i + j);
      lote.push((async () => {
        const r = await visitar(teste.slug, { ua: (i + j) % 3 === 0 ? UA_MOBILE : UA_HUMANO, ip });
        if (!r.variante) return;
        contagem[r.variante]++;
        await evento(teste.slug, r.variante, r.vid, 'view', ip);
        if (Math.random() < TAXA[r.variante]) {
          conv[r.variante]++;
          await evento(teste.slug, r.variante, r.vid, 'conversion', ip);
        }
      })());
    }
    await Promise.all(lote);
    if ((i / LOTE) % 8 === 0) process.stdout.write(`\r   ${Math.min(i + LOTE, VISITANTES)}/${VISITANTES}…   `);
  }
  t(`\r   ${VISITANTES} visitantes em ${((Date.now() - inicio) / 1000).toFixed(1)}s`);
  t(`   divisão observada: A=${contagem.A} B=${contagem.B}`);
  t(`   conversões geradas: A=${conv.A} B=${conv.B}`);

  bloco('6. TRAVA DE CICLO MÍNIMO (tudo aconteceu "hoje")');
  let a = (await api(`/api/resultados?s=${teste.slug}`)).corpo;
  t(`   veredito: ${a.veredito}`);
  t(`   pode decidir: ${a.pode_decidir}`);
  t(`   motivo: ${a.motivo}`);
  t('');
  for (const tr of a.travas) t(`   ${tr.ok ? '[x]' : '[ ]'} ${tr.nome} — ${tr.detalhe}`);
  const segurou = !a.pode_decidir && a.veredito === 'rodando';
  checar('Trava de ciclo mínimo segura vencedor de 1 dia', segurou, a.motivo);
  t(`\n   ${segurou ? 'OK — segurou. É exatamente o falso positivo que a atividade pede pra evitar.'
      : 'FALHA — declarou vencedor com 1 dia de teste.'}`);

  bloco('7. MESMOS DADOS, ESPALHADOS POR 10 DIAS');
  const n = espalharPorDias(10);
  t(`   ${n} eventos redistribuídos em 10 dias`);
  a = (await api(`/api/resultados?s=${teste.slug}`)).corpo;
  t('');
  t(`   veredito: ${a.veredito.toUpperCase()}`);
  t(`   vencedor: ${a.vencedor || '—'}   (rota: ${a.rota || '—'})`);
  t(`   motivo: ${a.motivo}`);
  t('');
  t('   variante                 atrib.   conv.     taxa      lift    p(planej.)  p(sempre-válido)');
  for (const v of a.variantes) {
    const c = (a.comparacoes || []).find((x) => x.chave === v.chave);
    const taxa = v.n ? (v.conv / v.n * 100).toFixed(2) + '%' : '—';
    t(`   ${(v.chave + ' ' + v.nome).padEnd(24)} ${String(v.n).padStart(6)} ${String(v.conv).padStart(7)} ${taxa.padStart(8)} ` +
      `${(c && c.lift != null ? (c.lift > 0 ? '+' : '') + (c.lift * 100).toFixed(1) + '%' : '—').padStart(9)} ` +
      `${(c ? fmtP(c.p_horizonte_fixo) : '—').padStart(11)} ${(c ? fmtP(c.p_sempre_valido) : '—').padStart(17)}`);
  }
  t('');
  for (const tr of a.travas) t(`   ${tr.ok ? '[x]' : '[ ]'} ${tr.nome} — ${tr.detalhe}`);
  t('');
  t(`   SRM: p=${a.srm.p.toExponential(2)} (${a.srm.ok ? 'divisão sadia' : 'DIVISÃO TORTA'})`);
  t(`   amostra alvo: ${a.amostra_minima} por braço · dias: ${a.dias_rodados}`);
  t(`   saúde: ${a.saude.views} views · ${a.saude.conversoes_orfas} conversões órfãs · ${a.saude.bots_ignorados} bots`);
  checar('Veredito de vencedor com amostra e prazo atendidos',
    a.veredito === 'vencedor' && a.pode_decidir, a.motivo);
  checar('Achou o vencedor certo (B, que é o melhor no universo simulado)',
    a.vencedor === 'B', 'vencedor=' + a.vencedor);
  checar('Tracking de view chegou', a.saude.views > 0, a.saude.views + ' views');
  checar('Conversões atribuídas sem órfãs', a.saude.conversoes_orfas === 0);

  bloco('8. JOB DE ANÁLISE + MENSAGEM DO SLACK');
  const job = await api('/api/analisar', { headers: { Authorization: 'Bearer sim-cron' } });
  t(`   GET /api/analisar → ${job.status}`);
  t(`   ${JSON.stringify(job.corpo.testes, null, 2).split('\n').join('\n   ')}`);

  const { montarMensagem } = await import('../lib/slack.js');
  const testeAtual = (await api(`/api/testes?s=${teste.slug}`)).corpo;
  const msg = montarMensagem(testeAtual, a, BASE + '/');
  t('\n   ── mensagem que vai pro Slack ──────────────────────────────────');
  for (const l of msg.attachments[0].text.split('\n')) t('   │ ' + l);
  t('   ────────────────────────────────────────────────────────────────');
  t(`   cor da barra: ${msg.attachments[0].color} (amarelo Selective Yellow da CW)`);

  bloco('9. SEGUNDA EXECUÇÃO DO JOB — NÃO PODE AVISAR DE NOVO');
  const job2 = await api('/api/analisar', { headers: { Authorization: 'Bearer sim-cron' } });
  const r2 = job2.corpo.testes[0];
  t(`   mudou: ${r2.mudou} · slack.enviado: ${r2.slack.enviado} · motivo: ${r2.slack.motivo}`);
  t(`   ${r2.mudou === false ? 'OK — sem repetição. Aviso diário treinaria o time a ignorar o canal.' : 'FALHA — avisou de novo'}`);
  checar('Job não re-notifica quando o veredito não mudou', r2.mudou === false,
    'anterior=' + r2.anterior);

  bloco('10. SRM: SIMULANDO UM REDIRECT QUEBRADO NA VARIANTE B');
  const f = path.join(DIR, 'eventos.jsonl');
  const linhas = fs.readFileSync(f, 'utf8').split('\n').filter((l) => l.trim()).map(JSON.parse);
  // Some com 25% das atribuições de B — é o que acontece quando uma variante
  // tem redirect falhando, cache errado ou a página cai de vez em quando.
  let sumiu = 0;
  const filtradas = linhas.filter((e) => {
    if (e.tipo === 'assignment' && e.variante === 'B' && Math.random() < 0.25) { sumiu++; return false; }
    return true;
  });
  fs.writeFileSync(f, filtradas.map((e) => JSON.stringify(e)).join('\n') + '\n', 'utf8');
  t(`   ${sumiu} atribuições de B removidas (simulando perda no redirect)`);
  const aSrm = (await api(`/api/resultados?s=${teste.slug}`)).corpo;
  t(`   veredito: ${aSrm.veredito}`);
  t(`   SRM p=${aSrm.srm.p.toExponential(2)} · pode decidir: ${aSrm.pode_decidir}`);
  t(`   motivo: ${aSrm.motivo}`);
  const trancou = aSrm.veredito.startsWith('SRM') && !aSrm.pode_decidir;
  t(`   ${trancou
      ? 'OK — trancou. Sem isso a plataforma declararia B vencedora com um número inflado.'
      : 'FALHA — não detectou o SRM'}`);
  checar('SRM tranca o veredito quando o tráfego some de um braço', trancou, aSrm.motivo);

  bloco('RESUMO');
  for (const c of checagens) {
    t(`   ${c.ok ? '[x]' : '[!]'} ${c.nome.padEnd(58, '.')} ${c.ok ? 'OK' : 'FALHOU'}`);
    if (!c.ok && c.detalhe) t(`       └ ${c.detalhe}`);
  }
  const falhas = checagens.filter((c) => !c.ok);
  t('');
  t(`   ${checagens.length - falhas.length}/${checagens.length} checagens passaram.`);
  t(`   dados da simulação em: ${DIR}`);

  servidor.kill();
  process.exit(falhas.length ? 1 : 0);
}

function fmtP(p) {
  if (p == null || Number.isNaN(p)) return '—';
  return p < 0.0001 ? p.toExponential(1) : Number(p).toFixed(4);
}

main().catch((e) => { console.error(e); if (servidor) servidor.kill(); process.exit(1); });
