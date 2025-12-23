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
  "uk"
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
