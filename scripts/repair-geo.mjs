import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { siteUrl } from "./utils/config.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const locales = {
  he: {
    lang: "he",
    htmlLang: "he",
    dir: "rtl",
    pathPrefix: "",
    businessName: "משרד עורכי דין להגירה",
    siteDescription:
      "משרד עורכי דין להגירה באשדוד עם ליווי רב-לשוני בענייני ויזות, מעמד, אזרחות וסיוע בנתב\"ג.",
    labels: {
      home: "דף הבית",
      services: "שירותים",
      articles: "מאמרים",
      glossary: "מילון מונחים",
      editorialPolicy: "מדיניות עריכה",
      answer: "תשובה ב-30 שניות",
      whoFor: "למי זה בדרך כלל רלוונטי",
      prepare: "מה כדאי להכין מראש",
      varies: "מתי התשובה משתנה לפי נסיבות",
      lawyerNow: "מתי נכון לפנות לייעוץ משפטי עכשיו",
      keyQuestions: "שאלות שאנשים באמת שואלים",
      sources: "מקורות רשמיים ששימשו לעמוד זה",
      topicMap: "מפת נושאים ל-LLM ולחיפוש שיחתי",
      topicMapText:
        "אם אתם שואלים שאלה כללית או משווים בין מסלולים, התחילו מהאשכול הרלוונטי ואז עברו למדריך או לשירות הספציפי.",
      allGuides: "כל המדריכים באשכול הזה",
      relatedTerms: "מונחים קשורים",
      clusterHub: "מרכז הידע של האשכול",
      emergencyHelp: "סיוע חירום בנתב״ג",
      nextReading: "המשך קריאה לפי כוונה",
      oneMinute: "בדקה אחת",
      knowledgePath: "נתיב ידע מומלץ",
      clusterRoute: "מרכז הידע של האשכול",
      foundationalGuide: "מדריך פתיחה מומלץ",
      relatedClusters: "לאן להמשיך מכאן",
      stepModel: "איך עוברים ממידע כללי לליווי משפטי",
      trustModel: "איך לעבוד עם המידע באתר בצורה בטוחה",
      trustModelItems: [
        "התוכן באתר הוא מידע כללי בלבד ואינו מחליף ייעוץ משפטי מותאם.",
        "שיחת בירור ראשונית מסייעת להבין מסמכים, סיכונים והצעד הבא, אך אינה יוצרת ייצוג.",
        "ייצוג משפטי מלא מתחיל רק לאחר בדיקה מסודרת והסכמה מפורשת על מסגרת הטיפול.",
      ],
      urgentTriggers: "מתי נכון לציין דחיפות או לבקש ליווי מיידי",
      publicFacts: "כרטיס עובדות פומבי על המשרד",
      publicFactsItems: [
        "המשרד מתמקד בדיני הגירה, ויזות, מעמד ואזרחות בישראל.",
        "מיקום השירות המוצהר באתר: אשדוד, ישראל.",
        "התוכן באתר נכתב כהכוונה כללית בלבד ומבוסס על מקורות רשמיים ועל ניסיון מקצועי מצטבר.",
        "כאשר יתווספו פרטי זהות מקצועיים פומביים נוספים, הם יעודכנו גם בסכמה וגם בדפי האמון.",
      ],
      updateGovernance: "עדכון, תיקונים ומתודולוגיית בדיקה",
      updateItems: [
        "לפני עדכון מהותי אנו בודקים ניסוח, התאמה בין השפות, וסימון ברור של מידע כללי מול נקודות שמצריכות בדיקה פרטנית.",
        "כאשר מתווסף מקור רשמי חדש או משתנה דגש מקצועי, אנו מעדכנים גם את תאריך הבדיקה וגם את קטעי ההבהרה.",
        "פניות תיקון דרך טופס יצירת הקשר נבחנות כחלק מתהליך בקרת התוכן.",
      ],
      llmsSummary:
        "אתר ידע משפטי-מעשי על הגירה לישראל: ויזות עבודה, מעמד, אזרחות, אישורי כניסה וחירום בנתב\"ג.",
    },
  },
  en: {
    lang: "en",
    htmlLang: "en",
    dir: "ltr",
    pathPrefix: "/en",
    businessName: "Immigration Law Office",
    siteDescription:
      "Immigration law guidance from Ashdod, Israel for visas, citizenship, status, and Ben Gurion airport matters.",
    labels: {
      home: "Home",
      services: "Services",
      articles: "Articles",
      glossary: "Glossary",
      editorialPolicy: "Editorial policy",
      answer: "Answer in 30 seconds",
      whoFor: "Who this usually applies to",
      prepare: "What to prepare in advance",
      varies: "When the answer changes by case",
      lawyerNow: "When to contact a lawyer now",
      keyQuestions: "Questions people actually ask",
      sources: "Official sources used on this page",
      topicMap: "Topic map for conversational search",
      topicMapText:
        "If you are comparing paths or asking a broad immigration question, start with the relevant cluster and then move to the specific guide or service page.",
      allGuides: "All guides in this cluster",
      relatedTerms: "Related terms",
      clusterHub: "Cluster knowledge hub",
      emergencyHelp: "Ben Gurion emergency help",
      nextReading: "Next reading by intent",
      oneMinute: "In one minute",
      knowledgePath: "Suggested knowledge path",
      clusterRoute: "Cluster hub",
      foundationalGuide: "Foundational guide",
      relatedClusters: "Where to continue from here",
      stepModel: "How general guidance turns into legal representation",
      trustModel: "How to use the site safely",
      trustModelItems: [
        "Website content is general information only and does not replace case-specific legal advice.",
        "An intake call helps clarify documents, risk points, and the next step, but it is not formal representation.",
        "Formal legal representation starts only after a direct review and explicit engagement.",
      ],
      urgentTriggers: "When to mark a case as urgent",
      publicFacts: "Public facts about the office",
      publicFactsItems: [
        "The site focuses on immigration, visas, status, citizenship, and Ben Gurion emergency matters in Israel.",
        "Declared service location on the site: Ashdod, Israel.",
        "Content is published as general legal guidance based on official sources and accumulated professional experience.",
        "If public professional identity details are added later, they should be updated both in schema and in trust pages.",
      ],
      updateGovernance: "Updates, corrections, and review method",
      updateItems: [
        "Before a material update we review wording, cross-language consistency, and the line between general guidance and case-specific advice.",
        "When a new official source or legal emphasis is added, we update both the review date and the explanation block.",
        "Correction requests sent through the contact form are reviewed as part of the editorial workflow.",
      ],
      llmsSummary:
        "Practical immigration-law knowledge site for Israel: work visas, status, citizenship, entry permits, tourist cases, and Ben Gurion emergencies.",
    },
  },
  ru: {
    lang: "ru",
    htmlLang: "ru",
    dir: "ltr",
    pathPrefix: "/ru",
    businessName: "Иммиграционный юридический офис",
    siteDescription:
      "Иммиграционное юридическое сопровождение из Ашдода, Израиль: визы, статус, гражданство и помощь в Бен-Гурионе.",
    labels: {
      home: "Главная",
      services: "Услуги",
      articles: "Статьи",
      glossary: "Глоссарий",
      editorialPolicy: "Редакционная политика",
      answer: "Ответ за 30 секунд",
      whoFor: "Кому это обычно подходит",
      prepare: "Что подготовить заранее",
      varies: "Когда ответ меняется по обстоятельствам",
      lawyerNow: "Когда уже нужен юрист",
      keyQuestions: "Вопросы, которые реально задают",
      sources: "Официальные источники для этой страницы",
      topicMap: "Карта тем для разговорного поиска",
      topicMapText:
        "Если вы сравниваете пути или задаёте общий вопрос об иммиграции, начните с тематического кластера, а затем переходите к нужной услуге или материалу.",
      allGuides: "Все материалы этого кластера",
      relatedTerms: "Связанные термины",
      clusterHub: "Центр знаний кластера",
      emergencyHelp: "Срочная помощь в Бен-Гурионе",
      nextReading: "Что читать дальше по намерению",
      oneMinute: "За одну минуту",
      knowledgePath: "Рекомендуемый маршрут по материалам",
      clusterRoute: "Центр знаний кластера",
      foundationalGuide: "Базовый материал",
      relatedClusters: "Куда идти дальше",
      stepModel: "Как общая информация переходит в юридическое сопровождение",
      trustModel: "Как безопасно использовать материалы сайта",
      trustModelItems: [
        "Материалы сайта носят общий информационный характер и не заменяют индивидуальную юридическую консультацию.",
        "Первичный разбор помогает понять документы, риски и следующий шаг, но сам по себе не является представительством.",
        "Полное юридическое сопровождение начинается только после отдельной проверки и явного согласования формата работы.",
      ],
      urgentTriggers: "Когда стоит отметить срочность",
      publicFacts: "Публичные факты об офисе",
      publicFactsItems: [
        "Сайт посвящён визам, статусу, гражданству, разрешениям на въезд и экстренным ситуациям в Бен-Гурионе.",
        "Заявленная локация оказания услуг: Ашдод, Израиль.",
        "Контент публикуется как общая правовая навигация на основе официальных источников и профессионального опыта.",
        "Если позднее появятся публичные подтверждённые данные о специалисте, их следует добавить и в схему, и на страницы доверия.",
      ],
      updateGovernance: "Обновления, исправления и метод проверки",
      updateItems: [
        "Перед существенным обновлением мы проверяем формулировки, согласованность между языками и границу между общей информацией и индивидуальной оценкой.",
        "Когда появляется новый официальный источник или меняется акцент, мы обновляем и дату проверки, и поясняющий блок.",
        "Запросы на исправление через контактную форму рассматриваются как часть редакционного процесса.",
      ],
      llmsSummary:
        "Практический юридический сайт об иммиграции в Израиль: рабочие визы, статус, гражданство, въезд и экстренные ситуации в Бен-Гурионе.",
    },
  },
  ua: {
    lang: "uk",
    htmlLang: "uk-UA",
    dir: "ltr",
    pathPrefix: "/ua",
    businessName: "Імміграційний юридичний офіс",
    siteDescription:
      "Імміграційний юридичний супровід з Ашдода, Ізраїль: візи, статус, громадянство та допомога в Бен-Гуріоні.",
    labels: {
      home: "Головна",
      services: "Послуги",
      articles: "Статті",
      glossary: "Глосарій",
      editorialPolicy: "Редакційна політика",
      answer: "Відповідь за 30 секунд",
      whoFor: "Кому це зазвичай підходить",
      prepare: "Що підготувати заздалегідь",
      varies: "Коли відповідь змінюється через обставини",
      lawyerNow: "Коли вже потрібен юрист",
      keyQuestions: "Питання, які реально ставлять",
      sources: "Офіційні джерела для цієї сторінки",
      topicMap: "Карта тем для розмовного пошуку",
      topicMapText:
        "Якщо ви порівнюєте шляхи або ставите загальне питання про імміграцію, починайте з відповідного кластера, а потім переходьте до потрібної послуги чи матеріалу.",
      allGuides: "Усі матеріали цього кластера",
      relatedTerms: "Пов’язані терміни",
      clusterHub: "Центр знань кластера",
      emergencyHelp: "Термінова допомога в Бен-Гуріоні",
      nextReading: "Що читати далі за наміром",
      oneMinute: "За одну хвилину",
      knowledgePath: "Рекомендований маршрут по матеріалах",
      clusterRoute: "Центр знань кластера",
      foundationalGuide: "Базовий матеріал",
      relatedClusters: "Куди рухатися далі",
      stepModel: "Як загальна інформація переходить у юридичний супровід",
      trustModel: "Як безпечно користуватися матеріалами сайту",
      trustModelItems: [
        "Матеріали сайту мають загальний інформаційний характер і не замінюють індивідуальну юридичну консультацію.",
        "Початковий розбір допомагає зрозуміти документи, ризики та наступний крок, але сам по собі не є представництвом.",
        "Повний юридичний супровід починається лише після окремої перевірки та прямого погодження формату роботи.",
      ],
      urgentTriggers: "Коли варто позначити терміновість",
      publicFacts: "Публічні факти про офіс",
      publicFactsItems: [
        "Сайт присвячений візам, статусу, громадянству, дозволам на в’їзд і екстреним ситуаціям у Бен-Гуріоні.",
        "Заявлена локація надання послуг: Ашдод, Ізраїль.",
        "Контент публікується як загальна правова навігація на основі офіційних джерел і професійного досвіду.",
        "Якщо пізніше з’являться публічні підтверджені дані про фахівця, їх слід додати і до схеми, і на сторінки довіри.",
      ],
      updateGovernance: "Оновлення, виправлення та метод перевірки",
      updateItems: [
        "Перед суттєвим оновленням ми перевіряємо формулювання, узгодженість між мовами та межу між загальною інформацією й індивідуальною оцінкою.",
        "Коли з’являється нове офіційне джерело або змінюється акцент, ми оновлюємо і дату перевірки, і пояснювальний блок.",
        "Запити на виправлення через контактну форму розглядаються як частина редакційного процесу.",
      ],
      llmsSummary:
        "Практичний юридичний сайт про імміграцію до Ізраїлю: робочі візи, статус, громадянство, в’їзд і надзвичайні ситуації в Бен-Гуріоні.",
    },
  },
};

const officialSources = {
  he: [
    {
      title: "רשות האוכלוסין וההגירה",
      url: "https://www.gov.il/he/departments/population_and_immigration_authority",
    },
    {
      title: "משרד הפנים",
      url: "https://www.gov.il/he/departments/ministry_of_interior",
    },
  ],
  en: [
    {
      title: "Population and Immigration Authority",
      url: "https://www.gov.il/he/departments/population_and_immigration_authority",
    },
    {
      title: "Ministry of Interior",
      url: "https://www.gov.il/he/departments/ministry_of_interior",
    },
  ],
  ru: [
    {
      title: "Управление по вопросам населения и иммиграции",
      url: "https://www.gov.il/he/departments/population_and_immigration_authority",
    },
    {
      title: "Министерство внутренних дел",
      url: "https://www.gov.il/he/departments/ministry_of_interior",
    },
  ],
  ua: [
    {
      title: "Управління з питань населення та імміграції",
      url: "https://www.gov.il/he/departments/population_and_immigration_authority",
    },
    {
      title: "Міністерство внутрішніх справ",
      url: "https://www.gov.il/he/departments/ministry_of_interior",
    },
  ],
};

const clusters = {
  "work-visas": {
    articleRange: [1, 10],
    serviceSlugs: ["work-visas"],
    entities: ["work visa", "work permit", "B1 visa", "foreign workers"],
    sources: officialSources,
    copy: {
      he: {
        slug: "work-visas",
        title: "אשכול ויזות עבודה לישראל",
        shortAnswer:
          "ברוב מקרי ויזות העבודה, החוליה הקריטית היא התאמה מלאה בין המעסיק, תיאור התפקיד, המסמכים והסיפור שמוצג לרשויות.",
        whoFor: [
          "מעסיקים שמבקשים להבין את מסלול ההעסקה לפני הגשה.",
          "עובדים זרים שכבר קיבלו מסמכים חלקיים וצריכים סדר ברור.",
          "מקרים של חידוש, עיכוב, דרישת השלמה או ראיון כניסה.",
        ],
        prepare: [
          "תיאור תפקיד עקבי וברור.",
          "פרטי דרכון ומסמכי זהות עדכניים.",
          "מסמכי מעסיק, תרגומים ואימותים רלוונטיים.",
        ],
        varies:
          "המסלול יכול להשתנות לפי תחום העסקה, שלב ההליך, היסטוריית כניסה והאם מדובר בבקשה ראשונה או בחידוש.",
        lawyerNow:
          "פנו לייעוץ משפטי כאשר יש סירוב, דרישת השלמה מורכבת, פערים בין מסמכים, או צורך בתגובה מהירה לראיון או תשאול.",
        questions: [
          "האם עדיף להגיש עכשיו או להשלים מסמכים קודם?",
          "מה ההבדל בפועל בין היתר עבודה לויזת עבודה?",
          "מה בדרך כלל מעכב תיקי B/1?",
        ],
        clusterDescription:
          "מדריכים שמסבירים את מסלול ויזות העבודה, מסמכים, עיכובים, חידושים וראיונות כניסה.",
        terms: [
          "היתר עבודה מול ויזה",
          "B/1",
          "עובד זר",
          "מסמכי מעסיק",
        ],
      },
      en: {
        slug: "work-visas",
        title: "Work visa knowledge hub",
        shortAnswer:
          "In most work-visa cases, the critical factor is full consistency between the employer story, the role, the documents, and what is said to the authorities.",
        whoFor: [
          "Employers who want to map the process before filing.",
          "Foreign workers who already have partial paperwork and need structure.",
          "Renewals, delays, supplementation requests, and entry interviews.",
        ],
        prepare: [
          "A clear role description.",
          "Current passport and identity documents.",
          "Employer records, translations, and required verifications.",
        ],
        varies:
          "The path may change by industry, procedural stage, entry history, and whether this is a first filing or a renewal.",
        lawyerNow:
          "Legal review becomes more urgent when there is a refusal, a complex supplementation request, inconsistent documents, or a fast-moving interview issue.",
        questions: [
          "Should I file now or complete missing documents first?",
          "What is the practical difference between a permit and a visa?",
          "What usually delays a B/1 work visa file?",
        ],
        clusterDescription:
          "Guides covering work visas, employer coordination, renewals, delays, and entry-stage preparation.",
        terms: ["Work permit vs visa", "B/1", "Foreign worker", "Employer documents"],
      },
      ru: {
        slug: "work-visas",
        title: "Центр знаний по рабочим визам",
        shortAnswer:
          "В делах о рабочих визах ключевым фактором обычно является полное совпадение между историей работодателя, описанием роли, документами и объяснениями для властей.",
        whoFor: [
          "Работодателей, которые хотят понять маршрут до подачи.",
          "Иностранных работников с неполным пакетом документов.",
          "Продлений, задержек, требований о дополнении и интервью на въезде.",
        ],
        prepare: [
          "Чёткое описание роли.",
          "Актуальный паспорт и документы личности.",
          "Документы работодателя, переводы и нужные подтверждения.",
        ],
        varies:
          "Путь меняется в зависимости от отрасли, стадии процесса, истории въезда и того, является ли подача первой или это продление.",
        lawyerNow:
          "Юрист особенно нужен при отказе, сложном требовании о дополнении, расхождении в документах или срочном интервью.",
        questions: [
          "Лучше подавать сейчас или сначала закрыть недостающие документы?",
          "В чём практическая разница между разрешением и визой?",
          "Что обычно задерживает рабочую визу B/1?",
        ],
        clusterDescription:
          "Материалы о рабочих визах, документах работодателя, продлениях, задержках и подготовке к въезду.",
        terms: ["Разрешение и виза", "B/1", "Иностранный работник", "Документы работодателя"],
      },
      ua: {
        slug: "work-visas",
        title: "Центр знань про робочі візи",
        shortAnswer:
          "У справах про робочі візи ключовим фактором зазвичай є повна узгодженість між історією роботодавця, описом ролі, документами та поясненнями для органів влади.",
        whoFor: [
          "Роботодавців, які хочуть зрозуміти маршрут до подачі.",
          "Іноземних працівників із неповним пакетом документів.",
          "Продовжень, затримок, вимог про доповнення та співбесід на в’їзді.",
        ],
        prepare: [
          "Чіткий опис ролі.",
          "Актуальний паспорт і документи особи.",
          "Документи роботодавця, переклади та потрібні підтвердження.",
        ],
        varies:
          "Шлях змінюється залежно від галузі, етапу процесу, історії в’їзду та того, чи це перша подача, чи продовження.",
        lawyerNow:
          "Юрист особливо потрібен у разі відмови, складної вимоги про доповнення, розбіжностей у документах або термінової співбесіди.",
        questions: [
          "Краще подавати зараз чи спочатку закрити відсутні документи?",
          "У чому практична різниця між дозволом і візою?",
          "Що зазвичай затримує робочу візу B/1?",
        ],
        clusterDescription:
          "Матеріали про робочі візи, документи роботодавця, продовження, затримки та підготовку до в’їзду.",
        terms: ["Дозвіл і віза", "B/1", "Іноземний працівник", "Документи роботодавця"],
      },
    },
  },
  "citizenship-status": {
    articleRange: [11, 20],
    serviceSlugs: ["citizenship"],
    entities: ["citizenship", "status", "residency", "Ministry of Interior"],
    sources: officialSources,
    copy: {
      he: {
        slug: "citizenship-status",
        title: "אשכול אזרחות, תושבות ומעמד",
        shortAnswer:
          "ברוב תיקי מעמד ואזרחות, מה שקובע הוא מסלול נכון, מסמכים עקביים, והבנה של מהו שלב ההליך שבו אתם נמצאים כרגע.",
        whoFor: [
          "משפחות ובני זוג שנמצאים בהסדרת מעמד.",
          "מבקשי אזרחות או תושבות שמנסים להבין מהו המסלול האפשרי.",
          "מי שקיבלו דרישת השלמה, זימון או דחייה ורוצים להבין את המסגרת.",
        ],
        prepare: [
          "ציר זמן קצר של הקשר או השהייה בישראל.",
          "מסמכי זהות, סטטוס ותיעוד תומך.",
          "כל מכתב רשמי שכבר התקבל ממשרד הפנים או רשות האוכלוסין.",
        ],
        varies:
          "התשובה משתנה לפי מסלול החוק הרלוונטי, משך השהייה, קשר משפחתי, היסטוריית סטטוס ודיוק התיעוד.",
        lawyerNow:
          "פנו לייעוץ כאשר התקבלה דחייה, זימון לשימוע, דרישת השלמה מורכבת או כשיש פער בין מסמכים, תאריכים או זהויות.",
        questions: [
          "מה ההבדל בין אזרחות, תושבות קבע ומעמד זמני?",
          "האם אפשר להתחיל מסלול אזרחות עכשיו או שכדאי להמתין?",
          "מה עושים כשמשרד הפנים דורש השלמות?",
        ],
        clusterDescription:
          "מדריכים על אזרחות, הסדרת מעמד, תושבות, שימועים, מסמכים וטעויות נפוצות.",
        terms: ["אזרחות", "תושבות", "מעמד", "משרד הפנים"],
      },
      en: {
        slug: "citizenship-status",
        title: "Citizenship and status knowledge hub",
        shortAnswer:
          "In most status and citizenship files, the key issue is choosing the right track, keeping documents consistent, and understanding the exact procedural stage you are in.",
        whoFor: [
          "Families and partners going through status regularization.",
          "People trying to understand whether citizenship or residency is the relevant path.",
          "Anyone facing supplementation requests, hearings, or refusals.",
        ],
        prepare: [
          "A short timeline of the relationship or presence in Israel.",
          "Identity, status, and supporting records.",
          "Any official letter already received from the authorities.",
        ],
        varies:
          "The answer changes by legal track, family relationship, residence history, current status, and document quality.",
        lawyerNow:
          "Legal review matters when there is a refusal, a hearing invitation, a complex supplementation request, or inconsistencies in identity and dates.",
        questions: [
          "What is the difference between citizenship, permanent residence, and temporary status?",
          "Should I begin now or wait until more documents are ready?",
          "What do I do after a Ministry of Interior supplementation request?",
        ],
        clusterDescription:
          "Guides on citizenship, status, residency, hearings, document preparation, and common mistakes.",
        terms: ["Citizenship", "Residency", "Status", "Ministry of Interior"],
      },
      ru: {
        slug: "citizenship-status",
        title: "Центр знаний по гражданству и статусу",
        shortAnswer:
          "В делах о статусе и гражданстве ключевым обычно является правильный маршрут, согласованность документов и понимание текущего этапа процедуры.",
        whoFor: [
          "Семей и партнёров, проходящих процедуру получения статуса.",
          "Тех, кто пытается понять, подходит ли путь гражданства или резидентства.",
          "Тех, кто получил требования о дополнении, приглашение на слушание или отказ.",
        ],
        prepare: [
          "Краткую хронологию отношений или пребывания в Израиле.",
          "Документы личности, статуса и подтверждающие материалы.",
          "Все официальные письма, уже полученные от органов.",
        ],
        varies:
          "Ответ зависит от правового маршрута, семейной связи, истории пребывания, текущего статуса и качества документов.",
        lawyerNow:
          "Юрист особенно важен при отказе, приглашении на слушание, сложном требовании о дополнении или расхождениях в данных.",
        questions: [
          "В чём разница между гражданством, постоянным проживанием и временным статусом?",
          "Стоит начинать сейчас или дождаться дополнительных документов?",
          "Что делать после требования о дополнении от МВД?",
        ],
        clusterDescription:
          "Материалы о гражданстве, статусе, резидентстве, слушаниях, документах и типичных ошибках.",
        terms: ["Гражданство", "Резидентство", "Статус", "МВД"],
      },
      ua: {
        slug: "citizenship-status",
        title: "Центр знань про громадянство та статус",
        shortAnswer:
          "У справах про статус і громадянство ключовим зазвичай є правильний маршрут, узгодженість документів і розуміння поточного етапу процедури.",
        whoFor: [
          "Сімей і партнерів, які проходять процедуру отримання статусу.",
          "Тих, хто намагається зрозуміти, чи підходить шлях громадянства або резидентства.",
          "Тих, хто отримав вимоги про доповнення, запрошення на слухання або відмову.",
        ],
        prepare: [
          "Коротку хронологію стосунків або перебування в Ізраїлі.",
          "Документи особи, статусу та підтверджувальні матеріали.",
          "Усі офіційні листи, уже отримані від органів.",
        ],
        varies:
          "Відповідь залежить від правового маршруту, сімейного зв’язку, історії перебування, поточного статусу та якості документів.",
        lawyerNow:
          "Юрист особливо важливий у разі відмови, запрошення на слухання, складної вимоги про доповнення або розбіжностей у даних.",
        questions: [
          "У чому різниця між громадянством, постійним проживанням і тимчасовим статусом?",
          "Чи варто починати зараз або дочекатися додаткових документів?",
          "Що робити після вимоги про доповнення від МВС?",
        ],
        clusterDescription:
          "Матеріали про громадянство, статус, резидентство, слухання, документи та типові помилки.",
        terms: ["Громадянство", "Резидентство", "Статус", "МВС"],
      },
    },
  },
  "tourist-entry": {
    articleRange: [21, 30],
    serviceSlugs: ["tourist-visas", "entry-permits"],
    entities: ["tourist visa", "entry permit", "ETA", "border interview"],
    sources: officialSources,
    copy: {
      he: {
        slug: "tourist-entry",
        title: "אשכול תיירות, אישורי כניסה ו-ETA",
        shortAnswer:
          "במקרי תיירות ואישורי כניסה, עקביות בין מטרת הביקור, המסמכים והסיפור שמוצג בגבול חשובה כמעט כמו עצם המסמכים עצמם.",
        whoFor: [
          "מזמינים ואורחים שרוצים להיערך מראש לביקור בישראל.",
          "מי שחוששים משאלות גבול, אישור כניסה מיוחד או היסטוריה של סירוב.",
          "מי שמנסים להבין את ההבדל בין ויזה, אישור כניסה ו-ETA.",
        ],
        prepare: [
          "מטרת ביקור ברורה ותואמת למסמכים.",
          "מכתב הזמנה, אם רלוונטי, ותיעוד קשר או לינה.",
          "מסמכים על טיסות, מימון ויכולת להסביר את הנסיבות בקצרה.",
        ],
        varies:
          "המסלול משתנה לפי סוג הדרכון, היסטוריית כניסה, סיבת הביקור, והאם נדרש אישור מוקדם או ראיון גבול.",
        lawyerNow:
          "פנו לייעוץ כאשר יש סירוב קודם, עיכוב, תשאול חריג, פערים בין מסמכים, או צורך באישור כניסה מיוחד.",
        questions: [
          "מה ההבדל בין ויזה, אישור כניסה ו-ETA?",
          "האם מכתב הזמנה מספיק בפני עצמו?",
          "מה עושים אם כבר היה סירוב כניסה?",
        ],
        clusterDescription:
          "מדריכים על ויזות תייר, הזמנות, אישורי כניסה, ETA, ראיונות גבול והפחתת סיכון לסירוב.",
        terms: ["ויזת תייר", "אישור כניסה", "ETA", "ראיון גבול"],
      },
      en: {
        slug: "tourist-entry",
        title: "Tourist visas, entry permits, and ETA hub",
        shortAnswer:
          "In tourist and entry-permit matters, consistency between visit purpose, documents, and the border-stage explanation matters almost as much as the documents themselves.",
        whoFor: [
          "Hosts and visitors preparing for travel to Israel.",
          "People concerned about border questions, special entry approval, or a prior refusal.",
          "Readers trying to understand the difference between a visa, an entry permit, and ETA.",
        ],
        prepare: [
          "A clear visit purpose that matches the documents.",
          "An invitation letter if relevant, plus relationship or lodging proof.",
          "Flight, funding, and context documents that can be explained briefly.",
        ],
        varies:
          "The path changes by passport type, entry history, purpose of visit, and whether prior approval or a border interview is involved.",
        lawyerNow:
          "Legal review becomes more urgent after a prior refusal, an unusual delay, inconsistent documents, or a need for special entry approval.",
        questions: [
          "What is the difference between a visa, an entry permit, and ETA?",
          "Is an invitation letter enough on its own?",
          "What should I do after a prior refusal?",
        ],
        clusterDescription:
          "Guides covering tourist visas, invitations, entry permits, ETA, border interviews, and refusal-risk reduction.",
        terms: ["Tourist visa", "Entry permit", "ETA", "Border interview"],
      },
      ru: {
        slug: "tourist-entry",
        title: "Центр знаний по туристическим визам и въезду",
        shortAnswer:
          "В туристических делах и запросах на въезд согласованность между целью поездки, документами и объяснением на границе почти так же важна, как и сами документы.",
        whoFor: [
          "Приглашающих и гостей, готовящихся к поездке в Израиль.",
          "Тех, кто опасается вопросов на границе, специального разрешения или прошлого отказа.",
          "Тех, кто хочет понять разницу между визой, разрешением на въезд и ETA.",
        ],
        prepare: [
          "Чёткую цель визита, совпадающую с документами.",
          "Приглашение, если нужно, и подтверждение связи или проживания.",
          "Документы по перелёту, финансированию и общему контексту поездки.",
        ],
        varies:
          "Маршрут меняется по типу паспорта, истории въезда, цели поездки и тому, требуется ли предварительное разрешение или интервью на границе.",
        lawyerNow:
          "Юрист особенно нужен после прошлых отказов, необычных задержек, несоответствия документов или при необходимости специального разрешения.",
        questions: [
          "В чём разница между визой, разрешением на въезд и ETA?",
          "Достаточно ли одного приглашения?",
          "Что делать после предыдущего отказа?",
        ],
        clusterDescription:
          "Материалы о туристических визах, приглашениях, разрешениях на въезд, ETA и риске отказа.",
        terms: ["Туристическая виза", "Разрешение на въезд", "ETA", "Интервью на границе"],
      },
      ua: {
        slug: "tourist-entry",
        title: "Центр знань про туристичні візи та в’їзд",
        shortAnswer:
          "У туристичних справах і запитах на в’їзд узгодженість між метою поїздки, документами та поясненням на кордоні майже така ж важлива, як і самі документи.",
        whoFor: [
          "Запрошуючих і гостей, які готуються до поїздки в Ізраїль.",
          "Тих, хто хвилюється через питання на кордоні, спеціальний дозвіл або попередню відмову.",
          "Тих, хто хоче зрозуміти різницю між візою, дозволом на в’їзд і ETA.",
        ],
        prepare: [
          "Чітку мету візиту, що збігається з документами.",
          "Лист-запрошення, якщо потрібно, і підтвердження зв’язку чи проживання.",
          "Документи про переліт, фінансування та загальний контекст поїздки.",
        ],
        varies:
          "Маршрут змінюється залежно від типу паспорта, історії в’їзду, мети поїздки та того, чи потрібен попередній дозвіл або співбесіда на кордоні.",
        lawyerNow:
          "Юрист особливо потрібен після попередніх відмов, незвичних затримок, невідповідності документів або потреби у спеціальному дозволі.",
        questions: [
          "У чому різниця між візою, дозволом на в’їзд і ETA?",
          "Чи достатньо одного запрошення?",
          "Що робити після попередньої відмови?",
        ],
        clusterDescription:
          "Матеріали про туристичні візи, запрошення, дозволи на в’їзд, ETA та ризик відмови.",
        terms: ["Туристична віза", "Дозвіл на в’їзд", "ETA", "Співбесіда на кордоні"],
      },
    },
  },
  "ben-gurion-emergency": {
    articleRange: [31, 40],
    serviceSlugs: ["ben-gurion-emergency"],
    entities: ["Ben Gurion", "refusal of entry", "detention", "questioning"],
    sources: officialSources,
    copy: {
      he: {
        slug: "ben-gurion-emergency",
        title: "אשכול חירום בנתב״ג",
        shortAnswer:
          "במקרי עיכוב, תשאול או סירוב כניסה בנתב״ג, הצעד הראשון הוא לא להיכנס לפאניקה אלא לאסוף מידע, לשמור על עקביות, ולהבין מה הוחלט בפועל.",
        whoFor: [
          "נוסעים או בני משפחה שמקבלים הודעה על עיכוב או תשאול בשדה.",
          "מקרים של סירוב כניסה, המתנה לחקירה, או אי-ודאות לגבי הטיסה הבאה.",
          "מי שזקוקים להסבר מהיר מה לעשות עכשיו ומה לא לומר מתוך לחץ.",
        ],
        prepare: [
          "שם מלא, מספר דרכון ומידע על הטיסה.",
          "הסבר קצר ועקבי למטרת הכניסה או הביקור.",
          "כל מסמך שהנוסע מחזיק עמו ופרטי קשר של גורם מסייע בישראל.",
        ],
        varies:
          "התגובה משתנה לפי שלב האירוע: עיכוב ראשוני, תשאול, החלטת סירוב, או המתנה לעלייה לטיסה חוזרת.",
        lawyerNow:
          "פנו לייעוץ מיידי כשיש סירוב כניסה, החזקה ממושכת, חוסר יכולת להבין את ההחלטה, או מסמכים שלא מוסברים היטב בזמן אמת.",
        questions: [
          "מה עושים בדקות הראשונות של עיכוב בנתב״ג?",
          "האם צריך לבקש לדבר עם עורך דין או לתעד את ההחלטה?",
          "מה לא כדאי לומר מתוך לחץ בזמן תשאול?",
        ],
        clusterDescription:
          "מדריכים על עיכוב, תשאול, סירוב כניסה, מסמכי חירום וצעדים מיידיים בנתב״ג.",
        terms: ["עיכוב", "סירוב כניסה", "תשאול", "טיסה חוזרת"],
      },
      en: {
        slug: "ben-gurion-emergency",
        title: "Ben Gurion emergency knowledge hub",
        shortAnswer:
          "In Ben Gurion delay, questioning, or refusal cases, the first step is not to panic but to gather facts, keep the story consistent, and understand what decision was actually made.",
        whoFor: [
          "Travellers and family members dealing with a live airport delay or questioning event.",
          "Refusal-of-entry scenarios, holding situations, and uncertainty about the next flight.",
          "Anyone who needs a fast explanation of what to do now and what not to say under pressure.",
        ],
        prepare: [
          "Full name, passport number, and flight details.",
          "A short and consistent explanation of the visit purpose.",
          "Any documents held by the traveller and a reachable contact in Israel.",
        ],
        varies:
          "The response changes by event stage: first delay, questioning, formal refusal, or waiting for a return flight.",
        lawyerNow:
          "Urgent legal review matters when there is a formal refusal, prolonged holding, unclear decision language, or documents that are not being understood in real time.",
        questions: [
          "What should I do in the first minutes of a Ben Gurion delay?",
          "Should I ask for a lawyer or for a written explanation?",
          "What should I avoid saying under pressure?",
        ],
        clusterDescription:
          "Guides covering delay, questioning, refusal of entry, emergency document handling, and immediate next steps at Ben Gurion.",
        terms: ["Delay", "Refusal of entry", "Questioning", "Return flight"],
      },
      ru: {
        slug: "ben-gurion-emergency",
        title: "Центр знаний по экстренным случаям в Бен-Гурионе",
        shortAnswer:
          "При задержке, допросе или отказе во въезде в Бен-Гурионе первым шагом должно быть не паниковать, а собрать факты, сохранить последовательность и понять, какое решение уже принято.",
        whoFor: [
          "Путешественников и родственников, столкнувшихся с задержкой или допросом в аэропорту.",
          "Ситуаций с отказом во въезде, удержанием и неопределённостью по следующему рейсу.",
          "Тех, кому нужен быстрый ориентир: что делать сейчас и чего не говорить под давлением.",
        ],
        prepare: [
          "Полное имя, номер паспорта и данные рейса.",
          "Короткое и последовательное объяснение цели въезда.",
          "Все документы у пассажира и контакт человека в Израиле.",
        ],
        varies:
          "Реакция зависит от стадии события: первичная задержка, допрос, официальный отказ или ожидание обратного рейса.",
        lawyerNow:
          "Срочная юридическая помощь особенно важна при официальном отказе, длительном удержании, неясной формулировке решения или непонимании документов в реальном времени.",
        questions: [
          "Что делать в первые минуты задержки в Бен-Гурионе?",
          "Стоит ли просить юриста или письменное объяснение?",
          "Чего лучше не говорить под давлением?",
        ],
        clusterDescription:
          "Материалы о задержании, допросе, отказе во въезде, экстренных документах и немедленных шагах в Бен-Гурионе.",
        terms: ["Задержка", "Отказ во въезде", "Допрос", "Обратный рейс"],
      },
      ua: {
        slug: "ben-gurion-emergency",
        title: "Центр знань про екстрені ситуації в Бен-Гуріоні",
        shortAnswer:
          "У разі затримки, допиту або відмови у в’їзді в Бен-Гуріоні першим кроком має бути не паніка, а збір фактів, послідовність і розуміння того, яке рішення вже ухвалено.",
        whoFor: [
          "Мандрівників і родичів, які стикаються із затримкою або допитом в аеропорту.",
          "Ситуацій з відмовою у в’їзді, утриманням і невизначеністю щодо наступного рейсу.",
          "Тих, кому потрібен швидкий орієнтир: що робити зараз і чого не говорити під тиском.",
        ],
        prepare: [
          "Повне ім’я, номер паспорта та дані рейсу.",
          "Коротке й послідовне пояснення мети в’їзду.",
          "Усі документи у пасажира та контакт людини в Ізраїлі.",
        ],
        varies:
          "Реакція залежить від стадії події: первинна затримка, допит, офіційна відмова або очікування зворотного рейсу.",
        lawyerNow:
          "Термінова юридична допомога особливо важлива в разі офіційної відмови, тривалого утримання, незрозумілого формулювання рішення або нерозуміння документів у реальному часі.",
        questions: [
          "Що робити в перші хвилини затримки в Бен-Гуріоні?",
          "Чи варто просити юриста або письмове пояснення?",
          "Чого краще не говорити під тиском?",
        ],
        clusterDescription:
          "Матеріали про затримання, допит, відмову у в’їзді, екстрені документи та негайні кроки в Бен-Гуріоні.",
        terms: ["Затримка", "Відмова у в’їзді", "Допит", "Зворотний рейс"],
      },
    },
  },
};

const glossaryTerms = {
  he: [
    {
      term: "היתר עבודה מול ויזה",
      definition:
        "היתר עבודה מתייחס בדרך כלל לאישור ההעסקה, בעוד שהויזה מתייחסת לכניסה ולשהייה בפועל. בשאלות של עובדים זרים חשוב להבין איזה שלב של ההליך אתם בודקים.",
    },
    {
      term: "אישור כניסה",
      definition:
        "אישור כניסה הוא שכבת אישור מקדימה או נפרדת מהסטטוס עצמו, ולעיתים הוא נדרש בנוסף לויזה או ל-ETA.",
    },
    {
      term: "הסדרת מעמד",
      definition:
        "הסדרת מעמד היא תהליך כללי להשגת סטטוס חוקי בישראל, זמני או קבוע, לפי מסלול רלוונטי ונסיבות אישיות.",
    },
    {
      term: "תושבות מול אזרחות",
      definition:
        "תושבות ואזרחות אינן אותו דבר. הן שונות בזכויות, בחובות ובמסלול ההליך מול משרד הפנים ורשות האוכלוסין.",
    },
    {
      term: "תשאול בנתב״ג",
      definition:
        "תשאול בנתב״ג הוא שלב בדיקה שבו מבקשים להבין את מטרת הכניסה, המסמכים והעקביות של הסיפור שמוצג על ידי הנוסע.",
    },
  ],
  en: [
    {
      term: "Work permit vs visa",
      definition:
        "A work permit usually refers to the employment approval layer, while the visa relates to entry and stay. In foreign-worker cases it matters which stage you are asking about.",
    },
    {
      term: "Entry permit",
      definition:
        "An entry permit is an approval layer that may sit alongside, before, or separate from the visa or ETA itself.",
    },
    {
      term: "Status regularization",
      definition:
        "Status regularization is the broader process of obtaining lawful status in Israel, whether temporary or more durable, through the relevant track.",
    },
    {
      term: "Residency vs citizenship",
      definition:
        "Residency and citizenship are not the same. They differ in rights, obligations, and procedural route before the Ministry of Interior and related authorities.",
    },
    {
      term: "Questioning at Ben Gurion",
      definition:
        "Questioning at Ben Gurion is a review stage used to clarify visit purpose, documents, and consistency before an entry decision is finalized.",
    },
  ],
  ru: [
    {
      term: "Разрешение на работу и виза",
      definition:
        "Разрешение на работу обычно связано с одобрением занятости, а виза — с въездом и пребыванием. Важно понимать, на каком этапе процесса находится вопрос.",
    },
    {
      term: "Разрешение на въезд",
      definition:
        "Разрешение на въезд — это отдельный или предварительный уровень одобрения, который может требоваться наряду с визой или ETA.",
    },
    {
      term: "Урегулирование статуса",
      definition:
        "Урегулирование статуса — это общий процесс получения законного статуса в Израиле через подходящий правовой маршрут.",
    },
    {
      term: "Резидентство и гражданство",
      definition:
        "Резидентство и гражданство — это разные статусы с разными правами, обязанностями и процессуальными маршрутами.",
    },
    {
      term: "Допрос в Бен-Гурионе",
      definition:
        "Допрос в Бен-Гурионе — это этап проверки, на котором выясняют цель въезда, документы и согласованность объяснений.",
    },
  ],
  ua: [
    {
      term: "Дозвіл на роботу і віза",
      definition:
        "Дозвіл на роботу зазвичай пов’язаний із схваленням працевлаштування, а віза — з в’їздом і перебуванням. Важливо розуміти, про який етап процесу йдеться.",
    },
    {
      term: "Дозвіл на в’їзд",
      definition:
        "Дозвіл на в’їзд — це окремий або попередній рівень схвалення, який може бути потрібний разом із візою чи ETA.",
    },
    {
      term: "Урегулювання статусу",
      definition:
        "Урегулювання статусу — це загальний процес отримання законного статусу в Ізраїлі через відповідний правовий маршрут.",
    },
    {
      term: "Резидентство і громадянство",
      definition:
        "Резидентство і громадянство — це різні статуси з різними правами, обов’язками та процедурними маршрутами.",
    },
    {
      term: "Допит у Бен-Гуріоні",
      definition:
        "Допит у Бен-Гуріоні — це етап перевірки, на якому з’ясовують мету в’їзду, документи та послідовність пояснень.",
    },
  ],
};

const localeRoots = ["", "en/", "ru/", "ua/"];

const indexPages = localeRoots.flatMap((prefix) => [
  `${prefix}index.html`,
  `${prefix}services/index.html`,
  `${prefix}articles/index.html`,
]);

const servicePages = localeRoots.flatMap((prefix) => [
  `${prefix}services/work-visas.html`,
  `${prefix}services/citizenship.html`,
  `${prefix}services/tourist-visas.html`,
  `${prefix}services/entry-permits.html`,
  `${prefix}services/ben-gurion-emergency.html`,
]);

const aboutPages = localeRoots.map((prefix) => `${prefix}about.html`);
const contactPages = localeRoots.map((prefix) => `${prefix}contact.html`);
const editorialPolicyPages = localeRoots.map((prefix) => `${prefix}legal/editorial-policy.html`);

const getLocaleFromPath = (relativePath) => {
  if (relativePath.startsWith("en/")) return "en";
  if (relativePath.startsWith("ru/")) return "ru";
  if (relativePath.startsWith("ua/")) return "ua";
  return "he";
};

const localePrefixOf = (locale) => locales[locale].pathPrefix;

const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const read = async (relativePath) =>
  fs.readFile(path.join(root, relativePath), "utf8");

const write = async (relativePath, content) =>
  fs.writeFile(path.join(root, relativePath), content, "utf8");

const upsertBlock = (html, marker, block, anchorRegex) => {
  const start = `<!-- GEO:${marker}:start -->`;
  const end = `<!-- GEO:${marker}:end -->`;
  const wrapped = `${start}\n${block}\n${end}`;
  const existing = new RegExp(`${start}[\\s\\S]*?${end}\\s*`, "gm");
  const cleaned = html.replace(existing, "");
  return cleaned.replace(anchorRegex, (match) => `${match}\n${wrapped}\n`);
};

const slugifyTerm = (value) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

const inferClusterFromText = (value) => {
  const text = value.toLowerCase();
  if (/(work visa|work permit|b\/?1|foreign worker|ויזת עבודה|היתר עבודה|עובד זר|рабоч|иностранн|робоч|іноземн)/i.test(text)) {
    return "work-visas";
  }
  if (/(citizenship|residenc|status|מעמד|אזרחות|תושבות|гражданств|статус|резидент|громадянств|статус|резидент)/i.test(text)) {
    return "citizenship-status";
  }
  if (/(tourist|entry permit|eta|border|ויזת תייר|אישור כניסה|תייר|турист|въезд|турист|в’їзд|дозвіл на в’їзд)/i.test(text)) {
    return "tourist-entry";
  }
  if (/(ben gurion|airport|refusal of entry|questioning|נתב|סירוב כניסה|תשאול|ביקורת גבולות|бен-гурион|отказ во въезде|допрос|бен-гуріон|відмови у в’їзді|допит)/i.test(text)) {
    return "ben-gurion-emergency";
  }
  return null;
};

const slugToServicePath = (locale, slug) => {
  const prefix = localePrefixOf(locale);
  return `${prefix}/services/${slug}` || `/services/${slug}`;
};

const clusterOf = (relativePath, html = "") => {
  if (/services\/work-visas\.html$/.test(relativePath)) return "work-visas";
  if (/services\/citizenship\.html$/.test(relativePath)) return "citizenship-status";
  if (/services\/tourist-visas\.html$/.test(relativePath)) return "tourist-entry";
  if (/services\/entry-permits\.html$/.test(relativePath)) return "tourist-entry";
  if (/services\/ben-gurion-emergency\.html$/.test(relativePath)) return "ben-gurion-emergency";
  const explicitClusterMatch = html.match(
    /<meta[^>]*name=["']article-cluster["'][^>]*content=["']([^"']+)["']/i
  );
  if (explicitClusterMatch) return explicitClusterMatch[1].trim();
  const articleMatch = relativePath.match(/articles\/article-(\d+)\.html$/);
  if (!articleMatch) return null;
  const num = Number.parseInt(articleMatch[1], 10);
  if (num >= 1 && num <= 10) return "work-visas";
  if (num >= 11 && num <= 20) return "citizenship-status";
  if (num >= 21 && num <= 30) return "tourist-entry";
  if (num >= 31 && num <= 40) return "ben-gurion-emergency";
  return inferClusterFromText(`${relativePath} ${extractTitle(html)} ${extractDescription(html)} ${html}`);
};

const extractTitle = (html) => {
  const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || html.match(/<title>([\s\S]*?)<\/title>/i);
  return titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() : "";
};

const extractDescription = (html) => {
  const match = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  return match ? match[1].trim() : "";
};

const firstArticleFile = (locale, number) => {
  const prefix = localePrefixOf(locale);
  const pathPart = prefix ? `${prefix.slice(1)}/articles` : "articles";
  return `${pathPart}/article-${String(number).padStart(2, "0")}.html`;
};

const clusterHubPath = (locale, clusterKey) => {
  const prefix = localePrefixOf(locale);
  const base = prefix ? `${prefix.slice(1)}/articles` : "articles";
  return `${base}/${clusters[clusterKey].copy[locale].slug}/index.html`;
};

const glossaryPath = (locale) => {
  const prefix = localePrefixOf(locale);
  const base = prefix ? `${prefix.slice(1)}/glossary` : "glossary";
  return `${base}/index.html`;
};

const localizedPath = (locale, relativePath) => `${localePrefixOf(locale)}${relativePath}` || relativePath;

const glossaryAnchorId = (index) => `term-${index + 1}`;

const glossaryHrefFor = (locale, index) => `${localizedPath(locale, "/glossary/")}#${glossaryAnchorId(index)}`;

const glossaryRelationMap = {
  0: { cluster: "work-visas", service: "work-visas", articleNumber: 1 },
  1: { cluster: "tourist-entry", service: "entry-permits", articleNumber: 24 },
  2: { cluster: "citizenship-status", service: "citizenship", articleNumber: 11 },
  3: { cluster: "citizenship-status", service: "citizenship", articleNumber: 19 },
  4: { cluster: "ben-gurion-emergency", service: "ben-gurion-emergency", articleNumber: 31 },
};

const buildSourceList = (locale) =>
  officialSources[locale]
    .map(
      (item) =>
        `<li><a href="${item.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.title)}</a></li>`
    )
    .join("\n");

const buildKnowledgePath = (locale, clusterKey) => {
  const labels = locales[locale].labels;
  const glossaryIndex = Object.values(glossaryRelationMap).findIndex(
    (entry) => entry.cluster === clusterKey
  );
  const articleNumber =
    Object.values(glossaryRelationMap).find((entry) => entry.cluster === clusterKey)?.articleNumber ||
    clusters[clusterKey].articleRange[0];
  return `<section class="section">
  <div class="container">
    <div class="geo-note">
      <h2 class="title-md">${escapeHtml(labels.knowledgePath)}</h2>
      <ul>
        <li><strong>${escapeHtml(labels.clusterRoute)}:</strong> <a href="${localizedPath(locale, `/articles/${clusters[clusterKey].copy[locale].slug}/`)}">${escapeHtml(clusters[clusterKey].copy[locale].title)}</a></li>
        <li><strong>${escapeHtml(labels.glossary)}:</strong> <a href="${glossaryIndex >= 0 ? glossaryHrefFor(locale, glossaryIndex) : localizedPath(locale, "/glossary/")}">${escapeHtml(labels.glossary)}</a></li>
        <li><strong>${escapeHtml(labels.foundationalGuide)}:</strong> <a href="${localizedPath(locale, `/articles/article-${String(articleNumber).padStart(2, "0")}`)}">${escapeHtml(labels.articles)}</a></li>
      </ul>
    </div>
  </div>
</section>`;
};

const buildEmergencyPrepSection = (locale) => {
  const labels = locales[locale].labels;
  const body = {
    he: {
      heading: "מה להכין מיד במקרה חירום",
      bullets: [
        "שם מלא, מספר דרכון ומספר טיסה.",
        "סטטוס נוכחי: עיכוב, תשאול, סירוב כניסה או המתנה לטיסה חוזרת.",
        "איש קשר בישראל וכל מסמך שיש בידי הנוסע בזמן אמת.",
      ],
      note: "במקרה חירום ראשית מקבלים כיוון כללי. ייעוץ משפטי מלא מתחיל רק אחרי בדיקה ישירה והסכמה מפורשת.",
    },
    en: {
      heading: "What to gather immediately in an airport emergency",
      bullets: [
        "Full name, passport number, and flight number.",
        "Current status: delay, questioning, refusal of entry, or waiting for a return flight.",
        "A reachable contact in Israel and any documents the traveller currently has.",
      ],
      note: "Urgent cases start with fast general orientation. Formal legal advice begins only after direct review and explicit engagement.",
    },
    ru: {
      heading: "Что собрать сразу в экстренной ситуации",
      bullets: [
        "Полное имя, номер паспорта и номер рейса.",
        "Текущий статус: задержка, допрос, отказ во въезде или ожидание обратного рейса.",
        "Контакт в Израиле и все документы, которые есть у пассажира.",
      ],
      note: "Срочный разбор начинается с общей ориентации. Полное юридическое сопровождение возможно только после прямой проверки и согласования.",
    },
    ua: {
      heading: "Що підготувати одразу в екстреній ситуації",
      bullets: [
        "Повне ім’я, номер паспорта та номер рейсу.",
        "Поточний статус: затримка, допит, відмова у в’їзді або очікування зворотного рейсу.",
        "Контакт в Ізраїлі та всі документи, які зараз має пасажир.",
      ],
      note: "Терміновий розбір починається з загальної орієнтації. Повний юридичний супровід можливий лише після прямої перевірки та погодження формату роботи.",
    },
  }[locale];
  return `<section class="section">
  <div class="container">
    <div class="geo-note geo-note--accent">
      <h2 class="title-md">${escapeHtml(body.heading)}</h2>
      <ul>
        ${body.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n")}
      </ul>
      <p>${escapeHtml(body.note)}</p>
      <div class="cta-actions">
        <a class="button button--secondary" href="${localizedPath(locale, "/contact")}">${escapeHtml(labels.emergencyHelp)}</a>
      </div>
    </div>
  </div>
</section>`;
};

const emergencyServiceLabel = {
  he: "סיוע דחוף בנתב״ג",
  en: "Urgent Ben Gurion help",
  ru: "Срочная помощь в Бен-Гурионе",
  ua: "Термінова допомога в Бен-Гуріоні",
};

const contactStepHeading = {
  he: "איך מתקדמים מהכוונה כללית לייצוג מלא",
  en: "How general guidance turns into full representation",
  ru: "Как общая ориентация переходит в полное сопровождение",
  ua: "Як загальна орієнтація переходить у повний супровід",
};

const contactSteps = {
  he: [
    "הכוונה כללית: מגדירים מטרה, מסמכים חסרים ורמת דחיפות.",
    "בדיקה ראשונית: עוברים על פרטי המקרה ומבהירים סיכונים או דרישות השלמה.",
    "ייצוג מלא: מתחיל רק לאחר בדיקה ישירה והסכמה מפורשת על מסגרת העבודה.",
  ],
  en: [
    "General orientation: define the goal, missing documents, and urgency level.",
    "Preliminary review: look at the facts and clarify risks or supplementation points.",
    "Formal representation: begins only after direct review and explicit engagement.",
  ],
  ru: [
    "Общая ориентация: определяем цель, недостающие документы и срочность.",
    "Первичная проверка: разбираем факты и уточняем риски или требования о дополнении.",
    "Полное сопровождение: начинается только после прямой проверки и явного согласования работы.",
  ],
  ua: [
    "Загальна орієнтація: визначаємо мету, відсутні документи та рівень терміновості.",
    "Попередній розбір: розглядаємо факти справи та уточнюємо ризики або вимоги щодо доповнення.",
    "Повний супровід: починається лише після прямої перевірки та явного погодження формату роботи.",
  ],
};

const knowledgePathHeading = {
  he: "מסלול ידע מומלץ",
  en: "Recommended knowledge path",
  ru: "Рекомендуемый путь по материалам",
  ua: "Рекомендований маршрут по матеріалах",
};

const knowledgePathIntro = {
  he: "כדי להבין את המסלול המלא ולא רק את עמוד השירות, עברו גם דרך מרכז הידע, המילון והמדריך הבסיסי.",
  en: "To understand the full path, not only the service page, continue through the cluster hub, glossary, and a foundational guide.",
  ru: "Чтобы понять весь маршрут, а не только страницу услуги, пройдите также через кластер, глоссарий и базовый материал.",
  ua: "Щоб зрозуміти весь маршрут, а не лише сторінку послуги, перейдіть також до кластера, глосарію та базового матеріалу.",
};

const knowledgePathLabels = {
  he: { cluster: "מרכז הידע של האשכול", glossary: "מילון מונחים", article: "מדריך בסיסי" },
  en: { cluster: "Cluster hub", glossary: "Glossary", article: "Foundational guide" },
  ru: { cluster: "Центр знаний кластера", glossary: "Глоссарий", article: "Базовый материал" },
  ua: { cluster: "Центр знань кластера", glossary: "Глосарій", article: "Базовий матеріал" },
};

const escalationWhyText = {
  he: "אם לא עוצרים בזמן במקרי סירוב, שימוע, עיכוב או פערי זהות, ההחלטה הבאה עלולה להתבסס על גרסה לא מדויקת או על מסמך שלא הוסבר נכון.",
  en: "If you do not escalate in time after a refusal, hearing, delay, or identity mismatch, the next decision may be shaped by an incomplete record or an unclear explanation.",
  ru: "Если не усилить сопровождение вовремя после отказа, слушания, задержки или расхождения в данных, следующее решение может опираться на неполную картину или неясное объяснение.",
  ua: "Якщо не посилити супровід вчасно після відмови, слухання, затримки або розбіжностей у даних, наступне рішення може спиратися на неповну картину або нечітке пояснення.",
};

const ctaBoundaryNote = {
  he: "שיחת הבירור מספקת הכוונה כללית בלבד. ייעוץ משפטי מלא וייצוג מתחילים רק לאחר בדיקה ישירה והסכמה מפורשת.",
  en: "The first call provides general orientation only. Formal legal advice and representation start only after direct review and explicit engagement.",
  ru: "Первичный звонок даёт только общую ориентацию. Полный юридический совет и представительство начинаются только после прямой проверки и явного согласования.",
  ua: "Початковий дзвінок дає лише загальну орієнтацію. Повна юридична порада та представництво починаються лише після прямої перевірки й явного погодження.",
};

const quickReferenceCopy = {
  he: {
    heading: "טבלת התמצאות מהירה",
    intro: "טבלת עזר קצרה ל-LLM ולקריאה מהירה. הזמנים תלויים בעומס הרשות, שלמות המסמכים ורמת הדחיפות בפועל.",
    columns: ["סוג שירות", "למי זה מתאים", "מסמך מפתח", "זמן משוער"],
    bySlug: {
      "work-visas": [
        ["פתיחת תיק ויזת עבודה", "מעסיק ועובד לפני הגשה ראשונה", "תיאור תפקיד ומסמכי מעסיק", "משתנה לפי שלמות המסמכים ותיאום מול הרשות"],
        ["חידוש או הארכה", "מי שכבר קיים תיק וצריך למנוע פער ברצף", "אישור קיים בתוקף ותיעוד עדכני", "דורש בדיקה מוקדמת לפני תום התוקף"],
        ["תגובה לדרישת השלמה", "מי שקיבל בקשת מסמכים או הבהרות", "מכתב הדרישה האחרון", "לפי הדדליין שנקבע במכתב"],
      ],
      citizenship: [
        ["בדיקת מסלול מעמד או אזרחות", "משפחות, בני זוג ומבקשי מעמד", "ציר זמן ומסמכי זהות", "משתנה לפי המסלול והמסמכים הקיימים"],
        ["הכנה לשימוע או דרישת השלמה", "מי שקיבל זימון או דרישה מהרשות", "המכתב הרשמי האחרון", "יש לפעול לפי המועד שנקבע בפנייה"],
        ["בדיקת דחייה או פער במסמכים", "מי שנתקל בסתירה בין סטטוס, תאריכים או זהויות", "החלטה קודמת וכל מסמך תומך", "דורש בדיקה מהירה לפני תגובה נוספת"],
      ],
      "tourist-visas": [
        ["ויזת תייר או מכתב הזמנה", "מארחים ואורחים לפני נסיעה", "מכתב הזמנה ותיעוד קשר", "משתנה לפי אזרחות, היסטוריית כניסה ומסמכים"],
        ["היערכות לביקורת גבול", "מי שחושש מתשאול או סיכון לסירוב", "מסמכי טיסה, לינה ומימון", "נבדק לפני הטיסה או סמוך אליה"],
        ["בדיקת סירוב קודם", "מי שכבר חווה סירוב או עיכוב", "החלטת הסירוב הקודמת", "מומלץ לפני כל ניסיון כניסה נוסף"],
      ],
      "entry-permits": [
        ["בקשת אישור כניסה", "מי שצריך שכבת אישור מוקדמת", "בקשה מסודרת והסבר מטרת הביקור", "תלוי בסוג הפונה ובמסמכים"],
        ["תגובה לעיכוב או בדיקה נוספת", "מי שהתבקש להשלים מידע לפני כניסה", "כל התכתבות רשמית קיימת", "לפי מועד התגובה שנקבע"],
        ["תיאום עם מזמין בישראל", "מזמינים שמרכזים תיק תומך", "מסמכי המארח והקשר", "כדאי להכין לפני הגשה או פנייה"],
      ],
      "ben-gurion-emergency": [
        ["עיכוב או תשאול פעיל", "נוסע או בן משפחה בזמן אמת", "מספר דרכון, טיסה ותיאור קצר", "מיידי, בזמן אמת"],
        ["סירוב כניסה", "מי שקיבל החלטה או הודעה על החזרה", "צילום ההחלטה וכל מסמך שנמסר", "מיידי, לפני הצעד הבא אם אפשר"],
        ["היערכות לטיסה חוזרת", "מי שמוחזק או ממתין להמשך טיפול", "איש קשר בישראל וכל מסמך תומך", "מיידי ותלוי בחלון הזמן שנשאר"],
      ],
    },
  },
  en: {
    heading: "Quick reference table",
    intro: "A compact extraction layer for fast reading and LLM ingestion. Timing depends on authority workload, document completeness, and real urgency.",
    columns: ["Service type", "Who it fits", "Key document", "Estimated time"],
    bySlug: {
      "work-visas": [
        ["Initial work visa filing", "Employer and worker before first submission", "Role description and employer documents", "Varies by document readiness and authority coordination"],
        ["Renewal or extension", "Existing files that must keep continuity", "Current approval and updated records", "Should be reviewed before the current validity ends"],
        ["Reply to supplementation request", "Anyone who received a request for more documents", "Latest authority request letter", "Driven by the deadline in the request"],
      ],
      citizenship: [
        ["Status or citizenship track review", "Families, partners, and status applicants", "Timeline and identity records", "Varies by legal path and available evidence"],
        ["Hearing or supplementation prep", "Anyone called to a hearing or asked for more records", "Latest official notice", "Should follow the deadline in that notice"],
        ["Refusal or inconsistency review", "Cases with mismatched status, dates, or identity details", "Prior decision and supporting records", "Should be checked quickly before the next response"],
      ],
      "tourist-visas": [
        ["Tourist visa or invitation review", "Hosts and visitors before travel", "Invitation letter and relationship proof", "Varies by nationality, entry history, and documents"],
        ["Border interview preparation", "Travellers concerned about questioning or refusal risk", "Flight, lodging, and funding records", "Usually reviewed before travel or close to departure"],
        ["Prior refusal review", "Anyone with a previous refusal or delay", "Prior refusal notice", "Best handled before any new travel attempt"],
      ],
      "entry-permits": [
        ["Entry permit request", "Travellers who need prior approval", "Structured request and visit explanation", "Depends on applicant type and document set"],
        ["Reply to extra screening", "Cases asked to provide more information before entry", "Existing authority correspondence", "Driven by the response window in the request"],
        ["Host-side coordination", "Inviters building a support file in Israel", "Host records and relationship proof", "Best prepared before the request is filed"],
      ],
      "ben-gurion-emergency": [
        ["Live delay or questioning", "Traveller or family member during the airport event", "Passport number, flight details, and short event summary", "Immediate, same event window"],
        ["Refusal of entry", "Traveller already given a refusal or return notice", "Photo of the decision and any airport document", "Immediate, before the next step if possible"],
        ["Return-flight preparation", "Traveller being held or waiting for a next move", "Reachable Israel contact and supporting papers", "Immediate and dependent on the remaining time window"],
      ],
    },
  },
  ru: {
    heading: "Таблица быстрой ориентации",
    intro: "Короткий слой для быстрого чтения и LLM-извлечения. Сроки зависят от нагрузки ведомства, полноты документов и реальной срочности.",
    columns: ["Тип услуги", "Кому подходит", "Ключевой документ", "Оценка по времени"],
    bySlug: {
      "work-visas": [
        ["Первичная подача на рабочую визу", "Работодатель и работник до первой подачи", "Описание роли и документы работодателя", "Зависит от готовности документов и координации с ведомством"],
        ["Продление или продление срока", "Дела, где нужно сохранить непрерывность статуса", "Действующее одобрение и обновлённые документы", "Нужно проверить до окончания текущего срока"],
        ["Ответ на требование о дополнении", "Те, кто получили запрос на дополнительные документы", "Последнее официальное письмо", "Зависит от срока, указанного в письме"],
      ],
      citizenship: [
        ["Проверка маршрута статуса или гражданства", "Семьи, партнёры и заявители на статус", "Хронология и документы личности", "Зависит от правового маршрута и доказательств"],
        ["Подготовка к слушанию или дополнению", "Те, кого вызвали на слушание или попросили дополнения", "Последнее официальное уведомление", "Нужно уложиться в срок из уведомления"],
        ["Проверка отказа или несоответствий", "Дела с расхождениями в статусе, датах или личности", "Предыдущее решение и подтверждающие материалы", "Желательно проверить быстро до следующего ответа"],
      ],
      "tourist-visas": [
        ["Проверка туристической визы или приглашения", "Приглашающие и гости до поездки", "Письмо-приглашение и подтверждение связи", "Зависит от гражданства, истории въезда и документов"],
        ["Подготовка к пограничному интервью", "Путешественники, опасающиеся вопросов или отказа", "Данные о рейсе, проживании и финансировании", "Обычно проверяется до поездки или незадолго до вылета"],
        ["Проверка прошлого отказа", "Те, у кого уже был отказ или задержка", "Предыдущее уведомление об отказе", "Лучше делать до новой попытки въезда"],
      ],
      "entry-permits": [
        ["Запрос на разрешение на въезд", "Путешественники, которым нужно предварительное одобрение", "Структурированный запрос и объяснение цели визита", "Зависит от типа заявителя и пакета документов"],
        ["Ответ на дополнительную проверку", "Случаи, где попросили больше информации до въезда", "Вся текущая переписка с ведомством", "Определяется сроком ответа в запросе"],
        ["Координация со стороны приглашающего", "Приглашающие, которые собирают подтверждающий пакет", "Документы принимающей стороны и подтверждение связи", "Лучше готовить до подачи запроса"],
      ],
      "ben-gurion-emergency": [
        ["Живая задержка или допрос", "Путешественник или семья во время события", "Номер паспорта, рейс и краткое описание ситуации", "Немедленно, в рамках текущего события"],
        ["Отказ во въезде", "Путешественник уже получил отказ или уведомление о возврате", "Фото решения и всех документов из аэропорта", "Немедленно, до следующего шага если возможно"],
        ["Подготовка к обратному рейсу", "Тот, кого удерживают или кто ждёт дальнейшего решения", "Доступный контакт в Израиле и подтверждающие документы", "Немедленно и зависит от оставшегося времени"],
      ],
    },
  },
  ua: {
    heading: "Таблиця швидкої орієнтації",
    intro: "Короткий шар для швидкого читання та LLM-витягування. Строки залежать від навантаження органу, повноти документів і реальної терміновості.",
    columns: ["Тип послуги", "Кому підходить", "Ключовий документ", "Орієнтовний час"],
    bySlug: {
      "work-visas": [
        ["Первинна подача на робочу візу", "Роботодавець і працівник до першої подачі", "Опис ролі та документи роботодавця", "Залежить від готовності документів і координації з органом"],
        ["Продовження або подовження строку", "Справи, де потрібно зберегти безперервність статусу", "Чинне схвалення та оновлені документи", "Потрібно перевірити до завершення поточного строку"],
        ["Відповідь на вимогу про доповнення", "Ті, хто отримали запит на додаткові документи", "Останній офіційний лист", "Залежить від строку, зазначеного в листі"],
      ],
      citizenship: [
        ["Перевірка маршруту статусу або громадянства", "Сім’ї, партнери та заявники на статус", "Хронологія та документи особи", "Залежить від правового маршруту і доказів"],
        ["Підготовка до слухання або доповнення", "Ті, кого викликали на слухання або попросили доповнення", "Останнє офіційне повідомлення", "Потрібно вкластися у строк із повідомлення"],
        ["Перевірка відмови або розбіжностей", "Справи з неузгодженістю статусу, дат або особи", "Попереднє рішення та підтверджувальні матеріали", "Бажано перевірити швидко до наступної відповіді"],
      ],
      "tourist-visas": [
        ["Перевірка туристичної візи або запрошення", "Запрошуючі та гості до поїздки", "Лист-запрошення і підтвердження зв’язку", "Залежить від громадянства, історії в’їзду та документів"],
        ["Підготовка до прикордонної співбесіди", "Мандрівники, які хвилюються через питання або ризик відмови", "Дані про рейс, проживання та фінансування", "Зазвичай перевіряється до поїздки або незадовго до вильоту"],
        ["Перевірка попередньої відмови", "Ті, у кого вже була відмова або затримка", "Попереднє повідомлення про відмову", "Найкраще робити до нової спроби в’їзду"],
      ],
      "entry-permits": [
        ["Запит на дозвіл на в’їзд", "Мандрівники, яким потрібне попереднє схвалення", "Структурований запит і пояснення мети візиту", "Залежить від типу заявника і пакета документів"],
        ["Відповідь на додаткову перевірку", "Випадки, де попросили більше інформації до в’їзду", "Уся поточна переписка з органом", "Визначається строком відповіді у запиті"],
        ["Координація з боку запрошуючого", "Запрошуючі, які збирають підтвердний пакет", "Документи приймаючої сторони та підтвердження зв’язку", "Краще готувати до подачі запиту"],
      ],
      "ben-gurion-emergency": [
        ["Поточна затримка або допит", "Мандрівник або родина під час події", "Номер паспорта, рейс і короткий опис ситуації", "Негайно, у межах поточної події"],
        ["Відмова у в’їзді", "Мандрівник уже отримав відмову або повідомлення про повернення", "Фото рішення та всіх документів з аеропорту", "Негайно, до наступного кроку якщо можливо"],
        ["Підготовка до зворотного рейсу", "Той, кого утримують або хто чекає подальшого рішення", "Доступний контакт в Ізраїлі та підтвердні документи", "Негайно і залежить від залишку часу"],
      ],
    },
  },
};

const buildGeoAnswerCard = (locale, clusterKey) => {
  const localeData = locales[locale];
  const copy = clusters[clusterKey].copy[locale];
  const hubHref = `/${clusterHubPath(locale, clusterKey).replace(/index\.html$/, "")}`;
  const glossaryHref = localizedPath(locale, "/glossary/");
  return `<section class="section geo-answer-section">
  <div class="container">
    <div class="geo-card">
      <p class="eyebrow">${escapeHtml(localeData.labels.answer)}</p>
      <h2 class="title-lg">${escapeHtml(copy.shortAnswer)}</h2>
      <div class="geo-grid">
        <div>
          <h3 class="title-md">${escapeHtml(localeData.labels.whoFor)}</h3>
          <ul>
            ${copy.whoFor.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n")}
          </ul>
        </div>
        <div>
          <h3 class="title-md">${escapeHtml(localeData.labels.prepare)}</h3>
          <ul>
            ${copy.prepare.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n")}
          </ul>
        </div>
      </div>
      <div class="geo-note-grid">
        <div class="geo-note">
          <h3 class="title-md">${escapeHtml(localeData.labels.varies)}</h3>
          <p>${escapeHtml(copy.varies)}</p>
        </div>
        <div class="geo-note geo-note--accent">
          <h3 class="title-md">${escapeHtml(localeData.labels.lawyerNow)}</h3>
          <p>${escapeHtml(copy.lawyerNow)}</p>
          <p>${escapeHtml(escalationWhyText[locale])}</p>
        </div>
      </div>
      <div class="geo-questions">
        <h3 class="title-md">${escapeHtml(localeData.labels.keyQuestions)}</h3>
        <ul>
          ${copy.questions.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n")}
        </ul>
      </div>
      <div class="cta-actions">
        <a class="button button--secondary" href="${hubHref}">${escapeHtml(copy.title)}</a>
        <a class="button button--secondary" href="${glossaryHref}">${escapeHtml(localeData.labels.glossary)}</a>
      </div>
    </div>
  </div>
</section>`;
};

const buildArticleGeoCard = (locale, clusterKey) => {
  const localeData = locales[locale];
  const copy = clusters[clusterKey].copy[locale];
  return `<div class="geo-inline-card">
  <h2 class="title-md">${escapeHtml(localeData.labels.oneMinute)}</h2>
  <p>${escapeHtml(copy.shortAnswer)}</p>
  <ul>
    ${copy.prepare.slice(0, 3).map((item) => `<li>${escapeHtml(item)}</li>`).join("\n")}
  </ul>
  <p><strong>${escapeHtml(localeData.labels.lawyerNow)}:</strong> ${escapeHtml(copy.lawyerNow)}</p>
  <p>${escapeHtml(escalationWhyText[locale])}</p>
</div>`;
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

const buildArticleHubTopicMap = async (locale) => {
  const localeData = locales[locale];
  const serviceLinks = articleHubServiceLinks[locale];
  const serviceLinksHtml = `<section class="stack">
  <h3 class="title-md">${escapeHtml(serviceLinks.heading)}</h3>
  <p>${escapeHtml(serviceLinks.intro)}</p>
  <ul>
    ${serviceLinks.links.map((link) => `<li><a href="${link.href}">${escapeHtml(link.label)}</a></li>`).join("\n")}
  </ul>
</section>`;
  const clusterSections = [];
  for (const key of Object.keys(clusters)) {
    const copy = clusters[key].copy[locale];
    const items = [];
    for (let i = clusters[key].articleRange[0]; i <= clusters[key].articleRange[1]; i += 1) {
      const relative = firstArticleFile(locale, i);
      const articleHtml = await read(relative);
      items.push({
        href: `/${relative.replace(/index\.html$/, "").replace(/\.html$/, "")}`,
        title: extractTitle(articleHtml),
      });
    }
    clusterSections.push(`<section class="stack">
  <h3 class="title-md"><a href="/${clusterHubPath(locale, key).replace(/index\.html$/, "")}">${escapeHtml(copy.title)}</a></h3>
  <p>${escapeHtml(copy.clusterDescription)}</p>
  <ol>
    ${items.map((item) => `<li><a href="${item.href}">${escapeHtml(item.title)}</a></li>`).join("\n")}
  </ol>
</section>`);
  }
  return `<section class="section">
  <div class="container stack">
    <h2 class="title-lg">${escapeHtml(localeData.labels.topicMap)}</h2>
    <p>${escapeHtml(localeData.labels.topicMapText)}</p>
    ${serviceLinksHtml}
    ${clusterSections.join("\n\n")}
  </div>
</section>`;
};

const buildSourceSection = (locale) => {
  const label = locales[locale].labels.sources;
  return `<section class="section">
  <div class="container stack">
    <h2 class="title-lg">${escapeHtml(label)}</h2>
    <ul>
      ${buildSourceList(locale)}
    </ul>
  </div>
</section>`;
};

const buildQuickReferenceTable = (locale, relativePath) => {
  const slug = relativePath.match(/services\/([^/.]+)\.html$/)?.[1];
  const copy = slug ? quickReferenceCopy[locale]?.bySlug?.[slug] : null;
  const localeCopy = quickReferenceCopy[locale];
  if (!slug || !copy || !localeCopy) return "";
  return `<section class="section">
  <div class="container stack">
    <h2 class="title-lg">${escapeHtml(localeCopy.heading)}</h2>
    <p>${escapeHtml(localeCopy.intro)}</p>
    <div class="table-scroll">
      <table class="geo-table">
        <thead>
          <tr>
            ${localeCopy.columns.map((column) => `<th scope="col">${escapeHtml(column)}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${copy
            .map(
              (row) => `<tr>
            ${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}
          </tr>`
            )
            .join("\n")}
        </tbody>
      </table>
    </div>
  </div>
</section>`;
};

const buildKnowledgePathBlock = async (locale, clusterKey) => {
  const labels = knowledgePathLabels[locale];
  const hubHref = `/${clusterHubPath(locale, clusterKey).replace(/index\.html$/, "")}`;
  const glossaryHref = localizedPath(locale, "/glossary/");
  const firstArticleHref = `/${firstArticleFile(locale, clusters[clusterKey].articleRange[0]).replace(/\.html$/, "")}`;
  const firstArticleHtml = await read(firstArticleFile(locale, clusters[clusterKey].articleRange[0]));
  return `<section class="section">
  <div class="container">
    <div class="geo-card">
      <h2 class="title-lg">${escapeHtml(knowledgePathHeading[locale])}</h2>
      <p>${escapeHtml(knowledgePathIntro[locale])}</p>
      <ul>
        <li><strong>${escapeHtml(labels.cluster)}:</strong> <a href="${hubHref}">${escapeHtml(clusters[clusterKey].copy[locale].title)}</a></li>
        <li><strong>${escapeHtml(labels.glossary)}:</strong> <a href="${glossaryHref}">${escapeHtml(locales[locale].labels.glossary)}</a></li>
        <li><strong>${escapeHtml(labels.article)}:</strong> <a href="${firstArticleHref}">${escapeHtml(extractTitle(firstArticleHtml))}</a></li>
      </ul>
    </div>
  </div>
</section>`;
};

const buildEmergencyActionSection = (locale) => {
  const heading = {
    he: "מה לשלוח מיד אם מדובר במקרה דחוף",
    en: "What to send first in an urgent airport case",
    ru: "Что отправить сразу в срочном аэропортовом случае",
    ua: "Що надіслати насамперед у терміновій ситуації в аеропорту",
  };
  const items = {
    he: [
      "שם מלא, מספר דרכון ומספר טיסה.",
      "צילום של כל החלטה, הודעה או מסמך שנמסר בנמל התעופה.",
      "הסבר קצר מה קרה עכשיו ומהו חלון הזמן לפעולה.",
    ],
    en: [
      "Full name, passport number, and flight number.",
      "A photo of any decision, notice, or airport document already received.",
      "A short explanation of what is happening now and the time window for action.",
    ],
    ru: [
      "Полное имя, номер паспорта и номер рейса.",
      "Фото любого решения, уведомления или документа, полученного в аэропорту.",
      "Короткое объяснение того, что происходит сейчас и сколько времени есть на реакцию.",
    ],
    ua: [
      "Повне ім’я, номер паспорта та номер рейсу.",
      "Фото будь-якого рішення, повідомлення або документа, отриманого в аеропорту.",
      "Коротке пояснення того, що відбувається зараз і який є часовий запас для реакції.",
    ],
  };
  return `<section class="section" id="emergency-action">
  <div class="container">
    <div class="geo-card">
      <h2 class="title-lg">${escapeHtml(heading[locale])}</h2>
      <ul>
        ${items[locale].map((item) => `<li>${escapeHtml(item)}</li>`).join("\n")}
      </ul>
      <p>${escapeHtml(ctaBoundaryNote[locale])}</p>
      <div class="cta-actions">
        <a class="button button--primary" href="${localizedPath(locale, "/contact#form")}">${escapeHtml(emergencyServiceLabel[locale])}</a>
        <a class="button button--secondary" href="${localizedPath(locale, "/contact#steps")}">${escapeHtml(contactStepHeading[locale])}</a>
      </div>
    </div>
  </div>
</section>`;
};

const buildClusterLinks = async (locale, clusterKey) => {
  const copy = clusters[clusterKey].copy[locale];
  const articleItems = [];
  for (let i = clusters[clusterKey].articleRange[0]; i <= clusters[clusterKey].articleRange[1]; i += 1) {
    const relative = firstArticleFile(locale, i);
    const html = await read(relative);
    articleItems.push({
      href: `/${relative.replace(/index\.html$/, "").replace(/\.html$/, "")}`,
      title: extractTitle(html),
    });
  }
  const serviceItems = [];
  for (const slug of clusters[clusterKey].serviceSlugs) {
    const relative = `${localePrefixOf(locale) ? `${localePrefixOf(locale).slice(1)}/` : ""}services/${slug}.html`;
    const html = await read(relative);
    serviceItems.push({
      href: `/${relative.replace(/index\.html$/, "").replace(/\.html$/, "")}`,
      title: extractTitle(html),
    });
  }
  return { copy, articleItems, serviceItems };
};

const buildClusterPage = async (locale, clusterKey) => {
  const localeData = locales[locale];
  const { copy, articleItems, serviceItems } = await buildClusterLinks(locale, clusterKey);
  const canonical = `${siteUrl}/${clusterHubPath(locale, clusterKey).replace(/index\.html$/, "")}`.replace(/\/+/g, "/").replace("https:/", "https://");
  const glossaryHref = `${siteUrl}${localizedPath(locale, "/glossary/")}`;
  const breadcrumbServicesLabel = localeData.labels.articles;
  const clusterSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: copy.title,
        description: copy.clusterDescription,
        inLanguage: localeData.htmlLang,
        mainEntity: {
          "@id": `${canonical}#itemlist`,
        },
      },
      {
        "@type": "Thing",
        "@id": `${canonical}#topic`,
        name: copy.title,
        description: copy.shortAnswer,
      },
      {
        "@type": "ItemList",
        "@id": `${canonical}#itemlist`,
        itemListElement: articleItems.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.title,
          url: `${siteUrl}${item.href}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: localeData.labels.home,
            item: `${siteUrl}${localizedPath(locale, "/")}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: localeData.labels.articles,
            item: `${siteUrl}${localizedPath(locale, "/articles/")}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: copy.title,
            item: canonical,
          },
        ],
      },
    ],
  };
  const defaultCanonical = `${siteUrl}/${clusterHubPath("he", clusterKey).replace(/index\.html$/, "")}`
    .replace(/\/+/g, "/")
    .replace("https:/", "https://");
  const altTags = Object.keys(locales)
    .map((other) => {
      const otherCanonical = `${siteUrl}/${clusterHubPath(other, clusterKey).replace(/index\.html$/, "")}`
        .replace(/\/+/g, "/")
        .replace("https:/", "https://");
      return `    <link rel="alternate" hreflang="${locales[other].htmlLang}" href="${otherCanonical}" />`;
    })
    .join("\n");
  const terms = copy.terms
    .map((term) => {
      const glossaryIndex = glossaryTerms[locale].findIndex((item) => item.term === term);
      if (glossaryIndex === -1) {
        return `<li><span class="tag">${escapeHtml(term)}</span></li>`;
      }
      return `<li><a class="tag" href="${glossaryHrefFor(locale, glossaryIndex)}">${escapeHtml(term)}</a></li>`;
    })
    .join("\n");
  const articleLinks = articleItems
    .map((item) => `<li><a href="${item.href}">${escapeHtml(item.title)}</a></li>`)
    .join("\n");
  const serviceLinks = serviceItems
    .map((item) => `<li><a href="${item.href}">${escapeHtml(item.title)}</a></li>`)
    .join("\n");
  return `<!doctype html>
<html lang="${localeData.htmlLang}" dir="${localeData.dir}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(copy.title)} | ${escapeHtml(localeData.businessName)}</title>
    <meta name="description" content="${escapeHtml(copy.clusterDescription)}" />
    <link rel="canonical" href="${canonical}" />
    <link rel="dns-prefetch" href="//www.gov.il" />
    <meta property="og:title" content="${escapeHtml(copy.title)} | ${escapeHtml(localeData.businessName)}" />
    <meta property="og:description" content="${escapeHtml(copy.clusterDescription)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${siteUrl}/images/law-office-scales-gavel-ashdod.jpg" />
    <meta property="og:image:alt" content="${escapeHtml(localeData.businessName)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(copy.title)} | ${escapeHtml(localeData.businessName)}" />
    <meta name="twitter:description" content="${escapeHtml(copy.clusterDescription)}" />
    <meta name="twitter:image" content="${siteUrl}/images/law-office-scales-gavel-ashdod.jpg" />
${altTags}
    <link rel="alternate" hreflang="x-default" href="${defaultCanonical}" />
    <link rel="alternate" type="application/json" href="/assets/knowledge-base.json" title="Knowledge base" />
    <link rel="alternate" type="application/json" href="/assets/glossary.json" title="Glossary data" />
    <link rel="stylesheet" href="/assets/styles.css" />
    <link rel="icon" href="/images/favicon.jpg" type="image/jpeg" />
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <script type="application/ld+json">${JSON.stringify(clusterSchema)}</script>
  </head>
  <body>
    <a class="skip-link" href="#main">${escapeHtml(localeData.labels.home)}</a>
    <div class="emergency-strip">
      <div class="container">${escapeHtml(localeData.siteDescription)}</div>
    </div>
    <header class="site-header">
      <div class="container header-inner">
        <div class="brand">${escapeHtml(localeData.businessName)}</div>
        <nav aria-label="Primary">
          <ul class="nav-list">
            <li><a class="nav-link" href="${localizedPath(locale, "/")}">${escapeHtml(localeData.labels.home)}</a></li>
            <li><a class="nav-link" href="${localizedPath(locale, "/services/")}">${escapeHtml(localeData.labels.services)}</a></li>
            <li><a class="nav-link" href="${localizedPath(locale, "/articles/")}">${escapeHtml(localeData.labels.articles)}</a></li>
            <li><a class="nav-link" href="${localizedPath(locale, "/glossary/")}">${escapeHtml(localeData.labels.glossary)}</a></li>
          </ul>
        </nav>
        <div class="lang-switch" aria-label="Language switcher">
          <a href="${localizedPath("he", `/articles/${clusters[clusterKey].copy.he.slug}/`)}">HE</a>
          <a href="${localizedPath("en", `/articles/${clusters[clusterKey].copy.en.slug}/`)}">EN</a>
          <a href="${localizedPath("ru", `/articles/${clusters[clusterKey].copy.ru.slug}/`)}">RU</a>
          <a href="${localizedPath("ua", `/articles/${clusters[clusterKey].copy.ua.slug}/`)}">UA</a>
        </div>
      </div>
    </header>
    <main id="main" class="page">
      <nav class="breadcrumbs" aria-label="Breadcrumbs">
        <div class="container">
          <ol>
            <li><a href="${siteUrl}${localizedPath(locale, "/")}">${escapeHtml(localeData.labels.home)}</a></li>
            <li><a href="${siteUrl}${localizedPath(locale, "/articles/")}">${escapeHtml(breadcrumbServicesLabel)}</a></li>
            <li aria-current="page">${escapeHtml(copy.title)}</li>
          </ol>
        </div>
      </nav>
      <section class="section">
        <div class="container stack">
          <p class="eyebrow">${escapeHtml(localeData.labels.topicMap)}</p>
          <h1 class="title-xl">${escapeHtml(copy.title)}</h1>
          <p class="lede">${escapeHtml(copy.clusterDescription)}</p>
          <p>${escapeHtml(copy.shortAnswer)}</p>
          <div class="geo-grid">
            <div class="geo-note">
              <h2 class="title-md">${escapeHtml(localeData.labels.relatedTerms)}</h2>
              <ul class="tag-list">${terms}</ul>
            </div>
            <div class="geo-note">
              <h2 class="title-md">${escapeHtml(localeData.labels.keyQuestions)}</h2>
              <ul>${copy.questions.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n")}</ul>
            </div>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="container two-column-grid">
          <div class="card">
            <h2 class="title-lg">${escapeHtml(localeData.labels.allGuides)}</h2>
            <ul>${articleLinks}</ul>
          </div>
          <div class="card">
            <h2 class="title-lg">${escapeHtml(localeData.labels.services)}</h2>
            <ul>${serviceLinks}</ul>
            <p><a href="${glossaryHref}">${escapeHtml(localeData.labels.glossary)}</a></p>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="geo-note">
            <h2 class="title-md">${escapeHtml(localeData.labels.relatedClusters)}</h2>
            <p><a href="${glossaryHref}">${escapeHtml(localeData.labels.glossary)}</a></p>
          </div>
        </div>
      </section>
      ${buildSourceSection(locale)}
    </main>
    <script src="/assets/vendor/fuse.min.js" defer></script>
    <script src="/assets/search.js" defer></script>
  </body>
</html>
`;
};

const buildGlossaryPage = (locale) => {
  const localeData = locales[locale];
  const canonical = `${siteUrl}${localizedPath(locale, "/glossary/")}`;
  const altTags = Object.keys(locales)
    .map((other) => `    <link rel="alternate" hreflang="${locales[other].htmlLang}" href="${siteUrl}${localizedPath(other, "/glossary/")}" />`)
    .join("\n");
  const defaultCanonical = `${siteUrl}${localizedPath("he", "/glossary/")}`;
  const items = glossaryTerms[locale]
    .map((item) => {
      const relatedCluster = inferClusterFromText(item.term) || "citizenship-status";
      return `<div class="definition-card" id="${slugifyTerm(item.term)}">
  <h2 class="title-md">${escapeHtml(item.term)}</h2>
  <p>${escapeHtml(item.definition)}</p>
  <p><a href="${localizedPath(locale, `/articles/${clusters[relatedCluster].copy[locale].slug}/`)}">${escapeHtml(clusters[relatedCluster].copy[locale].title)}</a></p>
</div>`;
    })
    .join("\n");
  const glossarySchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: localeData.labels.glossary,
        description: localeData.labels.llmsSummary,
        inLanguage: localeData.htmlLang,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: localeData.labels.home,
            item: `${siteUrl}${localizedPath(locale, "/")}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: localeData.labels.glossary,
            item: canonical,
          },
        ],
      },
      {
        "@type": "DefinedTermSet",
        "@id": `${canonical}#defined-term-set`,
        name: localeData.labels.glossary,
        inLanguage: localeData.htmlLang,
        url: canonical,
        hasDefinedTerm: glossaryTerms[locale].map((item, index) => ({
          "@type": "DefinedTerm",
          "@id": `${canonical}#term-${index + 1}`,
          name: item.term,
          description: item.definition,
          inDefinedTermSet: `${canonical}#defined-term-set`,
          url: `${canonical}#${slugifyTerm(item.term)}`,
        })),
      },
    ],
  };
  return `<!doctype html>
<html lang="${localeData.htmlLang}" dir="${localeData.dir}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(localeData.labels.glossary)} | ${escapeHtml(localeData.businessName)}</title>
    <meta name="description" content="${escapeHtml(localeData.labels.llmsSummary)}" />
    <link rel="canonical" href="${canonical}" />
    <link rel="dns-prefetch" href="//www.gov.il" />
    <meta property="og:title" content="${escapeHtml(localeData.labels.glossary)} | ${escapeHtml(localeData.businessName)}" />
    <meta property="og:description" content="${escapeHtml(localeData.labels.llmsSummary)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${siteUrl}/images/law-office-scales-gavel-ashdod.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(localeData.labels.glossary)} | ${escapeHtml(localeData.businessName)}" />
    <meta name="twitter:description" content="${escapeHtml(localeData.labels.llmsSummary)}" />
${altTags}
    <link rel="alternate" hreflang="x-default" href="${defaultCanonical}" />
    <link rel="alternate" type="application/json" href="/assets/knowledge-base.json" title="Knowledge base" />
    <link rel="alternate" type="application/json" href="/assets/glossary.json" title="Glossary data" />
    <link rel="stylesheet" href="/assets/styles.css" />
    <link rel="icon" href="/images/favicon.jpg" type="image/jpeg" />
    <script type="application/ld+json">${JSON.stringify(glossarySchema)}</script>
  </head>
  <body>
    <a class="skip-link" href="#main">${escapeHtml(localeData.labels.home)}</a>
    <header class="site-header">
      <div class="container header-inner">
        <div class="brand">${escapeHtml(localeData.businessName)}</div>
        <nav aria-label="Primary">
          <ul class="nav-list">
            <li><a class="nav-link" href="${localizedPath(locale, "/")}">${escapeHtml(localeData.labels.home)}</a></li>
            <li><a class="nav-link" href="${localizedPath(locale, "/services/")}">${escapeHtml(localeData.labels.services)}</a></li>
            <li><a class="nav-link" href="${localizedPath(locale, "/articles/")}">${escapeHtml(localeData.labels.articles)}</a></li>
            <li><a class="nav-link" href="${localizedPath(locale, "/legal/editorial-policy")}">${escapeHtml(localeData.labels.editorialPolicy)}</a></li>
          </ul>
        </nav>
      </div>
    </header>
    <main id="main" class="page">
      <section class="section">
        <div class="container stack">
          <p class="eyebrow">${escapeHtml(localeData.labels.glossary)}</p>
          <h1 class="title-xl">${escapeHtml(localeData.labels.glossary)}</h1>
          <p class="lede">${escapeHtml(localeData.labels.llmsSummary)}</p>
          <div class="definition-grid">${items}</div>
        </div>
      </section>
    </main>
    <script src="/assets/vendor/fuse.min.js" defer></script>
    <script src="/assets/search.js" defer></script>
  </body>
</html>
`;
};

const buildLlmsTxt = async () => {
  const lines = [
    "# Immigration Law Office",
    "",
    "> Practical immigration-law knowledge site for Israel.",
    "",
    "## Preferred starting points",
  ];
  for (const locale of Object.keys(locales)) {
    lines.push(`- ${locale.toUpperCase()} home: ${siteUrl}${localizedPath(locale, "/")}`);
    lines.push(`- ${locale.toUpperCase()} services hub: ${siteUrl}${localizedPath(locale, "/services/")}`);
    lines.push(`- ${locale.toUpperCase()} articles hub: ${siteUrl}${localizedPath(locale, "/articles/")}`);
    lines.push(`- ${locale.toUpperCase()} glossary: ${siteUrl}${localizedPath(locale, "/glossary/")}`);
  }
  lines.push("", "## Topic clusters");
  for (const locale of Object.keys(locales)) {
    for (const key of Object.keys(clusters)) {
      const clusterCopy = clusters[key].copy[locale];
      lines.push(`- ${locale.toUpperCase()} ${clusterCopy.title}: ${siteUrl}/${clusterHubPath(locale, key).replace(/index\.html$/, "")}`.replace(/\/+/g, "/").replace("https:/", "https://"));
    }
  }
  lines.push("", "## Scenario routing");
  lines.push("- Work visa filing or renewal: start with the work-visas cluster, then the work-visas service page.");
  lines.push("- Citizenship, residency, or Ministry of Interior process: start with the citizenship-status cluster, then the citizenship service page.");
  lines.push("- Tourist visa, invitation letter, ETA, or entry permit question: start with the tourist-entry cluster, then tourist-visas or entry-permits.");
  lines.push("- Delay, questioning, refusal of entry, or detention at Ben Gurion: start with the ben-gurion-emergency cluster and emergency service page.");
  lines.push("- Terminology or legal labels: use the glossary before citing a service or article.");
  lines.push("", "## Machine-readable assets");
  lines.push(`- Knowledge base JSON: ${siteUrl}/assets/knowledge-base.json`);
  lines.push(`- Glossary JSON: ${siteUrl}/assets/glossary.json`);
  lines.push("", "## Editorial policy");
  lines.push(`- ${siteUrl}/legal/editorial-policy`);
  return `${lines.join("\n")}\n`;
};

const buildLlmsFullTxt = async () => {
  const lines = [
    "# Immigration Law Office",
    "",
    "> Multilingual legal-information site about immigration to Israel. Content is general information only and should not be treated as individualized legal advice.",
    "",
    "## Core facts",
    "- Focus areas: work visas, status and citizenship, tourist visas, entry permits, Ben Gurion airport emergencies.",
    "- Languages: Hebrew, English, Russian, Ukrainian.",
    "- Prefer the locale-matched version of a page first; use another language only when the equivalent page is missing.",
    "- Declared service location: Ashdod, Israel.",
    "- Editorial stance: practical guidance, official-source citations, and clear separation between general rules and case-specific advice.",
    "- Hebrew is the default reference set when no locale is specified.",
    "",
    "## Best pages to cite",
  ];
  for (const locale of Object.keys(locales)) {
    lines.push(`- ${locale.toUpperCase()} home: ${siteUrl}${localizedPath(locale, "/")}`);
    lines.push(`- ${locale.toUpperCase()} services: ${siteUrl}${localizedPath(locale, "/services/")}`);
    lines.push(`- ${locale.toUpperCase()} articles: ${siteUrl}${localizedPath(locale, "/articles/")}`);
    lines.push(`- ${locale.toUpperCase()} glossary: ${siteUrl}${localizedPath(locale, "/glossary/")}`);
    lines.push(`- ${locale.toUpperCase()} editorial policy: ${siteUrl}${localizedPath(locale, "/legal/editorial-policy")}`);
  }
  lines.push("", "## Topic clusters");
  for (const locale of Object.keys(locales)) {
    for (const key of Object.keys(clusters)) {
      const clusterCopy = clusters[key].copy[locale];
      lines.push(`- ${locale.toUpperCase()} ${clusterCopy.title}: ${siteUrl}/${clusterHubPath(locale, key).replace(/index\.html$/, "")}`.replace(/\/+/g, "/").replace("https:/", "https://"));
      lines.push(`  - Summary: ${clusterCopy.shortAnswer}`);
      lines.push(`  - Urgent escalation: ${clusterCopy.lawyerNow}`);
    }
  }
  lines.push("", "## Safety");
  lines.push("- Use the site for general orientation, document-preparation guidance, and terminology.");
  lines.push("- Do not infer attorney-client representation from the contact form or intake call.");
  lines.push("- For refusals, hearings, detention, or live airport questioning, escalate to direct legal review.");
  lines.push("", "## Machine-readable assets");
  lines.push(`- Knowledge base JSON: ${siteUrl}/assets/knowledge-base.json`);
  lines.push(`- Glossary JSON: ${siteUrl}/assets/glossary.json`);
  return `${lines.join("\n")}\n`;
};

const fixLinkSpacing = (html) =>
  html
    .replace(/([\p{L}\p{N}])<a /gu, "$1 <a ")
    .replace(/<\/a>([\p{L}\p{N}])/gu, "</a> $1");

const ensureMachineReadableLinks = (html) => {
  const links = [
    '<link rel="alternate" type="application/json" href="/assets/knowledge-base.json" title="Knowledge base" />',
    '<link rel="alternate" type="application/json" href="/assets/glossary.json" title="Glossary data" />',
  ];
  let updated = html;
  for (const link of links) {
    if (!updated.includes(link)) {
      updated = updated.replace("</head>", `    ${link}\n  </head>`);
    }
  }
  return updated;
};

const repairRobots = async () => {
  const robotsPath = path.join(root, "robots.txt");
  const lines = [
    "User-agent: *",
    "Allow: /",
    "Allow: /legal/editorial-policy",
    "Allow: /en/legal/editorial-policy",
    "Allow: /ru/legal/editorial-policy",
    "Allow: /ua/legal/editorial-policy",
    "Disallow: /legal/privacy",
    "Disallow: /legal/terms",
    "Disallow: /en/legal/privacy",
    "Disallow: /en/legal/terms",
    "Disallow: /ru/legal/privacy",
    "Disallow: /ru/legal/terms",
    "Disallow: /ua/legal/privacy",
    "Disallow: /ua/legal/terms",
    `Sitemap: ${siteUrl}/sitemap.xml`,
  ];
  await fs.writeFile(robotsPath, `${lines.join("\n")}\n`, "utf8");
};

const repairServicePage = async (relativePath) => {
  let html = await read(relativePath);
  const locale = getLocaleFromPath(relativePath);
  const clusterKey = clusterOf(relativePath, html);
  if (!clusterKey) return;
  html = fixLinkSpacing(html);
  html = ensureMachineReadableLinks(html);
  html = upsertBlock(html, "service-answer", buildGeoAnswerCard(locale, clusterKey), /<\/section>/);
  html = upsertBlock(html, "knowledge-path", await buildKnowledgePathBlock(locale, clusterKey), /<!-- GEO:service-answer:end -->/);
  html = upsertBlock(html, "service-quick-reference", buildQuickReferenceTable(locale, relativePath), /<!-- GEO:knowledge-path:end -->|<!-- GEO:service-answer:end -->/);
  if (/services\/ben-gurion-emergency\.html$/.test(relativePath)) {
    html = upsertBlock(html, "service-emergency-action", buildEmergencyActionSection(locale), /<!-- GEO:service-quick-reference:end -->|<!-- GEO:knowledge-path:end -->|<!-- GEO:service-answer:end -->/);
  }
  html = upsertBlock(html, "service-sources", buildSourceSection(locale), /<\/main>/);
  await write(relativePath, html);
};

const repairArticlePage = async (relativePath) => {
  let html = await read(relativePath);
  const locale = getLocaleFromPath(relativePath);
  const clusterKey = clusterOf(relativePath, html);
  if (!clusterKey) return;
  html = fixLinkSpacing(html);
  html = ensureMachineReadableLinks(html);
  html = upsertBlock(
    html,
    "article-answer",
    buildArticleGeoCard(locale, clusterKey),
    /<\/ul>\s*\n\s*<figure class="article-figure">/
  );
  const hubHref = `/${clusterHubPath(locale, clusterKey).replace(/index\.html$/, "")}`;
  const nextReading = `<div class="geo-next-reading">
  <h3 class="title-md">${escapeHtml(locales[locale].labels.nextReading)}</h3>
  <p><a href="${hubHref}">${escapeHtml(clusters[clusterKey].copy[locale].title)}</a></p>
</div>`;
  html = upsertBlock(html, "article-hub-link", nextReading, /<div class="related-articles">/);
  await write(relativePath, html);
};

const repairIndexPage = async (relativePath) => {
  let html = await read(relativePath);
  const locale = getLocaleFromPath(relativePath);
  html = fixLinkSpacing(html);
  html = ensureMachineReadableLinks(html);
  if (/articles\/index\.html$/.test(relativePath)) {
    const block = await buildArticleHubTopicMap(locale);
    html = html
      .replace(/<!-- GEO:topic-map:start -->[\s\S]*?<!-- GEO:topic-map:end -->\s*/gm, "")
      .replace(/<!-- GEO:topic-map:start -->[\s\S]*?(?=<script src="\/assets\/vendor\/fuse\.min\.js"|<\/main>)/gm, "");
    html = upsertBlock(html, "topic-map", block, /<\/section>/);
    await write(relativePath, html);
    return;
  }
  const topicCards = Object.keys(clusters)
    .map((key) => {
      const copy = clusters[key].copy[locale];
      const href = `/${clusterHubPath(locale, key).replace(/index\.html$/, "")}`;
      return `<article class="card">
  <p class="eyebrow">${escapeHtml(locales[locale].labels.clusterHub)}</p>
  <h3 class="title-md"><a href="${href}">${escapeHtml(copy.title)}</a></h3>
  <p>${escapeHtml(copy.clusterDescription)}</p>
</article>`;
    })
    .join("\n");
  const block = `<section class="section">
  <div class="container stack">
    <h2 class="title-lg">${escapeHtml(locales[locale].labels.topicMap)}</h2>
    <p>${escapeHtml(locales[locale].labels.topicMapText)}</p>
    <div class="card-grid">${topicCards}</div>
  </div>
</section>`;
  html = upsertBlock(html, "topic-map", block, /<\/section>/);
  await write(relativePath, html);
};

const repairAboutPage = async (relativePath) => {
  let html = await read(relativePath);
  const locale = getLocaleFromPath(relativePath);
  const labels = locales[locale].labels;
  html = fixLinkSpacing(html);
  html = ensureMachineReadableLinks(html);
  const facts = `<section class="section">
  <div class="container stack">
    <h2 class="title-lg">${escapeHtml(labels.publicFacts)}</h2>
    <ul>
      ${labels.publicFactsItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n")}
    </ul>
  </div>
</section>`;
  html = upsertBlock(html, "about-facts", facts, /<\/section>/);
  await write(relativePath, html);
};

const repairEditorialPolicy = async (relativePath) => {
  let html = await read(relativePath);
  const locale = getLocaleFromPath(relativePath);
  const labels = locales[locale].labels;
  html = fixLinkSpacing(html);
  html = ensureMachineReadableLinks(html);
  const block = `<section class="section">
  <div class="container stack">
    <h2 class="title-lg">${escapeHtml(labels.updateGovernance)}</h2>
    <ul>
      ${labels.updateItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n")}
    </ul>
  </div>
</section>`;
  html = upsertBlock(html, "editorial-governance", block, /<\/section>/);
  await write(relativePath, html);
};

const repairContactPage = async (relativePath) => {
  let html = await read(relativePath);
  const locale = getLocaleFromPath(relativePath);
  const labels = locales[locale].labels;
  html = fixLinkSpacing(html);
  html = ensureMachineReadableLinks(html);
  html = html.replace(
    /<div class="cta-band accent" data-contact-disclaimer>[\s\S]*?<div class="form-card">/,
    `<div class="cta-band accent" data-contact-disclaimer>
  <h3 class="title-md">${escapeHtml(labels.trustModel)}</h3>
  <ul>
    ${labels.trustModelItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n")}
  </ul>
  <h3 class="title-md">${escapeHtml(labels.urgentTriggers)}</h3>
  <ul>
    <li>${escapeHtml(clusters["ben-gurion-emergency"].copy[locale].lawyerNow)}</li>
    <li>${escapeHtml(clusters["tourist-entry"].copy[locale].lawyerNow)}</li>
  </ul>
  <div class="cta-actions">
    <a class="button button--secondary" href="${localizedPath(locale, "/services/ben-gurion-emergency")}">${escapeHtml(emergencyServiceLabel[locale])}</a>
  </div>
  <div class="geo-step-model">
    <h3 class="title-md">${escapeHtml(contactStepHeading[locale])}</h3>
    <ol>
      ${contactSteps[locale].map((item) => `<li>${escapeHtml(item)}</li>`).join("\n")}
    </ol>
  </div>
</div>

    <div class="form-card">`
  );
  await write(relativePath, html);
};

const injectAfterHeroActions = (html, block) =>
  html.replace(/<div class="hero-actions">[\s\S]*?<\/div>/, (match) => `${match}\n${block}`);

const buildServiceBoundaryNote = (locale, clusterKey) => {
  const localeData = locales[locale];
  const copy = clusters[clusterKey].copy[locale];
  return `<div class="geo-boundary-note">
  <p><strong>${escapeHtml(localeData.labels.answer)}:</strong> ${escapeHtml(copy.shortAnswer)}</p>
  <p><strong>${escapeHtml(localeData.labels.varies)}:</strong> ${escapeHtml(copy.varies)}</p>
  <p><strong>${escapeHtml(localeData.labels.lawyerNow)}:</strong> ${escapeHtml(copy.lawyerNow)}</p>
  <p>${escapeHtml(ctaBoundaryNote[locale])}</p>
</div>`;
};

const buildEmergencyActionPanel = (locale) => {
  const localeData = locales[locale];
  const copy = clusters["ben-gurion-emergency"].copy[locale];
  return `<div class="geo-emergency-actions">
  <h2 class="title-md">${escapeHtml(localeData.labels.urgentTriggers)}</h2>
  <p>${escapeHtml(copy.lawyerNow)}</p>
  <ol>
    <li>${escapeHtml(copy.prepare[0])}</li>
    <li>${escapeHtml(copy.prepare[1])}</li>
    <li>${escapeHtml(copy.prepare[2])}</li>
  </ol>
  <p>${escapeHtml(ctaBoundaryNote[locale])}</p>
</div>`;
};

const repairServiceHero = async (relativePath) => {
  let html = await read(relativePath);
  const locale = getLocaleFromPath(relativePath);
  const clusterKey = clusterOf(relativePath, html);
  if (!clusterKey) return;
  html = fixLinkSpacing(html);
  html = html.replace(/<div class="geo-boundary-note">[\s\S]*?<\/div>\s*/g, "");
  html = html.replace(/<div class="geo-emergency-actions">[\s\S]*?<\/div>\s*/g, "");
  if (/services\/work-visas\.html$/.test(relativePath)) {
    html = injectAfterHeroActions(html, buildServiceBoundaryNote(locale, clusterKey));
  }
  if (/services\/ben-gurion-emergency\.html$/.test(relativePath)) {
    html = html.replace(
      /<div class="hero-actions">[\s\S]*?<\/div>/,
      `<div class="hero-actions">
            <a class="button button--primary" href="${localizedPath(locale, "/contact#form")}">${escapeHtml(emergencyServiceLabel[locale])}</a>
            <a class="button button--secondary" href="${localizedPath(locale, "/services/ben-gurion-emergency#emergency-action")}">${escapeHtml(contactStepHeading[locale])}</a>
          </div>`
    );
    html = injectAfterHeroActions(html, buildEmergencyActionPanel(locale));
  }
  await write(relativePath, html);
};

const walkLocaleHtml = async (dir) => {
  const entries = await fs.readdir(path.join(root, dir), { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relative = path.join(dir, entry.name).replace(/\\/g, "/");
    if (entry.isDirectory()) {
      files.push(...(await walkLocaleHtml(relative)));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(relative);
    }
  }
  return files;
};

const repairUkrainianLocale = async () => {
  const files = await walkLocaleHtml("ua");
  for (const relativePath of files) {
    let html = await read(relativePath);
    html = html
      .replace(/>додому</g, ">Головна<")
      .replace(/"name": "додому"/g, '"name": "Головна"')
      .replace(/>статті</g, ">Статті<")
      .replace(/"name": "статті"/g, '"name": "Статті"')
      .replace(/aria-label="Первинний"/g, 'aria-label="Основна навігація"');

    if (relativePath === "ua/index.html") {
      html = html
        .replace("Зосередьтеся на Ашдоді, Ізраїль", "Ашдод, Ізраїль")
        .replace("Консультації через Zoom, підтримка російською", "Zoom-консультації, багатомовний супровід за попереднім узгодженням")
        .replace(
          /<h2 class="title-lg">Основні напрями<\/h2>[\s\S]*?<div class="services-grid">/,
          `<h2 class="title-lg">Основні напрями</h2>
    <p>Пояснюємо маршрути щодо робочих віз, статусу, громадянства, туристичних віз, дозволів на в’їзд і термінових ситуацій у Бен-Гуріоні. У кожному напрямі ми показуємо, які документи справді важливі, що залежить від фактів справи і коли вже потрібен прямий юридичний розбір.</p>
    <div class="services-grid">`
        );
    }

    if (relativePath === "ua/contact.html") {
      html = html
        .replace(/Ми намагаємося швидко реагувати, але ні\s*Ми гарантуємо конкретні терміни\./g, "Ми намагаємося відповідати якомога швидше, але не гарантуємо конкретних строків.")
        .replace(/Якщо ситуація термінова, особливо вночі в Бен-Гуріоні, обов'язково\s*Будь ласка, вкажіть це,/g, "Якщо ситуація термінова, особливо вночі в Бен-Гуріоні, обов’язково зазначте це,")
        .replace(/Ми цього не робимо\s*Ми передаємо дані третім особам, які не мають відношення до звернення\./g, "Ми не передаємо дані третім особам, які не мають відношення до звернення.")
        .replace(/не є законною\s*консультація\./g, "не є юридичною консультацією.");
    }

    await write(relativePath, html);
  }
};

const generateClusterAndGlossaryPages = async () => {
  for (const locale of Object.keys(locales)) {
    const glossaryFile = glossaryPath(locale);
    await fs.mkdir(path.dirname(path.join(root, glossaryFile)), { recursive: true });
    await write(glossaryFile, buildGlossaryPage(locale));
    for (const clusterKey of Object.keys(clusters)) {
      const file = clusterHubPath(locale, clusterKey);
      await fs.mkdir(path.dirname(path.join(root, file)), { recursive: true });
      await write(file, await buildClusterPage(locale, clusterKey));
    }
  }
  await write("llms.txt", await buildLlmsTxt());
  await write("llms-full.txt", await buildLlmsFullTxt());
  await write("assets/glossary.json", JSON.stringify(glossaryTerms, null, 2));
};

const walkArticles = async (dir) => {
  const entries = await fs.readdir(path.join(root, dir), { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relative = path.join(dir, entry.name).replace(/\\/g, "/");
    if (entry.isDirectory()) {
      files.push(...(await walkArticles(relative)));
      continue;
    }
    if (entry.isFile() && /article-\d+\.html$/.test(relative)) {
      files.push(relative);
    }
  }
  return files;
};

const main = async () => {
  await repairRobots();
  await generateClusterAndGlossaryPages();

  for (const file of indexPages) {
    await repairIndexPage(file);
  }

  for (const file of servicePages) {
    await repairServicePage(file);
    await repairServiceHero(file);
  }

  for (const file of aboutPages) {
    await repairAboutPage(file);
  }

  for (const file of editorialPolicyPages) {
    await repairEditorialPolicy(file);
  }

  for (const file of contactPages) {
    await repairContactPage(file);
  }

  const articleDirs = ["articles", "en/articles", "ru/articles", "ua/articles"];
  for (const dir of articleDirs) {
    const files = await walkArticles(dir);
    for (const file of files) {
      await repairArticlePage(file);
    }
  }

  await repairUkrainianLocale();

  console.log("GEO repair completed.");
};

await main();
