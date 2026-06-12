(function () {
  if (localStorage.getItem("nohemi_cookie_consent")) return;

  var isEnglish = document.documentElement.lang === "en";
  var privacyHref = isEnglish ? "/en/privacy.html" : "/privacy.html";

  var banner = document.createElement("div");
  banner.id = "cookie-consent-banner";
  banner.style.cssText =
    "position:fixed;bottom:0;left:0;right:0;z-index:9999;background:#2A1A40;color:#fff;padding:14px 16px;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:12px;font-family:'Montserrat',sans-serif;font-size:13px;line-height:1.5;box-shadow:0 -2px 12px rgba(0,0,0,0.25);";

  if (isEnglish) {
    banner.innerHTML =
      '<span style="max-width:640px;text-align:center;">We use our own and third-party cookies to improve your experience, remember your preferences (such as currency) and analyze browsing. By continuing, you accept our <a href="' +
      privacyHref +
      '" style="color:#C9A227;text-decoration:underline;">Privacy Policy</a>.</span>' +
      '<button id="cookie-consent-accept" type="button" style="background:#C9A227;color:#2A1A40;border:none;padding:10px 22px;border-radius:6px;font-weight:700;cursor:pointer;font-size:13px;white-space:nowrap;">Accept</button>';
  } else {
    banner.innerHTML =
      '<span style="max-width:640px;text-align:center;">Usamos cookies propias y de terceros para mejorar tu experiencia, recordar tus preferencias (como la moneda) y analizar la navegación. Al continuar, aceptas nuestra <a href="' +
      privacyHref +
      '" style="color:#C9A227;text-decoration:underline;">Política de Privacidad</a>.</span>' +
      '<button id="cookie-consent-accept" type="button" style="background:#C9A227;color:#2A1A40;border:none;padding:10px 22px;border-radius:6px;font-weight:700;cursor:pointer;font-size:13px;white-space:nowrap;">Aceptar</button>';
  }

  document.body.appendChild(banner);

  document.getElementById("cookie-consent-accept").addEventListener("click", function () {
    localStorage.setItem("nohemi_cookie_consent", "true");
    banner.remove();
  });
})();
