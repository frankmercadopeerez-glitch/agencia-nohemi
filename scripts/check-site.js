const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const ignored = new Set(["node_modules", ".git"]);
const failures = [];
let pages = 0;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (ignored.has(entry.name)) return [];
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

for (const file of walk(root).filter((file) => file.endsWith(".html"))) {
  pages += 1;
  const rel = path.relative(root, file).replaceAll("\\", "/");
  const html = fs.readFileSync(file, "utf8");
  if (!/<title>\s*[^<]+/i.test(html)) failures.push(`${rel}: falta title`);
  if (!/<meta\s+[^>]*name=["']description["'][^>]*content=["'][^"']+/i.test(html)) failures.push(`${rel}: falta meta description`);
  if (!/<h1\b/i.test(html)) failures.push(`${rel}: falta h1`);
  if (/G-XXXXXXXXXX/i.test(html)) failures.push(`${rel}: contiene un ID ficticio de Analytics`);
  if (rel !== "404.html" && !/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']https:\/\/dunasyolas\.com/i.test(html)) failures.push(`${rel}: falta canonical válido`);

  const ids = [...html.matchAll(/\bid=["']([^"']+)/gi)].map((match) => match[1]);
  for (const id of new Set(ids.filter((id, index) => ids.indexOf(id) !== index))) failures.push(`${rel}: id duplicado ${id}`);

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    if (tag.includes("${")) continue;
    if (!/\balt=["']/i.test(tag)) failures.push(`${rel}: imagen sin alt`);
    if (!/\bwidth=["']\d+/i.test(tag) || !/\bheight=["']\d+/i.test(tag)) failures.push(`${rel}: imagen sin dimensiones`);
    if (!/\bdecoding=["']async["']/i.test(tag)) failures.push(`${rel}: imagen sin decoding async`);
    if (!/\bloading=["'](?:lazy|eager)["']/i.test(tag)) failures.push(`${rel}: imagen sin estrategia de carga`);
  }
  for (const match of html.matchAll(/<button\b([^>]*)>(.*?)<\/button>/gis)) {
    const attrs = match[1];
    const body = match[2];
    const text = body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const imageAlt = /<img[^>]*\balt=["'][^"']+/i.test(body);
    if (!text && !imageAlt && !/\b(?:aria-label|title)=["'][^"']+/i.test(attrs)) failures.push(`${rel}: botón sin nombre accesible`);
  }
  for (const match of html.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/gi)) {
    if (!/\brel=["'][^"']*noopener/i.test(match[0])) failures.push(`${rel}: target=_blank sin noopener`);
  }
  for (const match of html.matchAll(/<a\b[^>]*href=["']#["'][^>]*>/gi)) {
    if (!/\bonclick=/i.test(match[0])) failures.push(`${rel}: enlace vacío sin acción`);
  }
  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']*)/gi)) {
    const raw = match[1].trim();
    if (!raw || raw.includes("${") || /^(#|https?:|mailto:|tel:|javascript:|data:|\/\/)/i.test(raw)) continue;
    let clean;
    try { clean = decodeURIComponent(raw.split(/[?#]/)[0]); } catch { clean = raw.split(/[?#]/)[0]; }
    const target = clean.startsWith("/") ? path.join(root, clean.slice(1)) : path.resolve(path.dirname(file), clean);
    if (!fs.existsSync(target) && !fs.existsSync(`${target}.html`) && !fs.existsSync(path.join(target, "index.html"))) failures.push(`${rel}: recurso inexistente ${raw}`);
  }
}

const vercel = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8"));
const securityHeaders = new Set((vercel.headers?.[0]?.headers || []).map((header) => header.key.toLowerCase()));
for (const required of ["content-security-policy", "referrer-policy", "permissions-policy", "strict-transport-security", "x-content-type-options", "x-frame-options"]) {
  if (!securityHeaders.has(required)) failures.push(`vercel.json: falta ${required}`);
}
if (!fs.existsSync(path.join(root, "404.html"))) failures.push("falta 404.html");

if (failures.length) {
  console.error(failures.join("\n"));
  console.error(`\n${failures.length} problema(s) en ${pages} páginas.`);
  process.exit(1);
}
console.log(`Sitio validado: ${pages} páginas, imágenes optimizadas y reglas de seguridad presentes.`);
