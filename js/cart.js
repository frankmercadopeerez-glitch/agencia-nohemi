/* ======================================================
   CARRITO DE COMPRAS COMPARTIDO — Dunas & Olas
   Catálogo único de experiencias, cursos, botes y
   adicionales. Se usa en experiences.html y fleet.html
   para que el carrito (guardado en localStorage) se vea
   igual sin importar desde qué página se agregó un ítem.

   Para ajustar precios, edita el objeto TOURS de abajo.
   ====================================================== */

const TOURS = {
  /* ---- Experiencias ---- */
  citytour: {
    name: "City Tour Histórico por Cartagena",
    price: 90000,
    unit: "persona",
  },
  acuario: {
    name: "Acuario & Vida Marina (Islas del Rosario)",
    price: 80000,
    unit: "persona",
  },
  pasadia: {
    name: "Pasadía Islas del Rosario (Sunny Day)",
    price: 180000,
    unit: "persona",
  },
  atardecer: {
    name: "Atardeceres Mágicos en la Bahía",
    price: 120000,
    unit: "persona",
  },
  buceo: {
    name: "Buceo y Snorkel: Aventura Submarina",
    price: 250000,
    unit: "persona",
  },
  kitesurf: {
    name: "Kitesurf y Deportes Acuáticos",
    price: 200000,
    unit: "clase",
  },
  paracaidismo: {
    name: "Salto en Paracaídas sobre el Mar Caribe",
    price: 980000,
    unit: "persona",
  },
  citybahia: {
    name: "City Bahía de ROA (con almuerzo y atardecer)",
    price: 195000,
    unit: "persona",
  },
  yate: {
    name: "Tour Bahía en Yate (Luna Mía)",
    price: 120000,
    unit: "persona",
  },
  yate_noche: {
    name: "Tour Nocturno en Yate – Luna Mía (7pm–9pm o 9pm–11pm)",
    price: 120000,
    unit: "persona",
  },
  catamaran_noche: {
    name: "Tour Nocturno en Catamarán (7pm–9pm o 9pm–11pm)",
    price: 150000,
    unit: "persona",
  },
  chiva: {
    name: "Chiva Rumbera (con discoteca Taboo)",
    price: 45000,
    unit: "persona",
  },
  playablanca: {
    name: "Puerto Medallo – Playa Blanca, Barú",
    price: 190000,
    unit: "persona",
  },
  medalloislas: {
    name: "Puerto Medallo + Islas + Mapaches y Snorkel",
    price: 290000,
    unit: "persona",
  },
  cabalgata: {
    name: "Cabalgata en la Playa (La Boquilla)",
    price: 160000,
    unit: "persona",
  },
  poloaviario: {
    name: "Barú – Polo Beach + Aviario Nacional",
    price: 240000,
    unit: "persona",
  },
  polobeach: {
    name: "Barú – Playa Tranquila Polo Beach",
    price: 160000,
    unit: "persona",
  },
  bqcartagena: {
    name: "City Tour Barranquilla + Cartagena",
    price: 350000,
    unit: "persona",
  },
  bqsantamarta: {
    name: "City Tour Barranquilla + Santa Marta",
    price: 260000,
    unit: "persona",
  },
  citytour_roa: {
    name: "City Tours de Roa – Recorrido Histórico con Almuerzo",
    price: 140000,
    unit: "persona",
  },
  catamaran: {
    name: "Catamarán Atardecer – Membresía Plata",
    price: 150000,
    unit: "persona",
  },

  atv: {
    name: "Cartagena ATV Tour – Cuatrimotos, Playa y Montañas (2.5 h)",
    price: 220000,
    unit: "persona",
  },
  tirolesa: {
    name: "Tour de Tirolesa – 5 Tirolesas con Vistas al Mar (2 h)",
    price: 200000,
    unit: "persona",
  },
  tamarindo: {
    name: "Tamarindo Beach House – Pasadía en Tierra Bomba",
    price: 190000,
    unit: "persona",
  },
  namaste: {
    name: "Namaste – Experiencia Holística en Tierra Bomba",
    price: 220000,
    unit: "persona",
  },

  /* ---- Cursos de Kitesurf (precio base, 1 persona) ---- */
  kitesurf_iniciacion: {
    name: 'Kitesurf — Clase de Iniciación (2 horas)',
    price: 750000,
    unit: "persona",
  },
  kitesurf_refuerzo: {
    name: "Kitesurf — Clase de Refuerzo (1 hora)",
    price: 400000,
    unit: "persona",
  },
  kitesurf_grupal: {
    name: "Kitesurf — Clase Grupal",
    price: 320000,
    unit: "persona",
  },
  kitesurf_foil: {
    name: "Kitesurf — Kite Foil (sesión)",
    price: 570000,
    unit: "persona",
  },
  kitesurf_rider: {
    name: 'Kitesurf — Curso Completo "Rider" (8 horas)',
    price: 2850000,
    unit: "persona",
  },
  kitesurf_avanzado: {
    name: "Kitesurf — Curso Avanzado (10 horas)",
    price: 3450000,
    unit: "persona",
  },
  kitesurf_elite: {
    name: "Kitesurf — Experiencia Elite VIP (12 horas)",
    price: 3990000,
    unit: "persona",
  },

  /* ---- Kitesurf: aventuras y alquileres ---- */
  kitesurf_wingfoil: {
    name: "Kitesurf — Clase de Wing Foil (1 hora)",
    price: 400000,
    unit: "hora",
  },
  kitesurf_sup: {
    name: "Alquiler de Tabla SUP (Stand Up Paddle)",
    price: 100000,
    unit: "hora",
  },
  kitesurf_downwind: {
    name: "Kitesurf — Expedición Downwind (Barú-Rosario)",
    price: 1250000,
    unit: "persona",
  },
  kitesurf_fotos: {
    name: "Kitesurf — Sesión de Fotos Profesional",
    price: 150000,
    unit: "sesión",
  },
  kitesurf_alquiler_supervisado: {
    name: "Kitesurf — Alquiler de Equipo + Supervisión",
    price: 250000,
    unit: "hora",
  },
  kitesurf_alquiler_equipo: {
    name: "Kitesurf — Alquiler de Equipo Completo",
    price: 200000,
    unit: "hora",
  },
  kitesurf_supervision: {
    name: "Kitesurf — Supervisión en Playa (equipo propio)",
    price: 100000,
    unit: "hora",
  },

  /* ---- Flotilla: alquiler de botes (precio por día) ---- */
  bote_interceptor: {
    name: "Alquiler Interceptor 38'",
    price: 3200000,
    unit: "día completo",
  },
  bote_laleona: {
    name: "Alquiler La Leona",
    price: 3600000,
    unit: "día completo",
  },
  bote_oly420: {
    name: "Alquiler Oly 420",
    price: 3800000,
    unit: "día completo",
  },
  bote_vicky420: {
    name: "Alquiler Vicky 420",
    price: 3800000,
    unit: "día completo",
  },
  bote_virginia420: {
    name: "Alquiler Virginia 420",
    price: 3900000,
    unit: "día completo",
  },

  /* ---- Adicionales a bordo ---- */
  addon_comida: {
    name: "Comida típica para tu grupo (por persona)",
    price: 35000,
    unit: "persona",
  },
  addon_quesos: {
    name: "Tabla de quesos y embutidos",
    price: 180000,
    unit: "tabla",
  },
  addon_picada: {
    name: "Picada criolla o de mariscos",
    price: 220000,
    unit: "porción",
  },
};

const CART_KEY = "dunas-olas-cart";
const COUPLE_DISCOUNT = 0.1; // 10% de descuento al reservar un curso en pareja

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function formatCOP(amount) {
  return (
    "$" +
    Math.round(amount).toLocaleString("es-CO", { maximumFractionDigits: 0 }) +
    " COP"
  );
}

/* Formatea un monto (en COP) según la moneda seleccionada en el
   selector de moneda (COP/USD/MXN, ver js/currency.js). Si ese
   script no está disponible, se muestra siempre en COP. */
function displayAmount(amount) {
  if (typeof window.formatPrice === "function") {
    return window.formatPrice(amount);
  }
  return formatCOP(amount);
}

/* Una entrada del carrito puede ser:
   - un número  -> cantidad de un ítem del catálogo TOURS
   - un objeto  -> { qty, name, unitPrice, unitLabel } para
                   ítems con precio calculado (p.ej. cursos
                   reservados para 2 personas con descuento) */
function entryDetails(id, value) {
  if (typeof value === "number") {
    const tour = TOURS[id];
    if (!tour) return null;
    return {
      name: tour.name,
      unitPrice: tour.price,
      unitLabel: tour.unit,
      qty: value,
      custom: false,
    };
  }
  if (value && typeof value === "object" && value.qty > 0) {
    return {
      name: value.name,
      unitPrice: value.unitPrice,
      unitLabel: value.unitLabel || "",
      qty: value.qty,
      custom: true,
    };
  }
  return null;
}

function addToCart(tourId, btnEl) {
  const cart = loadCart();
  const current = cart[tourId];
  if (typeof current === "object" && current) {
    current.qty += 1;
  } else {
    cart[tourId] = (current || 0) + 1;
  }
  saveCart(cart);
  renderCart();
  toggleCart(true);
  flashAdded(btnEl);
}

/* Agrega un ítem con precio calculado dinámicamente, por
   ejemplo un curso de kitesurf reservado para 2 personas
   con el descuento de pareja ya aplicado. */
function addCustomToCart(id, name, unitPrice, unitLabel, qty, btnEl) {
  const cart = loadCart();
  const current = cart[id];
  if (current && typeof current === "object") {
    current.qty += qty;
    current.unitPrice = unitPrice;
    current.name = name;
    current.unitLabel = unitLabel;
  } else {
    cart[id] = { qty, name, unitPrice, unitLabel };
  }
  saveCart(cart);
  renderCart();
  toggleCart(true);
  flashAdded(btnEl);
}

function flashAdded(btnEl) {
  if (!btnEl) return;
  const original = btnEl.innerHTML;
  btnEl.classList.add("added");
  btnEl.innerHTML = '<i class="fas fa-check"></i> Agregado';
  setTimeout(() => {
    btnEl.classList.remove("added");
    btnEl.innerHTML = original;
  }, 1400);
}

function changeQty(id, delta) {
  const cart = loadCart();
  const value = cart[id];
  if (value === undefined) return;

  if (typeof value === "object" && value) {
    value.qty += delta;
    if (value.qty <= 0) delete cart[id];
  } else {
    cart[id] = (value || 0) + delta;
    if (cart[id] <= 0) delete cart[id];
  }
  saveCart(cart);
  renderCart();
}

function removeFromCart(id) {
  const cart = loadCart();
  delete cart[id];
  saveCart(cart);
  renderCart();
}

function cartEntries(cart) {
  return Object.entries(cart)
    .map(([id, value]) => [id, entryDetails(id, value)])
    .filter(([, details]) => details !== null);
}

function cartTotal(cart) {
  return cartEntries(cart).reduce(
    (sum, [, d]) => sum + d.unitPrice * d.qty,
    0
  );
}

function cartItemCount(cart) {
  return cartEntries(cart).reduce((sum, [, d]) => sum + d.qty, 0);
}

function renderCart() {
  const cart = loadCart();
  const itemsEl = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const badgeEl = document.getElementById("cart-badge");
  const checkoutBtn = document.getElementById("cart-checkout-btn");
  if (!itemsEl || !totalEl || !badgeEl || !checkoutBtn) return;

  const entries = cartEntries(cart);

  if (entries.length === 0) {
    itemsEl.innerHTML =
      '<div class="text-center text-gray-400 py-16">' +
      '<i class="fas fa-shopping-cart text-4xl mb-3"></i>' +
      "<p>Tu carrito está vacío.<br/>Agrega una experiencia, curso o bote para comenzar.</p>" +
      "</div>";
    checkoutBtn.disabled = true;
    checkoutBtn.classList.add("opacity-50", "cursor-not-allowed");
  } else {
    itemsEl.innerHTML = entries
      .map(([id, d]) => {
        const subtotal = d.unitPrice * d.qty;
        const unitLabel = d.unitLabel ? ` / ${d.unitLabel}` : "";
        return (
          '<div class="cart-line">' +
          '<div class="flex-1">' +
          `<p class="font-semibold text-gray-900 text-sm">${d.name}</p>` +
          `<p class="text-xs text-gray-400 mb-2">${displayAmount(d.unitPrice)}${unitLabel}</p>` +
          '<div class="flex items-center gap-2">' +
          `<button class="cart-qty-btn" onclick="changeQty('${id}', -1)">−</button>` +
          `<span class="text-sm font-bold w-6 text-center">${d.qty}</span>` +
          `<button class="cart-qty-btn" onclick="changeQty('${id}', 1)">+</button>` +
          `<button class="text-xs text-red-400 hover:text-red-600 ml-3" onclick="removeFromCart('${id}')"><i class="fas fa-trash-alt"></i></button>` +
          "</div>" +
          "</div>" +
          `<div class="font-bold text-[#3F2761] text-sm whitespace-nowrap">${displayAmount(subtotal)}</div>` +
          "</div>"
        );
      })
      .join("");
    checkoutBtn.disabled = false;
    checkoutBtn.classList.remove("opacity-50", "cursor-not-allowed");
  }

  const total = cartTotal(cart);
  const count = cartItemCount(cart);
  totalEl.textContent = displayAmount(total);

  if (count > 0) {
    badgeEl.textContent = count;
    badgeEl.classList.remove("hidden");
  } else {
    badgeEl.classList.add("hidden");
  }
}

function toggleCart(open) {
  const overlay = document.getElementById("cart-overlay");
  const drawer = document.getElementById("cart-drawer");
  if (!overlay || !drawer) return;
  if (open) {
    overlay.classList.add("active");
    drawer.classList.add("active");
  } else {
    overlay.classList.remove("active");
    drawer.classList.remove("active");
  }
}

/* ── Checkout ─────────────────────────────── */
function buildOrderSummary() {
  const cart = loadCart();
  const entries = cartEntries(cart);
  const lines = entries.map(([, d]) => {
    const unitLabel = d.unitLabel ? ` / ${d.unitLabel}` : "";
    return `${d.qty} x ${d.name} (${displayAmount(d.unitPrice)}${unitLabel}) = ${displayAmount(d.unitPrice * d.qty)}`;
  });
  return { entries, lines, total: cartTotal(cart) };
}

function renderCheckoutSummary() {
  const summaryEl = document.getElementById("checkout-summary");
  if (!summaryEl) return;
  const { entries, lines, total } = buildOrderSummary();
  if (entries.length === 0) return;

  summaryEl.innerHTML =
    lines.map((l) => `<div>${l}</div>`).join("") +
    `<div class="font-bold text-[#3F2761] pt-2 mt-2 border-t border-gray-200">Total estimado: ${displayAmount(total)}</div>`;
}

function openCheckout() {
  const { entries } = buildOrderSummary();
  if (entries.length === 0) return;

  renderCheckoutSummary();
  document.getElementById("checkout-overlay").classList.add("active");
}

function closeCheckout() {
  document.getElementById("checkout-overlay").classList.remove("active");
}

function getCheckoutFormData() {
  return {
    name: document.getElementById("ck-name").value.trim(),
    phone: document.getElementById("ck-phone").value.trim(),
    email: document.getElementById("ck-email").value.trim(),
    date: document.getElementById("ck-date").value,
    people: document.getElementById("ck-people").value || "1",
    notes: document.getElementById("ck-notes").value.trim(),
  };
}

function validateCheckoutForm(data) {
  if (!data.name || !data.phone || !data.email) {
    alert(
      "Por favor completa al menos tu nombre, WhatsApp y correo electrónico para continuar."
    );
    return false;
  }
  return true;
}

function checkoutViaWhatsApp() {
  const data = getCheckoutFormData();
  if (!validateCheckoutForm(data)) return;

  const { lines, total } = buildOrderSummary();
  const currency =
    typeof window.getCurrentCurrency === "function"
      ? window.getCurrentCurrency()
      : "COP";
  const totalLine =
    currency === "COP"
      ? `Total estimado: ${formatCOP(total)}`
      : `Total estimado: ${displayAmount(total)} (${formatCOP(total)})`;
  const message =
    `Hola, quiero confirmar mi reserva con Dunas & Olas:\n\n` +
    lines.join("\n") +
    `\n\n${totalLine}\n\n` +
    `Nombre: ${data.name}\n` +
    `WhatsApp/Teléfono: ${data.phone}\n` +
    `Correo: ${data.email}\n` +
    (data.date ? `Fecha deseada: ${data.date}\n` : "") +
    `Número de personas: ${data.people}\n` +
    (data.notes ? `Notas: ${data.notes}\n` : "");

  openWhatsApp(message);
}

function payWithMercadoPago() {
  const data = getCheckoutFormData();
  if (!validateCheckoutForm(data)) return;

  /*
    EJEMPLO DE INTEGRACIÓN — Checkout Pro de Mercado Pago
    (https://www.mercadopago.com.mx/developers)
    ------------------------------------------------------------------
    Mercado Pago procesa el pago mediante una "preferencia" (preference):
    un objeto con los ítems, el monto y las URLs de retorno, que se debe
    crear desde un servidor usando el Access Token PRIVADO del comercio
    (nunca debe exponerse en el navegador). El servidor devuelve un
    "preference id" (o "init_point") que el frontend usa para abrir el
    Checkout, ya sea con el SDK de JS o redirigiendo directamente.

    Pasos para activar pagos reales aquí:
      1. Reemplaza MERCADOPAGO_PUBLIC_KEY con la Public Key del comercio
         (panel de Mercado Pago > Tus integraciones > Credenciales).
      2. Crea un endpoint en tu servidor (o función serverless) que,
         usando el Access Token privado, llame a la API de Mercado Pago
         (POST https://api.mercadopago.com/checkout/preferences) con los
         datos del carrito (buildOrderSummary()) y devuelva el
         "preference id" generado.
      3. Incluye el SDK de Mercado Pago en la página:
         <script src="https://sdk.mercadopago.com/js/v2"></script>
      4. Sustituye la simulación de abajo por la inicialización real:

         const mp = new MercadoPago('MERCADOPAGO_PUBLIC_KEY', { locale: 'es-CO' });
         const preferenceId = await fetch('/api/crear-preferencia', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ items: entries, total, customer: data }),
         }).then((r) => r.json());
         mp.checkout({ preference: { id: preferenceId.id }, autoOpen: true });

    Mientras tanto, dejamos el botón visible con esta explicación y
    ofrecemos la confirmación por WhatsApp como vía de pago manual.
  */
  const MERCADOPAGO_PUBLIC_KEY = "MERCADOPAGO_PUBLIC_KEY"; // <-- reemplazar con la Public Key real del comercio

  if (MERCADOPAGO_PUBLIC_KEY === "MERCADOPAGO_PUBLIC_KEY") {
    alert(
      "El pago en línea con Mercado Pago está casi listo: solo falta " +
        "conectar la Public Key del comercio y el endpoint que crea la " +
        "preferencia de pago (panel de Mercado Pago). Mientras tanto, " +
        "puedes confirmar y pagar tu reserva directamente con Nohemi por WhatsApp."
    );
    checkoutViaWhatsApp();
    return;
  }

  // Aquí iría la apertura real del Checkout de Mercado Pago una vez
  // configurada la Public Key y el endpoint que crea la preferencia.
}

window.renderCheckoutSummary = renderCheckoutSummary;

document.addEventListener("DOMContentLoaded", renderCart);
