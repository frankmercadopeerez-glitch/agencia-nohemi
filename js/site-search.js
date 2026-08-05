(function () {
  "use strict";
  var input = document.getElementById("site-search");
  var results = document.getElementById("site-search-results");
  if (!input || !results) return;
  var index = [];
  function normalize(value) { return String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
  function close() { results.classList.add("hidden"); input.setAttribute("aria-expanded", "false"); }
  function render() {
    var query = normalize(input.value.trim());
    if (query.length < 2) { close(); return; }
    var terms = query.split(/\s+/).filter(Boolean);
    var matches = index.filter(function (item) {
      var haystack = normalize(item.title + " " + item.description + " " + item.keywords);
      return terms.every(function (term) { return haystack.indexOf(term) !== -1; });
    }).slice(0, 8);
    results.innerHTML = "";
    if (!matches.length) {
      results.innerHTML = '<div class="site-search-result"><strong>Sin coincidencias</strong><span>Prueba con isla, Barú, playa, kitesurf, comida o Cartagena.</span></div>';
    } else {
      matches.forEach(function (item) {
        var link = document.createElement("a"); link.className = "site-search-result"; link.href = item.url; link.setAttribute("role", "option");
        var title = document.createElement("strong"); title.textContent = item.title;
        var description = document.createElement("span"); description.textContent = item.description;
        link.appendChild(title); link.appendChild(description); results.appendChild(link);
      });
    }
    results.classList.remove("hidden"); input.setAttribute("aria-expanded", "true");
  }
  fetch("/search-index.json").then(function (response) { return response.json(); }).then(function (data) {
    index = Array.isArray(data) ? data : []; input.addEventListener("input", render); input.addEventListener("focus", render);
  }).catch(function () { input.placeholder = "Busca experiencias en nuestro catálogo"; });
  document.addEventListener("click", function (event) { if (!event.target.closest(".site-search-shell")) close(); });
  input.addEventListener("keydown", function (event) { if (event.key === "Escape") close(); });
})();
