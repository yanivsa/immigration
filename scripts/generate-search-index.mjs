import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const outputPath = path.join(root, "assets", "search-index.json");

const ignoreDirs = new Set(["assets", "dist", "images", "scripts", "node_modules"]);
const ignoreFiles = new Set(["404.html", "design-system.html"]);

const decodeEntities = (value) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

const stripTags = (value) =>
  decodeEntities(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  );

const normalizeText = (value) =>
  stripTags(value).replace(/\s+/g, " ").trim();

const extractTag = (html, regex) => {
  const match = html.match(regex);
  return match ? normalizeText(match[1]) : "";
};

const extractHeadings = (html) => {
  const matches = Array.from(html.matchAll(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/gi));
  return matches
    .map((match) => normalizeText(match[1]))
    .filter(Boolean)
    .join(" | ");
};

const extractContent = (html) => {
  const mainMatch = html.match(/<main[\s\S]*?<\/main>/i);
  const bodyMatch = html.match(/<body[\s\S]*?<\/body>/i);
  const content = mainMatch ? mainMatch[0] : bodyMatch ? bodyMatch[0] : html;
  const cleaned = normalizeText(content);
  return cleaned.slice(0, 800);
};

const extractLang = (html) => {
  const match = html.match(/<html[^>]*\blang=["']([^"']+)["']/i);
  return match ? match[1].toLowerCase() : "";
};

const toUrl = (relativePath) => {
  if (relativePath === "index.html") {
    return "/";
  }
  if (relativePath.endsWith("/index.html")) {
    return `/${relativePath.replace(/index\.html$/, "")}`;
  }
  return `/${relativePath.replace(/\.html$/, "")}`;
};

const walk = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (ignoreDirs.has(entry.name)) {
        continue;
      }
      files.push(...(await walk(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      if (ignoreFiles.has(entry.name)) {
        continue;
      }
      files.push(fullPath);
    }
  }

  return files;
};

const buildIndex = async () => {
  const htmlFiles = await walk(root);
  const items = [];

  for (const file of htmlFiles) {
    const relativePath = path.relative(root, file).replace(/\\/g, "/");
    const html = await fs.readFile(file, "utf8");

    const title = extractTag(html, /<title>([\s\S]*?)<\/title>/i);
    const description = extractTag(
      html,
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i
    );
    const headings = extractHeadings(html);
    const content = extractContent(html);
    const lang = extractLang(html);
    const url = toUrl(relativePath);

    items.push({
      title,
      description,
      headings,
      content,
      lang,
      url,
    });
  }

  await fs.writeFile(outputPath, JSON.stringify(items, null, 2));
  console.log(`Search index generated: ${path.relative(root, outputPath)}`);
};

await buildIndex();
