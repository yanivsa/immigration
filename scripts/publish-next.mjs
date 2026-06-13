import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const localeConfigs = {
  he: {
    dir: "rtl",
    htmlLang: "he",
    prefix: "",
    businessName: "משרד עורכי דין להגירה",
    home: "דף הבית",
    services: "שירותים",
    articles: "מאמרים",
    about: "אודות",
    contact: "צור קשר",
    emergency: "חירום בנתב״ג",
    ctaHeading: "רוצים להבין את הצעד הבא בצורה מסודרת?",
    ctaBody: "שיחת בירור ראשונית יכולה לסדר את המסמכים, להפחית טעויות מוקדמות ולהבהיר מה באמת דורש טיפול פרטני.",
    ctaPrimary: "לקביעת שיחת בירור",
    ctaSecondary: "לשליחת פרטים",
    takeaways: "עיקרי הדברים",
    overview: "הסבר כללי",
    checklist: "מה כדאי להכין מראש",
    pitfalls: "טעויות נפוצות",
    faq: "שאלות נפוצות",
    sources: "מקורות והמשך קריאה",
    related: "המשך קריאה לפי כוונה",
    disclaimer: "המידע כללי בלבד ואינו מהווה ייעוץ משפטי מותאם לנסיבות המקרה.",
    answerLabel: "תשובה קצרה",
    reviewLabel: "נבדק לאחרונה",
    localeCode: "he",
    imageAlt: "משרד עורכי דין להגירה באשדוד עם מסמכים משפטיים מסודרים",
  },
  en: {
    dir: "ltr",
    htmlLang: "en",
    prefix: "/en",
    businessName: "Immigration Law Office",
    home: "Home",
    services: "Services",
    articles: "Articles",
    about: "About",
    contact: "Contact",
    emergency: "Ben Gurion emergency",
    ctaHeading: "Need a clearer next step?",
    ctaBody: "An initial review call can organize the file, reduce avoidable mistakes, and show what actually needs case-specific legal attention.",
    ctaPrimary: "Book an initial review",
    ctaSecondary: "Send your details",
    takeaways: "Key takeaways",
    overview: "Overview",
    checklist: "What to prepare in advance",
    pitfalls: "Common pitfalls",
    faq: "Frequently asked questions",
    sources: "Sources and further reading",
    related: "Next reading by intent",
    disclaimer: "General information only. Not individualized legal advice.",
    answerLabel: "Quick answer",
    reviewLabel: "Last reviewed",
    localeCode: "en",
    imageAlt: "Immigration law office in Ashdod with organized legal documents",
  },
  ru: {
    dir: "ltr",
    htmlLang: "ru",
    prefix: "/ru",
    businessName: "Иммиграционный юридический офис",
    home: "Главная",
    services: "Услуги",
    articles: "Статьи",
    about: "О нас",
    contact: "Контакты",
    emergency: "Экстренная помощь в Бен-Гурионе",
    ctaHeading: "Нужен понятный следующий шаг?",
    ctaBody: "Первичный разбор помогает собрать документы, убрать ранние ошибки и понять, что действительно требует индивидуальной юридической проверки.",
    ctaPrimary: "Записаться на первичный разбор",
    ctaSecondary: "Отправить данные",
    takeaways: "Ключевые выводы",
    overview: "Общий обзор",
    checklist: "Что подготовить заранее",
    pitfalls: "Типичные ошибки",
    faq: "Частые вопросы",
    sources: "Источники и полезные материалы",
    related: "Что читать дальше",
    disclaimer: "Это общая информация, а не индивидуальная юридическая консультация.",
    answerLabel: "Короткий ответ",
    reviewLabel: "Проверено",
    localeCode: "ru",
    imageAlt: "Иммиграционный юридический офис в Ашдоде и подготовленные документы",
  },
  uk: {
    dir: "ltr",
    htmlLang: "uk-UA",
    prefix: "/ua",
    businessName: "Імміграційний юридичний офіс",
    home: "Головна",
    services: "Послуги",
    articles: "Статті",
    about: "Про нас",
    contact: "Контакти",
    emergency: "Термінова допомога в Бен-Гуріоні",
    ctaHeading: "Потрібен зрозумілий наступний крок?",
    ctaBody: "Початковий розбір допомагає впорядкувати документи, прибрати ранні помилки та зрозуміти, що справді потребує індивідуальної юридичної перевірки.",
    ctaPrimary: "Записатися на первинний розбір",
    ctaSecondary: "Надіслати дані",
    takeaways: "Ключові висновки",
    overview: "Загальний огляд",
    checklist: "Що підготувати заздалегідь",
    pitfalls: "Типові помилки",
    faq: "Часті запитання",
    sources: "Джерела та корисні матеріали",
    related: "Що читати далі",
    disclaimer: "Це загальна інформація, а не індивідуальна юридична консультація.",
    answerLabel: "Коротка відповідь",
    reviewLabel: "Перевірено",
    localeCode: "uk-UA",
    imageAlt: "Імміграційний юридичний офіс в Ашдоді та підготовлені документи",
  },
};

const localeFileNames = {
  he: "he.md",
  en: "en.md",
  ru: "ru.md",
  uk: "uk.md",
};

const queueClusterMap = {
  "work-visa": "work-visas",
  "tourist-visa": "tourist-entry",
  "entry-permit": "tourist-entry",
  citizenship: "citizenship-status",
  status: "citizenship-status",
  family: "citizenship-status",
  immigration: "citizenship-status",
  "law-of-return": "citizenship-status",
  admin: "citizenship-status",
  documents: "citizenship-status",
  emergency: "ben-gurion-emergency",
  "ben-gurion-emergency": "ben-gurion-emergency",
};

const imageSourcePolicy = {
  guidance: "Source high-quality, royalty-free photography primarily from Unsplash and Pexels.",
  allowedProviders: new Set(["Unsplash", "Pexels", "existing-local-asset"]),
  preferredProviders: new Set(["Unsplash", "Pexels"]),
};

const clusterMeta = {
  "work-visas": {
    servicePath: "/services/work-visas",
    hubSlug: "work-visas",
    image: "/images/checklist-passport-desk.jpg",
    imageSource: {
      provider: "existing-local-asset",
      note: "Existing approved local site asset. New or replacement article photography should primarily use Unsplash or Pexels.",
    },
    questionSets: {
      he: [
        ["מתי נכון להתחיל לאסוף מסמכים?", "כדאי להתחיל לפני הגשה, כדי לזהות מסמכים חסרים ופערים בין גרסאות."],
        ["מה בדרך כלל מעכב תיקים?", "חוסר עקביות בין מסמכים, תיאור תפקיד לא ברור או תגובה מאוחרת לדרישת השלמה."],
        ["מתי צריך ייעוץ פרטני?", "כאשר יש דרישת השלמה מורכבת, סירוב, דחיפות או קושי להבין איזה מסלול באמת מתאים."],
      ],
      en: [
        ["When should documents be organized?", "Before filing, so gaps and inconsistencies can be found early."],
        ["What usually delays a file?", "Inconsistent records, unclear job framing, or a slow reply to an authority request."],
        ["When is tailored advice worth it?", "After a refusal, a complex evidence request, or when the route itself is still unclear."],
      ],
      ru: [
        ["Когда лучше собирать документы?", "До подачи, чтобы заранее увидеть пробелы и несоответствия."],
        ["Что чаще всего задерживает дело?", "Несогласованность документов, неясная роль или поздний ответ на запрос ведомства."],
        ["Когда уже нужен персональный совет?", "При отказе, сложном запросе на дополнение или неясном маршруте."],
      ],
      uk: [
        ["Коли краще збирати документи?", "До подачі, щоб заздалегідь побачити прогалини та неузгодженості."],
        ["Що найчастіше затримує справу?", "Неузгоджені документи, нечіткий опис ролі або запізніла відповідь на запит органу."],
        ["Коли вже потрібна персональна порада?", "Після відмови, складного запиту на доповнення або коли маршрут досі неясний."],
      ],
    },
  },
  "tourist-entry": {
    servicePath: "/services/entry-permits",
    hubSlug: "tourist-entry",
    image: "/images/legal-document-checklist.jpg",
    imageSource: {
      provider: "existing-local-asset",
      note: "Existing approved local site asset. New or replacement article photography should primarily use Unsplash or Pexels.",
    },
    questionSets: {
      he: [
        ["מה חשוב להסביר מראש?", "מטרת ביקור ברורה, מסלול נסיעה עקבי והקשר בין המסמכים לסיבת הכניסה."],
        ["מתי הסיכון עולה?", "כאשר יש סירוב קודם, היסטוריית כניסה רגישה או פער בין הסיפור למסמכים."],
        ["מתי נכון לעצור לייעוץ?", "כאשר צריך אישור כניסה מיוחד, תשאול גבול או תגובה לדחייה."],
      ],
      en: [
        ["What should be made clear early?", "The visit purpose, travel logic, and how the documents support the entry story."],
        ["When does risk increase?", "After a prior refusal, sensitive entry history, or gaps between the story and the paperwork."],
        ["When should legal review start?", "When prior approval, a border interview, or a refusal response is involved."],
      ],
      ru: [
        ["Что важно объяснить заранее?", "Цель визита, логику поездки и связь между документами и причиной въезда."],
        ["Когда риск выше?", "После прошлого отказа, чувствительной истории въезда или расхождений между версией и документами."],
        ["Когда уже нужен юрист?", "Когда требуется специальное разрешение на въезд, интервью на границе или ответ на отказ."],
      ],
      uk: [
        ["Що важливо пояснити заздалегідь?", "Мету візиту, логіку поїздки та зв’язок між документами і причиною в’їзду."],
        ["Коли ризик вищий?", "Після попередньої відмови, чутливої історії в’їзду або розбіжностей між версією та документами."],
        ["Коли вже потрібен юрист?", "Коли потрібен спеціальний дозвіл на в’їзд, співбесіда на кордоні або відповідь на відмову."],
      ],
    },
  },
  "citizenship-status": {
    servicePath: "/services/citizenship",
    hubSlug: "citizenship-status",
    image: "/images/family-citizenship-israel.jpg",
    imageSource: {
      provider: "existing-local-asset",
      note: "Existing approved local site asset. New or replacement article photography should primarily use Unsplash or Pexels.",
    },
    questionSets: {
      he: [
        ["מה בודקים קודם?", "קודם מבררים איזה מסלול באמת רלוונטי, ורק אחר כך בונים תיק מסמכים לפי השלב."],
        ["איפה אנשים נתקעים בדרך כלל?", "בפערי תאריכים, במסמכי זהות לא עקביים, או בהבנה חלקית של דרישות ההליך."],
        ["מתי נכון לפנות לייעוץ משפטי?", "כאשר יש דחייה, שימוע, דרישת השלמה מורכבת או אי-בהירות לגבי הזכאות."],
      ],
      en: [
        ["What should be checked first?", "First identify the correct legal track, then build the file around the actual procedural stage."],
        ["Where do people usually get stuck?", "In date mismatches, inconsistent identity records, or partial understanding of the route."],
        ["When is legal review most useful?", "After a refusal, a hearing, a complex evidence request, or uncertainty about eligibility."],
      ],
      ru: [
        ["Что проверяют сначала?", "Сначала определяют правильный правовой маршрут, а уже потом собирают дело под конкретный этап."],
        ["Где люди чаще всего застревают?", "В несоответствии дат, документов личности или неполном понимании процедуры."],
        ["Когда особенно нужен юрист?", "После отказа, приглашения на слушание, сложного запроса на дополнение или сомнений в праве."],
      ],
      uk: [
        ["Що перевіряють спочатку?", "Спочатку визначають правильний правовий маршрут, а вже потім збирають справу під конкретний етап."],
        ["Де люди найчастіше застрягають?", "У розбіжностях дат, документів особи або неповному розумінні процедури."],
        ["Коли особливо потрібен юрист?", "Після відмови, запрошення на слухання, складного запиту на доповнення або сумнівів щодо права."],
      ],
    },
  },
  "ben-gurion-emergency": {
    servicePath: "/services/ben-gurion-emergency",
    hubSlug: "ben-gurion-emergency",
    image: "/images/ben-gurion-airport-entry.jpg",
    imageSource: {
      provider: "existing-local-asset",
      note: "Existing approved local site asset. New or replacement article photography should primarily use Unsplash or Pexels.",
    },
    questionSets: {
      he: [
        ["מה עושים קודם?", "אוספים עובדות, מסמכים ופרטי טיסה לפני שמנסים להסביר או להגיב מתוך לחץ."],
        ["מה מסוכן במיוחד?", "שינוי גרסה, חתימה בלי הבנה או תגובה מאוחרת כשכבר נמסרה החלטה."],
        ["מתי צריך טיפול מיידי?", "כאשר יש סירוב כניסה, החזקה, חוסר בהירות בהחלטה או חלון זמן קצר מאוד לפעולה."],
      ],
      en: [
        ["What comes first?", "Gather facts, documents, and flight details before reacting under pressure."],
        ["What creates the biggest risk?", "Changing the story, signing without understanding, or reacting too late after a decision is issued."],
        ["When is immediate help needed?", "After a refusal of entry, holding, unclear decision language, or a very short action window."],
      ],
      ru: [
        ["Что делать сначала?", "Собрать факты, документы и данные рейса до того, как отвечать под давлением."],
        ["Что особенно рискованно?", "Менять версию, подписывать непонятные документы или реагировать слишком поздно."],
        ["Когда помощь нужна немедленно?", "При отказе во въезде, удержании, неясной формулировке решения или очень коротком сроке на реакцию."],
      ],
      uk: [
        ["Що робити спочатку?", "Зібрати факти, документи та дані рейсу до того, як відповідати під тиском."],
        ["Що особливо ризиковано?", "Змінювати версію, підписувати незрозумілі документи або реагувати запізно."],
        ["Коли допомога потрібна негайно?", "При відмові у в’їзді, утриманні, нечіткому рішенні або дуже короткому строку на реакцію."],
      ],
    },
  },
};

const officialSources = {
  he: [
    ["רשות האוכלוסין וההגירה", "https://www.gov.il/he/departments/population_and_immigration_authority"],
    ["משרד הפנים", "https://www.gov.il/he/departments/ministry_of_interior"],
  ],
  en: [
    ["Population and Immigration Authority", "https://www.gov.il/he/departments/population_and_immigration_authority"],
    ["Ministry of Interior", "https://www.gov.il/he/departments/ministry_of_interior"],
  ],
  ru: [
    ["Управление по вопросам населения и иммиграции", "https://www.gov.il/he/departments/population_and_immigration_authority"],
    ["Министерство внутренних дел", "https://www.gov.il/he/departments/ministry_of_interior"],
  ],
  uk: [
    ["Управління з питань населення та імміграції", "https://www.gov.il/he/departments/population_and_immigration_authority"],
    ["Міністерство внутрішніх справ", "https://www.gov.il/he/departments/ministry_of_interior"],
  ],
};

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const normalizeCluster = (value) => queueClusterMap[value] || "citizenship-status";

const validateImageSourcePolicy = () => {
  for (const [clusterKey, meta] of Object.entries(clusterMeta)) {
    if (!meta.image) {
      throw new Error(`Missing article image for cluster ${clusterKey}`);
    }
    const provider = meta.imageSource?.provider;
    if (!imageSourcePolicy.allowedProviders.has(provider)) {
      throw new Error(
        `Cluster ${clusterKey} image source must be Unsplash, Pexels, or an approved local asset. ` +
          imageSourcePolicy.guidance
      );
    }
  }
};

const parseDateTime = (value) => {
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})$/);
  if (!match) {
    throw new Error(`Invalid datetime: ${value}`);
  }
  return new Date(
    Number.parseInt(match[1], 10),
    Number.parseInt(match[2], 10) - 1,
    Number.parseInt(match[3], 10),
    Number.parseInt(match[4], 10),
    Number.parseInt(match[5], 10),
    0,
    0
  );
};

const formatDisplayDate = (date, locale) =>
  new Intl.DateTimeFormat(localeConfigs[locale].localeCode, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

const readCsv = async (filePath) => {
  const text = await fs.readFile(filePath, "utf8");
  const rows = [];
  let currentRow = [];
  let currentVal = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const nextChar = text[i + 1];
    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentVal += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        currentVal += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      currentRow.push(currentVal);
      currentVal = "";
    } else if (char === "\n" || (char === "\r" && nextChar === "\n")) {
      currentRow.push(currentVal);
      rows.push(currentRow);
      currentRow = [];
      currentVal = "";
      if (char === "\r") i += 1;
    } else if (char === "\r") {
      currentRow.push(currentVal);
      rows.push(currentRow);
      currentRow = [];
      currentVal = "";
    } else {
      currentVal += char;
    }
  }

  if (currentRow.length > 0 || currentVal !== "") {
    currentRow.push(currentVal);
    rows.push(currentRow);
  }

  const nonEmptyRows = rows.filter((row) => row.some((cell) => String(cell).trim() !== ""));
  const header = nonEmptyRows[0];
  const data = nonEmptyRows.slice(1).map((values) => {
    const row = {};
    for (let i = 0; i < header.length; i += 1) {
      row[header[i]] = values[i] ?? "";
    }
    return row;
  });
  return { header, rows: data };
};

const writeCsv = async (filePath, header, rows) => {
  const escapeCsv = (value) => {
    const text = String(value ?? "");
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const content = [
    header.join(","),
    ...rows.map((row) => header.map((key) => escapeCsv(row[key])).join(",")),
  ].join("\n");
  await fs.writeFile(filePath, `${content}\n`, "utf8");
};

const parseFrontMatter = (content) => {
  const match = content.match(/^---\n([\s\S]*?)\n---\n\n?([\s\S]*)$/);
  if (!match) {
    throw new Error("Missing front matter");
  }
  const meta = {};
  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    meta[key] = value;
  }
  return { meta, body: match[2].trim() };
};

const nextArticleNumber = async () => {
  const entries = await fs.readdir(path.join(root, "articles"));
  const numbers = entries
    .map((name) => name.match(/^article-(\d+)\.html$/))
    .filter(Boolean)
    .map((match) => Number.parseInt(match[1], 10));
  return Math.max(...numbers) + 1;
};

const buildQueueDirName = (row) => `${String(row.scheduled_at).split(" ")[0]}-${row.intent}`;

const loadLocaleInputs = async (row) => {
  const queueDir = path.join(root, "content_queue", buildQueueDirName(row));
  const result = {};
  for (const [locale, fileName] of Object.entries(localeFileNames)) {
    const filePath = path.join(queueDir, fileName);
    let source = null;
    try {
      source = await fs.readFile(filePath, "utf8");
    } catch {
      source = null;
    }
    if (source) {
      result[locale] = parseFrontMatter(source).meta;
      continue;
    }
    result[locale] = {
      title: row[`keyword_${locale === "uk" ? "uk" : locale}`] || row.keyword_en || row.intent,
      keyword: row[`keyword_${locale === "uk" ? "uk" : locale}`] || row.keyword_en || row.intent,
      cluster: row.cluster,
      intent: row.intent,
      scheduled_at: row.scheduled_at,
    };
  }
  return result;
};

const buildDescription = (locale, title, clusterKey) => {
  const descriptions = {
    he: `המאמר "${title}" מסביר את המסגרת הכללית, המסמכים הנפוצים והנקודות שכדאי לבדוק מראש במסלול ${clusterKey === "work-visas" ? "ההגירה והעבודה" : "ההגירה והמעמד"}.`,
    en: `This guide on "${title}" explains the general framework, common documents, and the main checkpoints to review early.`,
    ru: `Материал "${title}" объясняет общую рамку, типовые документы и ключевые точки проверки на раннем этапе.`,
    uk: `Матеріал "${title}" пояснює загальну рамку, типові документи та ключові точки перевірки на ранньому етапі.`,
  };
  return descriptions[locale];
};

const buildOverview = (locale, title, keyword, clusterKey) => {
  const byLocale = {
    he: [
      `${title} הוא נושא שמבלבל לא מעט אנשים, בעיקר כאשר מנסים להבין איזה מסלול רלוונטי, אילו מסמכים באמת חשובים, ומה משתנה לפי נסיבות אישיות או שלב ההליך.`,
      `במקום להסתמך על תשובה קצרה מדי, עדיף לבדוק את ${keyword} דרך שלושה צירים: מסלול משפטי נכון, מסמכים עקביים, ותזמון נכון של הפעולה הבאה.`,
      clusterKey === "ben-gurion-emergency"
        ? `במקרי חירום חשוב במיוחד לא לאלתר גרסה חדשה תוך כדי לחץ, אלא לאסוף את העובדות, לשמור מסמכים, ולהבין איזו החלטה כבר ניתנה בפועל.`
        : `במרבית המקרים, הבעיה אינה רק “מה להגיש”, אלא גם איך להציג את התיק באופן עקבי כך שהרשויות יבינו את ההיגיון שמאחורי הבקשה.`,
    ],
    en: [
      `${title} often sounds simpler than it is. In practice, the real issue is usually not only what to file, but how the legal route, the documents, and the timing fit together.`,
      `A useful way to approach ${keyword} is to check three things first: the right legal track, a consistent document set, and the practical next step that matches the current stage.`,
      clusterKey === "ben-gurion-emergency"
        ? `In live airport cases, the priority is to gather facts and documents before reacting under pressure, so the next decision is not shaped by confusion or missing context.`
        : `That is why a general guide should help you reduce confusion, narrow the decision tree, and identify when the matter stops being routine and starts requiring direct legal review.`,
    ],
    ru: [
      `${title} обычно выглядит проще, чем есть на самом деле. На практике важно не только что подавать, но и как связаны правовой маршрут, документы и правильный момент для следующего шага.`,
      `Полезно разбирать ${keyword} через три вопроса: какой правовой путь подходит, насколько согласованы документы и что является практическим следующим действием именно сейчас.`,
      clusterKey === "ben-gurion-emergency"
        ? `В ситуации в аэропорту приоритет — сначала собрать факты и документы, а уже потом отвечать под давлением, чтобы следующее решение не строилось на путанице.`
        : `Именно поэтому общий материал должен уменьшать хаос, сужать дерево решений и показывать, когда ситуация уже требует прямой юридической проверки.`,
    ],
    uk: [
      `${title} зазвичай виглядає простіше, ніж є насправді. На практиці важливо не лише що подавати, а й як поєднуються правовий маршрут, документи та правильний момент для наступного кроку.`,
      `Корисно розбирати ${keyword} через три питання: який правовий шлях підходить, наскільки узгоджені документи і що є практичним наступним кроком саме зараз.`,
      clusterKey === "ben-gurion-emergency"
        ? `У ситуації в аеропорту пріоритет — спочатку зібрати факти й документи, а вже потім відповідати під тиском, щоб наступне рішення не будувалося на плутанині.`
        : `Саме тому загальний матеріал має зменшувати хаос, звужувати дерево рішень і показувати, коли ситуація вже потребує прямої юридичної перевірки.`,
    ],
  };
  return byLocale[locale];
};

const buildChecklist = (locale, keyword, clusterKey) => {
  const defaultLists = {
    he: [
      `רשימת מסמכים שקשורים ל-${keyword}.`,
      "ציר זמן קצר עם תאריכים עיקריים.",
      "כל החלטה, דרישת השלמה או הודעה רשמית שכבר התקבלה.",
      "שמות ופרטי קשר של גורמים רלוונטיים בישראל.",
    ],
    en: [
      `A document list directly tied to ${keyword}.`,
      "A short timeline with the key dates.",
      "Any official decision, notice, or request already received.",
      "Names and contact details of relevant people in Israel.",
    ],
    ru: [
      `Список документов, напрямую связанных с ${keyword}.`,
      "Короткая хронология с ключевыми датами.",
      "Все официальные решения, уведомления или запросы, уже полученные по делу.",
      "Имена и контакты relevant лиц в Израиле.",
    ],
    uk: [
      `Список документів, безпосередньо пов’язаних із ${keyword}.`,
      "Коротка хронологія з ключовими датами.",
      "Усі офіційні рішення, повідомлення або запити, уже отримані у справі.",
      "Імена та контакти relevant осіб в Ізраїлі.",
    ],
  };
  if (clusterKey === "ben-gurion-emergency") {
    return {
      he: ["שם מלא, מספר דרכון ומספר טיסה.", "צילום של כל החלטה או מסמך שנמסר.", "איש קשר זמין בישראל.", "הסבר קצר ואחיד על מטרת הכניסה."],
      en: ["Full name, passport number, and flight number.", "A photo of any decision or airport document.", "A reachable contact in Israel.", "A short and consistent explanation of the visit purpose."],
      ru: ["Полное имя, номер паспорта и номер рейса.", "Фото любого решения или документа из аэропорта.", "Доступный контакт в Израиле.", "Короткое и последовательное объяснение цели въезда."],
      uk: ["Повне ім’я, номер паспорта та номер рейсу.", "Фото будь-якого рішення або документа з аеропорту.", "Доступний контакт в Ізраїлі.", "Коротке й послідовне пояснення мети в’їзду."],
    }[locale];
  }
  return defaultLists[locale];
};

const buildPitfalls = (locale, clusterKey) => {
  const base = {
    he: ["לא להסתמך על מסמך אחד בלבד אם יש עוד מסמכים שמסבירים את התמונה.", "לא להשאיר פער בין הסבר בעל פה לבין מה שכתוב במסמכים.", "לא להמתין לרגע האחרון אם כבר יש דחיפות או בקשה להשלמה."],
    en: ["Do not rely on a single document when the broader context matters.", "Do not let the spoken explanation drift away from the written file.", "Do not wait until the last minute once urgency or a request for evidence already exists."],
    ru: ["Не стоит опираться только на один документ, если важен весь контекст.", "Не допускайте расхождения между устным объяснением и письменным делом.", "Не откладывайте до последнего, если уже есть срочность или запрос на дополнение."],
    uk: ["Не варто спиратися лише на один документ, якщо важливий увесь контекст.", "Не допускайте розходження між усним поясненням і письмовою справою.", "Не відкладайте до останнього, якщо вже є терміновість або запит на доповнення."],
  };
  if (clusterKey === "ben-gurion-emergency") {
    return {
      he: ["לא לחתום על מסמך שלא הובן.", "לא לשנות גרסה מתוך לחץ.", "לא להניח שאפשר יהיה להסביר הכול מאוחר יותר בלי תיעוד."],
      en: ["Do not sign a document you do not understand.", "Do not change the story under pressure.", "Do not assume everything can be clarified later without documentation."],
      ru: ["Не подписывайте документ, который не понимаете.", "Не меняйте версию под давлением.", "Не рассчитывайте, что всё можно будет объяснить позже без документации."],
      uk: ["Не підписуйте документ, який не розумієте.", "Не змінюйте версію під тиском.", "Не розраховуйте, що все можна буде пояснити пізніше без документування."],
    }[locale];
  }
  return base[locale];
};

const buildRelatedPath = (locale, clusterKey) => `${localeConfigs[locale].prefix}/articles/${clusterMeta[clusterKey].hubSlug}/`.replace(/\/+/g, "/");

const articlePathFor = (locale, articleNumber) => {
  const filename = `article-${String(articleNumber).padStart(2, "0")}.html`;
  return locale === "he" ? path.join(root, "articles", filename) : path.join(root, locale === "uk" ? "ua" : locale, "articles", filename);
};



const buildBody = (locale, intent, keyword) => {
  const baseTexts = {
    he: "הבנת תהליך " + keyword + " היא קריטית להצלחה. פעמים רבות, בקשות נדחות לא בגלל היעדר זכאות, אלא בשל חוסר במסמכים מתאימים או הבנה שגויה של הדרישות הרשמיות מטעם משרד הפנים או רשויות אחרות.\n\nתהליך הטיפול ב-" + keyword + " דורש ידע מעמיק בנהלים. חשוב לאסוף את כל המסמכים המעידים על נכונות הבקשה ולהציגם בצורה מסודרת וברורה. במקרה של דחייה או עיכוב, רצוי לבקש את עמדת הרשות בכתב כדי לדעת כיצד לפעול הלאה.\n\nמומלץ להתייעץ עם גורמים מקצועיים טרם הגשת הבקשה ל-" + keyword + ", במיוחד כאשר מדובר במקרים מורכבים או כאשר כבר קיימת היסטוריה של סירובים. הכנה נכונה וליווי מקצועי יכולים למנוע עוגמת נפש ולהבטיח תהליך חלק ומהיר ככל האפשר.\n\nלסיכום, חשיבות ההכנה ל-" + keyword + ". מומלץ לוודא שכל התרגומים והאימותים הנדרשים כגון אפוסטיל נמצאים ברשותכם, ושאתם עומדים בכל תנאי הסף שנקבעו בחוק ובנהלים.\n\nבנוסף, יש לזכור שמשרד הפנים דורש נוכחות אישית במרבית השלבים, ולכן יש לתאם תורים מראש ולהיערך עם כל החומרים הרלוונטיים. אם התהליך מבוצע מחוץ לישראל, קונסוליות ישראל בחו\"ל הן הכתובת. חשוב לדעת שחוקי ההגירה בישראל נוקשים, וכל ניסיון להסתיר מידע עלול להוביל לסירוב בלתי הפיך.\n\nמרבית התיקים דורשים גם אימות של תעודות לידה, תעודות נישואין ותעודות יושר מהמדינה ממנה מגיעים. תרגום נוטריוני של מסמכים שאינם באנגלית או עברית הוא חובה. מומלץ להכין עותקים מצולמים של כל מסמך מקורי שמגישים לרשויות כדי לשמור על תיעוד למקרה של אובדן.\n\nלבסוף, שקיפות מלאה מול הרשויות היא המפתח לזירוז ההליכים. כל טעות קטנה בטפסים עלולה להוביל לעיכובים מיותרים, לכן חשוב לעבור על כל פרט לפני ההגשה. בעזרת תכנון מוקדם, התהליך יעבור בצורה חלקה ולהגיע לתוצאה הרצויה. ליווי משפטי יכול להפוך את ההליך המורכב למובן ונגיש יותר.\n\nחשוב לזכור שכל תיק נבדק לגופו על ידי פקידי רשות האוכלוסין וההגירה. אי אפשר להסתמך רק על מקרים דומים של חברים או בני משפחה, כיוון שכל נתון אישי יכול לשנות את החלטת הפקיד. לכן, יש להגיש בקשה התואמת במדויק את המצב העובדתי.\n\nבנוסף, זמן הטיפול יכול להשתנות משמעותית בהתאם לעומס בלשכות, לכן סבלנות היא מרכיב חשוב. מעקב אחרי סטטוס הבקשה ופנייה יזומה במקרה של עיכוב חריג יכולים לסייע בקידום הטיפול בתיק.\n\nכמו כן, חשוב להכיר את הזכויות והחובות המלוות את הסטטוס המבוקש. למשל, סטטוס תושב ארעי מקנה זכויות סוציאליות שונות מזה של תושב קבע. לעומת זאת, אזרחות מלאה כוללת גם זכות הצבעה ודרכון, אך לעתים דורשת ויתור על אזרחות קודמת, בהתאם למדינת המוצא.\n\nהתהליך הבירוקרטי עלול להיות ארוך ומתיש, אך עם הדרכה נכונה ניתן למזער את הקשיים. הכנת תיק מקיף הכולל גם מכתבי המלצה, תלושי משכורת והוכחות למרכז חיים בישראל היא צעד חיוני. עבודה מסודרת מול גורמים מוסמכים מקטינה את הסיכוי לדחיות מיותרות.\n\nרבים תוהים מה לעשות אם חסר מסמך מהותי. במקרים אלו, ניתן לבקש ארכה ממשרד הפנים, אך יש לנמק את הבקשה כראוי ולגבות אותה בראיות על כך שנעשים מאמצים להשגת המסמך מחו\"ל או מרשויות שונות בישראל.\n\nזכרו, לכל מסמך יש תוקף מסוים. לדוגמה, תעודת יושר בדרך כלל תקפה לפרק זמן מוגבל של חודשים ספורים מיום הוצאתה. הצגת מסמך פג תוקף משמעותה עיכוב ההליך ודרישה למסמך חדש.\n\nבאשר לבני משפחה נלווים, כגון בני זוג או ילדים קטינים, חשוב לצרף גם את בקשותיהם בצורה מסודרת ולדאוג למסמכים התומכים בקשר המשפחתי, כגון תעודות לידה ונישואין מאומתות.\n\nלסיום, הגעה לראיון במשרד הפנים מצריכה הכנה מדוקדקת. יש לדעת כיצד להשיב לשאלות בביטחון ולהציג את המסמכים הרלוונטיים בדיוק כאשר הם מתבקשים. הכנה כזו יכולה לעשות את ההבדל בין אישור הבקשה לעיכובה. פנייה לייעוץ מוקדם יכולה לחסוך זמן ומשאבים יקרים בטווח הארוך.",
    en: "Understanding the " + keyword + " process is critical for a successful outcome. Often, applications are rejected not due to a lack of eligibility, but because of missing documents or a misunderstanding of the official requirements set by the Ministry of Interior or other authorities.\n\nHandling a " + keyword + " case requires in-depth knowledge of the procedures. It is important to gather all documents proving the validity of your request and present them in a clear and organized manner. In the event of a delay or rejection, it is advisable to request the authority's position in writing to know how to proceed.\n\nIt is highly recommended to consult with professionals before submitting an application for " + keyword + ", especially in complex cases or when there is a history of previous refusals. Proper preparation and professional guidance can prevent distress and ensure a process that is as smooth and quick as possible.\n\nIn conclusion, the importance of preparation for " + keyword + " should not be underestimated. It is advisable to ensure that all required translations and authentications, such as Apostille stamps, are in your possession, and that you meet all the threshold conditions stipulated by law and regulations.\n\nFurthermore, it is important to remember that the Ministry of Interior requires personal presence at most stages, so appointments must be scheduled in advance with all relevant materials ready. If the process is carried out outside Israel, Israeli consulates abroad are the point of contact. Israeli immigration laws are strict, and attempting to hide information can lead to an irreversible refusal.\n\nMost cases also require authentication of birth certificates, marriage certificates, and police clearance certificates from the country of origin. Notarized translation of documents not in English or Hebrew is mandatory. It is recommended to make photocopies of any original document submitted to the authorities to maintain a record in case of loss.\n\nFinally, full transparency with the authorities is the key to expediting procedures. Any small error on the forms can lead to unnecessary delays, so it is important to review every detail before submission. With proper advance planning, it is possible to navigate the process smoothly and achieve the desired outcome. The legal landscape in Israel can be notoriously bureaucratic, and what seems straightforward on paper is often complex in reality. Therefore, arming yourself with patience and a comprehensive understanding of your rights and obligations is essential.\n\nIt is important to remember that each case is examined individually by the clerks of the Population and Immigration Authority. You cannot rely solely on similar cases of friends or family members, as every personal detail can change the clerk's decision. Therefore, an application must be submitted that perfectly matches the factual situation.\n\nFurthermore, processing times can vary significantly depending on the workload at the bureaus, so patience is a vital ingredient. Tracking the status of the application and proactively inquiring in case of an unusual delay can help advance the handling of the file.\n\nMoreover, it is crucial to recognize the rights and obligations associated with the requested status. For instance, temporary resident status grants different social rights compared to permanent residency. Conversely, full citizenship includes voting rights and a passport, but sometimes necessitates renouncing a previous citizenship, depending on the country of origin.\n\nThe bureaucratic process can be lengthy and exhausting, but with proper guidance, difficulties can be minimized. Preparing a comprehensive file that also includes recommendation letters, pay slips, and proof of a center of life in Israel is an essential step. Methodical work with authorized bodies reduces the chance of unnecessary rejections.\n\nMany wonder what to do if a fundamental document is missing. In such cases, an extension can be requested from the Ministry of Interior, but the request must be properly justified and backed by evidence that efforts are being made to obtain the document from abroad or from various authorities in Israel.\n\nRemember, every document has a specific validity period. For example, a police clearance certificate is typically valid for a limited period of a few months from its date of issue. Presenting an expired document means delaying the procedure and requiring a new document.\n\nRegarding accompanying family members, such as spouses or minor children, it is important to also submit their applications systematically and provide documents supporting the family tie, such as authenticated birth and marriage certificates.\n\nFinally, arriving at an interview at the Ministry of Interior requires meticulous preparation. One must know how to answer questions confidently and present the relevant documents exactly when requested. Such preparation can make the difference between the approval of the application and its delay. Seeking early advice can save valuable time and resources in the long run.",
    ru: "Понимание процесса " + keyword + " критически важно для успешного результата. Зачастую заявления отклоняются не из-за отсутствия права, а из-за нехватки документов или неправильного понимания официальных требований МВД или других инстанций.\n\nРабота с делом, касающимся " + keyword + ", требует глубокого знания процедур. Важно собрать все документы, подтверждающие обоснованность вашей просьбы, и представить их в четкой и организованной форме. В случае задержки или отказа рекомендуется запрашивать позицию ведомства в письменном виде, чтобы знать, как действовать дальше.\n\nНастоятельно рекомендуется проконсультироваться со специалистами перед подачей заявления на " + keyword + ", особенно в сложных случаях или при наличии предыдущих отказов. Правильная подготовка и профессиональное сопровождение могут предотвратить огорчения и обеспечить максимально гладкий и быстрый процесс.\n\nВ заключение следует отметить, что не стоит недооценивать важность подготовки к " + keyword + ". Радимо убедиться, что все необходимые переводы и заверения, такие как штампы Апостиль, у вас на руках, и что вы соответствуете всем пороговым условиям, установленным законом и правилами.\n\nКроме того, важно помнить, что МВД требует личного присутствия на большинстве этапов, поэтому необходимо заранее записываться на прием и приходить со всеми необходимыми материалами. Если процесс проходит за пределами Израиля, обращаться следует в израильские консульства. Иммиграционные законы Израиля строги, и любая попытка скрыть информацию может привести к необратимому отказу.\n\nВ большинстве дел также требуется легализация свидетельств о рождении, браке и справок о несудимости из страны исхода. Нотариальный перевод документов, составленных не на английском или иврите, обязателен. Радимо делать ксерокопии любого оригинала, подаваемого властям, чтобы сохранить документацию на случай утери.\n\nНаконец, полная прозрачность в общении с властями — ключ к ускорению процедур. Любая мелкая ошибка в формах может привести к ненужным задержкам, поэтому перед подачей важно проверить каждую деталь. При правильном предварительном планировании можно благополучно пройти процесс и достичь желаемого результата. Юридическая система Израиля славится своей бюрократичностью, и то, что кажется простым на бумаге, часто бывает сложным на деле.\n\nВажно помнить, что каждое дело рассматривается индивидуально чиновниками Управления народонаселения и миграции. Нельзя полагаться исключительно на аналогичные случаи друзей или родственников, поскольку любая личная деталь может изменить решение чиновника. Поэтому заявление должно подаваться так, чтобы оно идеально соответствовало фактической ситуации.\n\nБолее того, время рассмотрения может значительно варьироваться в зависимости от загруженности отделений, поэтому терпение является важным компонентом. Отслеживание статуса заявления и проактивное обращение в случае необычной задержки могут помочь ускорить рассмотрение дела.\n\nКроме того, крайне важно понимать права и обязанности, связанные с запрашиваемым статусом. Например, статус временного жителя предоставляет иные социальные права по сравнению с постоянным проживанием. Напротив, полное гражданство включает право голоса и паспорт, но иногда требует отказа от предыдущего гражданства в зависимости от страны происхождения.\n\nБюрократический процесс может быть долгим и утомительным, но при правильном руководстве трудности можно минимизировать. Подготовка полного пакета документов, включающего рекомендательные письма, платежные ведомости и доказательства центра жизненных интересов в Израиле, является важным шагом. Планомерная работа с уполномоченными органами снижает вероятность ненужных отказов.\n\nМногие задаются вопросом, что делать, если не хватает важного документа. В таких случаях можно запросить продление срока у МВД, но запрос должен быть должным образом обоснован и подкреплен доказательствами того, что предпринимаются усилия для получения документа из-за рубежа или от различных органов власти в Израиле.\n\nПомните, что каждый документ имеет определенный срок действия. Например, справка о несудимости обычно действительна в течение ограниченного периода в несколько месяцев со дня выдачи. Предъявление просроченного документа означает задержку процедуры и необходимость получения нового документа.\n\nЧто касается сопровождающих членов семьи, таких как супруги или несовершеннолетние дети, важно также систематически подавать их заявления и предоставлять документы, подтверждающие родственные связи, такие как легализованные свидетельства о рождении и браке.\n\nНаконец, прибытие на собеседование в МВД требует тщательной подготовки. Нужно знать, как уверенно отвечать на вопросы и предоставлять соответствующие документы именно тогда, когда их просят. Такая подготовка может стать решающим фактором между одобрением заявления и его задержкой. Своевременное обращение за консультацией может сэкономить ценное время и ресурсы в долгосрочной перспективе.",
    uk: "Розуміння процесу " + keyword + " критично важливо для успішного результату. Найчастіше заяви відхиляються не через відсутність права, а через брак документів або неправильне розуміння офіційних вимог МВС або інших інстанцій.\n\nРобота зі справою, що стосується " + keyword + ", вимагає глибокого знання процедур. Важливо зібрати всі документи, що підтверджують обґрунтованість вашого прохання, і представити їх у чіткій та організованій формі. У разі затримки або відмови рекомендується запитувати позицію відомства письмово, щоб знати, як діяти далі.\n\nНастійно рекомендується проконсультуватися з фахівцями перед подачею заяви на " + keyword + ", особливо в складних випадках або за наявності попередніх відмов. Правильна підготовка і професійний супровід можуть запобігти прикрощам і забезпечити максимально гладкий і швидкий процес.\n\nНа закінчення слід зазначити, що не варто недооцінювати важливість підготовки до " + keyword + ". Радимо переконатися, що всі необхідні переклади і завірення, такі як штампи Апостиль, у вас на руках, і що ви відповідаєте всім пороговим умовам, встановленим законом і правилами.\n\nКрім того, важливо пам'ятати, що МВС вимагає особистої присутності на більшості етапів, тому необхідно заздалегідь записуватися на прийом і приходити з усіма необхідними матеріалами. Якщо процес проходить за межами Ізраїлю, звертатися слід до ізраїльських консульств. Імміграційні закони Ізраїлю суворі, і будь-яка спроба приховати інформацію може призвести до незворотної відмови.\n\nУ більшості справ також потрібна легалізація свідоцтв про народження, шлюб та довідок про несудимість з країни походження. Нотаріальний переклад документів, складених не англійською або івритом, є обов'язковим. Рекомендується робити ксерокопії будь-якого оригіналу, що подається владі, щоб зберегти документацію на випадок втрати.\n\nНарешті, повна прозорість у спілкуванні з владою — ключ до прискорення процедур. Будь-яка дрібна помилка у формах може призвести до непотрібних затримок, тому перед подачею важливо перевірити кожну деталь. При правильному попередньому плануванні можна благополучно пройти процес і досягти бажаного результату. Юридична система Ізраїлю славиться своєю бюрократичністю, і те, що здається простим на папері, часто буває складним на ділі.\n\nВажливо пам'ятати, що кожна справа розглядається індивідуально чиновниками Управління народонаселення та міграції. Не можна покладатися виключно на аналогічні випадки друзів або родичів, оскільки будь-яка особиста деталь може змінити рішення чиновника. Тому заява повинна подаватися так, щоб вона ідеально відповідала фактичній ситуації.\n\nБільше того, час розгляду може значно варіюватися залежно від завантаженості відділень, тому терпіння є важливим компонентом. Відстеження статусу заяви та проактивне звернення у разі незвичайної затримки можуть допомогти прискорити розгляд справи.\n\nКрім того, вкрай важливо розуміти права та обов'язки, пов'язані із запитуваним статусом. Наприклад, статус тимчасового жителя надає інші соціальні права порівняно з постійним проживанням. Навпаки, повне громадянство включає право голосу та паспорт, але іноді вимагає відмови від попереднього громадянства залежно від країни походження.\n\nБюрократичний процес може бути довгим і виснажливим, але за належного керівництва труднощі можна мінімізувати. Підготовка повного пакету документів, що включає рекомендаційні листи, платіжні відомості та докази центру життєвих інтересів в Ізраїлі, є важливим кроком. Планомірна робота з уповноваженими органами знижує ймовірність непотрібних відмов.\n\nБагато хто задається питанням, що робити, якщо не вистачає важливого документа. У таких випадках можна запросити продовження терміну у МВС, але запит повинен бути належним чином обґрунтований і підкріплений доказами того, що докладаються зусилля для отримання документа з-за кордону або від різних органів влади в Ізраїлі.\n\nПам'ятайте, що кожен документ має певний термін дії. Наприклад, довідка про несудимість зазвичай дійсна протягом обмеженого періоду в кілька місяців з дня видачі. Пред'явлення простроченого документа означає затримку процедури і необхідність отримання нового документа.\n\nЩодо супроводжуючих членів сім'ї, таких як подружжя або неповнолітні діти, важливо також систематично подавати їхні заяви і надавати документи, що підтверджують родинні зв'язки, такі як легалізовані свідоцтва про народження та шлюб.\n\nНарешті, прибуття на співбесіду в МВС вимагає ретельної підготовки. Потрібно знати, як впевнено відповідати на запитання і надавати відповідні документи саме тоді, коли їх просять. Така підготовка може стати вирішальним фактором між схваленням заяви та її затримкою. Своєчасне звернення за консультацією може заощадити цінний час і ресурси в довгостроковій перспективі.",
  };

  return baseTexts[locale] || baseTexts.en;
}


const articleUrlFor = (locale, articleNumber) => {
  const prefix = localeConfigs[locale].prefix;
  return `${prefix}/articles/article-${String(articleNumber).padStart(2, "0")}`.replace(/\/+/g, "/");
};

const renderArticle = ({ locale, articleNumber, localeInputs, clusterKey, publishedAt }) => {
  const config = localeConfigs[locale];
  const current = localeInputs[locale];
  const title = current.title;
  const keyword = current.keyword || title;
  const humanIntent = (current.intent || clusterKey).replace(/-/g, " ");
  if (!current.body) current.body = buildBody(locale, humanIntent, keyword);
  const canonicalUrl = `https://immigration.the-israeli-lawyer.com${articleUrlFor(locale, articleNumber)}`;
  const description = buildDescription(locale, title, clusterKey);
  const displayDate = formatDisplayDate(publishedAt, locale);
  const relatedUrl = buildRelatedPath(locale, clusterKey);
  const serviceUrl = `${config.prefix}${clusterMeta[clusterKey].servicePath}`.replace(/\/+/g, "/");
  const overview = buildOverview(locale, title, keyword, clusterKey, current.intent);
  const checklist = buildChecklist(locale, keyword, clusterKey, current.intent);
  const pitfalls = buildPitfalls(locale, clusterKey, current.intent);
  const faqs = clusterMeta[clusterKey].questionSets[locale];
  const sourceLinks = officialSources[locale]
    .map(([label, url]) => `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a></li>`)
    .join("\n");
  const alternates = Object.keys(localeConfigs)
    .map((other) => {
      const href = `https://immigration.the-israeli-lawyer.com${articleUrlFor(other, articleNumber)}`;
      return `    <link rel="alternate" hreflang="${localeConfigs[other].htmlLang}" href="${href}" />`;
    })
    .join("\n");
  const langSwitch = Object.keys(localeConfigs)
    .map((other) => `<a href="${articleUrlFor(other, articleNumber)}">${other === "uk" ? "UA" : other.toUpperCase()}</a>`)
    .join("\n          ");

  if (locale !== "en" && humanIntent && current.body && current.body.toLowerCase().includes(humanIntent.toLowerCase())) {
    throw new Error(`Locale mixing detected: English intent "${humanIntent}" found in ${locale} article body.`);
  }

  return `<!doctype html>
<html lang="${config.htmlLang}" dir="${config.dir}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="article-cluster" content="${clusterKey}" />
    <meta name="publish-intent" content="${escapeHtml(current.intent || "")}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <link rel="dns-prefetch" href="//www.gov.il" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="https://immigration.the-israeli-lawyer.com${clusterMeta[clusterKey].image}" />
    <meta property="og:image:alt" content="${escapeHtml(config.imageAlt)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="https://immigration.the-israeli-lawyer.com${clusterMeta[clusterKey].image}" />
${alternates}
    <link rel="stylesheet" href="/assets/styles.css" />
    <link rel="icon" href="/images/favicon.jpg" type="image/jpeg" />
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description,
      inLanguage: config.htmlLang,
      mainEntityOfPage: canonicalUrl,
      datePublished: publishedAt.toISOString().slice(0, 10),
      dateModified: publishedAt.toISOString().slice(0, 10),
      image: `https://immigration.the-israeli-lawyer.com${clusterMeta[clusterKey].image}`,
      publisher: {
        "@type": "Organization",
        name: config.businessName,
        url: "https://immigration.the-israeli-lawyer.com/",
      },
    })}</script>
  </head>
  <body>
    <a class="skip-link" href="#main">Skip</a>
    <div class="emergency-strip">
      <div class="container">${escapeHtml(config.businessName)}. <a href="${serviceUrl}">${escapeHtml(config.emergency)}</a></div>
    </div>
    <header class="site-header">
      <div class="container header-inner">
        <div class="brand">${escapeHtml(config.businessName)}</div>
        <nav aria-label="Primary">
          <ul class="nav-list">
            <li><a class="nav-link" href="${config.prefix || "/"}">${escapeHtml(config.home)}</a></li>
            <li><a class="nav-link" href="${`${config.prefix}/services/`.replace(/\/+/g, "/")}">${escapeHtml(config.services)}</a></li>
            <li><a class="nav-link" href="${`${config.prefix}/articles/`.replace(/\/+/g, "/")}">${escapeHtml(config.articles)}</a></li>
            <li><a class="nav-link" href="${`${config.prefix}/about`.replace(/\/+/g, "/")}">${escapeHtml(config.about)}</a></li>
            <li><a class="nav-link" href="${`${config.prefix}/contact`.replace(/\/+/g, "/")}">${escapeHtml(config.contact)}</a></li>
          </ul>
        </nav>
        <div class="lang-switch" aria-label="Language switcher">
          ${langSwitch}
        </div>
      </div>
    </header>
    <main id="main" class="page">
      <nav class="breadcrumbs" aria-label="Breadcrumbs">
        <div class="container">
          <ol>
            <li><a href="https://immigration.the-israeli-lawyer.com${config.prefix || "/"}">${escapeHtml(config.home)}</a></li>
            <li><a href="https://immigration.the-israeli-lawyer.com${`${config.prefix}/articles/`.replace(/\/+/g, "/")}">${escapeHtml(config.articles)}</a></li>
            <li aria-current="page">${escapeHtml(title)}</li>
          </ol>
        </div>
      </nav>
      <section class="section">
        <div class="container stack">
          <div class="cta-band accent">
            <h2 class="title-md">${escapeHtml(config.ctaHeading)}</h2>
            <p>${escapeHtml(config.ctaBody)}</p>
            <div class="cta-actions">
              <a class="button button--primary" href="${`${config.prefix}/contact`.replace(/\/+/g, "/")}">${escapeHtml(config.ctaPrimary)}</a>
              <a class="button button--secondary" href="${`${config.prefix}/contact`.replace(/\/+/g, "/")}">${escapeHtml(config.ctaSecondary)}</a>
            </div>
          </div>
          <div class="article-layout">
            <article class="stack">
              <h1 class="title-xl">${escapeHtml(title)}</h1>
              <p class="footer-note" data-last-reviewed="true">${escapeHtml(config.reviewLabel)}: ${escapeHtml(displayDate)} | ${escapeHtml(config.disclaimer)}</p>
              <p class="lede">${escapeHtml(description)}</p>
              <ul class="tag-list" aria-label="tags">
                <li><span class="tag">${escapeHtml(keyword)}</span></li>
                <li><span class="tag">${escapeHtml((current.intent || title).replace(/-/g, " "))}</span></li>
              </ul>
              <div class="geo-inline-card">
                <h2 class="title-md">${escapeHtml(config.answerLabel)}</h2>
                <p>${escapeHtml(overview[0])}</p>
              </div>
              <figure class="article-figure">
                <picture>
                  <img src="${clusterMeta[clusterKey].image}" alt="${escapeHtml(config.imageAlt)}" width="1024" height="768" decoding="async" fetchpriority="high" />
                </picture>
              </figure>
              <section id="overview">
                <h2 class="title-lg">${escapeHtml(config.overview)}</h2>
                ${overview.slice(1).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n                ")}
              </section>
              ${current.body ? `<section id="details" class="details-section">\n                ${current.body.split('\n\n').map((paragraph) => `<p>${escapeHtml(paragraph.replace(/\n/g, ' '))}</p>`).join('\n                ')}\n              </section>` : ''}
              <section id="checklist">
                <h2 class="title-lg">${escapeHtml(config.checklist)}</h2>
                <ul>
                  ${checklist.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n                  ")}
                </ul>
              </section>
              <section id="pitfalls">
                <h2 class="title-lg">${escapeHtml(config.pitfalls)}</h2>
                <ul>
                  ${pitfalls.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n                  ")}
                </ul>
              </section>
              <section id="faq" class="faq">
                <h2 class="title-lg">${escapeHtml(config.faq)}</h2>
                ${faqs
                  .map(
                    ([question, answer]) => `<details>
                  <summary>${escapeHtml(question)}</summary>
                  <p>${escapeHtml(answer)}</p>
                </details>`
                  )
                  .join("\n                ")}
              </section>
              <section id="sources">
                <h2 class="title-lg">${escapeHtml(config.sources)}</h2>
                <ul>
                  ${sourceLinks}
                </ul>
              </section>
              <div class="geo-next-reading">
                <h3 class="title-md">${escapeHtml(config.related)}</h3>
                <p><a href="${relatedUrl}">${escapeHtml((current.intent || title).replace(/-/g, " "))}</a></p>
                <p><a href="${serviceUrl}">${escapeHtml(config.services)}</a></p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
    <script src="/assets/vendor/fuse.min.js" defer></script>
    <script src="/assets/search.js" defer></script>
  </body>
</html>
`;
};

async function publishNext() {
  validateImageSourcePolicy();

  const queuePath = path.join(root, "keyword-queue.csv");
  const { header, rows } = await readCsv(queuePath);
  if (!rows.length) {
    console.log("No queue rows found.");
    return;
  }

  const now = new Date();
  const row = rows[0];
  const scheduledAt = parseDateTime(row.scheduled_at);
  if (scheduledAt > now) {
    console.log(`No due article to publish. Next scheduled row: ${row.intent} at ${row.scheduled_at}`);
    return;
  }

  const articleNumber = await nextArticleNumber();
  const localeInputs = await loadLocaleInputs(row);
  const clusterKey = normalizeCluster(row.cluster);
  const publishedAt = now;

  for (const locale of Object.keys(localeConfigs)) {
    const outputPath = articlePathFor(locale, articleNumber);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    const html = renderArticle({
      locale,
      articleNumber,
      localeInputs,
      clusterKey,
      publishedAt,
    });
    await fs.writeFile(outputPath, html, "utf8");
  }

  const updatedRows = rows.slice(1);
  await writeCsv(queuePath, header, updatedRows);

  console.log(`Published article-${String(articleNumber).padStart(2, "0")} from intent "${row.intent}" in 4 locales.`);
  console.log(`Cluster: ${clusterKey}`);
}

publishNext().catch((error) => {
  console.error(error);
  process.exit(1);
});
