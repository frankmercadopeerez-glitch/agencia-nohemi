(function () {
  "use strict";

  document.documentElement.classList.add("brand-refresh-active");

  function initBrandIdentity() {
    document.querySelectorAll("nav span").forEach(function (node) {
      if (node.textContent.trim() === "Cartagena de Indias") {
        node.textContent = "Mexicana en Cartagena";
      }
    });
  }

  function initGalleryNavigation() {
    var isEnglish = (document.documentElement.lang || "es").toLowerCase().indexOf("en") === 0;
    var label = isEnglish ? "GALLERY" : "GALERÍA";

    function addLink(container, mobile) {
      if (!container || container.querySelector('a[href*="galeria"]')) return;
      var links = Array.prototype.slice.call(container.querySelectorAll("a"));
      var experiences = links.find(function (link) {
        return /experien/i.test(link.textContent || "");
      });
      var link = document.createElement("a");
      link.href = "/galeria.html";
      link.textContent = label;
      link.className = experiences && experiences.className
        ? experiences.className
        : (mobile ? "text-2xl font-bold text-white hover:text-blue-400" : "text-white hover:text-blue-400 transition");
      if (experiences) experiences.insertAdjacentElement("afterend", link);
      else container.appendChild(link);
    }

    var nav = document.querySelector("nav");
    if (!nav) return;
    addLink(nav.querySelector(".hidden.md\\:flex"), false);
    addLink(document.getElementById("mobile-menu"), true);
  }

  function removeNewsletterSections() {
    document.querySelectorAll("#newsletter-form").forEach(function (form) {
      var section = form.closest("section");
      if (section) section.remove();
      else form.remove();
    });
  }

  function initWhatsAppMessages() {
    var nativeOpen = window.open.bind(window);
    var clickContext = "";

    function cleanLabel(value) {
      return String(value || "")
        .replace(/\s+/g, " ")
        .replace(/^[\s\-–—:|]+|[\s\-–—:|]+$/g, "")
        .trim()
        .slice(0, 140);
    }

    function normalize(value) {
      return cleanLabel(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
    }

    function pageContext(trigger) {
      var scope = trigger && trigger.closest
        ? trigger.closest("[data-experience-name], [data-tour-name], article, .experience-card, .tour-card, .package-card, .day-card")
        : null;
      var explicit = scope && (scope.getAttribute("data-experience-name") || scope.getAttribute("data-tour-name"));
      var scopedTitle = scope && scope.querySelector("h2, h3, h4, [data-title], .title");
      var heading = document.querySelector("main h1, body > header h1, h1");
      var title = cleanLabel(explicit || (scopedTitle && scopedTitle.textContent) || clickContext || (heading && heading.textContent));

      if (!title || /^(inicio|contacto|tu carrito|arma tu viaje|dunas\s*&\s*olas)$/i.test(title)) {
        title = cleanLabel(document.title.split("|")[0].split("–")[0]);
      }
      return title || "las experiencias en Cartagena";
    }

    function personalizedMessage(original, trigger) {
      var context = pageContext(trigger);
      var base = "Hola, vengo desde la web de Dunas y Olas y quiero más información sobre " + context + ".";
      var detail = cleanLabel(String(original || "")
        .replace(/^hola[,!\s]*/i, "")
        .replace(/^vengo desde la web de dunas y olas[^.]*\.?/i, ""));

      if (!detail || /^(quiero|quisiera|me gustar[ií]a)\s+m[aá]s informaci[oó]n\.?$/i.test(detail)) return base;
      var contextKey = normalize(context);
      var detailKey = normalize(detail);
      if (contextKey && detailKey.indexOf(contextKey) !== -1 && detailKey.length < contextKey.length + 55) return base;
      return base + "\n\nDetalle de mi consulta: " + detail;
    }

    function personalizeUrl(rawUrl, trigger) {
      try {
        var url = new URL(String(rawUrl), window.location.href);
        if (!/(^|\.)wa\.me$|(^|\.)api\.whatsapp\.com$/i.test(url.hostname)) return rawUrl;
        var original = url.searchParams.get("text") || "";
        if (/^Hola, vengo desde la web de Dunas y Olas/i.test(original)) return url.toString();
        url.searchParams.set("text", personalizedMessage(original, trigger));
        return url.toString();
      } catch (_error) {
        return rawUrl;
      }
    }

    document.addEventListener("click", function (event) {
      var trigger = event.target.closest("a, button");
      if (!trigger) return;
      var nearbyTitle = trigger.closest("article, .experience-card, .tour-card, .package-card, .day-card");
      var heading = nearbyTitle && nearbyTitle.querySelector("h2, h3, h4, [data-title], .title");
      clickContext = cleanLabel(heading && heading.textContent);
      window.setTimeout(function () { clickContext = ""; }, 1000);

      if (trigger.tagName === "A" && trigger.href && /wa\.me|api\.whatsapp\.com/i.test(trigger.href)) {
        trigger.href = personalizeUrl(trigger.href, trigger);
      }
    }, true);

    window.open = function (url, target, features) {
      return nativeOpen(personalizeUrl(url, document.activeElement), target, features);
    };
  }

  function addMarineSectionTransitions() {
    function solidBackground(node, fallback) {
      var current = node;
      while (current && current !== document.documentElement) {
        var styles = getComputedStyle(current);
        var color = styles.backgroundColor;
        if (color && color !== "rgba(0, 0, 0, 0)" && color !== "transparent") return color;
        if (styles.backgroundImage && styles.backgroundImage !== "none") {
          var gradientColors = styles.backgroundImage.match(/rgba?\([^\)]+\)/g) || [];
          var gradientColor = gradientColors.find(function (candidate) {
            return !/rgba\([^\)]+,\s*0(?:\.0+)?\s*\)/.test(candidate);
          });
          if (gradientColor) return gradientColor;
        }
        current = current.parentElement;
      }
      return fallback;
    }

    var sections = Array.prototype.slice.call(document.querySelectorAll("body > section, main > section"));
    sections.forEach(function (section) {
      var previous = section.previousElementSibling;
      if (!previous || previous.classList.contains("dyo-wave-divider")) return;
      if (!(previous.matches("section") || previous.matches("header") || previous.matches("main"))) return;

      var previousColor = solidBackground(previous, "#10293a");
      var nextColor = solidBackground(section, "#fffdf9");
      if (previousColor === nextColor) return;

      var wave = document.createElement("div");
      wave.className = "dyo-wave-divider";
      wave.setAttribute("aria-hidden", "true");
      wave.style.setProperty("--dyo-wave-from", previousColor);
      wave.style.setProperty("--dyo-wave-to", nextColor);
      wave.innerHTML = '<svg viewBox="0 0 1440 70" preserveAspectRatio="none"><rect width="1440" height="70"/><path d="M0 40C120 20 240 20 360 40s240 20 360 0 240-20 360 0 240 20 360 0v30H0Z"/></svg>';
      section.before(wave);
    });
  }

  function initReveal() {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var nodes = document.querySelectorAll("main section, body > section, article");
    nodes.forEach(function (node) { node.classList.add("reveal-ready"); });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -5%", threshold: 0.001 });
    nodes.forEach(function (node) { observer.observe(node); });
  }

  function initGallery() {
    var tiles = document.querySelectorAll("[data-gallery-src]");
    if (!tiles.length) return;
    var box = document.createElement("div");
    box.className = "gallery-lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Vista ampliada de la galería");
    box.innerHTML = '<button type="button" aria-label="Cerrar galería">&times;</button><img alt="" />';
    document.body.appendChild(box);
    var image = box.querySelector("img");
    var close = box.querySelector("button");
    function hide() { box.classList.remove("is-open"); document.body.style.overflow = ""; }
    tiles.forEach(function (tile) {
      tile.setAttribute("tabindex", "0");
      tile.setAttribute("role", "button");
      tile.setAttribute("aria-label", "Ver " + (tile.getAttribute("data-label") || "fotografía") + " en tamaño completo");
      function show() {
        image.src = tile.getAttribute("data-gallery-src");
        image.alt = tile.querySelector("img")?.alt || "Fotografía de una experiencia en Cartagena";
        box.classList.add("is-open");
        document.body.style.overflow = "hidden";
        close.focus();
      }
      tile.addEventListener("click", show);
      tile.addEventListener("keydown", function (event) { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); show(); } });
    });
    close.addEventListener("click", hide);
    box.addEventListener("click", function (event) { if (event.target === box) hide(); });
    document.addEventListener("keydown", function (event) { if (event.key === "Escape") hide(); });
  }

  if (document.readyState === "loading") {
    initWhatsAppMessages();
    document.addEventListener("DOMContentLoaded", function () { initBrandIdentity(); initGalleryNavigation(); removeNewsletterSections(); addMarineSectionTransitions(); initReveal(); initGallery(); });
  } else {
    initWhatsAppMessages();
    initBrandIdentity(); initGalleryNavigation(); removeNewsletterSections(); addMarineSectionTransitions(); initReveal(); initGallery();
  }
})();
