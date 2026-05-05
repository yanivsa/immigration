import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { walk } from "./utils/fs.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const siteUrl = "https://immigration.the-israeli-lawyer.com";

const ignoreDirs = new Set([
  ".git",
  ".wrangler",
  "content_queue",
  "dist",
  "logs",
  "node_modules",
  "scripts",
]);

const localeConfig = {
  he: {
    brand: "משרד עורכי דין להגירה",
    businessName: "משרד עורכי דין להגירה",
    businessDescription:
      "משרד עורכי דין להגירה באשדוד עם ליווי רב-לשוני בענייני ויזות, מעמד, אזרחות וסיוע בנתב\"ג.",
    locale: "he",
    languages: ["Hebrew", "English", "Russian", "Ukrainian"],
    reviewHeading: "בדיקה מקצועית ועדכון",
    reviewBody:
      "העמוד נכתב, נבדק ועודכן מקצועית על ידי עורכת הדין של המשרד, בעלת רקע ברשות האוכלוסין לשעבר. המידע כללי בלבד ודורש בדיקה פרטנית לפי נסיבות המקרה.",
    reviewBulletOne:
      "מה נבדק: בהירות התהליך, מסמכים נפוצים, נקודות סיכון והפניות להמשך קריאה.",
    reviewBulletTwo:
      "מתי לפנות לייעוץ פרטני: במקרה של דחיפות, סירוב, עיכוב בנתב\"ג או אי-התאמה במסמכים.",
    clusterLabels: [
      {
        key: "work",
        heading: "ויזות עבודה ועובדים זרים",
        description:
          "מדריכי יסוד, צ'קליסטים ותשובות קצרות למעסיקים ולעובדים זרים.",
      },
      {
        key: "citizenship",
        heading: "אזרחות, מעמד ותושבות",
        description:
          "עמודי יסוד להשוואה, דרישות, טעויות נפוצות והכנת תיק מסודר.",
      },
      {
        key: "tourism",
        heading: "ויזות תייר, הזמנות ואישורי כניסה",
        description:
          "מכתבי הזמנה, דרישות כניסה, ETA-IL והפחתת סיכון לסירוב.",
      },
      {
        key: "emergency",
        heading: "חירום בנתב\"ג וביקורת גבולות",
        description:
          "צעדים מיידיים, מסמכי חירום, תשאול ועיכוב בשדה התעופה.",
      },
    ],
  },
  en: {
    brand: "Immigration Law Office",
    businessName: "Immigration Law Office",
    businessDescription:
      "Immigration law guidance from Ashdod, Israel for visas, citizenship, status, and Ben Gurion airport matters.",
    locale: "en",
    languages: ["Hebrew", "English", "Russian", "Ukrainian"],
    reviewHeading: "Professional Review",
    reviewBody:
      "This page was written, reviewed, and updated by the office attorney with former Population and Immigration Authority experience. It is general information only and must be checked against the facts of your case.",
    reviewBulletOne:
      "What was reviewed: process clarity, common documents, risk points, and follow-up resources.",
    reviewBulletTwo:
      "When to seek tailored advice: urgency, refusal, airport delay, or inconsistent documents.",
    clusterLabels: [
      {
        key: "work",
        heading: "Work visas and foreign workers",
        description:
          "Core guides, checklists, and practical answers for employers and foreign workers.",
      },
      {
        key: "citizenship",
        heading: "Citizenship, status, and residency",
        description:
          "Core pages for requirements, comparisons, common mistakes, and file preparation.",
      },
      {
        key: "tourism",
        heading: "Tourist visas, invitations, and entry permits",
        description:
          "Invitation letters, entry requirements, ETA-IL, and refusal-prevention guidance.",
      },
      {
        key: "emergency",
        heading: "Ben Gurion emergencies and border control",
        description:
          "Immediate steps, document packs, questioning, and airport-delay guidance.",
      },
    ],
  },
  ru: {
    brand: "Иммиграционный юридический офис",
    businessName: "Иммиграционный юридический офис",
    businessDescription:
      "Иммиграционное юридическое сопровождение из Ашдода, Израиль: визы, статус, гражданство и помощь в Бен-Гурионе.",
    locale: "ru",
    languages: ["Hebrew", "English", "Russian", "Ukrainian"],
    reviewHeading: "Профессиональная проверка",
    reviewBody:
      "Эта страница подготовлена, проверена и обновлена юристом офиса с опытом работы в Управлении по вопросам населения и иммиграции. Материал общий и требует проверки под обстоятельства конкретного дела.",
    reviewBulletOne:
      "Что проверено: логика процесса, типовые документы, риски и полезные материалы по теме.",
    reviewBulletTwo:
      "Когда нужен персональный совет: срочность, отказ, задержка в аэропорту или несостыковки в документах.",
    clusterLabels: [
      {
        key: "work",
        heading: "Рабочие визы и иностранные работники",
        description:
          "Базовые руководства, чек-листы и практические ответы для работодателей и работников.",
      },
      {
        key: "citizenship",
        heading: "Гражданство, статус и резидентство",
        description:
          "Материалы о требованиях, сравнениях, типовых ошибках и подготовке дела.",
      },
      {
        key: "tourism",
        heading: "Туристические визы, приглашения и въезд",
        description:
          "Письма-приглашения, правила въезда, ETA-IL и снижение риска отказа.",
      },
      {
        key: "emergency",
        heading: "Экстренные ситуации в Бен-Гурионе",
        description:
          "Немедленные шаги, документы, допрос и задержка в аэропорту.",
      },
    ],
  },
  ua: {
    brand: "Імміграційний юридичний офіс",
    businessName: "Імміграційний юридичний офіс",
    businessDescription:
      "Імміграційний юридичний супровід з Ашдода, Ізраїль: візи, статус, громадянство та допомога в Бен-Гуріоні.",
    locale: "uk-UA",
    languages: ["Hebrew", "English", "Russian", "Ukrainian"],
    reviewHeading: "Професійна перевірка",
    reviewBody:
      "Цю сторінку підготував, перевірив і оновив юрист офісу з досвідом роботи в Управлінні з питань населення та імміграції. Матеріал є загальним і потребує перевірки під факти конкретної справи.",
    reviewBulletOne:
      "Що перевірено: логіку процесу, типові документи, ризики та корисні матеріали за темою.",
    reviewBulletTwo:
      "Коли потрібна персональна порада: терміновість, відмова, затримка в аеропорту або неузгоджені документи.",
    clusterLabels: [
      {
        key: "work",
        heading: "Робочі візи та іноземні працівники",
        description:
          "Базові гіди, чек-листи та практичні відповіді для роботодавців і працівників.",
      },
      {
        key: "citizenship",
        heading: "Громадянство, статус і резидентство",
        description:
          "Матеріали про вимоги, порівняння, типові помилки та підготовку справи.",
      },
      {
        key: "tourism",
        heading: "Туристичні візи, запрошення та в’їзд",
        description:
          "Листи-запрошення, правила в’їзду, ETA-IL і зниження ризику відмови.",
      },
      {
        key: "emergency",
        heading: "Екстрені ситуації в Бен-Гуріоні",
        description:
          "Негайні кроки, документи, допит і затримка в аеропорту.",
      },
    ],
  },
};

const localeOrder = ["he", "en", "ru", "ua"];

const titleOverrides = {
  "contact.html": "צור קשר | שיחת בירור ראשונית בזום",
  "en/contact.html": "Contact | Book an initial Zoom review",
  "ru/contact.html": "Контакты | Первичный разбор в Zoom",
  "ua/contact.html": "Контакти | Первинний розбір у Zoom",
  "en/services/tourist-visas.html": "Tourist visas and invitation letters for Israel",
  "en/articles/article-10.html": "Work visa questions answered | Israel guide",
  "en/articles/article-20.html": "Citizenship questions answered | Israel guide",
  "en/articles/article-30.html": "Tourist visa questions answered | Israel guide",
  "en/articles/article-40.html": "Ben Gurion emergency questions answered | Israel guide",
  "ua/articles/article-27.html":
    "Документи для дозволу на в'їзд: як подати без плутанини",
};

const descriptionOverrides = {
  "ru/index.html":
    "Понимание требований к визам, статусу и гражданству в Израиле, список недостающих документов и следующий практический шаг без лишних обещаний.",
  "ua/index.html":
    "Чітке розуміння вимог до віз, статусу та громадянства в Ізраїлі, перелік відсутніх документів і наступний практичний крок без зайвих обіцянок.",
  "en/services/tourist-visas.html":
    "Guidance on tourist visas, invitation letters, and entry-risk preparation for Israel, with a clear checklist for hosts, visitors, and urgent border questions.",
};

const editorialCopy = {
  he: {
    contactDisclaimerHeading: "לפני השליחה: מה כוללת הפנייה הראשונית",
    contactDisclaimerBody:
      'הטופס מיועד לשיחת בירור ראשונית בלבד. הוא אינו יוצר יחסי עו"ד-לקוח ואינו מהווה ייעוץ משפטי מותאם לנסיבות המקרה.',
    contactDisclaimerBulletOne:
      "מה תקבלו: כיוון ראשוני, רשימת מסמכים חסרים והבנת הצעד הבא.",
    contactDisclaimerBulletTwo:
      'מקרה דחוף, עיכוב או סירוב בנתב"ג? עברו למסלול החירום הייעודי.',
    contactDisclaimerCta: 'למסלול חירום בנתב"ג',
    contactDisclaimerHref: "/services/ben-gurion-emergency",
    dateLocale: "he-IL",
    reviewMetaLabel: "נבדק לאחרונה",
    reviewMetaNotice: "מידע כללי בלבד, לא ייעוץ משפטי.",
    articleReviewHeading: "בדיקה מקצועית של המאמר",
    articleReviewBody: (headline, dateText) =>
      `המאמר בנושא "${headline}" נבדק ועודכן לאחרונה ב-${dateText}. הוא נועד לספק מסגרת כללית, לא להחליף ייעוץ משפטי מותאם.`,
    articleReviewBulletOne:
      "נבדקו: בהירות ההסבר, המסמכים הנפוצים, נקודות הסיכון וההפניות למקורות רשמיים.",
    articleReviewBulletTwo:
      "מומלץ ייעוץ פרטני לפני הגשה, תגובה לדרישת השלמה, סירוב או דחיפות.",
    serviceReviewHeading: "בדיקה מקצועית של עמוד השירות",
    serviceReviewBody: (headline, dateText) =>
      `עמוד השירות בנושא "${headline}" נבדק ועודכן לאחרונה ב-${dateText}. הוא מסביר מסלול כללי, לא מחליף בדיקה פרטנית של המסמכים והנסיבות.`,
    serviceReviewBulletOne:
      "נבדקו: קהל היעד, שלבי התהליך, המסמכים הראשוניים ומקרי דחיפות.",
    serviceReviewBulletTwo:
      "לפני הגשה או תגובה לרשות מומלץ לוודא התאמה בין המסמכים לבין נסיבות המקרה.",
  },
  en: {
    contactDisclaimerHeading: "Before you submit",
    contactDisclaimerBody:
      "This form is for an initial review call only. It does not create an attorney-client relationship and is not tailored legal advice.",
    contactDisclaimerBulletOne:
      "What you receive: a first direction, missing-document notes, and the next practical step.",
    contactDisclaimerBulletTwo:
      "Urgent Ben Gurion delay or refusal? Use the dedicated emergency route.",
    contactDisclaimerCta: "Ben Gurion emergency route",
    contactDisclaimerHref: "/en/services/ben-gurion-emergency",
    dateLocale: "en-US",
    reviewMetaLabel: "Last reviewed",
    reviewMetaNotice: "General information only, not legal advice.",
    articleReviewHeading: "Editorial review of this guide",
    articleReviewBody: (headline, dateText) =>
      `This guide about "${headline}" was reviewed and updated on ${dateText}. It explains the general framework and should be checked against the facts of your case.`,
    articleReviewBulletOne:
      "Reviewed: process clarity, common documents, risk points, and official-source links.",
    articleReviewBulletTwo:
      "Get tailored advice before filing, answering a request for evidence, refusal, or urgent action.",
    serviceReviewHeading: "Professional review of this service page",
    serviceReviewBody: (headline, dateText) =>
      `This service page about "${headline}" was reviewed and updated on ${dateText}. It outlines the general route and should not replace a case-specific legal review.`,
    serviceReviewBulletOne:
      "Reviewed: target user, process stages, first-pass documents, and urgency triggers.",
    serviceReviewBulletTwo:
      "Check the actual facts and documents before filing or responding to the authority.",
  },
  ru: {
    contactDisclaimerHeading: "Перед отправкой",
    contactDisclaimerBody:
      "Эта форма предназначена только для первичного разбора. Она не создает отношения адвокат-клиент и не является персональной юридической консультацией.",
    contactDisclaimerBulletOne:
      "Что вы получите: первое направление, список недостающих документов и следующий практический шаг.",
    contactDisclaimerBulletTwo:
      "Срочная задержка или отказ в Бен-Гурионе? Используйте отдельный экстренный маршрут.",
    contactDisclaimerCta: "Экстренный маршрут Бен-Гурион",
    contactDisclaimerHref: "/ru/services/ben-gurion-emergency",
    dateLocale: "ru-RU",
    reviewMetaLabel: "Проверено",
    reviewMetaNotice: "Общая информация, не юридическая консультация.",
    articleReviewHeading: "Профессиональная проверка материала",
    articleReviewBody: (headline, dateText) =>
      `Материал по теме "${headline}" проверен и обновлен ${dateText}. Он описывает общую рамку и требует сверки с фактами вашего дела.`,
    articleReviewBulletOne:
      "Проверены: логика процесса, типовые документы, риски и ссылки на официальные источники.",
    articleReviewBulletTwo:
      "Персональный совет нужен до подачи, ответа на запрос, отказа или срочного действия.",
    serviceReviewHeading: "Профессиональная проверка страницы услуги",
    serviceReviewBody: (headline, dateText) =>
      `Страница услуги по теме "${headline}" проверена и обновлена ${dateText}. Она описывает общий маршрут и не заменяет индивидуальную юридическую проверку.`,
    serviceReviewBulletOne:
      "Проверены: целевая аудитория, этапы процесса, стартовые документы и триггеры срочности.",
    serviceReviewBulletTwo:
      "Перед подачей или ответом в ведомство нужно сверить факты и документы конкретного дела.",
  },
  ua: {
    contactDisclaimerHeading: "Перед надсиланням",
    contactDisclaimerBody:
      "Ця форма призначена лише для первинного розбору. Вона не створює відносини адвокат-клієнт і не є персональною юридичною консультацією.",
    contactDisclaimerBulletOne:
      "Що ви отримаєте: первинний напрямок, список відсутніх документів і наступний практичний крок.",
    contactDisclaimerBulletTwo:
      "Термінова затримка або відмова в Бен-Гуріоні? Перейдіть до окремого екстреного маршруту.",
    contactDisclaimerCta: "Екстрений маршрут Бен-Гуріон",
    contactDisclaimerHref: "/ua/services/ben-gurion-emergency",
    dateLocale: "uk-UA",
    reviewMetaLabel: "Перевірено",
    reviewMetaNotice: "Загальна інформація, а не юридична консультація.",
    articleReviewHeading: "Професійна перевірка матеріалу",
    articleReviewBody: (headline, dateText) =>
      `Матеріал на тему "${headline}" перевірено й оновлено ${dateText}. Він описує загальну рамку та потребує звірки з фактами вашої справи.`,
    articleReviewBulletOne:
      "Перевірено: логіку процесу, типові документи, ризики та посилання на офіційні джерела.",
    articleReviewBulletTwo:
      "Персональна порада потрібна до подання, відповіді на запит, відмови або термінової дії.",
    serviceReviewHeading: "Професійна перевірка сторінки послуги",
    serviceReviewBody: (headline, dateText) =>
      `Сторінку послуги на тему "${headline}" перевірено й оновлено ${dateText}. Вона описує загальний маршрут і не замінює індивідуальну юридичну перевірку.`,
    serviceReviewBulletOne:
      "Перевірено: цільову аудиторію, етапи процесу, стартові документи та тригери терміновості.",
    serviceReviewBulletTwo:
      "Перед поданням або відповіддю відомству потрібно звірити факти та документи конкретної справи.",
  },
};

const consultationReplacements = {
  he: [
    ["קבע פגישה בזום בחינם", "קבעו שיחת בירור ראשונית בזום"],
    ["פגישה בזום בחינם", "שיחת בירור ראשונית בזום"],
    ["לקביעת פגישה בזום", "לקביעת שיחת בירור"],
    ["לקביעת פגישה באשדוד או בזום", "לקביעת שיחת בירור באשדוד או בזום"],
    ["קביעת ייעוץ ראשוני (ללא עלות)", "קביעת שיחת בירור ראשונית"],
    ["שיחת זום קצרה", "שיחת בירור קצרה"],
    ["פגישה בזום", "שיחת בירור בזום"],
    ["קבלו כיוון ראשוני ברור (ללא עלות)", "קבלו שיחת בירור ראשונית"],
  ],
  en: [
    ["Book a free Zoom consult", "Book an initial Zoom review"],
    ["Schedule Free Consultation", "Book an initial review call"],
    ["Book a Zoom consult", "Book an initial review call"],
  ],
  ru: [
    ["Запишитесь на бесплатную консультацию в Zoom", "Запишитесь на первичный разбор в Zoom"],
    ["Записаться на бесплатную консультацию", "Записаться на первичный разбор"],
  ],
  ua: [
    ["Запишіться на безкоштовну консультацію в Zoom", "Запишіться на первинний розбір у Zoom"],
    ["Записатися на безкоштовну консультацію", "Записатися на первинний розбір"],
  ],
};

const articleHubServiceLinks = {
  he: {
    heading: "עמודי שירות קשורים",
    intro: "אם כבר ברור לכם הכיוון, המשיכו ישירות לעמוד השירות המתאים:",
    links: [
      { href: "/services/work-visas", label: "ויזות עבודה" },
      { href: "/services/citizenship", label: "אזרחות ומעמד" },
      { href: "/services/tourist-visas", label: "ויזות תייר והזמנות" },
      { href: "/services/entry-permits", label: "אישורי כניסה" },
      { href: "/services/ben-gurion-emergency", label: 'חירום בנתב"ג' },
    ],
  },
  en: {
    heading: "Related service pages",
    intro: "If you already know the direction, go straight to the matching service page:",
    links: [
      { href: "/en/services/work-visas", label: "Work visas" },
      { href: "/en/services/citizenship", label: "Citizenship and status" },
      { href: "/en/services/tourist-visas", label: "Tourist visas and invitations" },
      { href: "/en/services/entry-permits", label: "Entry permits" },
      { href: "/en/services/ben-gurion-emergency", label: "Ben Gurion emergency" },
    ],
  },
  ru: {
    heading: "Связанные страницы услуг",
    intro: "Если направление уже понятно, переходите сразу к нужной услуге:",
    links: [
      { href: "/ru/services/work-visas", label: "Рабочие визы" },
      { href: "/ru/services/citizenship", label: "Гражданство и статус" },
      { href: "/ru/services/tourist-visas", label: "Туристические визы и приглашения" },
      { href: "/ru/services/entry-permits", label: "Разрешения на въезд" },
      { href: "/ru/services/ben-gurion-emergency", label: "Экстренная помощь в Бен-Гурионе" },
    ],
  },
  ua: {
    heading: "Пов’язані сторінки послуг",
    intro: "Якщо напрямок уже зрозумілий, переходьте одразу до потрібної послуги:",
    links: [
      { href: "/ua/services/work-visas", label: "Робочі візи" },
      { href: "/ua/services/citizenship", label: "Громадянство і статус" },
      { href: "/ua/services/tourist-visas", label: "Туристичні візи та запрошення" },
      { href: "/ua/services/entry-permits", label: "Дозволи на в'їзд" },
      { href: "/ua/services/ben-gurion-emergency", label: "Екстрена допомога в Бен-Гуріоні" },
    ],
  },
};

const ogImageMeta = {
  "/images/family-citizenship-israel.jpg": { width: 1024, height: 1024 },
  "/images/checklist-passport-desk.jpg": { width: 1024, height: 1024 },
  "/images/israel-flag-scales-gavel.jpg": { width: 464, height: 474 },
  "/images/law-office-scales-gavel-ashdod.jpg": { width: 460, height: 302 },
  "/images/immigration-consultation-couple.jpg": { width: 456, height: 266 },
  "/images/immigration-consultation-couple-alt.jpg": { width: 456, height: 266 },
  "/images/immigration-consultation-couple-alt-hq.jpg": { width: 456, height: 266 },
};

const boilerplateFragments = {
  he: [
    "ליווי מסודר, מסמכים ברורים, תיאום ציפיות ושירות בזום",
    "ליווי מסודר, מסמכים ברורים, תיאום ציפיות",
  ],
  en: [
    "Clear process, organized documents, realistic expectations, and Zoom guidance",
    "Clear process, organized documents, realistic expectations",
  ],
  ru: [
    "Четкий процесс, упорядоченные документы, реалистичные ожидания и поддержка в Zoom",
    "Четкий процесс, упорядоченные документы, реалистичные ожидания",
  ],
  ua: [
    "Чіткий процес, упорядковані документи, реалістичні очікування та підтримка в Zoom",
    "Чіткий процес, упорядковані документи, реалістичні очікування",
  ],
};

const normalizeConsultationCopy = (html, locale) => {
  let next = html;
  for (const [from, to] of consultationReplacements[locale] || []) {
    next = next.split(from).join(to);
  }
  return next;
};

const formatDisplayDate = (date, locale) => {
  try {
    return new Intl.DateTimeFormat(editorialCopy[locale].dateLocale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
};

const getReviewDetails = (locale, pageType, headline, dateText) => {
  const copy = editorialCopy[locale];
  if (pageType === "service-detail") {
    return {
      heading: copy.serviceReviewHeading,
      body: copy.serviceReviewBody(headline, dateText),
      bulletOne: copy.serviceReviewBulletOne,
      bulletTwo: copy.serviceReviewBulletTwo,
    };
  }

  return {
    heading: copy.articleReviewHeading,
    body: copy.articleReviewBody(headline, dateText),
    bulletOne: copy.articleReviewBulletOne,
    bulletTwo: copy.articleReviewBulletTwo,
  };
};

const buildReviewMeta = (locale, dateText) => {
  const copy = editorialCopy[locale];
  return `<p class="footer-note" data-last-reviewed="true">${copy.reviewMetaLabel}: ${dateText} | ${copy.reviewMetaNotice}</p>`;
};

const injectReviewMeta = (html, locale, pageType, dateText) => {
  if (!["article-detail", "service-detail"].includes(pageType)) {
    return html;
  }

  const block = `${buildReviewMeta(locale, dateText)}\n`;
  if (html.includes('data-last-reviewed="true"')) {
    return html.replace(
      /<p class="footer-note" data-last-reviewed="true">[\s\S]*?<\/p>\s*/i,
      block
    );
  }

  if (/<h1\b[^>]*>[\s\S]*?<\/h1>/i.test(html)) {
    return html.replace(/(<h1\b[^>]*>[\s\S]*?<\/h1>\s*)/i, `$1${block}`);
  }

  return html;
};

const ensureContactDisclaimer = (html, locale, pageType) => {
  if (pageType !== "contact") {
    return html;
  }

  const copy = editorialCopy[locale];
  const block = [
    '<div class="cta-band accent" data-contact-disclaimer>',
    `  <h3 class="title-md">${copy.contactDisclaimerHeading}</h3>`,
    `  <p>${copy.contactDisclaimerBody}</p>`,
    "  <ul>",
    `    <li>${copy.contactDisclaimerBulletOne}</li>`,
    `    <li>${copy.contactDisclaimerBulletTwo}</li>`,
    "  </ul>",
    '  <div class="cta-actions">',
    `    <a class="button button--secondary" href="${copy.contactDisclaimerHref}">${copy.contactDisclaimerCta}</a>`,
    "  </div>",
    "</div>",
  ].join("\n");

  if (html.includes("data-contact-disclaimer")) {
    return html.replace(
      /<div class="cta-band accent" data-contact-disclaimer>[\s\S]*?<\/div>\s*/i,
      `${block}\n`
    );
  }

  return html.replace(/(\s*<div class="form-card">)/i, `\n${block}\n$1`);
};

const stripRedundantFooterNotes = (html) =>
  html
    .replace(/\s*<p class="footer-note">נכתב\/עודכן ונבדק עי עורכת הדין של המשרד<\/p>\s*/gi, "\n")
    .replace(/\s*<p class="footer-note">נכתב, נבדק ועודכן על ידי עורכת הדין של המשרד, לשעבר ברשות האוכלוסין וההגירה\.<\/p>\s*/gi, "\n")
    .replace(/\s*<p class="footer-note">מידע כללי בלבד, לא ייעוץ משפטי\.<\/p>\s*/gi, "\n")
    .replace(/\s*<p class="footer-note">Written\/updated and reviewed by the office attorney\.<\/p>\s*/gi, "\n")
    .replace(/\s*<p class="footer-note">Written, reviewed, and updated by the office immigration attorney, with former Population and Immigration Authority experience\.<\/p>\s*/gi, "\n")
    .replace(/\s*<p class="footer-note">General information only, not legal advice\.<\/p>\s*/gi, "\n")
    .replace(/\s*<p class="footer-note">Материал подготовлен\/обновлен и проверен юристом офиса\.<\/p>\s*/gi, "\n")
    .replace(/\s*<p class="footer-note">Материал подготовлен, проверен и обновлен юристом офиса с опытом работы в Управлении по вопросам населения и иммиграции\.<\/p>\s*/gi, "\n")
    .replace(/\s*<p class="footer-note">Общая информация, не юридическая консультация\.<\/p>\s*/gi, "\n")
    .replace(/\s*<p class="footer-note">Матеріал підготовлено\/оновлено та перевірено юристом офісу\.<\/p>\s*/gi, "\n")
    .replace(/\s*<p class="footer-note">Матеріал підготовлено, перевірено й оновлено юристом офісу з досвідом роботи в Управлінні з питань населення та імміграції\.<\/p>\s*/gi, "\n")
    .replace(/\s*<p class="footer-note">Загальна інформація, а не юридична консультація\.<\/p>\s*/gi, "\n");

const ensurePictureWebpSources = (html, webpImages) =>
  html.replace(/<picture>([\s\S]*?)<\/picture>/gi, (match) => {
    if (/type=["']image\/webp["']/i.test(match)) {
      return match;
    }

    const imgTag = match.match(/<img\b[^>]*>/i)?.[0];
    const src = imgTag ? imgTag.match(/\ssrc=["']([^"']+)["']/i)?.[1] : "";
    if (!src || !/\.(?:jpg|jpeg|png)$/i.test(src)) {
      return match;
    }

    const webpPath = src.replace(/\.(?:jpg|jpeg|png)$/i, ".webp");
    if (!webpImages.has(webpPath)) {
      return match;
    }

    const webpSource = `\n            <source srcset="${webpPath}" type="image/webp" />`;
    if (/<source\b/i.test(match)) {
      return match.replace(/<source\b/i, `${webpSource}\n            <source`);
    }

    return match.replace(/<img\b/i, `${webpSource}\n            <img`);
  });

const normalizePath = (filePath) =>
  path.relative(root, filePath).replace(/\\/g, "/");

const getLocale = (relativePath) => {
  if (relativePath.startsWith("en/")) return "en";
  if (relativePath.startsWith("ru/")) return "ru";
  if (relativePath.startsWith("ua/")) return "ua";
  return "he";
};

const getCanonicalUrl = (relativePath) => {
  if (relativePath === "index.html") {
    return `${siteUrl}/`;
  }

  if (relativePath.endsWith("/index.html")) {
    return `${siteUrl}/${relativePath.replace(/index\.html$/, "")}`;
  }

  return `${siteUrl}/${relativePath.replace(/\.html$/, "")}`;
};

const getNeutralPath = (relativePath) => {
  const locale = getLocale(relativePath);
  if (locale === "he") {
    return relativePath;
  }
  return relativePath.replace(new RegExp(`^${locale}/`), "");
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
  )
    .replace(/\s+/g, " ")
    .trim();

const trimAtWord = (value, max) => {
  if (value.length <= max) {
    return value;
  }

  const slice = value.slice(0, max + 1);
  const breakpoints = [
    slice.lastIndexOf(" "),
    slice.lastIndexOf("-"),
    slice.lastIndexOf("–"),
    slice.lastIndexOf("—"),
    slice.lastIndexOf("־"),
  ];
  const best = Math.max(...breakpoints);
  const cutoff = best > Math.floor(max * 0.6) ? best : max;
  return slice
    .slice(0, cutoff)
    .replace(/[|:;,.\-–—־\s]+$/g, "")
    .trim();
};

const ensureSentence = (value) => {
  if (!value) {
    return value;
  }

  return /[.!?…»”]$/.test(value) ? value : `${value}.`;
};

const fitCompleteSentences = (value, max = 158) => {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return normalized;
  }

  const sentences = normalized.match(/[^.!?…]+[.!?…]?/gu) || [];
  let combined = "";

  for (const sentence of sentences) {
    const next = combined ? `${combined} ${sentence.trim()}` : sentence.trim();
    if (next.length > max) {
      break;
    }
    combined = next;
  }

  if (combined.length >= 50) {
    return ensureSentence(combined.trim());
  }

  return ensureSentence(trimAtWord(normalized, max));
};

const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const extractTitle = (html) => {
  const match = html.match(/<title>([\s\S]*?)<\/title>/i);
  return match ? decodeEntities(match[1]).replace(/\s+/g, " ").trim() : "";
};

const extractMeta = (html, attr, name) => {
  const match = html.match(
    new RegExp(
      `<meta[^>]*${attr}=["']${name}["'][^>]*content=(["'])([\\s\\S]*?)\\1[^>]*>`,
      "i"
    )
  );
  return match ? decodeEntities(match[2]).replace(/\s+/g, " ").trim() : "";
};

const replaceTitle = (html, title) =>
  html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

const replaceMetaContent = (html, attr, name, content) => {
  const escaped = escapeHtml(content);
  const regex = new RegExp(
    `(<meta[^>]*${attr}=["']${name}["'][^>]*content=)(["'])([\\s\\S]*?)(\\2)([^>]*>)`,
    "i"
  );

  if (regex.test(html)) {
    return html.replace(regex, `$1$2${escaped}$2$5`);
  }

  return html.replace(
    /<\/head>/i,
    `    <meta ${attr}="${name}" content="${escaped}" />\n  </head>`
  );
};

const replaceCanonical = (html, canonicalUrl) => {
  const escaped = escapeHtml(canonicalUrl);
  const regex = /(<link[^>]*rel=["']canonical["'][^>]*href=["'])([\s\S]*?)(["'][^>]*>)/i;

  if (regex.test(html)) {
    return html.replace(regex, `$1${escaped}$3`);
  }

  return html.replace(
    /<\/head>/i,
    `    <link rel="canonical" href="${escaped}" />\n  </head>`
  );
};

const replaceHtmlLang = (html, locale) => {
  const langValue = localeConfig[locale].locale;
  return html.replace(
    /<html\b([^>]*?)\blang=["'][^"']+["']([^>]*?)>/i,
    `<html$1lang="${langValue}"$2>`
  );
};

const extractH1 = (html) => {
  const match = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  return match ? stripTags(match[1]) : "";
};

const extractLead = (html) => {
  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] || html;
  const ledeMatch = main.match(
    /<p\b[^>]*class=["'][^"']*\blede\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/i
  );
  if (ledeMatch) {
    const lede = stripTags(ledeMatch[1]);
    if (lede.length >= 40) {
      return lede;
    }
  }

  const candidates = Array.from(
    main.matchAll(/<(p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi)
  )
    .map((match) => stripTags(match[2]))
    .filter(
      (value) =>
        value.length >= 35 &&
        !/^(נכתב|Матеріал підготовлено|Материал подготовлен|This page was|מידע כללי בלבד|General information only|Загальна інформація|Общая информация)/i.test(
          value
        )
    );

  if (!candidates.length) {
    return "";
  }

  let lead = candidates[0];
  if (lead.length < 95 && candidates[1]) {
    lead = `${lead} ${candidates[1]}`;
  }

  return lead.replace(/\s+/g, " ").trim();
};

const extractDescriptionCandidates = (html) => {
  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] || html;
  const candidates = [];
  const seen = new Set();

  const addCandidate = (raw) => {
    const text = stripTags(raw).replace(/\s+/g, " ").trim();
    if (!text || text.length < 45) {
      return;
    }

    if (
      /^(נכתב|Матеріал підготовлено|Материал подготовлен|This page was|מידע כללי בלבד|General information only|Загальна інформація|Общая информация)/i.test(
        text
      )
    ) {
      return;
    }

    if (seen.has(text)) {
      return;
    }

    seen.add(text);
    candidates.push(text);
  };

  for (const match of main.matchAll(/<p\b[^>]*class=["'][^"']*\blede\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/gi)) {
    addCandidate(match[1]);
  }

  for (const match of main.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
    addCandidate(match[1]);
  }

  return candidates;
};

const sanitizeDescription = (value, locale) => {
  let next = value.replace(/\s+/g, " ").trim();

  for (const fragment of boilerplateFragments[locale] || []) {
    const index = next.indexOf(fragment);
    if (index !== -1) {
      next = next.slice(0, index).trim();
    }
  }

  next = next.replace(/\s+[|:;,.\-–—־]*$/g, "").trim();
  return fitCompleteSentences(next, 158);
};

const getPageType = (relativePath) => {
  if (relativePath === "404.html") return "404";
  if (relativePath === "design-system.html") return "design-system";
  if (relativePath === "article_template.html") return "internal-template";
  if (relativePath === "index.html" || /^(en|ru|ua)\/index\.html$/.test(relativePath)) {
    return "home";
  }
  if (/(^|\/)about\.html$/.test(relativePath)) return "about";
  if (/(^|\/)contact\.html$/.test(relativePath)) return "contact";
  if (/(^|\/)articles\/index\.html$/.test(relativePath)) return "article-index";
  if (/(^|\/)articles\/article-\d+\.html$/.test(relativePath)) return "article-detail";
  if (/(^|\/)services\/index\.html$/.test(relativePath)) return "service-index";
  if (/(^|\/)services\/[^/]+\.html$/.test(relativePath)) return "service-detail";
  if (/(^|\/)legal\/(privacy|terms)\.html$/.test(relativePath)) return "private-legal";
  if (/(^|\/)legal\/[^/]+\.html$/.test(relativePath)) return "legal";
  return "page";
};

const buildTitle = ({ existingTitle, h1, locale, pageType, relativePath }) => {
  if (titleOverrides[relativePath]) {
    return titleOverrides[relativePath];
  }

  const brand = localeConfig[locale].brand;
  const candidate = existingTitle.replace(/\s+/g, " ").trim();

  if (candidate.length >= 30 && candidate.length <= 65) {
    return candidate;
  }

  let base = h1 || candidate || brand;

  if (pageType === "home" && candidate) {
    base = candidate;
  }

  if (base.length < 30) {
    base = `${base} | ${brand}`;
  }

  return trimAtWord(base, 62);
};

const buildDescription = ({ existingDescription, html, lead, locale, relativePath }) => {
  if (descriptionOverrides[relativePath]) {
    return descriptionOverrides[relativePath];
  }

  const rawCandidates = [
    lead,
    ...extractDescriptionCandidates(html),
    existingDescription,
  ].filter(Boolean);

  for (let index = 0; index < rawCandidates.length; index += 1) {
    const current = sanitizeDescription(rawCandidates[index], locale);
    if (current.length >= 90) {
      return current;
    }

    if (rawCandidates[index + 1]) {
      const combined = sanitizeDescription(
        `${rawCandidates[index]} ${rawCandidates[index + 1]}`,
        locale
      );
      if (combined.length >= 90) {
        return combined;
      }
    }
  }

  if (rawCandidates.length) {
    return sanitizeDescription(rawCandidates[0], locale);
  }

  return sanitizeDescription(existingDescription, locale);
};

const buildSharedGraph = ({
  canonicalUrl,
  description,
  headline,
  locale,
  pageType,
  title,
  itemList,
}) => {
  const config = localeConfig[locale];
  const graph = [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: config.businessName,
      description: config.businessDescription,
      inLanguage: ["he", "en", "ru", "uk-UA"],
      publisher: { "@id": `${siteUrl}/#business` },
    },
    {
      "@type": ["LegalService", "LocalBusiness", "Attorney"],
      "@id": `${siteUrl}/#business`,
      name: config.businessName,
      url: `${siteUrl}/`,
      description: config.businessDescription,
      image: `${siteUrl}/images/law-office-scales-gavel-ashdod.jpg`,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/images/favicon.jpg`,
      },
      areaServed: ["Ashdod", "Israel"],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ashdod",
        addressCountry: "IL",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 31.8044,
        longitude: 34.6553,
      },
      availableLanguage: config.languages,
    },
  ];

  const pageSchemaType = {
    about: "AboutPage",
    "article-index": "CollectionPage",
    contact: "ContactPage",
    legal: "WebPage",
    "service-index": "CollectionPage",
  }[pageType] || "WebPage";

  const pageNode = {
    "@type": pageSchemaType,
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: title,
    description,
    inLanguage: config.locale,
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#business` },
  };

  if (pageType === "service-detail") {
    pageNode.mainEntity = { "@id": `${canonicalUrl}#service` };
    graph.push(pageNode);
    graph.push({
      "@type": "Service",
      "@id": `${canonicalUrl}#service`,
      name: headline,
      description,
      serviceType: headline,
      url: canonicalUrl,
      provider: { "@id": `${siteUrl}/#business` },
      areaServed: "Israel",
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: `${siteUrl}/${locale === "he" ? "contact" : `${locale}/contact`}`,
        availableLanguage: config.languages,
      },
    });
    return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2);
  }

  if (pageType === "article-index" && itemList.length) {
    pageNode.mainEntity = { "@id": `${canonicalUrl}#itemlist` };
    graph.push(pageNode);
    graph.push({
      "@type": "ItemList",
      "@id": `${canonicalUrl}#itemlist`,
      itemListElement: itemList.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: item.url,
      })),
    });
    return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2);
  }

  graph.push(pageNode);
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2);
};

const replacePrimarySchemaBlock = (html, schemaText) => {
  const scripts = Array.from(
    html.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/gi)
  );
  const target = scripts.find((match) => match[1].includes("\"LegalService\""));

  if (!target) {
    return html.replace(
      /<\/head>/i,
      `    <script type="application/ld+json">\n${schemaText}\n    </script>\n  </head>`
    );
  }

  return html.replace(
    target[0],
    `    <script type="application/ld+json">\n${schemaText}\n    </script>`
  );
};

const removeJsonLdBlocks = (html, predicate) =>
  html.replace(
    /<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>\s*/gi,
    (fullMatch, rawJson) => {
      try {
        const parsed = JSON.parse(rawJson);
        return predicate(parsed) ? "" : fullMatch;
      } catch {
        return fullMatch;
      }
    }
  );

const removeDuplicatePageSchemas = (html) => {
  const scripts = Array.from(
    html.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/gi)
  );

  let next = html;
  for (const match of scripts) {
    try {
      const parsed = JSON.parse(match[1]);
      if (
        !parsed["@graph"] &&
        typeof parsed["@id"] === "string" &&
        /#(?:page|itemlist|service)$/i.test(parsed["@id"])
      ) {
        next = next.replace(match[0], "");
      }
    } catch {
      // Ignore non-JSON payloads or scripts that are not standalone page schemas.
    }
  }

  return next;
};

const normalizeUkrainianLocale = (html, locale) => {
  if (locale !== "ua") {
    return html;
  }

  return html
    .replace(/<html lang="uk"/g, '<html lang="uk-UA"')
    .replace(/hreflang="uk"/g, 'hreflang="uk-UA"')
    .replace(/"inLanguage": "uk"/g, '"inLanguage": "uk-UA"');
};

const updateArticleSchemaDates = async (html, filePath) => {
  const stats = await fs.stat(filePath);
  const datePublished = stats.birthtime && !Number.isNaN(stats.birthtime.valueOf())
    ? stats.birthtime
    : stats.mtime;
  const dateModified = stats.mtime;
  const scripts = Array.from(
    html.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/gi)
  );
  const target = scripts.find((match) => match[1].includes('"@type": "Article"'));

  if (!target) {
    return html;
  }

  const article = JSON.parse(target[1]);
  article.datePublished = datePublished.toISOString().slice(0, 10);
  article.dateModified = dateModified.toISOString().slice(0, 10);
  article.publisher = {
    ...article.publisher,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/images/favicon.jpg`,
    },
  };

  return html.replace(
    target[0],
    `    <script type="application/ld+json">\n${JSON.stringify(
      article,
      null,
      2
    )}\n    </script>`
  );
};

const updateImageLoading = (html) => {
  let imageIndex = 0;

  return html.replace(/<img\b([^>]*?)\s*\/?>/gi, (match, attributes) => {
    imageIndex += 1;
    let next = `<img${attributes}>`;

    next = next.replace(/\sloading=["'][^"']+["']/i, "");
    next = next.replace(/\sdecoding=["'][^"']+["']/i, "");
    next = next.replace(/\sfetchpriority=["'][^"']+["']/i, "");

    if (imageIndex === 1) {
      next = next.replace(/>$/, ' decoding="async" fetchpriority="high">');
    } else {
      next = next.replace(/>$/, ' loading="lazy" decoding="async">');
    }

    return next;
  });
};

const ensureMetaDimensions = (html) => {
  const ogImage = extractMeta(html, "property", "og:image");
  if (!ogImage) {
    return html;
  }

  const url = new URL(ogImage);
  const meta = ogImageMeta[url.pathname];
  if (!meta) {
    return html;
  }

  let next = replaceMetaContent(
    html,
    "property",
    "og:image:width",
    String(meta.width)
  );
  next = replaceMetaContent(
    next,
    "property",
    "og:image:height",
    String(meta.height)
  );
  return next;
};

const replaceAlternateLinks = (html, alternateTags) => {
  const cleaned = html.replace(
    /\s*<link rel="alternate" hreflang="[^"]+" href="[^"]+"\s*\/>\n?/g,
    ""
  );

  if (/<link rel="stylesheet"/i.test(cleaned)) {
    return cleaned.replace(
      /<link rel="stylesheet"/i,
      `${alternateTags}\n\n    <link rel="stylesheet"`
    );
  }

  return cleaned.replace(/<\/head>/i, `${alternateTags}\n  </head>`);
};

const buildReviewBlock = (locale, pageType, headline, dateText) => {
  const config = getReviewDetails(locale, pageType, headline, dateText);

  return [
    '<div class="cta-band" data-review-block>',
    `  <h3 class="title-md">${config.heading}</h3>`,
    `  <p>${config.body}</p>`,
    "  <ul>",
    `    <li>${config.bulletOne}</li>`,
    `    <li>${config.bulletTwo}</li>`,
    "  </ul>",
    "</div>",
  ].join("\n");
};

const injectReviewBlock = (html, locale, pageType, headline, dateText) => {
  if (!["article-detail", "service-detail"].includes(pageType)) {
    return html;
  }

  const block = `${buildReviewBlock(locale, pageType, headline, dateText)}\n\n`;
  if (html.includes("data-review-block")) {
    return html.replace(
      /<div class="cta-band" data-review-block>[\s\S]*?<\/div>\s*/i,
      block
    );
  }

  if (/<p class="footer-note">/i.test(html)) {
    return html.replace(/<p class="footer-note">/i, `${block}<p class="footer-note">`);
  }

  return html.replace(/<\/main>/i, `${block}    </main>`);
};

const buildItemList = (html, locale) => {
  const pathPrefix = locale === "he" ? "" : `/${locale}`;
  const anchors = Array.from(
    html.matchAll(
      new RegExp(
        `<a href="${pathPrefix.replace("/", "\\/")}\\/articles\\/article-(\\d+)"[^>]*>([\\s\\S]*?)<\\/a>`,
        "gi"
      )
    )
  );

  const unique = new Map();
  for (const match of anchors) {
    const number = match[1];
    const href = `${pathPrefix}/articles/article-${number}`.replace("//", "/");
    if (unique.has(href)) {
      continue;
    }
    unique.set(href, {
      url: `${siteUrl}${href}`,
      name: stripTags(match[2]),
      number: Number.parseInt(number, 10),
    });
  }

  return Array.from(unique.values()).sort((a, b) => a.number - b.number);
};

const rebuildArticleHub = (html, locale) => {
  const items = buildItemList(html, locale);
  if (items.length !== 40) {
    return html;
  }

  const serviceLinks = articleHubServiceLinks[locale];
  const serviceLinksHtml = [
    '<section class="stack">',
    `  <h3 class="title-md">${serviceLinks.heading}</h3>`,
    `  <p>${serviceLinks.intro}</p>`,
    "  <ul>",
    ...serviceLinks.links.map(
      (link) => `    <li><a href="${link.href}">${link.label}</a></li>`
    ),
    "  </ul>",
    "</section>",
  ].join("\n");

  const clusterHtml = localeConfig[locale].clusterLabels
    .map((cluster) => {
      const ranges = {
        citizenship: [11, 20],
        emergency: [31, 40],
        tourism: [21, 30],
        work: [1, 10],
      };
      const [start, end] = ranges[cluster.key];
      const clusterItems = items.filter(
        (item) => item.number >= start && item.number <= end
      );

      return [
        '<section class="stack">',
        `  <h3 class="title-md">${cluster.heading}</h3>`,
        `  <p>${cluster.description}</p>`,
        "  <ol>",
        ...clusterItems.map(
          (item) =>
            `    <li><a href="${item.url.replace(siteUrl, "")}">${escapeHtml(
              item.name
            )}</a></li>`
        ),
        "  </ol>",
        "</section>",
      ].join("\n");
    })
    .join("\n\n");

  return html.replace(
    /(<h2 class="title-lg">[\s\S]*?<\/h2>\s*<p>[\s\S]*?<\/p>)([\s\S]*?)(\s*<div class="cta-band">)/i,
    `$1\n${serviceLinksHtml}\n\n${clusterHtml}\n$3`
  );
};

const repairFile = async (filePath) => {
  const relativePath = normalizePath(filePath);
  const locale = getLocale(relativePath);
  const pageType = getPageType(relativePath);
  let html = await fs.readFile(filePath, "utf8");

  if (pageType === "design-system" || pageType === "404" || pageType === "internal-template" || pageType === "private-legal") {
    return false;
  }

  html = normalizeConsultationCopy(html, locale);

  const title = buildTitle({
    existingTitle: extractTitle(html),
    h1: extractH1(html),
    locale,
    pageType,
    relativePath,
  });
  const headline = extractH1(html) || title;
  const description = buildDescription({
    existingDescription: extractMeta(html, "name", "description"),
    html,
    lead: extractLead(html),
    locale,
    relativePath,
  });
  const canonicalUrl = getCanonicalUrl(relativePath);
  const alternateTags = buildAlternateTags(relativePath);
  const reviewDateText = formatDisplayDate((await fs.stat(filePath)).mtime, locale);

  html = replaceHtmlLang(html, locale);
  html = replaceTitle(html, title);
  html = replaceMetaContent(html, "name", "description", description);
  html = replaceMetaContent(html, "property", "og:title", title);
  html = replaceMetaContent(html, "property", "og:description", description);
  html = replaceMetaContent(html, "name", "twitter:title", title);
  html = replaceMetaContent(html, "name", "twitter:description", description);
  html = replaceCanonical(html, canonicalUrl);
  html = replaceAlternateLinks(html, alternateTags);

  const schemaText = buildSharedGraph({
    canonicalUrl,
    description,
    headline,
    locale,
    pageType,
    title,
    itemList: pageType === "article-index" ? buildItemList(html, locale) : [],
  });
  html = replacePrimarySchemaBlock(html, schemaText);
  html = removeDuplicatePageSchemas(html);
  html = normalizeUkrainianLocale(html, locale);

  if (pageType === "article-detail") {
    html = await updateArticleSchemaDates(html, filePath);
  }

  if (pageType === "article-index") {
    html = rebuildArticleHub(html, locale);
  }

  html = removeJsonLdBlocks(
    html,
    (parsed) =>
      parsed?.["@id"] === `${canonicalUrl}#page` ||
      parsed?.["@id"] === `${canonicalUrl}#webpage` ||
      parsed?.["@id"] === `${canonicalUrl}#service` ||
      parsed?.["@id"] === `${canonicalUrl}#itemlist`
  );
  html = ensureMetaDimensions(html);
  html = ensurePictureWebpSources(html, webpImages);
  html = updateImageLoading(html);
  html = injectReviewMeta(html, locale, pageType, reviewDateText);
  html = injectReviewBlock(html, locale, pageType, headline, reviewDateText);
  html = ensureContactDisclaimer(html, locale, pageType);
  html = stripRedundantFooterNotes(html);

  await fs.writeFile(filePath, html, "utf8");
  return true;
};

const htmlFiles = await walk(root, { ignoreDirs });
const webpImages = new Set(
  (await fs.readdir(path.join(root, "images")))
    .filter((name) => name.endsWith(".webp"))
    .map((name) => `/images/${name}`)
);
const alternateGroups = htmlFiles.reduce((accumulator, filePath) => {
  const relativePath = normalizePath(filePath);
  const pageType = getPageType(relativePath);
  if (pageType === "404" || pageType === "design-system" || pageType === "internal-template" || pageType === "private-legal") {
    return accumulator;
  }

  const neutralPath = getNeutralPath(relativePath);
  const pages = accumulator.get(neutralPath) || [];
  pages.push({
    locale: getLocale(relativePath),
    url: getCanonicalUrl(relativePath),
  });
  accumulator.set(neutralPath, pages);
  return accumulator;
}, new Map());

const buildAlternateTags = (relativePath) => {
  const pages = (alternateGroups.get(getNeutralPath(relativePath)) || [])
    .slice()
    .sort(
      (left, right) =>
        localeOrder.indexOf(left.locale) - localeOrder.indexOf(right.locale)
    );
  const defaultPage = pages.find((page) => page.locale === "he") || pages[0];
  const tags = pages.map(
    (page) =>
      `    <link rel="alternate" hreflang="${localeConfig[page.locale].locale}" href="${page.url}" />`
  );

  if (getNeutralPath(relativePath) === "index.html" && defaultPage) {
    tags.push(
      `    <link rel="alternate" hreflang="x-default" href="${defaultPage.url}" />`
    );
  }

  return tags.join("\n");
};

const generateSitemap = async () => {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ];

  const groupedEntries = Array.from(alternateGroups.entries()).sort((left, right) =>
    left[0].localeCompare(right[0], "en")
  );

  for (const [neutralPath, pageGroup] of groupedEntries) {
    const pages = [];

    for (const page of pageGroup) {
      const relativePath = page.locale === "he" ? neutralPath : `${page.locale}/${neutralPath}`;
      const pageType = getPageType(relativePath);
      if (pageType === "internal-template" || pageType === "private-legal") {
        continue;
      }
      const filePath = path.join(root, relativePath);
      const html = await fs.readFile(filePath, "utf8");
      const robots = extractMeta(html, "name", "robots").toLowerCase();
      if (robots.includes("noindex")) {
        continue;
      }

      const stats = await fs.stat(filePath);
      pages.push({
        ...page,
        mtime: stats.mtime,
      });
    }

    if (!pages.length) {
      continue;
    }

    pages.sort(
      (left, right) =>
        localeOrder.indexOf(left.locale) - localeOrder.indexOf(right.locale)
    );

    const defaultPage = pages.find((page) => page.locale === "he") || pages[0];
    const lastmod = new Date(
      Math.max(...pages.map((page) => page.mtime.getTime()))
    )
      .toISOString()
      .slice(0, 10);

    lines.push("  <url>");
    lines.push(`    <loc>${defaultPage.url}</loc>`);
    for (const page of pages) {
      lines.push(
        `    <xhtml:link rel="alternate" hreflang="${localeConfig[page.locale].locale}" href="${page.url}" />`
      );
    }
    if (neutralPath === "index.html") {
      lines.push(
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultPage.url}" />`
      );
    }
    lines.push(`    <lastmod>${lastmod}</lastmod>`);
    lines.push("  </url>");
  }

  lines.push("</urlset>");
  await fs.writeFile(path.join(root, "sitemap.xml"), `${lines.join("\n")}\n`, "utf8");
};

let updated = 0;

for (const filePath of htmlFiles) {
  const changed = await repairFile(filePath);
  if (changed) {
    updated += 1;
  }
}

await generateSitemap();

console.log(`SEO repair updated ${updated} HTML files.`);
