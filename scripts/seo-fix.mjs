import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const siteUrl = "https://immigration.the-israeli-lawyer.com";

const ignoredDirs = new Set([
  ".git",
  ".wrangler",
  "assets",
  "content_queue",
  "dist",
  "images",
  "logs",
  "node_modules",
  "scripts",
]);

const ignoredFiles = new Set([
  ".DS_Store",
  "favicon.svg",
]);

const localeConfig = {
  he: {
    htmlLang: "he",
    dir: "rtl",
    articleSuffix: "| מדריך הגירה לישראל",
    descriptionBoilerplate: "ליווי מסודר, מסמכים ברורים, תיאום ציפיות ושירות בזום",
    author: "משרד עורכי דין להגירה",
  },
  en: {
    htmlLang: "en",
    dir: "ltr",
    articleSuffix: "| Israel immigration guide",
    descriptionBoilerplate: "Clear process, organized documents, realistic expectations, and Zoom guidance",
    author: "Immigration Law Office",
  },
  ru: {
    htmlLang: "ru",
    dir: "ltr",
    articleSuffix: "| Иммиграция в Израиль",
    descriptionBoilerplate: "Четкий процесс, аккуратные документы, реалистичные ожидания и поддержка в Zoom",
    author: "Иммиграционный юридический офис",
  },
  uk: {
    htmlLang: "uk-UA",
    dir: "ltr",
    articleSuffix: "| Імміграція до Ізраїлю",
    descriptionBoilerplate: "Чіткий процес, упорядковані документи, реалістичні очікування та підтримка в Zoom",
    author: "Імміграційний юридичний офіс",
  },
};

const titleOverrides = {
  "en/index.html": "Immigration lawyer in Ashdod | Work visas, citizenship and status",
  "en/articles/index.html": "Immigration articles | Visas, status and Ben Gurion",
  "en/services/work-visas.html": "Work visas in Israel | Employers and foreign workers",
  "en/articles/article-10.html": "Work visa Q&A | 12 short answers",
  "en/articles/article-20.html": "Citizenship Q&A | 12 short answers",
  "en/articles/article-30.html": "Tourist visa Q&A | 12 short answers",
  "en/articles/article-32.html": "Delayed by the Population Authority at Ben Gurion",
  "en/articles/article-34.html": "Risk of removal | Immediate steps in Israel",
  "ru/index.html": "Иммиграционный юрист в Ашдоде | Визы, гражданство и статус",
  "ru/contact.html": "Контакты | Бесплатная консультация в Zoom",
  "ru/services/index.html": "Иммиграционные услуги в Ашдоде | Визы и статус",
  "ru/articles/article-32.html": "Задержка со стороны управления в Бен-Гурионе",
  "ru/articles/article-33.html": "Задержание на погранконтроле в Бен-Гурионе",
  "ua/index.html": "Імміграційний юрист в Ашдоді | Візи, громадянство та статус",
  "ua/contact.html": "Контакти | Безкоштовна консультація в Zoom",
  "ua/services/index.html": "Імміграційні послуги в Ашдоді | Візи та статус",
  "ua/articles/index.html": "Статті про візи та Бен-Гуріон | Імміграційний юридичний офіс",
  "ua/articles/article-32.html": "Затримка з боку управління в Бен-Гуріоні",
  "ua/articles/article-33.html": "Затримання на прикордонному контролі в Бен-Гуріоні",
};

const relatedArticlesByService = {
  "ben-gurion-emergency": ["article-26", "article-29", "article-31", "article-32"],
  citizenship: ["article-12", "article-14", "article-15", "article-19"],
  "entry-permits": ["article-22", "article-24", "article-29", "article-32"],
  "tourist-visas": ["article-23", "article-25", "article-26", "article-29"],
  "work-visas": ["article-01", "article-02", "article-07", "article-10"],
};

const relatedCopy = {
  he: {
    intro: "כדי להגיע מוכנים יותר, מומלץ לקרוא גם את המדריכים הבאים לפני שפועלים:",
    title: "מאמרים קשורים שכדאי לקרוא",
  },
  en: {
    intro: "These guides add practical context before you submit documents or take the next step:",
    title: "Related guides worth reading",
  },
  ru: {
    intro: "Эти материалы помогут понять практические шаги до подачи документов и следующего действия:",
    title: "Связанные материалы, которые стоит прочитать",
  },
  uk: {
    intro: "Ці матеріали допоможуть краще зрозуміти практичні кроки до подання документів і наступної дії:",
    title: "Пов’язані матеріали, які варто прочитати",
  },
};

const ogImageMeta = {
  "/images/checklist-passport-desk.jpg": { width: 1024, height: 1024 },
  "/images/family-citizenship-israel.jpg": { width: 1024, height: 1024 },
  "/images/immigration-consultation-couple-alt-hq.jpg": { width: 456, height: 266 },
  "/images/immigration-consultation-couple-alt.jpg": { width: 456, height: 266 },
  "/images/immigration-consultation-couple.jpg": { width: 456, height: 266 },
  "/images/israel-flag-scales-gavel.jpg": { width: 464, height: 474 },
  "/images/law-office-scales-gavel-ashdod.jpg": { width: 460, height: 302 },
};

const noindexPatterns = [
  /^404\.html$/,
  /^design-system\.html$/,
  /(^|\/)legal\/privacy\.html$/,
  /(^|\/)legal\/terms\.html$/,
];

const stripTags = (value) =>
  decodeEntities(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  );

export function decodeEntities(value = "") {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function escapeAttribute(value = "") {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeHtmlText(value = "") {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function normalizeWhitespace(value = "") {
  return value.replace(/\s+/g, " ").trim();
}

function clipText(value, max = 155) {
  const text = normalizeWhitespace(value).replace(/[ ,;:]+$/u, "");
  if (text.length <= max) {
    return text;
  }

  const sliced = text.slice(0, max + 1);
  const lastSpace = sliced.lastIndexOf(" ");
  const clipped = lastSpace > Math.floor(max * 0.6) ? sliced.slice(0, lastSpace) : sliced.slice(0, max);
  return clipped.replace(/[ ,;:]+$/u, "");
}

function readMatch(html, pattern) {
  const match = html.match(pattern);
  return match ? match[1].trim() : "";
}

function extractAttribute(tag, name) {
  if (!tag) {
    return "";
  }
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`${escapedName}=(["'])([\\s\\S]*?)\\1`, "i");
  const match = tag.match(pattern);
  return match ? decodeEntities(match[2].trim()) : "";
}

function readMetaContent(html, key, attribute = "name") {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const tag = readMatch(html, new RegExp(`(<meta[^>]*${attribute}=["']${escapedKey}["'][^>]*>)`, "i"));
  return extractAttribute(tag, "content");
}

function readLinkHref(html, relValue) {
  const escapedRel = relValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const tag = readMatch(html, new RegExp(`(<link[^>]*rel=["']${escapedRel}["'][^>]*>)`, "i"));
  return extractAttribute(tag, "href");
}

function getLocale(relPath) {
  if (relPath.startsWith("en/")) return "en";
  if (relPath.startsWith("ru/")) return "ru";
  if (relPath.startsWith("ua/")) return "uk";
  return "he";
}

function stripLocalePrefix(relPath) {
  return relPath.replace(/^(en|ru|ua)\//, "");
}

function getLocalizedRel(baseRel, locale) {
  if (locale === "he") return baseRel;
  if (locale === "uk") return `ua/${baseRel}`;
  return `${locale}/${baseRel}`;
}

function toPathname(relPath) {
  if (relPath === "index.html") {
    return "/";
  }
  if (relPath.endsWith("/index.html")) {
    return `/${relPath.slice(0, -"/index.html".length)}/`;
  }
  return `/${relPath.slice(0, -".html".length)}`;
}

function toAbsoluteUrl(relPath) {
  return `${siteUrl}${toPathname(relPath)}`;
}

function isNoindex(relPath) {
  return noindexPatterns.some((pattern) => pattern.test(relPath));
}

function extractMainHtml(html) {
  return readMatch(html, /<main[\s\S]*?>([\s\S]*?)<\/main>/i) || readMatch(html, /<body[\s\S]*?>([\s\S]*?)<\/body>/i) || html;
}

function extractParagraphCandidates(html) {
  const main = extractMainHtml(html);
  const candidates = [];
  const seen = new Set();

  const addCandidate = (raw) => {
    const text = normalizeWhitespace(stripTags(raw));
    if (!text || text.length < 45) {
      return;
    }
    if (/^(מידע כללי בלבד|general information only|общая информация|загальна інформація)/iu.test(text)) {
      return;
    }
    if (/^(מוכנים להתחיל|ready to start|готовы начать|готові почати)/iu.test(text)) {
      return;
    }
    if (!seen.has(text)) {
      seen.add(text);
      candidates.push(text);
    }
  };

  for (const match of main.matchAll(/<p[^>]*class=["'][^"']*\blede\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/gi)) {
    addCandidate(match[1]);
  }

  for (const match of main.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
    addCandidate(match[1]);
  }

  return candidates;
}

function needsDescriptionRefresh(description, locale) {
  const text = normalizeWhitespace(decodeEntities(description));
  if (!text) return true;
  if (text.length < 110 || text.length > 165) return true;
  if (text.includes(localeConfig[locale].descriptionBoilerplate)) return true;
  if (/(?:\s|^)[\p{L}]{1,2}$/u.test(text) && !/[.!?…]$/u.test(text)) return true;
  return false;
}

function splitSentences(text) {
  return (normalizeWhitespace(text).match(/[^.!?…]+[.!?…]?/gu) || [])
    .map((sentence) => normalizeWhitespace(sentence))
    .filter(Boolean);
}

function buildSnippet(text) {
  const normalized = normalizeWhitespace(text);
  const sentences = splitSentences(normalized);
  let snippet = "";

  for (const sentence of sentences) {
    const candidate = snippet ? `${snippet} ${sentence}` : sentence;
    if (candidate.length > 155) {
      break;
    }
    snippet = candidate;
    if (snippet.length >= 95 && /[.!?…]$/u.test(snippet)) {
      return snippet;
    }
  }

  if (!snippet) {
    snippet = sentences[0] || normalized;
  }

  return clipText(snippet, 155);
}

function buildDescription(html, relPath, currentDescription) {
  const candidates = extractParagraphCandidates(html);
  const h1 = normalizeWhitespace(stripTags(readMatch(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i)));

  for (let index = 0; index < Math.min(candidates.length, 3); index += 1) {
    const current = buildSnippet(candidates[index]);
    if (current.length >= 95) {
      return current;
    }
    if (candidates[index + 1]) {
      const combined = buildSnippet(`${candidates[index]} ${candidates[index + 1]}`);
      if (combined.length >= 95) {
        return combined;
      }
    }
  }

  const fallback = normalizeWhitespace(decodeEntities(currentDescription)) || h1;
  if (!fallback) {
    return "";
  }

  return buildSnippet(fallback);
}

function normalizeTitle(title, relPath) {
  if (titleOverrides[relPath]) {
    return titleOverrides[relPath];
  }

  const locale = getLocale(relPath);
  let nextTitle = normalizeWhitespace(decodeEntities(title));

  if (!nextTitle) {
    return nextTitle;
  }

  if (nextTitle.length > 65) {
    if (nextTitle.includes(": ")) {
      nextTitle = nextTitle.split(": ")[0];
    }
    if (nextTitle.length > 65 && nextTitle.includes(" | ")) {
      nextTitle = nextTitle.split(" | ")[0];
    }
    if (nextTitle.length > 65 && nextTitle.includes(" - ")) {
      nextTitle = nextTitle.split(" - ")[0];
    }
    if (nextTitle.length > 65) {
      nextTitle = clipText(nextTitle, 62);
    }
  }

  if (nextTitle.length < 38 && /(^|\/)articles\/article-\d+\.html$/.test(relPath)) {
    nextTitle = `${nextTitle} ${localeConfig[locale].articleSuffix}`;
  }

  return nextTitle;
}

function upsertAttribute(tag, name, value) {
  const attrPattern = new RegExp(`\\s${name}=["'][^"']*["']`, "i");
  if (attrPattern.test(tag)) {
    return tag.replace(attrPattern, ` ${name}="${escapeAttribute(value)}"`);
  }
  return tag.replace(/\/?>$/u, (ending) => ` ${name}="${escapeAttribute(value)}"${ending}`);
}

function removeAttribute(tag, name) {
  const attrPattern = new RegExp(`\\s${name}=["'][^"']*["']`, "ig");
  return tag.replace(attrPattern, "");
}

function normalizeImageTags(html) {
  let imageIndex = 0;

  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    imageIndex += 1;
    let nextTag = upsertAttribute(tag, "decoding", "async");

    if (imageIndex === 1) {
      nextTag = upsertAttribute(nextTag, "loading", "eager");
      nextTag = upsertAttribute(nextTag, "fetchpriority", "high");
      return nextTag;
    }

    nextTag = upsertAttribute(nextTag, "loading", "lazy");
    nextTag = removeAttribute(nextTag, "fetchpriority");
    return nextTag;
  });
}

function extractFirstImageMeta(html, relPath) {
  const tag = readMatch(html, /(<img\b[^>]*>)/i);
  if (!tag) {
    return {
      alt: "Immigration law office in Ashdod",
      height: String(ogImageMeta["/images/law-office-scales-gavel-ashdod.jpg"].height),
      src: `${siteUrl}/images/law-office-scales-gavel-ashdod.jpg`,
      width: String(ogImageMeta["/images/law-office-scales-gavel-ashdod.jpg"].width),
    };
  }

  const rawSrc = extractAttribute(tag, "src");
  const rawAlt = extractAttribute(tag, "alt");
  const src = rawSrc.startsWith("http") ? rawSrc : `${siteUrl}${rawSrc}`;
  const width = extractAttribute(tag, "width");
  const height = extractAttribute(tag, "height");
  const meta = ogImageMeta[rawSrc] || null;
  return {
    alt: rawAlt || "Immigration law office in Ashdod",
    height: height || String(meta?.height || ""),
    src,
    width: width || String(meta?.width || ""),
  };
}

function upsertMetaTag(head, key, value, attribute = "name") {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`\\n?\\s*<meta[^>]*${attribute}=["']${escapedKey}["'][^>]*>`, "i");
  const tag = `    <meta ${attribute}="${key}" content="${escapeAttribute(value)}" />`;

  if (pattern.test(head)) {
    return head.replace(pattern, `\n${tag}`);
  }

  return head.replace(/<\/head>/i, `${tag}\n  </head>`);
}

function upsertCanonical(head, href) {
  const pattern = /\n?\s*<link[^>]*rel=["']canonical["'][^>]*>/i;
  const tag = `    <link rel="canonical" href="${escapeAttribute(href)}" />`;
  if (pattern.test(head)) {
    return head.replace(pattern, `\n${tag}`);
  }
  return head.replace(/<\/head>/i, `${tag}\n  </head>`);
}

function removeKeywordMeta(head) {
  return head.replace(/\n?\s*<meta[^>]*name=["']keywords["'][^>]*>/gi, "");
}

function rebuildAlternateLinks(head, relPath, allFiles) {
  const baseRel = stripLocalePrefix(relPath);
  const alternates = [
    { hreflang: "he", rel: getLocalizedRel(baseRel, "he") },
    { hreflang: "en", rel: getLocalizedRel(baseRel, "en") },
    { hreflang: "ru", rel: getLocalizedRel(baseRel, "ru") },
    { hreflang: "uk-UA", rel: getLocalizedRel(baseRel, "uk") },
  ].filter((item) => allFiles.has(item.rel));

  const defaultRel = getLocalizedRel(baseRel, "he");
  if (allFiles.has(defaultRel)) {
    alternates.push({ hreflang: "x-default", rel: defaultRel });
  }

  const block = alternates
    .map((item) => `    <link rel="alternate" hreflang="${item.hreflang}" href="${escapeAttribute(toAbsoluteUrl(item.rel))}" />`)
    .join("\n");

  const withoutAlternates = head.replace(/\n?\s*<link[^>]*rel=["']alternate["'][^>]*>/gi, "");
  const stylesheetPattern = /\n\s*<link rel="stylesheet"/i;

  if (!stylesheetPattern.test(withoutAlternates)) {
    return withoutAlternates.replace(/<\/head>/i, `${block}\n  </head>`);
  }

  return withoutAlternates.replace(stylesheetPattern, `\n${block}\n$&`);
}

function buildRelatedArticlesBlock(relPath, locale, articleLookup) {
  const serviceSlug = path.basename(relPath, ".html");
  const articleIds = relatedArticlesByService[serviceSlug];
  if (!articleIds) {
    return "";
  }

  const links = articleIds
    .map((articleId) => articleLookup[locale]?.[articleId])
    .filter(Boolean)
    .map((article) => `          <li><a href="${article.url}">${escapeHtmlText(article.title)}</a></li>`)
    .join("\n");

  if (!links) {
    return "";
  }

  const copy = relatedCopy[locale];
  return [
    '        <div class="related-articles" data-seo-related="true">',
    `          <h2 class="title-lg">${escapeHtmlText(copy.title)}</h2>`,
    `          <p>${escapeHtmlText(copy.intro)}</p>`,
    "          <ul>",
    links,
    "          </ul>",
    "        </div>",
  ].join("\n");
}

function upsertRelatedArticles(html, block) {
  if (!block) {
    return html;
  }

  if (/data-seo-related="true"/.test(html)) {
    return html.replace(/<div class="related-articles" data-seo-related="true">[\s\S]*?<\/div>/i, block);
  }

  if (/<p class="footer-note">/i.test(html)) {
    return html.replace(/\s*<p class="footer-note">/i, `\n${block}\n\n<p class="footer-note">`);
  }

  return html.replace(/<\/main>/i, `\n${block}\n</main>`);
}

function normalizeHtmlTag(html, relPath) {
  const locale = getLocale(relPath);
  const { htmlLang, dir } = localeConfig[locale];
  return html.replace(/<html[^>]*lang=["'][^"']+["'][^>]*dir=["'][^"']+["'][^>]*>/i, `<html lang="${htmlLang}" dir="${dir}">`);
}

function updateJsonLd(html, relPath, meta) {
  return html.replace(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/gi, (fullMatch, rawJson) => {
    let data;

    try {
      data = JSON.parse(rawJson);
    } catch {
      return fullMatch;
    }

    const types = Array.isArray(data["@type"]) ? data["@type"] : [data["@type"]];

    if (types.includes("Article")) {
      data.headline = meta.title;
      data.description = meta.description;
      data.inLanguage = meta.schemaLanguage;
      data.mainEntityOfPage = meta.canonical;
      data.image = meta.ogImage;
      if (data.publisher && typeof data.publisher === "object" && !data.publisher.logo) {
        data.publisher.logo = {
          "@type": "ImageObject",
          "url": `${siteUrl}/favicon.svg`,
        };
      }
    }

    if (types.some((type) => ["WebPage", "AboutPage", "ContactPage", "CollectionPage"].includes(type))) {
      data.name = meta.title;
      data.url = meta.canonical;
      data.description = meta.description;
      data.inLanguage = meta.schemaLanguage;
      if (data.about) {
        data.about = { "@id": `${siteUrl}/#business` };
      }
    }

    if (types.includes("Service")) {
      data.name = meta.heading || meta.title;
      data.serviceType = meta.heading || meta.title;
      data.url = meta.canonical;
      data.description = meta.description;
      data.inLanguage = meta.schemaLanguage;
      if (data.provider) {
        data.provider = { "@id": `${siteUrl}/#business` };
      }
    }

    if (types.some((type) => ["LegalService", "LocalBusiness", "Attorney"].includes(type))) {
      data.description = meta.description;
      data.image = meta.ogImage;
      data.availableLanguage = ["Hebrew", "English", "Russian", "Ukrainian"];
      if (!data.openingHours) {
        data.openingHours = "Mo-Fr 09:00-18:00";
      }
    }

    if (types.includes("BreadcrumbList") && Array.isArray(data.itemListElement) && data.itemListElement.length > 0) {
      const lastIndex = data.itemListElement.length - 1;
      if (data.itemListElement[lastIndex] && typeof data.itemListElement[lastIndex] === "object") {
        data.itemListElement[lastIndex].item = meta.canonical;
      }
    }

    return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n\n    </script>`;
  });
}

function collectFilesByPriority(files) {
  return [...files].sort((a, b) => a.localeCompare(b, "en"));
}

async function walkHtml(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".") || ignoredFiles.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name)) {
        continue;
      }
      files.push(...(await walkHtml(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(fullPath);
    }
  }

  return files;
}

async function generateSitemap(indexableFiles) {
  const entries = [];

  for (const relPath of collectFilesByPriority(indexableFiles)) {
    const filePath = path.join(root, relPath);
    const html = await fs.readFile(filePath, "utf8");
    const canonical = readLinkHref(html, "canonical") || toAbsoluteUrl(relPath);
    const stat = await fs.stat(filePath);
    const alternates = [...html.matchAll(/<link\b[^>]*rel=["']alternate["'][^>]*>/gi)]
      .map((match) => ({
        hreflang: extractAttribute(match[0], "hreflang"),
        href: extractAttribute(match[0], "href"),
      }))
      .filter((item) => item.hreflang && item.href);

    entries.push({
      canonical,
      alternates,
      lastmod: stat.mtime.toISOString().split("T")[0],
    });
  }

  const lines = [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:xhtml=\"http://www.w3.org/1999/xhtml\">",
  ];

  for (const entry of entries) {
    lines.push("  <url>");
    lines.push(`    <loc>${entry.canonical}</loc>`);
    for (const alternate of entry.alternates) {
      lines.push(`    <xhtml:link rel=\"alternate\" hreflang=\"${alternate.hreflang}\" href=\"${alternate.href}\" />`);
    }
    lines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
    lines.push("  </url>");
  }

  lines.push("</urlset>");

  await fs.writeFile(path.join(root, "sitemap.xml"), `${lines.join("\n")}\n`);
}

async function main() {
  const filePaths = await walkHtml(root);
  const relativeFiles = filePaths.map((filePath) => path.relative(root, filePath).replace(/\\/g, "/"));
  const allFiles = new Set(relativeFiles);
  const indexableFiles = new Set();
  const articleLookup = { he: {}, en: {}, ru: {}, uk: {} };

  for (const relPath of relativeFiles) {
    if (!/(^|\/)articles\/article-\d+\.html$/.test(relPath)) {
      continue;
    }
    const locale = getLocale(relPath);
    const html = await fs.readFile(path.join(root, relPath), "utf8");
    articleLookup[locale][path.basename(relPath, ".html")] = {
      title: normalizeWhitespace(stripTags(readMatch(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i) || readMatch(html, /<title>([\s\S]*?)<\/title>/i))),
      url: toPathname(relPath),
    };
  }

  for (const relPath of collectFilesByPriority(relativeFiles)) {
    const filePath = path.join(root, relPath);
    const originalHtml = await fs.readFile(filePath, "utf8");
    let html = originalHtml;

    html = normalizeHtmlTag(html, relPath);
    html = normalizeImageTags(html);

    const locale = getLocale(relPath);
    const canonical = toAbsoluteUrl(relPath);
    const title = normalizeTitle(readMatch(html, /<title>([\s\S]*?)<\/title>/i), relPath);
    const currentDescription = readMetaContent(html, "description");
    const heading = normalizeWhitespace(stripTags(readMatch(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i)));
    const description = isNoindex(relPath) && !needsDescriptionRefresh(currentDescription, locale)
      ? normalizeWhitespace(decodeEntities(currentDescription))
      : buildDescription(html, relPath, currentDescription);
    const firstImage = extractFirstImageMeta(html, relPath);

    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtmlText(title)}</title>`);

    let head = readMatch(html, /(<head>[\s\S]*?<\/head>)/i);
    head = removeKeywordMeta(head);
    head = upsertMetaTag(
      head,
      "robots",
      isNoindex(relPath)
        ? "noindex,follow,max-image-preview:large"
        : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
    );
    head = upsertMetaTag(head, "description", description);
    head = upsertMetaTag(head, "author", localeConfig[locale].author);
    head = upsertCanonical(head, canonical);
    head = upsertMetaTag(head, "og:title", title, "property");
    head = upsertMetaTag(head, "og:description", description, "property");
    head = upsertMetaTag(head, "og:url", canonical, "property");
    head = upsertMetaTag(head, "og:site_name", localeConfig[locale].author, "property");
    head = upsertMetaTag(head, "og:image", firstImage.src, "property");
    head = upsertMetaTag(head, "og:image:alt", firstImage.alt, "property");
    if (firstImage.width && firstImage.height) {
      head = upsertMetaTag(head, "og:image:width", firstImage.width, "property");
      head = upsertMetaTag(head, "og:image:height", firstImage.height, "property");
    }
    head = upsertMetaTag(head, "twitter:card", "summary_large_image");
    head = upsertMetaTag(head, "twitter:title", title);
    head = upsertMetaTag(head, "twitter:description", description);
    head = upsertMetaTag(head, "twitter:image", firstImage.src);
    head = upsertMetaTag(head, "twitter:image:alt", firstImage.alt);

    if (!isNoindex(relPath)) {
      head = rebuildAlternateLinks(head, relPath, allFiles);
      indexableFiles.add(relPath);
    } else {
      head = head.replace(/\n?\s*<link[^>]*rel=["']alternate["'][^>]*>/gi, "");
    }

    html = html.replace(/<head>[\s\S]*?<\/head>/i, head);
    html = updateJsonLd(html, relPath, {
      canonical,
      description,
      heading,
      ogImage: firstImage.src,
      title,
      schemaLanguage: localeConfig[locale].htmlLang,
    });

    if (/^((en|ru|ua)\/)?services\/(?!index\.html$)[^/]+\.html$/.test(relPath) && !isNoindex(relPath)) {
      html = upsertRelatedArticles(html, buildRelatedArticlesBlock(relPath, locale, articleLookup));
    }

    if (html !== originalHtml) {
      await fs.writeFile(filePath, html);
    }
  }

  await generateSitemap(indexableFiles);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
