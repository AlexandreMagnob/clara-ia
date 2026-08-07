/**
 * Detecção de bot e de pré-carregamento.
 *
 * Por que isso não é detalhe: bot é a causa nº 1 de SRM. O AdsBot do Google
 * bate na URL do anúncio pra avaliar a landing page; o crawler do Facebook bate
 * quando o link é compartilhado. Se esse tráfego for sorteado e contado, ele
 * entra num braço só (ou nos dois, mas em proporção errada) e distorce o
 * denominador — sem nunca converter, o que puxa a taxa da variante pra baixo.
 *
 * Regra: bot é sempre mandado pro CONTROLE e nunca é contabilizado.
 * Mandar pro controle importa pro Google Ads — o AdsBot precisa avaliar a
 * página real do anúncio, não uma variante que pode sumir amanhã.
 */

const PADROES = [
  // buscadores e verificadores de anúncio
  'googlebot', 'adsbot-google', 'google-inspectiontool', 'mediapartners-google',
  'apis-google', 'feedfetcher-google', 'google favicon', 'storebot-google',
  'bingbot', 'adidxbot', 'bingpreview', 'yandexbot', 'baiduspider',
  'duckduckbot', 'slurp', 'applebot', 'petalbot', 'seznambot',
  // redes sociais / preview de link
  'facebookexternalhit', 'facebookcatalog', 'meta-externalagent',
  'twitterbot', 'linkedinbot', 'pinterest', 'slackbot', 'slack-imgproxy',
  'whatsapp', 'telegrambot', 'discordbot', 'embedly', 'redditbot',
  'skypeuripreview', 'vkshare', 'tiktok',
  // monitoramento, SEO, scraping
  'ahrefsbot', 'semrushbot', 'mj12bot', 'dotbot', 'rogerbot', 'screaming frog',
  'sitebulb', 'gtmetrix', 'pingdom', 'uptimerobot', 'statuscake', 'lighthouse',
  'chrome-lighthouse', 'pagespeed', 'datadog', 'newrelicpinger',
  // agentes de IA
  'gptbot', 'oai-searchbot', 'chatgpt-user', 'claudebot', 'claude-web',
  'anthropic-ai', 'perplexitybot', 'ccbot', 'bytespider', 'amazonbot',
  'google-extended', 'cohere-ai', 'diffbot',
  // genéricos e ferramentas
  'bot', 'crawler', 'spider', 'crawling', 'scrapy', 'curl/', 'wget',
  'python-requests', 'python-urllib', 'go-http-client', 'java/', 'okhttp',
  'httpclient', 'axios/', 'node-fetch', 'headlesschrome', 'phantomjs',
  'puppeteer', 'playwright', 'selenium', 'monitoring', 'preview', 'validator',
];

/** true se o User-Agent parece bot. UA vazio também conta como bot. */
export function ehBot(ua) {
  if (!ua || typeof ua !== 'string' || ua.trim().length < 8) return true;
  const s = ua.toLowerCase();
  return PADROES.some((p) => s.includes(p));
}

/**
 * true se a requisição é pré-carregamento do navegador (o usuário ainda não
 * clicou). Contar isso infla o denominador com gente que nunca viu a página.
 */
export function ehPrefetch(headers = {}) {
  const g = (k) => String(headers[k] || headers[k.toLowerCase()] || '').toLowerCase();
  const secPurpose = g('sec-purpose');           // Chrome moderno
  const purpose = g('purpose') || g('x-purpose') || g('x-moz'); // Safari, Firefox, legado
  return (
    secPurpose.includes('prefetch') ||
    secPurpose.includes('prerender') ||
    purpose.includes('prefetch') ||
    purpose.includes('prerender') ||
    purpose.includes('preview')
  );
}

/** Motivo da exclusão, ou null se o tráfego é legítimo. */
export function motivoExclusao(ua, headers = {}) {
  if (ehBot(ua)) return 'bot';
  if (ehPrefetch(headers)) return 'prefetch';
  return null;
}
