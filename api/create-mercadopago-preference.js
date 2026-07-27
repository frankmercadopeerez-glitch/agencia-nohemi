const { TOURS } = require("../js/cart.js");

const MAX_ITEMS = 20;
const MAX_QTY = 20;
const KITESURF_COUPLE_DISCOUNT = 0.1;

function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  return res.end(JSON.stringify(body));
}

function parseBody(body) {
  if (!body) return {};
  if (typeof body === "string") return JSON.parse(body);
  return body;
}

function cleanText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function buildItems(cart) {
  if (!cart || typeof cart !== "object" || Array.isArray(cart)) {
    throw new Error("El carrito no es válido.");
  }

  const entries = Object.entries(cart);
  if (entries.length === 0 || entries.length > MAX_ITEMS) {
    throw new Error("El carrito está vacío o supera el límite permitido.");
  }

  return entries.map(([id, rawValue]) => {
    const tour = TOURS[id];
    if (!tour) throw new Error(`La experiencia ${id} no está disponible.`);

    const qty =
      typeof rawValue === "object" && rawValue
        ? Number(rawValue.qty)
        : Number(rawValue);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
      throw new Error(`La cantidad de ${tour.name} no es válida.`);
    }

    const isCoupleCourse = id.startsWith("kitesurf_") && qty === 2;
    const unitPrice = isCoupleCourse
      ? Math.round(tour.price * (1 - KITESURF_COUPLE_DISCOUNT))
      : tour.price;

    return {
      id,
      title: tour.name.slice(0, 120),
      description: `Reserva con Dunas & Olas · ${tour.unit}`.slice(0, 256),
      quantity: qty,
      currency_id: "COP",
      unit_price: unitPrice,
    };
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Método no permitido." });
  }

  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!accessToken) {
    return json(res, 503, {
      code: "mercadopago_not_configured",
      error: "Mercado Pago todavía no está activado.",
    });
  }

  try {
    const body = parseBody(req.body);
    const customer = body.customer || {};
    const name = cleanText(customer.name, 100);
    const email = cleanText(customer.email, 150);
    const phone = cleanText(customer.phone, 40);

    if (!name || !email || !phone || !email.includes("@")) {
      return json(res, 400, {
        error: "Completa nombre, correo y teléfono antes de pagar.",
      });
    }

    const items = buildItems(body.cart);
    const reference = `DYO-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase()}`;
    const siteUrl = process.env.PUBLIC_SITE_URL || "https://dunasyolas.com";
    const preference = {
      items,
      payer: { name, email },
      external_reference: reference,
      back_urls: {
        success: `${siteUrl}/pago-resultado?status=approved`,
        pending: `${siteUrl}/pago-resultado?status=pending`,
        failure: `${siteUrl}/pago-resultado?status=failure`,
      },
      auto_return: "approved",
      metadata: {
        customer_phone: phone,
        travel_date: cleanText(customer.date, 20),
        travelers: cleanText(customer.people, 4),
        notes: cleanText(customer.notes, 250),
      },
    };

    if (process.env.MERCADO_PAGO_WEBHOOK_URL) {
      preference.notification_url = process.env.MERCADO_PAGO_WEBHOOK_URL;
    }

    const mpResponse = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Idempotency-Key": reference,
        },
        body: JSON.stringify(preference),
      }
    );
    const result = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error("Mercado Pago preference error", {
        status: mpResponse.status,
        message: result.message,
        cause: result.cause,
      });
      return json(res, 502, {
        error: "Mercado Pago no pudo preparar el pago en este momento.",
      });
    }

    const useSandbox = process.env.MERCADO_PAGO_ENV === "test";
    const checkoutUrl = useSandbox
      ? result.sandbox_init_point
      : result.init_point;

    return json(res, 200, {
      preferenceId: result.id,
      checkoutUrl,
      externalReference: reference,
    });
  } catch (error) {
    return json(res, 400, {
      error: error.message || "No fue posible preparar el pago.",
    });
  }
};

