# Reglas para crear la versión en inglés del sitio (carpeta `en/`)

Este es un sitio estático de turismo (Agencia Nohemi Tours, Cartagena, Colombia).
Vamos a crear una copia en inglés de cada página bajo `en/`, manteniendo la
misma estructura de carpetas relativa (ej: `blog/foo/index.html` ->
`en/blog/foo/index.html`).

Para cada archivo asignado:

## 1. Traducción de contenido
Traduce TODO el texto visible para el usuario a inglés natural y profesional
(turístico, cálido, no robótico):
- `<title>`, meta `description`, OG/Twitter `title`/`description`
- Encabezados, párrafos, listas, botones, labels de formularios, placeholders
- Atributos `alt`, `title`, `aria-label`
- Textos dentro de JSON-LD (`description`, `name` de servicios/FAQ, preguntas
  y respuestas de FAQPage, etc.) — pero NO traduzcas campos estructurales
  como `@type`, `@id`, claves JSON, ni datos como teléfono/dirección/coordenadas.
- Mensajes pre-llenados de WhatsApp (los strings que se pasan a `openWhatsApp(...)`)
  — tradúcelos a inglés natural también.
- Textos del banner de cookies, newsletter, FAQ accordion, etc.

**NO traduzcas / deja igual:**
- Nombres propios: "Agencia Nohemi Tours", "Nohemi", nombres de botes
  ("Interceptor 38'", "La Leona", "Oly 420", "Vicky 420", "Virginia 420"),
  nombres de lugares ("Cartagena", "Islas del Rosario", "Bocagrande", "La Boquilla",
  "Manga", "Bolívar"), direcciones, teléfonos, coordenadas, precios (formato COP).
- Clases CSS, IDs, atributos `data-*`, estructura HTML, lógica `<script>`,
  rutas de JSON-LD `@graph`, el script de Google Analytics (deja `G-XXXXXXXXXX` tal cual).
- El toggle de moneda COP/USD (js/currency.js) — no lo modifiques.

## 2. `<html lang="...">`
Cambia `<html lang="es">` por `<html lang="en">`.

## 3. Rutas de assets (imágenes, CSS, JS, favicons)
Como el archivo nuevo vive un nivel más profundo (dentro de `en/`), TODA
referencia a `images/...`, `css/...`, `js/...` (rutas relativas a la raíz del
sitio) necesita UN `../` ADICIONAL al inicio.

Ejemplos:
- En `index.html` (raíz): `src="images/foo.jpg"` -> en `en/index.html`:
  `src="../images/foo.jpg"`
- En `blog/index.html`: `src="../images/foo.jpg"` -> en `en/blog/index.html`:
  `src="../../images/foo.jpg"`
- En `blog/slug/index.html`: `src="../../images/foo.jpg"` -> en
  `en/blog/slug/index.html`: `src="../../../images/foo.jpg"`

La misma regla aplica a `href="css/..."`, `src="js/..."`, `href="images/favicon..."`, etc.
Los CDNs externos (https://cdn.tailwindcss.com, fonts.googleapis.com, etc.) NO cambian.

## 4. Enlaces entre páginas (.html)
Los enlaces relativos a OTRAS páginas HTML (ej: `href="fleet.html"`,
`href="../index.html"`, `href="mejores-islas-rosario/index.html"`,
`href="policies.html"`, `href="faq.html"`, `href="privacy.html"`) NO necesitan
el `../` extra, porque la estructura espejo bajo `en/` preserva las posiciones
relativas. Déjalos exactamente igual (apuntarán automáticamente a la versión
en inglés correspondiente dentro de `en/`).

Excepción: enlaces con `target="_blank"` a redes sociales externas
(Instagram, Facebook, WhatsApp wa.me, etc.) no cambian.

## 5. URLs absolutas (canonical, OG, JSON-LD, sitemap)
Cualquier URL absoluta que empiece con `https://agencianohemi.com/` y apunte
a esta misma página debe convertirse en `https://agencianohemi.com/en/...`.
Ejemplo: canonical de `blog/foo/index.html` es
`https://agencianohemi.com/blog/foo/index.html` -> en la versión inglesa debe
ser `https://agencianohemi.com/en/blog/foo/index.html`.

## 6. Etiquetas hreflang
Agrega estas 3 líneas dentro de `<head>` (cerca del `<link rel="canonical">`),
usando la URL absoluta ESPAÑOLA original y la URL absoluta INGLESA nueva de
ESTA página específica:

```html
<link rel="alternate" hreflang="es" href="https://agencianohemi.com/RUTA-ES" />
<link rel="alternate" hreflang="en" href="https://agencianohemi.com/en/RUTA-ES" />
<link rel="alternate" hreflang="x-default" href="https://agencianohemi.com/RUTA-ES" />
```

## 7. No toques los archivos en español
Solo CREA los archivos nuevos bajo `en/`. No modifiques ningún archivo fuera
de `en/`. El selector de idioma (ES/EN) en el nav y el `sitemap.xml` se
agregan en un paso posterior aparte, no es parte de tu tarea.

## 8. Verificación final
Después de escribir cada archivo, verifica:
- Que el HTML no quedó roto (etiquetas balanceadas).
- Que no quedó texto en español suelto (excepto los nombres propios indicados).
- Que las rutas de imágenes/css/js tienen el `../` extra correcto.
