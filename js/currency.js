// =====================================================
// Dunas & Olas — Selector de Moneda COP / USD / MXN
// =====================================================
(function () {
  var CURRENCY_KEY = "dunas_currency";
  var RATES_KEY = "dunas_usd_rates";
  var RATES_TS_KEY = "dunas_usd_rates_ts";
  var CACHE_TTL = 86400000; // 24 horas
  var FALLBACK_COP_RATE = 4200; // COP por 1 USD (respaldo si falla la API)
  var FALLBACK_MXN_RATE = 18.5; // MXN por 1 USD (respaldo si falla la API)
  var CURRENCIES = ["COP", "USD", "MXN"];

  var copRate = FALLBACK_COP_RATE;
  var mxnRate = FALLBACK_MXN_RATE;
  var current = localStorage.getItem(CURRENCY_KEY) || "COP";
  if (CURRENCIES.indexOf(current) === -1) current = "COP";

  async function loadRates() {
    var ts = parseInt(localStorage.getItem(RATES_TS_KEY) || "0");
    var cached = null;
    try {
      cached = JSON.parse(localStorage.getItem(RATES_KEY) || "null");
    } catch (_) {
      cached = null;
    }
    if (cached && cached.COP && cached.MXN && Date.now() - ts < CACHE_TTL) {
      copRate = cached.COP;
      mxnRate = cached.MXN;
      return;
    }
    try {
      var res = await fetch("https://open.er-api.com/v6/latest/USD");
      var data = await res.json();
      if (data.result === "success" && data.rates && data.rates.COP && data.rates.MXN) {
        copRate = data.rates.COP;
        mxnRate = data.rates.MXN;
        localStorage.setItem(RATES_KEY, JSON.stringify({ COP: copRate, MXN: mxnRate }));
        localStorage.setItem(RATES_TS_KEY, Date.now());
      }
    } catch (_) {
      /* usa tasas de respaldo */
    }
  }

  function parseCOP(text) {
    return parseInt((text || "").replace(/\D/g, "")) || 0;
  }

  function formatUSD(cop) {
    var usd = Math.round(cop / copRate);
    return "$" + usd.toLocaleString("en-US") + " USD";
  }

  function formatMXN(cop) {
    var mxn = Math.round((cop / copRate) * mxnRate);
    return "$" + mxn.toLocaleString("es-MX") + " MXN";
  }

  function formatCOP(n) {
    // Formato colombiano: $X.XXX.XXX COP
    return (
      "$" +
      n.toLocaleString("es-CO", { minimumFractionDigits: 0 }).replace(/,/g, ".") +
      " COP"
    );
  }

  function formatPrice(cop) {
    if (current === "USD") return formatUSD(cop);
    if (current === "MXN") return formatMXN(cop);
    return formatCOP(cop);
  }

  function scanAndTag() {
    // Etiqueta elementos de precio estáticos con su valor COP original
    document
      .querySelectorAll(".price-value, .addon-btn .font-bold, .food-price-value")
      .forEach(function (el) {
        if (!el.dataset.copVal) {
          var v = parseCOP(el.textContent);
          if (v > 0) el.dataset.copVal = v;
        }
      });
  }

  function applyDisplay() {
    scanAndTag();
    document.querySelectorAll("[data-cop-val]").forEach(function (el) {
      var cop = parseInt(el.dataset.copVal);
      el.textContent = formatPrice(cop);
    });

    // Precio dinámico del selector de kitesurf (experiences.html)
    var kitePreview = document.getElementById("kite-total-preview");
    if (kitePreview) {
      var cop = parseCOP(kitePreview.dataset.copVal || kitePreview.textContent);
      if (!kitePreview.dataset.copVal && cop)
        kitePreview.dataset.copVal = cop;
      if (kitePreview.dataset.copVal) {
        kitePreview.textContent = formatPrice(parseInt(kitePreview.dataset.copVal));
      }
    }

    updateToggleBtn();

    // Refresca el carrito y el resumen de checkout (si están presentes)
    // para que también muestren los montos en la moneda seleccionada
    if (typeof window.renderCart === "function") window.renderCart();
    if (typeof window.renderCheckoutSummary === "function")
      window.renderCheckoutSummary();
  }

  function updateToggleBtn() {
    var html = CURRENCIES.map(function (code) {
      return code === current
        ? '<span class="font-bold text-yellow-400">' + code + "</span>"
        : '<span class="opacity-50">' + code + "</span>";
    }).join('<span class="opacity-40 mx-0.5">/</span>');
    ["currency-toggle", "currency-toggle-checkout", "currency-toggle-cart"].forEach(function (id) {
      var btn = document.getElementById(id);
      if (btn) btn.innerHTML = html;
    });
  }

  // Expuesto globalmente
  window.toggleCurrency = function () {
    var idx = CURRENCIES.indexOf(current);
    current = CURRENCIES[(idx + 1) % CURRENCIES.length];
    localStorage.setItem(CURRENCY_KEY, current);
    applyDisplay();
  };

  window.formatPrice = formatPrice;
  window.getCurrencyRate = function () {
    return copRate;
  };
  window.getCurrentCurrency = function () {
    return current;
  };

  // Parchar updateKiteTotalPreview para que respete la moneda seleccionada
  document.addEventListener("DOMContentLoaded", async function () {
    await loadRates();
    applyDisplay();

    // Parchar el preview de kitesurf después de cada recalculación
    var origUpdate =
      typeof updateKiteTotalPreview === "function"
        ? updateKiteTotalPreview
        : null;
    if (origUpdate) {
      window.updateKiteTotalPreview = function () {
        origUpdate();
        var kite = document.getElementById("kite-total-preview");
        if (kite) {
          var cop = parseCOP(kite.textContent);
          if (cop) {
            kite.dataset.copVal = cop;
            kite.textContent = formatPrice(cop);
          }
        }
      };
      // Lanzar una vez para inicializar
      window.updateKiteTotalPreview();
    }
  });
})();
