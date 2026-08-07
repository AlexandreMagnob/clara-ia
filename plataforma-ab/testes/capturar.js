/**
 * Prints de evidência via Chrome headless + CDP.
 *
 *   node testes/capturar.js            (precisa do dev-server na 3100)
 *
 * Usa CDP direto (sem puppeteer) porque o projeto não tem dependência e não vai
 * ter. `Emulation.setDeviceMetricsOverride` com `mobile:true` é obrigatório pro
 * print de celular — sem isso o Chrome ignora o meta viewport e o screenshot
 * mente sobre o layout.
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SAIDA = path.join(RAIZ, 'docs', 'evidencias');
const BASE = process.env.AB_BASE || 'http://localhost:3100';
const TOKEN = process.env.AB_ADMIN_TOKEN || 'dev-token';
const PORTA_CDP = 9333;

const CHROMES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
];
const CHROME = CHROMES.find((c) => c && fs.existsSync(c));
if (!CHROME) { console.error('Chrome não encontrado'); process.exit(1); }

fs.mkdirSync(SAIDA, { recursive: true });
const perfil = path.join(RAIZ, '.chrome-perfil');

const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORTA_CDP}`, `--user-data-dir=${perfil}`,
  '--no-first-run', '--no-default-browser-check', '--disable-gpu', '--hide-scrollbars',
  'about:blank',
], { stdio: 'ignore' });

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function alvo() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORTA_CDP}/json/list`);
      const lista = await r.json();
      const p = lista.find((x) => x.type === 'page');
      if (p) return p.webSocketDebuggerUrl;
    } catch { /* subindo */ }
    await esperar(250);
  }
  throw new Error('CDP não respondeu');
}

const ws = new WebSocket(await alvo());
await new Promise((r) => { ws.onopen = r; });

let id = 0;
const pendentes = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pendentes.has(m.id)) { pendentes.get(m.id)(m); pendentes.delete(m.id); }
};
function cdp(metodo, params = {}) {
  const meu = ++id;
  ws.send(JSON.stringify({ id: meu, method: metodo, params }));
  return new Promise((r) => pendentes.set(meu, r));
}

await cdp('Page.enable');
await cdp('Runtime.enable');
await cdp('Network.enable');

// O Chrome headless manda "HeadlessChrome" no User-Agent, e o roteador
// classifica isso como bot (corretamente) e desvia pro controle. Sem
// sobrescrever, o print de `cwforce=B` sairia mostrando a variante A.
await cdp('Network.setUserAgentOverride', {
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
});

async function capturar(nome, url, { largura = 1280, altura = 900, mobile = false, antes = null } = {}) {
  await cdp('Emulation.setDeviceMetricsOverride', {
    width: largura, height: altura, deviceScaleFactor: 2, mobile,
  });
  await cdp('Page.navigate', { url });
  await esperar(1400);
  if (antes) { await cdp('Runtime.evaluate', { expression: antes, awaitPromise: true }); await esperar(1200); }
  const r = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  if (!r.result || !r.result.data) { console.error(`  FALHOU: ${nome}`); return; }
  const arq = path.join(SAIDA, nome + '.png');
  fs.writeFileSync(arq, Buffer.from(r.result.data, 'base64'));
  console.log(`  ${nome}.png  (${(fs.statSync(arq).size / 1024).toFixed(0)} KB)`);
}

console.log('capturando em docs/evidencias/');

// O token mora no localStorage. Grava na origem certa e recarrega.
await cdp('Page.navigate', { url: BASE + '/' });
await esperar(700);
await cdp('Runtime.evaluate', { expression: `localStorage.setItem('ab_token','${TOKEN}')` });

await capturar('painel-lista', BASE + '/', { largura: 1280, altura: 1500 });
await capturar('painel-mobile', BASE + '/', { largura: 390, altura: 1400, mobile: true });
await capturar('painel-formulario', BASE + '/', {
  largura: 1280, altura: 1350,
  antes: `document.querySelector('#btNovo').click();
          document.querySelector('#f-baseline').value='0.1237';
          document.querySelector('#f-mde').value='0.3';
          document.querySelector('#f-baseline').dispatchEvent(new Event('input',{bubbles:true}));`,
});

// Roteamento: as duas variantes servidas pela MESMA URL de anúncio
await capturar('roteamento-variante-a', BASE + '/t/demo-roteamento?cwforce=A&utm_source=meta&utm_campaign=sm33', { largura: 900, altura: 760 });
await capturar('roteamento-variante-b', BASE + '/t/demo-roteamento?cwforce=B&utm_source=meta&utm_campaign=sm33', { largura: 900, altura: 760 });

ws.close();
chrome.kill();
await esperar(400);
try { fs.rmSync(perfil, { recursive: true, force: true }); } catch { /* ok */ }
console.log('pronto');
process.exit(0);
