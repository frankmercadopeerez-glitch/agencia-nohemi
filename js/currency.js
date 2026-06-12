// =====================================================
// Dunas & Olas — Toggle de Moneda COP / USD
// =====================================================
(function () {
  var CURRENCY_KEY = "nohemi_currency";
  var RATE_KEY = "nohemi_usd_rate";
  var RATE_TS_KEY = "nohemi_usd_ts";
  var CACHE_TTL = 86400000; // 24 horas
  var FALLBACK_RATE = 4200; // COP por 1 USD (respaldo si falla la API)

  var rate = FALLBACK_RATE;
  var current = localStorage.getItem(CURRENCY_KEY) || "COP";

  async function loadRate() {
    var ts = parseInt(localStorage.getItem(RATE_TS_KEY) || "0");
    var cached = parseFloat(localStorage.getItem(RATE_KEY) || "0");
    if (cached && Date.now() - ts < CACHE_TTL) {
      rate = cached;
      return;
    }
    try {
      var res = await fetch("https://open.er-api.com/v6/latest/USD");
      var data = await res.json();
      if (data.result === "success" && data.rates && data.rates.COP) {
        rate = data.rates.COP;
        localStorage.setItem(RATE_KEY, rate);
        localStorage.setItem(RATE_TS_KEY, Date.now());
      }
    } catch (_) {
      /* usa tasa de respaldo */
    }
  }

  function parseCOP(text) {
    return parseInt((text || "").replace(/\D/g, "")) || 0;
  }

  function formatUSD(cop) {
    var usd = Math.round(cop / rate);
    return "$" + usd.toLocaleString("en-US") + " USD";
  }

  function formatCOP(n) {
    // Formato colombiano: $X.XXX.XXX COP
    return (
      "$" +
      n.toLocaleString("es-CO", { minimumFractionDigits: 0 }).replace(/,/g, ".") +
      " COP"
    );
  }

  function scanAndTag() {
    // Etiqueta elementos de precio estáticos con su valor COP original
    document
      .querySelectorAll(".price-value, .addon-btn .font-bold")
      .forEach(function (el) {
        if (!el.dataset.copVal) {
          var v = parseCOP(el.textContent);
          if (v > 0) el.dataset.copVal = v;
        }
      });
  }

  function applyDisplay() {
    scanAndTag();
    var toUSD = current === "USD";
    document.querySelectorAll("[data-cop-val]").forEach(function (el) {
      var cop = parseInt(el.dataset.copVal);
      // Evitar doble escritura si ya está convertido
      if (toUSD) {
        el.textContent = formatUSD(cop);
      } else {
        el.textContent = formatCOP(cop);
      }
    });

    // Precio dinámico del selector de kitesurf (experiences.html)
    var kitePreview = document.getElementById("kite-total-preview");
    if (kitePreview) {
      var cop = parseCOP(kitePreview.dataset.copVal || kitePreview.textContent);
      if (!kitePreview.dataset.copVal && cop)
        kitePreview.dataset.copVal = cop;
      if (kitePreview.dataset.copVal) {
        kitePreview.textContent = toUSD
          ? formatUSD(parseInt(kitePreview.dataset.copVal))
          : formatCOP(parseInt(kitePreview.dataset.copVal));
      }
    }

    updateToggleBtn();
  }

  function updateToggleBtn() {
    var btn = document.getElementById("currency-toggle");
    if (!btn) return;
    if (current === "COP") {
      btn.innerHTML =
        '<span class="font-bold text-white">COP</span><span class="opacity-40 mx-0.5">/</span><span class="opacity-50">USD</span>';
    } else {
      btn.innerHTML =
        '<span class="opacity-50">COP</span><span class="opacity-40 mx-0.5">/</span><span class="font-bold text-yellow-400">USD</span>';
    }
  }

  // Expuesto globalmente
  window.toggleCurrency = function () {
    current = current === "COP" ? "USD" : "COP";
    localStorage.setItem(CURRENCY_KEY, current);
    // Resetear data-cop-val para que vuelva a parsear limpio en COP
    if (current === "COP") {
      document.querySelectorAll("[data-cop-val]").forEach(function (el) {
        var cop = parseInt(el.dataset.copVal);
        el.textContent = formatCOP(cop);
      });
      var kite = document.getElementById("kite-total-preview");
      if (kite && kite.dataset.copVal)
        kite.textContent = formatCOP(parseInt(kite.dataset.copVal));
    } else {
      applyDisplay();
    }
    updateToggleBtn();
  };

  window.getCurrencyRate = function () {
    return rate;
  };
  window.getCurrentCurrency = function () {
    return current;
  };

  // Parchar updateKiteTotalPreview para que respete la moneda seleccionada
  document.addEventListener("DOMContentLoaded", async function () {
    await loadRate();
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
            if (current === "USD") kite.textContent = formatUSD(cop);
          }
        }
      };
      // Lanzar una vez para inicializar
      window.updateKiteTotalPreview();
    }
  });
})();
