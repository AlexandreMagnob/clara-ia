/**
 * Roda o `app/ab.js` REAL contra um DOM de mentira.
 *
 * Não é mock do snippet: é o arquivo de produção, carregado e executado. O que
 * é falso é o navegador em volta — o mínimo de DOM que ele toca.
 *
 * Cobre os dois furos que o QA achou no snippet, e que nenhum outro teste pega
 * porque os dois só aparecem com um DOM na frente:
 *
 *   1. A guarda do submit nativo perguntava se havia `[name^="form_fields"]` no
 *      formulário — e o próprio snippet injeta `form_fields[cw_ab]` em todo
 *      formulário logo antes. A guarda casava sempre e a rede de segurança
 *      nunca cobria o caso pra que foi escrita.
 *   2. `submit_success` é um listener de DOCUMENTO. Sem amarrar à página do
 *      teste, qualquer formulário do site (newsletter do rodapé, popup) virava
 *      conversão, por 30 dias.
 *
 *   node testes/snippet-dom.js
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const RAIZ = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const FONTE = fs.readFileSync(path.join(RAIZ, 'app', 'ab.js'), 'utf8');

const checagens = [];
const checar = (nome, ok, detalhe) => checagens.push({ nome, ok: !!ok, detalhe: detalhe || '' });

// ── DOM de mentira ──────────────────────────────────────────────────────────
function criarElemento(tag, attrs = {}) {
  const el = {
    tagName: String(tag).toUpperCase(),
    filhos: [],
    attrs: { ...attrs },
    classList: {
      _c: new Set((attrs.class || '').split(' ').filter(Boolean)),
      contains(c) { return this._c.has(c); },
      add(c) { this._c.add(c); },
    },
    getAttribute(k) { return k in this.attrs ? this.attrs[k] : null; },
    setAttribute(k, v) { this.attrs[k] = String(v); },
    appendChild(f) { this.filhos.push(f); f.pai = this; return f; },
    closest() { return null; },
    querySelector(sel) { return this.querySelectorAll(sel)[0] || null; },
    querySelectorAll(sel) {
      const m = /^\[name\^="(.+)"\]$/.exec(sel);
      const out = [];
      const anda = (n) => {
        for (const f of n.filhos) {
          if (m && String(f.attrs.name || '').startsWith(m[1])) out.push(f);
          else if (!m && sel === 'form' && f.tagName === 'FORM') out.push(f);
          anda(f);
        }
      };
      anda(this);
      return out;
    },
  };
  Object.defineProperty(el, 'name', { get() { return this.attrs.name; }, set(v) { this.attrs.name = v; } });
  Object.defineProperty(el, 'type', { get() { return this.attrs.type; }, set(v) { this.attrs.type = v; } });
  Object.defineProperty(el, 'value', { get() { return this.attrs.value; }, set(v) { this.attrs.value = v; } });
  return el;
}

function montarJanela({ caminho, busca, formularios }) {
  const enviados = [];
  const body = criarElemento('body');
  const forms = formularios.map((f) => {
    const el = criarElemento('form', f.elementor ? { class: 'elementor-form' } : {});
    for (const campo of f.campos || []) el.appendChild(criarElemento('input', { name: campo }));
    body.appendChild(el);
    return el;
  });

  const ouvintes = {};
  const doc = {
    filhos: [body],
    body,
    readyState: 'complete',
    currentScript: { getAttribute: (k) => (k === 'data-ab' ? 'https://ab.exemplo' : null), src: 'https://ab.exemplo/ab.js' },
    documentElement: body,
    createElement: (t) => criarElemento(t),
    getElementsByTagName: () => [doc.currentScript],
    querySelectorAll: (s) => body.querySelectorAll(s),
    querySelector: (s) => body.querySelector(s),
    addEventListener(ev, fn) { (ouvintes[ev] = ouvintes[ev] || []).push(fn); },
    _disparar(ev, alvo) { for (const fn of ouvintes[ev] || []) fn({ target: alvo }); },
  };

  // jQuery só do tanto que o snippet usa: jQuery(document).on('submit_success', fn)
  const jqOuvintes = [];
  const jQuery = () => ({ on: (ev, fn) => { if (ev === 'submit_success') jqOuvintes.push(fn); } });

  const armazem = {};
  const janela = {
    document: doc,
    location: { search: busca, pathname: caminho },
    localStorage: {
      getItem: (k) => (k in armazem ? armazem[k] : null),
      setItem: (k, v) => { armazem[k] = String(v); },
    },
    navigator: {
      sendBeacon: (url, blob) => { enviados.push({ url, corpo: blob._t }); return true; },
    },
    Blob: class { constructor(p) { this._t = p.join(''); } },
    Image: class { set src(v) { enviados.push({ url: v, via: 'pixel' }); } },
    fetch: () => Promise.resolve({}),
    MutationObserver: class { observe() {} },
    URLSearchParams,
    setTimeout, clearTimeout, setInterval, clearInterval,
    console,
    jQuery,
    _enviados: enviados,
    _forms: forms,
    _jq: jqOuvintes,
    _doc: doc,
    _armazem: armazem,
  };
  janela.window = janela;
  return janela;
}

function rodar(cenario) {
  const j = montarJanela(cenario);
  vm.createContext(j);
  vm.runInContext(FONTE, j);
  return j;
}

const CTX_URL = '?cwab=hero:B&cwvid=abcdef0123456789abcdef0123456789';
const conversoes = (j) => j._enviados.filter((e) => String(e.corpo || e.url).includes('conversion'));

// ── 1. FURO ORIGINAL: formulário não-Elementor com jQuery na página ─────────
{
  const j = rodar({
    caminho: '/lp-sql', busca: CTX_URL,
    formularios: [{ elementor: false, campos: ['email'] }],
  });
  j._doc._disparar('submit', j._forms[0]);
  checar('formulário NÃO-Elementor com jQuery: a rede de segurança envia a conversão',
    conversoes(j).length === 1, `enviadas: ${conversoes(j).length}`);
}

// ── 2. formulário Elementor: quem manda é o submit_success, sem duplicar ────
{
  const j = rodar({
    caminho: '/lp-sql', busca: CTX_URL,
    formularios: [{ elementor: true, campos: ['form_fields[email]'] }],
  });
  j._doc._disparar('submit', j._forms[0]);
  checar('formulário Elementor: submit nativo NÃO converte (o submit_success cuida)',
    conversoes(j).length === 0, `enviadas: ${conversoes(j).length}`);
  j._jq.forEach((fn) => fn());
  checar('formulário Elementor: submit_success converte',
    conversoes(j).length === 1, `enviadas: ${conversoes(j).length}`);
  j._jq.forEach((fn) => fn());
  j._doc._disparar('submit', j._forms[0]);
  checar('conversão não duplica com evento repetido',
    conversoes(j).length === 1, `enviadas: ${conversoes(j).length}`);
}

// ── 3. FURO ORIGINAL: conversão em OUTRA página do site ─────────────────────
{
  // Chega na LP (grava o contexto), depois navega pro rodapé do site.
  const j1 = rodar({ caminho: '/lp-sql', busca: CTX_URL, formularios: [] });
  const guardado = j1._armazem.cw_ab_ctx;
  checar('contexto guarda a página do teste',
    guardado && JSON.parse(guardado).p === '/lp-sql', guardado);

  const j2 = montarJanela({ caminho: '/blog/post-qualquer', busca: '', formularios: [{ elementor: true, campos: ['form_fields[email]'] }] });
  j2._armazem.cw_ab_ctx = guardado; // veio do localStorage, como na vida real
  vm.createContext(j2);
  vm.runInContext(FONTE, j2);
  j2._jq.forEach((fn) => fn());
  checar('submit_success em OUTRA página não vira conversão do teste',
    conversoes(j2).length === 0, `enviadas: ${conversoes(j2).length}`);
  checar('view em outra página também não é disparado',
    j2._enviados.length === 0, `eventos: ${j2._enviados.length}`);
}

// ── 4. o caminho feliz continua funcionando ─────────────────────────────────
{
  const j = rodar({
    caminho: '/lp-sql', busca: CTX_URL,
    formularios: [{ elementor: true, campos: ['form_fields[email]'] }],
  });
  const views = j._enviados.filter((e) => String(e.corpo || e.url).includes('view'));
  checar('view é enviado na página do teste', views.length === 1, `views: ${views.length}`);
  const escondido = j._forms[0].querySelector('[name^="form_fields"]');
  const temAb = j._forms[0].filhos.some((f) => f.attrs.name === 'form_fields[cw_ab]' && f.attrs.value === 'hero:B');
  checar('campo escondido com teste:variante é injetado no formulário', temAb);
  checar('contexto público expõe teste, variante e página',
    j.cwAB && j.cwAB.contexto().teste === 'hero' && j.cwAB.contexto().variante === 'B',
    JSON.stringify(j.cwAB && j.cwAB.contexto()));
}

// ── 5. visitante que chegou direto, sem passar pelo roteador ────────────────
{
  const j = rodar({ caminho: '/lp-sql', busca: '', formularios: [{ elementor: true, campos: ['form_fields[email]'] }] });
  checar('sem contexto, o snippet não manda nada e não define cwAB',
    j._enviados.length === 0 && !j.cwAB, `eventos: ${j._enviados.length}`);
}

// ── resumo ──────────────────────────────────────────────────────────────────
console.log('─'.repeat(78));
for (const c of checagens) {
  console.log(`  ${c.ok ? '[x]' : '[!]'} ${c.nome.padEnd(64, '.')} ${c.ok ? 'OK' : 'FALHOU'}`);
  if (!c.ok && c.detalhe) console.log(`      └ ${c.detalhe}`);
}
const falhas = checagens.filter((c) => !c.ok).length;
console.log('─'.repeat(78));
console.log(`  ${checagens.length - falhas}/${checagens.length} passaram.`);
process.exitCode = falhas ? 1 : 0;
