import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

const items = [
  "404.html",
  "about.html",
  "contact.html",
  "favicon.svg",
  "index.html",
  "llms.txt",
  "llms-full.txt",
  "robots.txt",
  "sitemap.xml",
  "_headers",
  "articles",
  "assets",
  "en",
  "glossary",
  "images",
  "legal",
  "ru",
  "services",
  "ua"
];

export async function build() {
  // Pre-flight check: Ensure all source items exist
  await Promise.all(items.map(async (item) => {
    const src = path.join(root, item);
    try {
      await fs.access(src);
    } catch {
      console.error(`Error: Source item not found: ${item}`);
      process.exit(1);
    }
  }));

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
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  build().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
