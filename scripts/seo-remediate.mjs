import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const currentDate = "2026-04-01";

const ignoreDirs = new Set([
  ".git",
  ".wrangler",
  "content_queue",
  "dist",
  "logs",
  "node_modules",
  "scripts",
]);

const titleOverrides = new Map([
  ["articles/article-17.html", "טעויות שמעכבות תיקי אזרחות בישראל"],
  ["articles/article-19.html", "אזרחות מול תושבות בישראל: מה ההבדל"],
  ["articles/article-22.html", "מכתב הזמנה לישראל: מה צריך לכלול"],
  ["articles/article-34.html", "סיכון להרחקה מישראל: צעדים מיידיים"],
  ["articles/article-35.html", "איזה מידע לתת לעורך דין מהשדה בנתב״ג"],
  ["articles/article-36.html", "חבילת מסמכים לחירום בנתב״ג: מה להכין"],
  ["articles/article-37.html", "טעויות שמחמירות מצב בחירום בנתב״ג"],
  ["en/index.html", "Immigration lawyer in Ashdod | Visas and citizenship"],
  ["en/services/index.html", "Immigration services in Ashdod | Work, status, entry"],
  ["en/services/work-visas.html", "Work visas in Israel | Employers and foreign workers"],
  ["en/articles/index.html", "Immigration articles | Visas, status, Ben Gurion"],
  ["en/articles/article-32.html", "Ben Gurion delay by the Population Authority | What to ask"],
  ["ru/index.html", "Иммиграционный юрист в Ашдоде | Визы и статус"],
  ["ru/services/index.html", "Иммиграционные услуги в Ашдоде | Визы и статус"],
  ["ru/contact.html", "Контакты | Бесплатная консультация Zoom"],
  ["ru/articles/article-32.html", "Задержка в Бен-Гурионе со стороны Управления | Что просить"],
  ["ru/articles/article-33.html", "Задержание на границе в Бен-Гурионе | Что это значит"],
  ["ua/index.html", "Імміграційний юрист в Ашдоді | Візи і статус"],
  ["ua/services/index.html", "Імміграційні послуги в Ашдоді | Візи і статус"],
  ["ua/contact.html", "Контакти | Безкоштовна консультація Zoom"],
  ["ua/articles/article-32.html", "Затримка в Бен-Гуріоні з боку Управління | Що просити"],
  ["ua/articles/article-33.html", "Затримання на кордоні в Бен-Гуріоні | Що це означає"],
  ["ua/articles/article-39.html", "Допит на кордоні в Бен-Гуріоні | Як відповідати чітко"],
]);

const descriptionOverrides = new Map([
  [
    "articles/index.html",
    "ספריית מאמרים על ויזות עבודה, אזרחות, ויזות תייר, אישורי כניסה וחירום בנתב״ג, עם מדריכים, צ'קליסטים והסברים מעשיים."
  ],
  [
    "articles/article-03.html",
    "צ'קליסט מסמכים למעסיק ולעובד זר: מה להכין מראש, איך לתאם בין הגרסאות ואילו מסמכים עוזרים לצמצם דרישות השלמה ועיכובים."
  ],
  [
    "articles/article-07.html",
    "הסבר פשוט למה שנקרא לעיתים אישור עובד זר, איך הוא משתלב בתהליך הוויזה ומה חשוב לבדוק לפני שמתקדמים."
  ],
  [
    "articles/article-12.html",
    "תנאים לאזרחות בישראל: אילו דרישות בסיסיות כדאי לבדוק מראש, איך להבין את הרשימה ואילו מסמכים מסייעים להיערכות נכונה."
  ],
  [
    "articles/article-14.html",
    "צ'קליסט מסמכים להסדרת מעמד ואזרחות: אילו מסמכים להכין, איפה נדרשים תרגומים ואיך שומרים על עקביות בין כל הגרסאות."
  ],
  [
    "articles/article-15.html",
    "איך מקבלים אזרחות בישראל: מבט קצר על המסלולים העיקריים, שלבי ההיערכות ומה חשוב להבין לפני שמתחילים."
  ],
  [
    "articles/article-26.html",
    "סיבות נפוצות לסירוב כניסת תיירים לישראל, מה בודקים בגבול ואיך להיערך עם מסמכים וסיפור ביקור עקבי."
  ],
  [
    "articles/article-31.html",
    "צ'קליסט ל-60 הדקות הראשונות בעת עיכוב בנתב״ג בלילה, עם דגשים למסמכים, תקשורת ובקשת סיוע."
  ],
  [
    "contact.html",
    "קבעו פגישת זום ראשונית, השאירו פרטים בטופס וקבלו כיוון כללי לגבי ויזה, מעמד או אישור כניסה לישראל."
  ],
  [
    "en/about.html",
    "Learn how the firm approaches immigration matters in Israel with clear process mapping, document review, and practical guidance grounded in former authority experience."
  ],
  [
    "en/articles/index.html",
    "English article library on work visas, citizenship, tourist visas, entry permits, and Ben Gurion emergencies, with practical guides and checklists."
  ],
  [
    "en/services/work-visas.html",
    "Work visas in Israel for employers and foreign workers, with document review, process mapping, and practical guidance before filing or entry."
  ],
  [
    "ru/index.html",
    "Четкое юридическое сопровождение по визам, статусу и въезду в Израиль, с проверкой документов, пошаговой стратегией и консультациями в Zoom."
  ],
  [
    "ru/articles/index.html",
    "Русская библиотека статей о рабочих визах, гражданстве, въезде в Израиль и экстренных ситуациях в Бен-Гурионе, с практическими объяснениями и чек-листами."
  ],
  [
    "ua/index.html",
    "Чіткий юридичний супровід щодо віз, статусу та в’їзду до Ізраїлю, з практичними кроками, перевіркою документів і консультаціями в Zoom."
  ],
  [
    "ua/articles/index.html",
    "Українська бібліотека матеріалів про робочі візи, громадянство, в’їзд до Ізраїлю та екстрені ситуації в Бен-Гуріоні."
  ],
  [
    "ua/articles/article-27.html",
    "Практичні поради щодо подання документів на дозвіл на в’їзд: порядок, логіка та спосіб презентації на кордоні."
  ],
  [
    "ua/articles/article-26.html",
    "Поширені причини відмови туристам на в’їзді до Ізраїлю, що перевіряють на кордоні та як підготувати послідовний пакет документів."
  ],
]);

const descriptionSuffixPatterns = {
  he: [
    /\s+ליווי מסודר, מסמכים ברורים, תיאום ציפיות ושירות בזום[\s\S]*$/i,
  ],
  en: [
    /\s+Clear process, organized documents, realistic expectations, and Zoom guidance[\s\S]*$/i,
    /\s+Clear process, organized documents, realistic expectations, and Zoom support[\s\S]*$/i,
  ],
  ru: [
    /\s+Четкий процесс, аккуратные документы, реалистичные ожидания[\s\S]*$/i,
    /\s+Сопровождение и Zoom[\s\S]*$/i,
  ],
  uk: [
    /\s+Чіткий процес, упорядковані документи, реалістичні очікування[\s\S]*$/i,
    /\s+Супровід і Zoom[\s\S]*$/i,
  ],
};

const authorConfig = {
  he: {
    name: "עורכת הדין של המשרד",
    jobTitle: "עורכת דין להגירה",
    description: "לשעבר ברשות האוכלוסין וההגירה, עם מיקוד בויזות, מעמד ואזרחות בישראל.",
    footer:
      "נכתב, נבדק ועודכן על ידי עורכת הדין של המשרד, לשעבר ברשות האוכלוסין וההגירה."
  },
  en: {
    name: "Office Immigration Attorney",
    jobTitle: "Immigration attorney",
    description: "Former Population and Immigration Authority experience, with focus on visas, status, and citizenship in Israel.",
    footer:
      "Written, reviewed, and updated by the office immigration attorney, with former Population and Immigration Authority experience."
  },
  ru: {
    name: "Юрист офиса по иммиграции",
    jobTitle: "Иммиграционный юрист",
    description: "Опыт работы в Управлении по вопросам населения и иммиграции, фокус на визах, статусе и гражданстве в Израиле.",
    footer:
      "Материал подготовлен, проверен и обновлен юристом офиса с опытом работы в Управлении по вопросам населения и иммиграции."
  },
  uk: {
    name: "Юрист офісу з імміграції",
    jobTitle: "Імміграційний юрист",
    description: "Досвід роботи в Управлінні з питань населення та імміграції, фокус на візах, статусі та громадянстві в Ізраїлі.",
    footer:
      "Матеріал підготовлено, перевірено й оновлено юристом офісу з досвідом роботи в Управлінні з питань населення та імміграції."
  },
};

const collectionPageMeta = {
  "articles/index.html": {
    name: "ספריית מאמרים על ויזות, מעמד וחירום בנתב״ג",
    inLanguage: "he",
  },
  "en/articles/index.html": {
    name: "Immigration articles on visas, status, and Ben Gurion emergencies",
    inLanguage: "en",
  },
  "ru/articles/index.html": {
    name: "Статьи о визах, статусе и экстренных ситуациях в Бен-Гурионе",
    inLanguage: "ru",
  },
  "ua/articles/index.html": {
    name: "Матеріали про візи, статус і екстрені ситуації в Бен-Гуріоні",
    inLanguage: "uk",
  },
};

const pageSchemaTypes = {
  "about.html": "AboutPage",
  "contact.html": "ContactPage",
  "en/about.html": "AboutPage",
  "en/contact.html": "ContactPage",
  "ru/about.html": "AboutPage",
  "ru/contact.html": "ContactPage",
  "ua/about.html": "AboutPage",
  "ua/contact.html": "ContactPage",
};

const decodeEntities = (value) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const stripTags = (value) =>
  decodeEntities(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();

const normalizeText = (value) => decodeEntities(value).replace(/\s+/g, " ").trim();

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
      files.push(fullPath);
    }
  }

  return files;
};

const detectLocale = (html, relativePath) => {
  const match = html.match(/<html[^>]*\blang=["']([^"']+)["']/i);
  if (match) {
    return match[1].toLowerCase().split("-")[0];
  }
  if (relativePath.startsWith("en/")) return "en";
  if (relativePath.startsWith("ru/")) return "ru";
  if (relativePath.startsWith("ua/")) return "uk";
  return "he";
};

const getTitle = (html) => {
  const match = html.match(/<title>([\s\S]*?)<\/title>/i);
  return match ? normalizeText(match[1]) : "";
};

const setTitle = (html, value) =>
  html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(value)}</title>`);

const getMeta = (html, attr, name) => {
  const pattern = new RegExp(
    `<meta[^>]*${attr}="${name}"[^>]*content="([\\s\\S]*?)"[^>]*>`,
    "i"
  );
  const match = html.match(pattern);
  return match ? normalizeText(match[1]) : "";
};

const setMeta = (html, attr, name, value) => {
  const pattern = new RegExp(
    `(<meta[^>]*${attr}="${name}"[^>]*content=")([\\s\\S]*?)("[^>]*>)`,
    "i"
  );
  if (!pattern.test(html)) {
    return html;
  }
  return html.replace(pattern, `$1${escapeHtml(value)}$3`);
};

const getCanonical = (html) => {
  const match = html.match(
    /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i
  );
  return match ? match[1] : "";
};

const extractH1 = (html) => {
  const match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return match ? stripTags(match[1]) : "";
};

const extractParagraphs = (html) => {
  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] ?? html;
  return Array.from(main.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi))
    .map((match) => stripTags(match[1]))
    .filter(Boolean);
};

const isUsefulParagraph = (text) => {
  if (!text) {
    return false;
  }
  if (text.length < 55) {
    return false;
  }
  const ignored = [
    "מידע כללי בלבד",
    "General information only",
    "Общая информация",
    "Загальна інформація",
    "מאמרים ומדריכים",
    "Articles and guides",
    "Статьи и материалы",
    "Статті та матеріали",
    "צור קשר",
    "Contact",
    "Контакты",
    "Контакти",
    "שיחת זום קצרה",
    "פגישת זום קצרה",
    "שיחה קצרה בזום",
    "A short Zoom consultation",
    "A brief Zoom consultation",
    "Brief Zoom guidance",
    "Короткая консультация",
    "Небольшая консультация",
    "Коротка консультація",
    "Невелика консультація",
  ];
  return !ignored.some((snippet) => text.includes(snippet));
};

const ensureSentence = (value) => {
  const text = value.trim();
  if (!text) {
    return text;
  }
  if (/[.!?։»”"]$/.test(text)) {
    return text;
  }
  return `${text}.`;
};

const clampText = (value, max = 155) => {
  const text = value.trim();
  if (!text) {
    return text;
  }
  if (text.length <= max) {
    return ensureSentence(text);
  }

  const sliced = text.slice(0, max + 1);
  const lastSpace = sliced.lastIndexOf(" ");
  const trimmed = (lastSpace > 90 ? sliced.slice(0, lastSpace) : sliced.slice(0, max))
    .replace(/[,\s]+$/g, "")
    .trim();
  return ensureSentence(trimmed);
};

const cleanDescription = (value, locale) => {
  let text = normalizeText(value);
  for (const pattern of descriptionSuffixPatterns[locale] ?? []) {
    text = text.replace(pattern, "").trim();
  }
  text = text.replace(/\s+([,.;!?])/g, "$1");
  text = text.replace(/[|•-]\s*$/g, "");
  return clampText(text);
};

const buildFallbackDescription = (html, locale, h1) => {
  const paragraphs = extractParagraphs(html).filter(isUsefulParagraph);
  const firstParagraph = paragraphs[0] ?? "";
  if (!firstParagraph) {
    return clampText(h1);
  }

  if (firstParagraph.length >= 70) {
    return clampText(firstParagraph);
  }

  return clampText(`${h1}. ${firstParagraph}`);
};

const replaceFooterNote = (html, locale) => {
  if (!/\/articles\//.test(html) && !/<p class="footer-note">/.test(html)) {
    return html;
  }

  const footer = authorConfig[locale]?.footer;
  if (!footer) {
    return html;
  }

  return html.replace(
    /<p class="footer-note">([\s\S]*?)<\/p>/,
    `<p class="footer-note">${escapeHtml(footer)}</p>`
  );
};

const replaceArticleAuthor = (html, locale) => {
  if (!/"@type"\s*:\s*"Article"/.test(html)) {
    return html;
  }

  const author = authorConfig[locale];
  if (!author) {
    return html;
  }

  const replacement = [
    '  "author": {',
    '    "@type": "Person",',
    `    "name": ${JSON.stringify(author.name)},`,
    `    "jobTitle": ${JSON.stringify(author.jobTitle)},`,
    `    "description": ${JSON.stringify(author.description)},`,
    '    "worksFor": {',
    '      "@id": "https://immigration.the-israeli-lawyer.com/#business"',
    "    }",
    "  },",
  ].join("\n");

  return html
    .replace(/  "author": \{\n[\s\S]*?\n  \},\n(?=  "mainEntityOfPage")/, `${replacement}\n`)
    .replace(/("dateModified":\s*")([^"]+)(")/, `$1${currentDate}$3`);
};

const setImageAttributes = (html) => {
  let index = 0;

  const setAttribute = (attrs, name, value) => {
    const pattern = new RegExp(`\\b${name}=["'][^"']*["']`, "i");
    if (pattern.test(attrs)) {
      return attrs.replace(pattern, `${name}="${value}"`);
    }
    return `${attrs} ${name}="${value}"`;
  };

  const removeAttribute = (attrs, name) =>
    attrs.replace(new RegExp(`\\s*\\b${name}=["'][^"']*["']`, "ig"), "");

  return html.replace(/<img\b([^>]*?)>/gi, (full, rawAttrs) => {
    index += 1;
    let attrs = rawAttrs.trim();
    attrs = setAttribute(attrs, "decoding", "async");

    if (index === 1) {
      attrs = removeAttribute(attrs, "loading");
      attrs = setAttribute(attrs, "fetchpriority", "high");
    } else {
      attrs = setAttribute(attrs, "loading", "lazy");
      attrs = removeAttribute(attrs, "fetchpriority");
    }

    return `<img ${attrs}>`;
  });
};

const injectJsonLd = (html, schemaType, schema) => {
  if (new RegExp(`"@type"\\s*:\\s*"${schemaType}"`).test(html)) {
    return html;
  }

  const payload = [
    '    <script type="application/ld+json">',
    JSON.stringify(schema, null, 2),
    "",
    "    </script>",
  ].join("\n");

  return html.replace("</head>", `${payload}\n  </head>`);
};

const buildCollectionSchema = (relativePath, canonical, description) => {
  const meta = collectionPageMeta[relativePath];
  if (!meta) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: meta.name,
    description,
    inLanguage: meta.inLanguage,
    url: canonical,
    about: {
      "@id": "https://immigration.the-israeli-lawyer.com/#business",
    },
  };
};

const buildPageSchema = (relativePath, canonical, description, h1, locale) => {
  const type = pageSchemaTypes[relativePath];
  if (!type) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": type,
    name: h1,
    description,
    inLanguage: locale,
    url: canonical,
    about: {
      "@id": "https://immigration.the-israeli-lawyer.com/#business",
    },
  };
};

const updateMetadata = (html, relativePath, locale) => {
  const h1 = extractH1(html);

  if (titleOverrides.has(relativePath)) {
    const nextTitle = titleOverrides.get(relativePath);
    html = setTitle(html, nextTitle);
  }

  const nextTitle = getTitle(html);
  html = setMeta(html, "property", "og:title", nextTitle);
  html = setMeta(html, "name", "twitter:title", nextTitle);

  const currentDescription = getMeta(html, "name", "description");
  const cleanedDescription = cleanDescription(currentDescription, locale);
  const fallbackDescription = buildFallbackDescription(html, locale, h1);
  const overrideDescription = descriptionOverrides.get(relativePath);
  const looksBroken =
    !cleanedDescription ||
    cleanedDescription.length < 70 ||
    /[.!?]["']\S/.test(cleanedDescription) ||
    /[.!?]׳\S/.test(cleanedDescription);

  let nextDescription = overrideDescription
    ? overrideDescription
    : looksBroken
      ? fallbackDescription
      : cleanedDescription;

  nextDescription = clampText(nextDescription);
  html = setMeta(html, "name", "description", nextDescription);
  html = setMeta(html, "property", "og:description", nextDescription);
  html = setMeta(html, "name", "twitter:description", nextDescription);

  const canonical = getCanonical(html);
  const collectionSchema = buildCollectionSchema(relativePath, canonical, nextDescription);
  if (collectionSchema) {
    html = injectJsonLd(html, "CollectionPage", collectionSchema);
  }

  const pageSchema = buildPageSchema(relativePath, canonical, nextDescription, h1, locale);
  if (pageSchema) {
    html = injectJsonLd(html, pageSchema["@type"], pageSchema);
  }

  return html;
};

const main = async () => {
  const files = await walk(root);
  let changedCount = 0;

  for (const filePath of files) {
    const relativePath = path.relative(root, filePath).replace(/\\/g, "/");
    const original = await fs.readFile(filePath, "utf8");
    let html = original;
    const locale = detectLocale(html, relativePath);

    html = html.replace(/\bhreflang=(["'])uk-UA\1/gi, 'hreflang="uk"');
    html = updateMetadata(html, relativePath, locale);
    html = setImageAttributes(html);

    if (/\/articles\/article-|^articles\/article-/.test(relativePath)) {
      html = replaceFooterNote(html, locale);
      html = replaceArticleAuthor(html, locale);
    }

    if (html !== original) {
      await fs.writeFile(filePath, html);
      changedCount += 1;
    }
  }

  console.log(`SEO remediation updated ${changedCount} HTML files.`);
};

await main();
