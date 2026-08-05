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

  function addMarineSectionTransitions() {
    var sections = Array.prototype.slice.call(document.querySelectorAll("body > section, main > section"));
    sections.forEach(function (section) {
      var previous = section.previousElementSibling;
      if (!previous || previous.classList.contains("dyo-wave-divider")) return;
      if (!(previous.matches("section") || previous.matches("header") || previous.matches("main"))) return;

      var nextColor = getComputedStyle(section).backgroundColor;
      if (!nextColor || nextColor === "rgba(0, 0, 0, 0)") return;

      var wave = document.createElement("div");
      wave.className = "dyo-wave-divider";
      wave.setAttribute("aria-hidden", "true");
      wave.style.setProperty("--dyo-wave-color", nextColor);
      wave.innerHTML = '<svg class="dyo-wave-back" viewBox="0 0 1440 70" preserveAspectRatio="none"><path d="M0 31C180 66 360 3 540 34c180 31 360-29 540 1 180 30 270-15 360-4v39H0Z"/></svg><svg class="dyo-wave-front" viewBox="0 0 1440 70" preserveAspectRatio="none"><path d="M0 39c120-25 240-25 360 0s240 25 360 0 240-25 360 0 240 25 360 0v31H0Z"/></svg>';
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
    document.addEventListener("DOMContentLoaded", function () { initBrandIdentity(); initGalleryNavigation(); removeNewsletterSections(); addMarineSectionTransitions(); initReveal(); initGallery(); });
  } else {
    initBrandIdentity(); initGalleryNavigation(); removeNewsletterSections(); addMarineSectionTransitions(); initReveal(); initGallery();
  }
})();
