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
    document.addEventListener("DOMContentLoaded", function () { initBrandIdentity(); initReveal(); initGallery(); });
  } else {
    initBrandIdentity(); initReveal(); initGallery();
  }
})();
