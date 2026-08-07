/**
 * Utilidades de HTTP compartilhadas pelos handlers.
 *
 * Os handlers usam só `req.url`, `req.method`, `req.headers` e o `res` cru do
 * Node — que é exatamente o que a Vercel entrega no runtime Node e o que o
 * servidor local de teste entrega também. Assim o MESMO código roda nos dois,
 * sem uma segunda implementação pra sair de sincronia.
 */

import crypto from 'node:crypto';

export function urlDe(req) {
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
  const proto = req.headers['x-forwarded-proto'] || 'http';
  return new URL(req.url, `${proto}://${host}`);
}

export function cookies(req) {
  const bruto = req.headers.cookie || '';
  const out = {};
  for (const parte of bruto.split(';')) {
    const i = parte.indexOf('=');
    if (i < 0) continue;
    const k = parte.slice(0, i).trim();
    const v = parte.slice(i + 1).trim();
    if (k) {
      try { out[k] = decodeURIComponent(v); } catch { out[k] = v; }
    }
  }
  return out;
}

export function porCookie(nome, valor, { dias = 365, sameSite = 'Lax' } = {}) {
  const partes = [
    `${nome}=${encodeURIComponent(valor)}`,
    'Path=/',
    `Max-Age=${Math.round(dias * 86400)}`,
    `SameSite=${sameSite}`,
    'HttpOnly',
    'Secure',
  ];
  return partes.join('; ');
}

export async function lerCorpo(req, { limiteBytes = 256 * 1024 } = {}) {
  // Se o runtime já parseou (Vercel faz isso quando o content-type é json)
  if (req.body !== undefined && req.body !== null && typeof req.body === 'object') return req.body;
  return new Promise((resolve, reject) => {
    let n = 0;
    const pedacos = [];
    req.on('data', (c) => {
      n += c.length;
      if (n > limiteBytes) { reject(new Error('corpo grande demais')); req.destroy(); return; }
      pedacos.push(c);
    });
    req.on('end', () => {
      const txt = Buffer.concat(pedacos).toString('utf8');
      if (!txt.trim()) return resolve({});
      try { resolve(JSON.parse(txt)); } catch { reject(new Error('JSON inválido')); }
    });
    req.on('error', reject);
  });
}

export function json(res, status, corpo, headers = {}) {
  const txt = JSON.stringify(corpo);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...headers,
  });
  res.end(txt);
}

export function texto(res, status, corpo, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', ...headers });
  res.end(corpo);
}

/**
 * Redirect 302 — NUNCA 301.
 *
 * O 301 é permanente: o navegador guarda e para de bater no roteador, o que
 * congela a variante daquele visitante mesmo depois do teste acabar. E o Google
 * troca a URL original pela variante no índice. O Search Central é explícito
 * sobre usar 302 em teste A/B.
 *
 * `no-store` pelo mesmo motivo: o roteador não pode ser cacheado em lugar
 * nenhum, senão um CDN serve a mesma variante pra todo mundo e o teste morre.
 */
export function redirecionar(res, destino, headers = {}) {
  res.writeHead(302, {
    Location: destino,
    'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    Pragma: 'no-cache',
    Expires: '0',
    'Referrer-Policy': 'no-referrer-when-downgrade',
    ...headers,
  });
  res.end();
}

/** Pixel 1x1 transparente — resposta do beacon por <img>, o plano C do snippet. */
const GIF = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
export function pixel(res) {
  res.writeHead(200, {
    'Content-Type': 'image/gif',
    'Content-Length': GIF.length,
    'Cache-Control': 'no-store, no-cache, must-revalidate, private',
  });
  res.end(GIF);
}

export function cors(res, origem = '*') {
  res.setHeader('Access-Control-Allow-Origin', origem);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-AB-Token');
  res.setHeader('Access-Control-Max-Age', '86400');
}

export function novoId() {
  return crypto.randomUUID().replace(/-/g, '');
}

/** Hash do IP com sal do ambiente — pra diagnóstico sem guardar IP. */
export function hashIp(ip) {
  if (!ip) return null;
  const sal = process.env.AB_SAL_IP || 'cw-ab';
  return crypto.createHash('sha256').update(sal + '|' + ip).digest('hex').slice(0, 16);
}

export function ipDe(req) {
  const f = req.headers['x-forwarded-for'];
  if (f) return String(f).split(',')[0].trim();
  return req.socket?.remoteAddress || null;
}

/**
 * Compara segredos em tempo constante. `a === b` vaza o tamanho do prefixo
 * comum pelo tempo de execução, o que dá pra explorar num endpoint público.
 */
export function segredoConfere(recebido, esperado) {
  if (!esperado) return false;
  const a = Buffer.from(String(recebido || ''), 'utf8');
  const b = Buffer.from(String(esperado), 'utf8');
  if (a.length !== b.length) {
    // ainda assim gasta o tempo da comparação, pra não vazar o tamanho
    crypto.timingSafeEqual(b, b);
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}

/** Guarda dos endpoints de escrita. */
export function exigirAdmin(req, res) {
  const esperado = process.env.AB_ADMIN_TOKEN;
  if (!esperado) {
    json(res, 503, { erro: 'AB_ADMIN_TOKEN não configurado no ambiente — escrita desabilitada' });
    return false;
  }
  const recebido = req.headers['x-ab-token'] ||
    String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!segredoConfere(recebido, esperado)) {
    json(res, 401, { erro: 'token inválido' });
    return false;
  }
  return true;
}
