(() => {
  const mount =
    document.querySelector(".lang-switch") ||
    document.querySelector(".header-inner");

  const baseLang = (document.documentElement.lang || "en")
    .toLowerCase()
    .split("-")[0];

  const strings = {
    he: {
      openLabel: "פתיחת חיפוש באתר",
      closeLabel: "סגירת חיפוש",
      panelLabel: "חיפוש באתר",
      placeholder: "חיפוש לפי נושא, שירות או מאמר",
      hint: "הקלידו לפחות שתי אותיות.",
      noResults: "לא נמצאו תוצאות.",
      loading: "טוען נתונים...",
    },
    en: {
      openLabel: "Open site search",
      closeLabel: "Close search",
      panelLabel: "Site search",
      placeholder: "Search by topic, service, or article",
      hint: "Type at least two characters.",
      noResults: "No results found.",
      loading: "Loading search data...",
    },
    ru: {
      openLabel: "Открыть поиск по сайту",
      closeLabel: "Закрыть поиск",
      panelLabel: "Поиск по сайту",
      placeholder: "Поиск по теме, услуге или статье",
      hint: "Введите минимум две буквы.",
      noResults: "Ничего не найдено.",
      loading: "Загрузка данных...",
    },
    uk: {
      openLabel: "Відкрити пошук по сайту",
      closeLabel: "Закрити пошук",
      panelLabel: "Пошук по сайту",
      placeholder: "Пошук за темою, послугою чи статтею",
      hint: "Введіть мінімум дві літери.",
      noResults: "Нічого не знайдено.",
      loading: "Завантаження даних...",
    },
  };

  const copy = strings[baseLang] || strings.en;

  const triggers = new Set();
  const registerTrigger = (element) => {
    if (!element || triggers.has(element)) {
      return;
    }
    if (element.tagName === "BUTTON" && !element.type) {
      element.type = "button";
    }
    if (!element.hasAttribute("aria-label") && !element.textContent.trim()) {
      element.setAttribute("aria-label", copy.openLabel);
    }
    element.setAttribute("aria-expanded", "false");
    triggers.add(element);
  };

  document.querySelectorAll("[data-search-trigger]").forEach(registerTrigger);

  const existingTrigger = document.querySelector(".search-trigger");
  if (existingTrigger) {
    registerTrigger(existingTrigger);
  }

  if (!existingTrigger && mount) {
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "search-trigger";
    trigger.setAttribute("aria-label", copy.openLabel);
    trigger.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M15.5 15.5L20 20M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    `;
    mount.appendChild(trigger);
    registerTrigger(trigger);
  }

  if (!triggers.size) {
    return;
  }

  const backdrop = document.createElement("div");
  backdrop.className = "search-backdrop";

  const panel = document.createElement("div");
  panel.className = "search-panel";
  panel.id = "site-search-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", copy.panelLabel);
  panel.innerHTML = `
    <div class="search-panel__inner">
      <label class="visually-hidden" for="site-search-input">${copy.panelLabel}</label>
      <div class="search-input-row">
        <input
          id="site-search-input"
          class="search-input"
          type="search"
          placeholder="${copy.placeholder}"
          autocomplete="off"
          spellcheck="false"
        />
        <button type="button" class="search-close" aria-label="${copy.closeLabel}">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M6 6L18 18M18 6L6 18"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
      <div class="search-results" data-search-results></div>
      <p class="search-hint" data-search-hint>${copy.hint}</p>
    </div>
  `;

  document.body.appendChild(backdrop);
  document.body.appendChild(panel);

  const input = panel.querySelector("#site-search-input");
  const results = panel.querySelector("[data-search-results]");
  const hint = panel.querySelector("[data-search-hint]");
  const closeButton = panel.querySelector(".search-close");
  const triggerList = Array.from(triggers);

  triggerList.forEach((element) => {
    element.setAttribute("aria-controls", panel.id);
  });

  let fuse = null;
  let items = null;

  const escapeHtml = (value) =>
    value.replace(/[&<>"']/g, (char) => {
      const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;",
      };
      return map[char] || char;
    });

  const snippetFor = (item) => {
    const raw = item.description || item.content || "";
    const trimmed = raw.replace(/\s+/g, " ").trim();
    if (!trimmed) {
      return "";
    }
    return trimmed.length > 160 ? `${trimmed.slice(0, 160).trim()}...` : trimmed;
  };

  const typeLabels = {
    he: {
      article: "מאמר",
      service: "שירות",
      "cluster-hub": "אשכול",
      glossary: "מילון",
      contact: "יצירת קשר",
      about: "אודות",
      "articles-hub": "מרכז מאמרים",
      "services-hub": "מרכז שירותים",
      "editorial-policy": "מדיניות עריכה",
    },
    en: {
      article: "Article",
      service: "Service",
      "cluster-hub": "Cluster",
      glossary: "Glossary",
      contact: "Contact",
      about: "About",
      "articles-hub": "Articles hub",
      "services-hub": "Services hub",
      "editorial-policy": "Editorial policy",
    },
    ru: {
      article: "Статья",
      service: "Услуга",
      "cluster-hub": "Кластер",
      glossary: "Глоссарий",
      contact: "Контакты",
      about: "О сайте",
      "articles-hub": "Центр статей",
      "services-hub": "Центр услуг",
      "editorial-policy": "Редакционная политика",
    },
    uk: {
      article: "Стаття",
      service: "Послуга",
      "cluster-hub": "Кластер",
      glossary: "Глосарій",
      contact: "Контакти",
      about: "Про сайт",
      "articles-hub": "Центр статей",
      "services-hub": "Центр послуг",
      "editorial-policy": "Редакційна політика",
    },
  };

  const filterByLang = (data) => {
    const filtered = data.filter((item) => item.lang === baseLang);
    return filtered.length ? filtered : data;
  };

  const loadIndex = async () => {
    if (items) {
      return items;
    }
    const response = await fetch("/assets/search-index.json", {
      cache: "force-cache",
    });
    items = await response.json();
    return items;
  };

  const getFuse = async () => {
    if (fuse) {
      return fuse;
    }
    if (typeof Fuse === "undefined") {
      console.error("Fuse.js failed to load.");
      throw new Error("Fuse.js not loaded");
    }
    const data = filterByLang(await loadIndex());
    fuse = new Fuse(data, {
      keys: [
        { name: "title", weight: 0.5 },
        { name: "headings", weight: 0.25 },
        { name: "description", weight: 0.2 },
        { name: "content", weight: 0.05 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
    return fuse;
  };

  const renderResults = (list) => {
    if (!list.length) {
      results.innerHTML = `<p class="search-empty">${copy.noResults}</p>`;
      return;
    }

    results.innerHTML = list
      .map(({ item }) => {
        const title = escapeHtml(item.title || "");
        const snippet = escapeHtml(snippetFor(item));
        const labels = typeLabels[baseLang] || typeLabels.en;
        const pageType = escapeHtml(labels[item.pageType] || item.pageType || "");
        const cluster = escapeHtml(item.cluster || "");
        const reviewedAt = escapeHtml(item.reviewedAt || "");
        return `
          <div class="search-result">
            <div class="search-result__meta">
              ${pageType ? `<span class="search-chip">${pageType}</span>` : ""}
              ${cluster ? `<span class="search-chip search-chip--muted">${cluster}</span>` : ""}
              ${reviewedAt ? `<span class="search-chip search-chip--muted">${reviewedAt}</span>` : ""}
            </div>
            <a href="${item.url}">${title}</a>
            ${snippet ? `<p>${snippet}</p>` : ""}
          </div>
        `;
      })
      .join("");
  };

  const runSearch = async (query) => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      results.innerHTML = "";
      hint.hidden = false;
      return;
    }

    hint.hidden = true;
    const engine = await getFuse();
    const matches = engine.search(trimmed).slice(0, 8);
    renderResults(matches);
  };

  const setExpanded = (expanded) => {
    triggerList.forEach((element) => {
      element.setAttribute("aria-expanded", expanded ? "true" : "false");
    });
  };

  const openPanel = async () => {
    panel.classList.add("is-open");
    backdrop.classList.add("is-visible");
    setExpanded(true);
    input.focus();
    if (!items) {
      results.innerHTML = `<p class="search-loading">${copy.loading}</p>`;
      hint.hidden = true;
      try {
        await getFuse();
        results.innerHTML = "";
        hint.hidden = false;
      } catch (error) {
        console.error("Search initialization failed:", error);
        results.innerHTML = `<p class="search-empty">${copy.noResults} (System Error)</p>`;
      }
    }
  };

  const closePanel = () => {
    panel.classList.remove("is-open");
    backdrop.classList.remove("is-visible");
    setExpanded(false);
    input.value = "";
    results.innerHTML = "";
    hint.hidden = false;
  };

  const togglePanel = () => {
    if (panel.classList.contains("is-open")) {
      closePanel();
    } else {
      openPanel();
    }
  };

  triggerList.forEach((element) => {
    element.addEventListener("click", togglePanel);
  });

  closeButton.addEventListener("click", closePanel);
  backdrop.addEventListener("click", closePanel);

  input.addEventListener("input", (event) => {
    runSearch(event.target.value);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePanel();
    }
    if (event.key === "Enter") {
      const firstLink = results.querySelector("a");
      if (firstLink) {
        window.location.href = firstLink.href;
      }
    }
  });

  results.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closePanel();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && panel.classList.contains("is-open")) {
      closePanel();
    }
  });
})();
