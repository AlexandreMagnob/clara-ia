/**
 * Servidor local. Monta os MESMOS handlers de `api/` que a Vercel vai montar —
 * nada aqui é uma segunda implementação, então o que passa no teste local é o
 * que vai rodar em produção.
 *
 *   node testes/dev-server.js
 *   node testes/dev-server.js --porta 3100
 *
 * Sobe junto um WordPress de mentira em `/lp/<slug>` com o snippet embutido,
 * pra dar pra rodar o fluxo inteiro (anúncio → roteador → LP → formulário →
 * conversão) sem depender do site real.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.dirname(AQUI);

// Ambiente de desenvolvimento — precisa estar setado ANTES de importar os
// módulos, porque alguns leem env na carga.
process.env.AB_STORE = process.env.AB_STORE || 'arquivo';
process.env.AB_DIR = process.env.AB_DIR || path.join(RAIZ, 'dados');
process.env.AB_PERMITIR_HTTP = process.env.AB_PERMITIR_HTTP || '1';
process.env.AB_ADMIN_TOKEN = process.env.AB_ADMIN_TOKEN || 'dev-token';
process.env.AB_CRON_SECRET = process.env.AB_CRON_SECRET || 'dev-cron';
process.env.AB_DOMINIOS_PERMITIDOS = process.env.AB_DOMINIOS_PERMITIDOS ||
  'cardapioweb.com,localhost,127.0.0.1';

const { default: rotaT } = await import('../api/t.js');
const { default: rotaEv } = await import('../api/ev.js');
const { default: rotaTestes } = await import('../api/testes.js');
const { default: rotaResultados } = await import('../api/resultados.js');
const { default: rotaAnalisar } = await import('../api/analisar.js');

const arg = (nome, padrao) => {
  const i = process.argv.indexOf('--' + nome);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : padrao;
};
const PORTA = Number(arg('porta', 3100));

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
};

function estatico(res, arquivo) {
  if (!fs.existsSync(arquivo) || !fs.statSync(arquivo).isFile()) return false;
  const ext = path.extname(arquivo).toLowerCase();
  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': 'no-store',
    // O snippet é carregado por outro domínio (a LP). Sem isso, CORS barra.
    'Access-Control-Allow-Origin': '*',
  });
  res.end(fs.readFileSync(arquivo));
  return true;
}

/** LP de mentira, com o snippet e um formulário. */
function lpFalsa(res, nome, base) {
  const html = `<!doctype html>
<html lang="pt-BR"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>LP de teste — ${nome}</title>
<!-- Num teste de redirect a variante SEMPRE aponta o canonical pro controle.
     Sem isso o Google troca a página original pela variante no índice. -->
<link rel="canonical" href="http://localhost:${PORTA}/lp/controle">
<script defer src="${base}/ab.js" data-ab="${base}"></script>
<style>
 body{font-family:system-ui,sans-serif;margin:0;padding:48px;background:#F4EDF7;color:#59327A}
 .c{max-width:560px;margin:0 auto;background:#fff;padding:40px;border-radius:24px}
 h1{font-size:32px;margin:0 0 8px}
 .v{display:inline-block;background:#FFB600;color:#59327A;padding:6px 16px;border-radius:999px;font-weight:700}
 input,button{width:100%;padding:14px;margin:8px 0;border-radius:12px;border:2px solid #59327A26;font-size:16px;box-sizing:border-box}
 button{background:#FFB600;color:#59327A;font-weight:700;border:0;cursor:pointer}
 pre{background:#F4EDF7;padding:12px;border-radius:12px;font-size:12px;overflow:auto}
</style></head><body><div class="c">
<span class="v">variante ${nome}</span>
<h1>Landing page de teste — ${nome}</h1>
<p>Página de mentira do kit de teste. O snippet real está carregado.</p>
<form id="f">
  <input name="form_fields[email]" type="email" placeholder="e-mail" required>
  <input name="form_fields[telefone]" placeholder="telefone" required>
  <button type="submit">Quero uma demonstração</button>
</form>
<p id="ok" style="display:none"><b>Enviado.</b> Conversão registrada.</p>
<pre id="ctx">contexto: carregando…</pre>
<script>
document.getElementById('f').addEventListener('submit', function(e){
  e.preventDefault();
  document.getElementById('ok').style.display='block';
  e.target.style.display='none';
});
setTimeout(function(){
  var c = window.cwAB ? window.cwAB.contexto() : null;
  document.getElementById('ctx').textContent = c
    ? 'teste: ' + c.teste + '\\nvariante: ' + c.variante +
      '\\ncampo escondido: ' + (document.querySelector('[name="form_fields[cw_ab]"]')||{}).value
    : 'sem contexto de teste (chegou direto, sem passar pelo roteador)';
}, 300);
</script>
</div></body></html>`;
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(html);
}

const servidor = http.createServer(async (req, res) => {
  const caminho = decodeURIComponent((req.url || '/').split('?')[0]);
  const base = `http://${req.headers.host}`;

  try {
    if (caminho === '/api/ev') return void (await rotaEv(req, res));
    if (caminho === '/api/testes') return void (await rotaTestes(req, res));
    if (caminho === '/api/resultados') return void (await rotaResultados(req, res));
    if (caminho === '/api/analisar') return void (await rotaAnalisar(req, res));
    if (caminho.startsWith('/t/') || caminho === '/api/t') return void (await rotaT(req, res));

    const lp = caminho.match(/^\/lp\/([a-z0-9-]+)$/i);
    if (lp) return lpFalsa(res, lp[1], base);

    if (caminho === '/' || caminho === '/index.html') {
      if (estatico(res, path.join(RAIZ, 'app', 'index.html'))) return;
    }
    const alvo = path.join(RAIZ, 'app', caminho.replace(/^\/+/, ''));
    // Trava de path traversal: `/../../.env` não pode sair de app/.
    if (alvo.startsWith(path.join(RAIZ, 'app')) && estatico(res, alvo)) return;

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404');
  } catch (e) {
    console.error('[dev]', e);
    if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('erro: ' + e.message);
  }
});

servidor.listen(PORTA, () => {
  console.log(`
  plataforma de teste A/B — servidor local
  ────────────────────────────────────────────────────────
  painel      http://localhost:${PORTA}/
  roteador    http://localhost:${PORTA}/t/<slug>
  LP falsa    http://localhost:${PORTA}/lp/<nome>
  token       ${process.env.AB_ADMIN_TOKEN}
  dados       ${process.env.AB_DIR}
  store       ${process.env.AB_STORE}
`);
});
