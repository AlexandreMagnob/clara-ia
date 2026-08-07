/**
 * Snippet da landing page. Um arquivo, sem dependência, ~3 KB.
 *
 *   <script defer src="https://<plataforma>/ab.js"
 *           data-ab="https://<plataforma>"></script>
 *
 * O que ele faz:
 *   1. lê `cwab` (teste:variante) e `cwvid` (visitante) da URL — o roteador põe
 *   2. guarda no localStorage, pra sobreviver à navegação dentro do site
 *   3. manda `view`
 *   4. escuta o sucesso do formulário do Elementor e manda `conversion`
 *   5. injeta o campo escondido `cw_ab` nos formulários, pra variante viajar
 *      junto com o lead até o RD/Meetime/Supabase
 *
 * O passo 5 é a rede de segurança que importa: se um dia esta plataforma sair
 * do ar, a variante ainda estará gravada no lead e o experimento continua
 * analisável pelo banco.
 *
 * O snippet NUNCA esconde nem altera a página. Não existe anti-flicker aqui
 * porque não existe flicker: a variante é uma página de verdade, servida
 * inteira pelo WordPress.
 */
(function () {
  'use strict';

  var script = document.currentScript ||
    (function () { var s = document.getElementsByTagName('script'); return s[s.length - 1]; })();
  var BASE = (script && script.getAttribute('data-ab')) ||
    (script && script.src ? script.src.replace(/\/[^/]*$/, '') : '');
  if (!BASE) return;

  var CHAVE = 'cw_ab_ctx';
  var RE_VID = /^[a-f0-9]{16,64}$/i;

  function guardar(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function ler(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  // ── contexto: da URL (prioridade) ou do que ficou guardado ────────────────
  function contexto() {
    var p;
    try { p = new URLSearchParams(location.search); } catch (e) { return null; }

    var cwab = p.get('cwab');
    var vid = p.get('cwvid');

    if (cwab && vid && RE_VID.test(vid)) {
      var partes = String(cwab).split(':');
      if (partes.length === 2 && partes[0] && partes[1]) {
        var ctx = {
          teste: partes[0], variante: partes[1], vid: vid, t: Date.now(),
          // Guarda a PÁGINA em que o roteador largou o visitante. Sem isso, o
          // listener de `submit_success` é de documento e vale pro site
          // inteiro por 30 dias: newsletter do rodapé, popup de saída e
          // formulário de contato em qualquer página virariam conversão do
          // teste. O numerador deixaria de medir a LP e passaria a medir
          // "qualquer formulário do site" — sem nada, depois, pra separar.
          p: location.pathname,
        };
        guardar(CHAVE, JSON.stringify(ctx));
        return ctx;
      }
    }

    var salvo = ler(CHAVE);
    if (salvo) {
      try {
        var c = JSON.parse(salvo);
        // 30 dias: depois disso a atribuição é velha demais pra valer como
        // contexto de conversão, e o teste já acabou de qualquer jeito.
        if (c && c.teste && c.variante && RE_VID.test(c.vid || '') &&
            (Date.now() - (c.t || 0)) < 30 * 864e5) return c;
      } catch (e) {}
    }
    return null;
  }

  var ctx = contexto();
  if (!ctx) return; // visitante que não veio pelo roteador: não é do teste

  // ── envio: sendBeacon → fetch keepalive → pixel ───────────────────────────
  //
  // Três planos porque o momento crítico é o submit do formulário, quando a
  // página costuma estar navegando. sendBeacon é o único que o navegador
  // garante entregar durante o unload; os outros dois cobrem quem não tem.
  function mandar(tipo) {
    var corpo = {
      teste: ctx.teste, variante: ctx.variante, visitante: ctx.vid, tipo: tipo,
    };
    var url = BASE + '/api/ev';

    try {
      if (navigator.sendBeacon) {
        var blob = new Blob([JSON.stringify(corpo)], { type: 'application/json' });
        if (navigator.sendBeacon(url, blob)) return;
      }
    } catch (e) {}

    try {
      if (window.fetch) {
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(corpo),
          keepalive: true,
          mode: 'cors',
        }).catch(function () { pixel(tipo); });
        return;
      }
    } catch (e) {}

    pixel(tipo);
  }

  function pixel(tipo) {
    try {
      var i = new Image();
      i.src = BASE + '/api/ev?t=' + encodeURIComponent(ctx.teste) +
        '&v=' + encodeURIComponent(ctx.variante) +
        '&vid=' + encodeURIComponent(ctx.vid) +
        '&tipo=' + encodeURIComponent(tipo) +
        '&_=' + Date.now();
    } catch (e) {}
  }

  // ── 1. pageview ───────────────────────────────────────────────────────────
  // Só na página do teste. O `view` é o sinal de saúde "o snippet carregou na
  // LP"; disparado em outra página do site ele mediria outra coisa e o aviso
  // de "poucos views por atribuição" pararia de significar o que diz.
  if (!ctx.p || location.pathname === ctx.p) mandar('view');

  // ── 2. campo escondido nos formulários ────────────────────────────────────
  function marcarFormularios() {
    var forms = document.querySelectorAll('form');
    for (var i = 0; i < forms.length; i++) {
      var f = forms[i];
      if (f.getAttribute('data-cw-ab')) continue;
      f.setAttribute('data-cw-ab', '1');
      var input = document.createElement('input');
      input.type = 'hidden';
      // O coletor `cw-site-tracking.php` captura por LABEL do campo, então o
      // name precisa ser identificável do lado do WordPress.
      input.name = 'form_fields[cw_ab]';
      input.value = ctx.teste + ':' + ctx.variante;
      f.appendChild(input);

      var iv = document.createElement('input');
      iv.type = 'hidden';
      iv.name = 'form_fields[cw_ab_vid]';
      iv.value = ctx.vid;
      f.appendChild(iv);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', marcarFormularios);
  } else {
    marcarFormularios();
  }
  // O Elementor monta popup e formulário depois do load; reobserva.
  //
  // Com debounce e ancorado no <body>: sem isso, `querySelectorAll('form')`
  // roda a cada mutação da árvore inteira — e LP com carrossel ou animação
  // muta o tempo todo, o que fazia o snippet varrer o DOM continuamente.
  try {
    var pendente = null;
    new MutationObserver(function () {
      if (pendente) return;
      pendente = setTimeout(function () { pendente = null; marcarFormularios(); }, 300);
    }).observe(document.body || document.documentElement, {
      childList: true, subtree: true,
    });
  } catch (e) {}

  // ── 3. conversão ──────────────────────────────────────────────────────────
  var jaMandou = false;

  /** A conversão só vale na página em que o roteador largou o visitante. */
  function naPaginaDoTeste() {
    return !ctx.p || location.pathname === ctx.p;
  }

  function converteu() {
    if (jaMandou) return;      // trava local
    if (!naPaginaDoTeste()) return;  // outro formulário, outra página: não é o teste
    jaMandou = true;           // (o servidor deduplica de novo, por visitante)
    mandar('conversion');
  }

  // Caminho principal: o Elementor Pro dispara `submit_success` via jQuery
  // depois que o AJAX volta OK. É o único sinal que significa "lead gravado".
  function ligarElementor() {
    if (!window.jQuery) return false;
    window.jQuery(document).on('submit_success', converteu);
    return true;
  }
  if (!ligarElementor()) {
    // jQuery pode carregar depois do snippet: tenta de novo por 10s.
    var tentativas = 0;
    var timer = setInterval(function () {
      if (ligarElementor() || ++tentativas > 20) clearInterval(timer);
    }, 500);
  }

  /**
   * Rede de segurança: submit nativo, pra formulário que não é Elementor ou
   * Elementor com o `submit_success` quebrado (o defeito mais comum em campo).
   *
   * A guarda tem que reconhecer formulário do Elementor DE VERDADE. A versão
   * anterior perguntava se havia algum `[name^="form_fields"]` — e o próprio
   * snippet injeta `form_fields[cw_ab]` em todo formulário da página logo
   * acima. A guarda casava sempre, a rede de segurança nunca cobria o caso pra
   * que foi escrita, e a perda era 100% silenciosa.
   */
  function ehFormularioElementor(f) {
    return !!(f.classList && f.classList.contains('elementor-form')) ||
      !!f.closest('.elementor-widget-form');
  }

  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (!f || f.tagName !== 'FORM') return;
    if (window.jQuery && ehFormularioElementor(f)) return; // o submit_success cuida
    converteu();
  }, true);

  // API pública, pra conversão que não é formulário (clique no WhatsApp, etc.)
  window.cwAB = {
    contexto: function () {
      return { teste: ctx.teste, variante: ctx.variante, pagina: ctx.p };
    },
    converter: converteu,
  };
})();
