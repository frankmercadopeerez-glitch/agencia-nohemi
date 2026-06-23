// ============================================================
// Dunas & Olas — Preferencias de Idioma y Moneda (Primera Visita)
// Maneja: detección de idioma del navegador, banner compacto
// de una sola línea, redirección a /en/, y preferencia de moneda.
// ============================================================
(function () {
  var PREF_KEY = 'dunasyolas-pref-set';
  var CUR_KEY  = 'dunas_currency';
  var LANG_KEY = 'dunas_lang';

  // Páginas con equivalente en /en/
  var EN_PAGES = [
    'index.html', 'experiences.html', 'about.html', 'faq.html',
    'policies.html', 'privacy.html', 'kitesurf.html',
    'atardeceres-bahia.html', 'buceo-snorkel.html',
    'recorrido-gastronomico.html', 'sabores-locales.html',
    'pasadia-islas-rosario.html', 'fleet.html'
  ];

  var browserLang = ((navigator.language || navigator.userLanguage || 'es') + '').substring(0, 2).toLowerCase();
  var savedLang   = localStorage.getItem(LANG_KEY);
  var savedCur    = localStorage.getItem(CUR_KEY);
  var prefSet     = !!localStorage.getItem(PREF_KEY);
  var isEnSite    = window.location.pathname.indexOf('/en') === 0;

  // ── Redirección automática para visitas de retorno ──────────────────────
  if (prefSet && savedLang === 'en' && !isEnSite) {
    window.location.replace(buildEnPath(window.location.pathname));
    return;
  }
  if (prefSet && savedLang === 'es' && isEnSite) {
    window.location.replace(buildEsPath(window.location.pathname));
    return;
  }

  // Preselección para primera visita
  var _selLang = savedLang || (browserLang === 'en' ? 'en' : 'es');
  var _selCur  = savedCur  || (_selLang === 'en' ? 'USD' : 'COP');

  // ── Helpers de rutas ────────────────────────────────────────────────────
  function buildEnPath(path) {
    if (path.indexOf('/en') === 0) return path;
    var page = path.split('/').pop() || 'index.html';
    if (!page.includes('.')) page += '.html';
    return EN_PAGES.indexOf(page) !== -1 ? '/en/' + page : '/en/';
  }

  function buildEsPath(path) {
    return path.replace(/^\/en\/?/, '/') || '/';
  }

  // ── Render del banner ───────────────────────────────────────────────────
  function _btn(type, code, flag, label) {
    var active = type === 'lang' ? _selLang === code : _selCur === code;
    var fn = type === 'lang' ? "window._prefLang('" + code + "')" : "window._prefCur('" + code + "')";
    var attr = type === 'lang' ? 'data-pref-lang' : 'data-pref-cur';
    return '<button onclick="' + fn + '" ' + attr + '="' + code + '" style="' +
      'font-size:11px;font-weight:700;padding:4px 11px;border-radius:9999px;' +
      'border:1.5px solid ' + (active ? '#C9A227' : 'rgba(255,255,255,.28)') + ';' +
      'color:' + (active ? '#C9A227' : 'rgba(255,255,255,.65)') + ';' +
      'background:' + (active ? 'rgba(201,162,39,.14)' : 'transparent') + ';' +
      'cursor:pointer;white-space:nowrap;font-family:inherit;flex-shrink:0">' +
      flag + '&nbsp;' + label + '</button>';
  }

  function isEn() { return _selLang === 'en'; }

  function renderBanner() {
    var el = document.getElementById('pref-banner');
    if (!el) {
      el = document.createElement('div');
      el.id = 'pref-banner';
      document.body.insertBefore(el, document.body.firstChild);
    }
    Object.assign(el.style, {
      position: 'fixed', top: '0', left: '0', right: '0', zIndex: '9999',
      background: 'linear-gradient(90deg,#1e0f30,#3F2761)', display: 'none'
    });

    el.innerHTML =
      '<div style="max-width:1200px;margin:0 auto;padding:6px 16px;display:flex;align-items:center;gap:8px;overflow-x:auto;-ms-overflow-style:none;scrollbar-width:none">' +
        '<i class="fas fa-globe" style="color:#C9A227;font-size:13px;flex-shrink:0"></i>' +
        // Idioma
        '<span style="color:rgba(255,255,255,.45);font-size:9.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;flex-shrink:0">' + (isEn() ? 'Language:' : 'Idioma:') + '</span>' +
        '<div style="display:flex;gap:5px;flex-shrink:0">' +
          _btn('lang', 'es', '🇨🇴', 'ES') +
          _btn('lang', 'en', '🇺🇸', 'EN') +
        '</div>' +
        '<span style="color:rgba(255,255,255,.15);font-size:18px;flex-shrink:0;line-height:1">|</span>' +
        // Moneda
        '<span style="color:rgba(255,255,255,.45);font-size:9.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;flex-shrink:0">' + (isEn() ? 'Currency:' : 'Moneda:') + '</span>' +
        '<div style="display:flex;gap:5px;flex-shrink:0">' +
          _btn('cur', 'COP', '🇨🇴', 'COP') +
          _btn('cur', 'USD', '🇺🇸', 'USD') +
          _btn('cur', 'MXN', '🇲🇽', 'MXN') +
        '</div>' +
        // Guardar / Cerrar
        '<div style="display:flex;align-items:center;gap:8px;margin-left:auto;flex-shrink:0">' +
          '<button id="pref-save-btn" onclick="window._prefSave()" style="background:#C9A227;color:#111;font-size:11px;font-weight:800;padding:5px 18px;border-radius:8px;border:none;cursor:pointer;white-space:nowrap;font-family:inherit">' + (isEn() ? 'Save' : 'Guardar') + '</button>' +
          '<button onclick="window._prefDismiss()" style="color:rgba(255,255,255,.35);font-size:20px;line-height:1;background:transparent;border:none;cursor:pointer;padding:0 2px" title="' + (isEn() ? 'Close' : 'Cerrar') + '">✕</button>' +
        '</div>' +
      '</div>';

    return el;
  }

  function showBanner() {
    var el = renderBanner();
    el.style.display = 'block';
    setTimeout(function () {
      var nav = document.getElementById('navbar') || document.querySelector('nav.fixed');
      if (nav) nav.style.top = el.offsetHeight + 'px';
    }, 0);
  }

  function hideBanner() {
    var el = document.getElementById('pref-banner');
    if (el) el.style.display = 'none';
    var nav = document.getElementById('navbar') || document.querySelector('nav.fixed');
    if (nav) nav.style.top = '';
  }

  // ── API Global ───────────────────────────────────────────────────────────
  window._prefLang = function (code) {
    _selLang = code;
    if (code === 'en' && _selCur === 'COP') _selCur = 'USD';
    if (code === 'es' && _selCur === 'USD') _selCur = 'COP';
    renderBanner(); showBanner();
  };

  window._prefCur = function (code) {
    _selCur = code;
    renderBanner(); showBanner();
  };

  window._prefSave = function () {
    localStorage.setItem(PREF_KEY, '1');
    localStorage.setItem(LANG_KEY, _selLang);
    localStorage.setItem(CUR_KEY, _selCur);
    if (typeof window.setCurrency === 'function') window.setCurrency(_selCur);
    hideBanner();
    var path = window.location.pathname;
    if (_selLang === 'en' && !isEnSite) {
      window.location.replace(buildEnPath(path));
    } else if (_selLang === 'es' && isEnSite) {
      window.location.replace(buildEsPath(path));
    }
  };

  window._prefDismiss = function () {
    localStorage.setItem(PREF_KEY, '1');
    localStorage.setItem(LANG_KEY, _selLang);
    localStorage.setItem(CUR_KEY, _selCur);
    if (typeof window.setCurrency === 'function') window.setCurrency(_selCur);
    hideBanner();
  };

  // Alias backward compat (arma-tu-viaje.html tenía estos nombres)
  window.prefSelectCurrency = window._prefCur;
  window.prefSave           = window._prefSave;
  window.prefDismiss        = window._prefDismiss;

  // Actualiza label de moneda en el nav (si existe)
  function updateNavCurrencyLabel() {
    var lbl = document.getElementById('currency-label-nav');
    if (lbl) lbl.textContent = localStorage.getItem(CUR_KEY) || 'COP';
  }

  // ── Init ─────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    updateNavCurrencyLabel();

    // Sobrescribir toggleCurrency para sincronizar el label del nav
    var origToggle = window.toggleCurrency;
    window.toggleCurrency = function () {
      if (origToggle) origToggle();
      updateNavCurrencyLabel();
    };

    if (!prefSet) {
      setTimeout(showBanner, 700);
    }
  });
})();
