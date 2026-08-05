const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const skip = new Set(["404.html", "privacy.html", "policies.html", "pago-resultado.html"]);
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if ([".git", "node_modules", "en", "api", "css", "images", "js", "scripts"].includes(entry.name)) return [];
      return walk(full);
    }
    return entry.name.endsWith(".html") ? [full] : [];
  });
}
function clean(text) { return String(text || "").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&[^;]+;/g, " ").replace(/\s+/g, " ").trim(); }
const items = walk(root).filter((file) => !skip.has(path.relative(root, file).replace(/\\/g, "/"))).map((file) => {
  const html = fs.readFileSync(file, "utf8");
  const relative = path.relative(root, file).replace(/\\/g, "/");
  const title = clean((html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1]).replace(/\s*\|\s*Dunas\s*&\s*Olas.*$/i, "");
  const description = clean((html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i) || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i) || [])[1]);
  const keywords = clean((html.match(/<meta[^>]+name=["']keywords["'][^>]+content=["']([^"']+)/i) || [])[1]);
  let url = "/" + relative.replace(/index\.html$/i, "").replace(/\.html$/i, "");
  return { title, description: description.slice(0, 180), keywords, url };
}).filter((item) => item.title && item.url !== "/");
fs.writeFileSync(path.join(root, "search-index.json"), JSON.stringify(items, null, 2) + "\n", "utf8");
console.log(`Search index: ${items.length} pages`);
