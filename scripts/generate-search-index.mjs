import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const outputPath = path.join(root, "assets", "search-index.json");
const knowledgeBasePath = path.join(root, "assets", "knowledge-base.json");

const ignoreDirs = new Set(["assets", "dist", "images", "scripts", "node_modules"]);
const ignoreFiles = new Set(["404.html", "design-system.html", "article_template.html"]);
const ignoredHeadingLabels = new Set([
  "תוכן עניינים",
  "בדקה אחת",
  "עיקרי הדברים",
  "מה הלאה",
  "Table of contents",
  "In one minute",
  "Key takeaways",
  "Next reading by intent",
  "Editorial review of this guide",
  "לא בטוחים איך להתקדם?",
  "Need a bit more clarity?",
  "Not sure how to move forward?",
  "Unsure about the next step?",
  "הסבר כללי",
  "טעויות נפוצות",
  "איך לתכנן את הצעד הבא",
  "צ'קליסט מעשי",
  "Overview",
  "Common pitfalls",
  "Plan the next step with fewer surprises",
  "Practical checklist",
  "Общий обзор",
  "Типичные ошибки",
  "Практический чеклист",
  "Загальний огляд",
  "Типові помилки",
  "Практичний чеклист",
  "Ответ за 30 секунд",
  "Відповідь за 30 секунд",
]);

const isEntityLikeHeading = (heading) => {
  if (ignoredHeadingLabels.has(heading)) return false;
  if (heading.length > 80) return false;
  if (/[?？]$/.test(heading)) return false;
  if (/(sources?|מקורות|reading|קריאה|review|בדיקה מקצועית|questions|שאלות|cta|conversation|שיחה|guide review|по намерению|за наміром)/i.test(heading)) {
    return false;
  }
  return true;
};

const clusterDefinitions = {
  "work-visas": {
    entities: ["work visa", "work permit", "B/1 visa", "foreign worker"],
    scenarios: ["employer filing", "renewal", "document mismatch", "entry interview"],
  },
  "citizenship-status": {
    entities: ["citizenship", "residency", "status", "Ministry of Interior"],
    scenarios: ["status regularization", "family process", "hearing", "supplementation request"],
  },
  "tourist-entry": {
    entities: ["tourist visa", "entry permit", "ETA", "border interview"],
    scenarios: ["invitation letter", "prior refusal", "travel planning", "entry approval"],
  },
  "ben-gurion-emergency": {
    entities: ["Ben Gurion", "refusal of entry", "questioning", "detention"],
    scenarios: ["live airport issue", "return flight", "holding", "urgent escalation"],
  },
};

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

const normalizeText = (value) => stripTags(value).replace(/\s+/g, " ").trim();

const extractTag = (html, regex) => {
  const match = html.match(regex);
  return match ? normalizeText(match[1]) : "";
};

const extractHeadings = (html) =>
  Array.from(html.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi))
    .map((match) => normalizeText(match[1]))
    .filter(Boolean);

const extractContent = (html, filePath = "unknown file") => {
  const mainMatch = html.match(/<main[\s\S]*?<\/main>/i);
  if (!mainMatch) {
    console.warn(`[Search Index] Warning: <main> tag missing in "${filePath}". Indexing cleaned body content.`);
    const bodyMatch = html.match(/<body[\s\S]*?<\/body>/i);
    let content = bodyMatch ? bodyMatch[0] : html;
    content = content.replace(/<(nav|header|footer)[\s\S]*?<\/\1>/gi, " ");
    return normalizeText(content).slice(0, 1200);
  }
  return normalizeText(mainMatch[0]).slice(0, 1200);
};

const extractLang = (html) => {
  const match = html.match(/<html[^>]*\blang=["']([^"']+)["']/i);
  return match ? match[1].toLowerCase().split("-")[0] : "";
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

const unique = (values) => Array.from(new Set(values.filter(Boolean)));

const readJson = async (file) => {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return null;
  }
};

const getLocale = (relativePath) => {
  if (relativePath.startsWith("en/")) return "en";
  if (relativePath.startsWith("ru/")) return "ru";
  if (relativePath.startsWith("ua/")) return "uk";
  return "he";
};

const extractArticleClusterMeta = (html) => {
  const match = html.match(/<meta[^>]*name=["']article-cluster["'][^>]*content=["']([^"']+)["']/i);
  return match ? match[1].trim() : "";
};

const clusterOf = (relativePath, html = "") => {
  if (/services\/work-visas\.html$/.test(relativePath)) return "work-visas";
  if (/services\/citizenship\.html$/.test(relativePath)) return "citizenship-status";
  if (/services\/tourist-visas\.html$/.test(relativePath)) return "tourist-entry";
  if (/services\/entry-permits\.html$/.test(relativePath)) return "tourist-entry";
  if (/services\/ben-gurion-emergency\.html$/.test(relativePath)) return "ben-gurion-emergency";
  if (/articles\/work-visas\/index\.html$/.test(relativePath)) return "work-visas";
  if (/articles\/citizenship-status\/index\.html$/.test(relativePath)) return "citizenship-status";
  if (/articles\/tourist-entry\/index\.html$/.test(relativePath)) return "tourist-entry";
  if (/articles\/ben-gurion-emergency\/index\.html$/.test(relativePath)) return "ben-gurion-emergency";

  const explicitCluster = extractArticleClusterMeta(html);
  if (explicitCluster) return explicitCluster;

  const articleMatch = relativePath.match(/articles\/article-(\d+)\.html$/);
  if (!articleMatch) return null;
  const num = Number.parseInt(articleMatch[1], 10);
  if (num >= 1 && num <= 10) return "work-visas";
  if (num >= 11 && num <= 20) return "citizenship-status";
  if (num >= 21 && num <= 30) return "tourist-entry";
  if (num >= 31 && num <= 40) return "ben-gurion-emergency";
  return null;
};

const inferClusterFromContent = (title, description, content) => {
  const haystack = `${title} ${description} ${content}`;
  if (/(ben gurion|נתב.?ג|refusal of entry|airport|questioning|detention|депортац|допрос|допит)/i.test(haystack)) {
    return "ben-gurion-emergency";
  }
  if (/(citizenship|residency|status|ministry of interior|אזרחות|מעמד|תושבות|משרד הפנים|гражданств|статус|резидент|громадянств)/i.test(haystack)) {
    return "citizenship-status";
  }
  if (/(tourist|entry permit|eta|invitation|ויזת תייר|אישור כניסה|הזמנה|турист|въезд|запрошенн|туристич|в.?їзд|запрошення)/i.test(haystack)) {
    return "tourist-entry";
  }
  if (/(work visa|work permit|foreign worker|b\/1|ויזת עבודה|היתר עבודה|עובד זר|рабоч|разрешение на работу|робоч|дозвіл на роботу)/i.test(haystack)) {
    return "work-visas";
  }
  return null;
};

const pageTypeOf = (relativePath) => {
  if (relativePath === "index.html" || /^(en|ru|ua)\/index\.html$/.test(relativePath)) return "home";
  if (/\/?about\.html$/.test(relativePath)) return "about";
  if (/\/?contact\.html$/.test(relativePath)) return "contact";
  if (/services\/index\.html$/.test(relativePath)) return "services-hub";
  if (/services\/[^/]+\.html$/.test(relativePath)) return "service";
  if (/articles\/index\.html$/.test(relativePath)) return "articles-hub";
  if (/articles\/[^/]+\/index\.html$/.test(relativePath)) return "cluster-hub";
  if (/articles\/article-\d+\.html$/.test(relativePath)) return "article";
  if (/glossary\/index\.html$/.test(relativePath)) return "glossary";
  if (/legal\/editorial-policy\.html$/.test(relativePath)) return "editorial-policy";
  if (/legal\/(privacy|terms)\.html$/.test(relativePath)) return "legal";
  return "page";
};

const answerTypeOf = (pageType) => {
  if (pageType === "service") return "service-answer";
  if (pageType === "article") return "article-answer";
  if (pageType === "cluster-hub") return "topic-cluster";
  if (pageType === "glossary") return "defined-terms";
  if (pageType === "editorial-policy") return "governance";
  if (pageType === "contact") return "intake-guidance";
  return "navigational";
};

const scenarioListOf = (pageType, clusterKey, content) => {
  const scenarios = [];
  if (clusterKey && clusterDefinitions[clusterKey]) {
    scenarios.push(...clusterDefinitions[clusterKey].scenarios);
  }
  if (pageType === "contact") scenarios.push("intake", "urgent triage");
  if (pageType === "editorial-policy") scenarios.push("content trust", "editorial review");
  if (/refusal|סירוב|відмов|отказ/i.test(content)) scenarios.push("refusal handling");
  if (/hearing|שימוע|слушан|слухан/i.test(content)) scenarios.push("hearing preparation");
  return unique(scenarios);
};

const extractGovSources = (html) =>
  unique(
    Array.from(html.matchAll(/<a[^>]*href=["']([^"']+)["'][^>]*>/gi))
      .map((match) => match[1])
      .filter((href) => href.includes("gov.il"))
  );

const extractGeoAnswerMetadata = (html) => {
  const shortAnswer =
    extractTag(html, /<section[^>]*class=["'][^"']*geo-answer-section[^"']*["'][\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>/i) ||
    extractTag(html, /<div[^>]*class=["'][^"']*geo-inline-card[^"']*["'][\s\S]*?<p>([\s\S]*?)<\/p>/i);
  const urgentEscalation =
    extractTag(html, /<div[^>]*class=["'][^"']*geo-note geo-note--accent[^"']*["'][\s\S]*?<p>([\s\S]*?)<\/p>/i) ||
    extractTag(html, /<strong>(?:When to contact a lawyer now|מתי נכון לפנות לייעוץ משפטי עכשיו|Когда уже нужен юрист|Коли вже потрібен юрист):<\/strong>\s*([\s\S]*?)<\/p>/i);
  return {
    shortAnswer,
    urgentEscalation,
  };
};

const extractReviewedAt = (html, stat) => {
  const labelMatch = html.match(/(?:נבדק לאחרונה|Last reviewed|Проверено|Оновлено)[^:]*:\s*([^|<\n]+)/i);
  if (labelMatch) {
    return {
      reviewedAt: stat.mtime.toISOString().slice(0, 10),
      reviewedAtDisplay: labelMatch[1].trim(),
    };
  }
  const fallback = stat.mtime.toISOString().slice(0, 10);
  return {
    reviewedAt: fallback,
    reviewedAtDisplay: fallback,
  };
};

const buildEntities = (title, headings, clusterKey, glossaryData) => {
  const entities = [];
  if (clusterKey && clusterDefinitions[clusterKey]) {
    entities.push(...clusterDefinitions[clusterKey].entities);
  }
  entities.push(
    ...title
      .split(/[|–—:]+/)
      .map((part) => part.trim())
      .filter((part) => part.length > 2)
      .slice(0, 4)
  );
  entities.push(
    ...headings
      .map((heading) => heading.trim())
      .filter((heading) => heading.length > 2 && isEntityLikeHeading(heading))
      .slice(0, 6)
  );
  if (glossaryData) {
    for (const localeTerms of Object.values(glossaryData)) {
      for (const item of localeTerms) {
        if (title.includes(item.term)) {
          entities.push(item.term);
        }
      }
    }
  }
  return unique(entities);
};

const walk = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (ignoreDirs.has(entry.name)) continue;
      files.push(...(await walk(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      if (ignoreFiles.has(entry.name) || /template/i.test(entry.name)) continue;
      files.push(fullPath);
    }
  }
  return files;
};

const buildIndex = async () => {
  const glossaryData = await readJson(path.join(root, "assets", "glossary.json"));
  const htmlFiles = await walk(root);
  const items = [];

  for (const file of htmlFiles) {
    const relativePath = path.relative(root, file).replace(/\\/g, "/");
    const html = await fs.readFile(file, "utf8");
    const stat = await fs.stat(file);

    const title = extractTag(html, /<title>([\s\S]*?)<\/title>/i);
    const description = extractTag(
      html,
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i
    );
    const headings = extractHeadings(html);
    const content = extractContent(html, relativePath);
    const lang = extractLang(html) || getLocale(relativePath);
    const url = toUrl(relativePath);
    const pageType = pageTypeOf(relativePath);
    if (pageType === "legal") {
      continue;
    }
    const detectedCluster = clusterOf(relativePath, html);
    const cluster =
      detectedCluster ||
      (pageType === "article" || pageType === "service" || pageType === "cluster-hub"
        ? inferClusterFromContent(title, description, content)
        : null);
    const sources = extractGovSources(html);
    const reviewed = extractReviewedAt(html, stat);
    const entities = buildEntities(title, headings, cluster, glossaryData);
    const scenario = scenarioListOf(pageType, cluster, content);
    const answerType = answerTypeOf(pageType);
    const geoAnswer = extractGeoAnswerMetadata(html);
    const clusterTitle = cluster ? clusterDefinitions[cluster]?.entities?.[0] || cluster.replace(/-/g, " ") : "";
    const localePrefix = lang === "he" ? "" : `/${lang === "uk" ? "ua" : lang}`;
    const recommendedNextPage = cluster ? `${localePrefix}/articles/${cluster}/`.replace(/\/+/g, "/") : "";

    items.push({
      title,
      description,
      headings: headings.join(" | "),
      content,
      lang,
      url,
      pageType,
      cluster,
      entities,
      scenario,
      sources,
      reviewedAt: reviewed.reviewedAt,
      reviewedAtDisplay: reviewed.reviewedAtDisplay,
      answerType,
      shortAnswer: geoAnswer.shortAnswer,
      urgentEscalation: geoAnswer.urgentEscalation,
      clusterTitle,
      recommendedNextPage,
    });
  }

  const knowledgeBase = {
    generatedAt: new Date().toISOString(),
    pages: items,
    clusters: Object.entries(clusterDefinitions).map(([key, value]) => ({
      key,
      entities: value.entities,
      scenarios: value.scenarios,
      pages: items.filter((item) => item.cluster === key).map((item) => item.url),
    })),
    glossary: glossaryData || {},
  };

  await fs.writeFile(outputPath, JSON.stringify(items, null, 2));
  await fs.writeFile(knowledgeBasePath, JSON.stringify(knowledgeBase, null, 2));
  console.log(`Search index generated: ${path.relative(root, outputPath)}`);
  console.log(`Knowledge base generated: ${path.relative(root, knowledgeBasePath)}`);
};

export { buildIndex };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await buildIndex();
}
