import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const items = [
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

export async function build(root, dist, itemsToBuild) {
  // Pre-flight check: Ensure all source items exist
  await Promise.all(itemsToBuild.map(async (item) => {
    const src = path.join(root, item);
    try {
      await fs.access(src);
    } catch {
      throw new Error(`Source item not found: ${item}`);
    }
  }));

  await fs.rm(dist, { recursive: true, force: true });
  await fs.mkdir(dist, { recursive: true });

  await Promise.all(
    itemsToBuild.map(async (item) => {
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

// Run only if invoked directly
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  const __dirname = path.dirname(__filename);
  const rootDir = path.resolve(__dirname, "..");
  const distDir = path.join(rootDir, "dist");

  build(rootDir, distDir, items).catch((err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });
}
