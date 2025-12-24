import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

const items = [
  "about.html",
  "contact.html",
  "design-system.html",
  "favicon.svg",
  "index.html",
  "robots.txt",
  "sitemap.xml",
  "articles",
  "assets",
  "en",
  "images",
  "legal",
  "ru",
  "services",
  "ua"
];

await fs.rm(dist, { recursive: true, force: true });
await fs.mkdir(dist, { recursive: true });

await Promise.all(
  items.map(async (item) => {
    const src = path.join(root, item);
    const dest = path.join(dist, item);
    await fs.cp(src, dest, { recursive: true });
  })
);

// Copy _redirects file to dist for Cloudflare Pages
const redirectsSrc = path.join(root, "_redirects");
const redirectsDest = path.join(dist, "_redirects");
try {
  await fs.copyFile(redirectsSrc, redirectsDest);
} catch (err) {
  // If _redirects doesn't exist, create it
  const redirectsContent = "/* /index.html 200\n";
  await fs.writeFile(redirectsDest, redirectsContent);
}
