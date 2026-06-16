import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const opts = {
    queue: "keyword-queue.csv",
    out: "content_queue",
    cadenceDays: 1,
    maxPerRun: Number.POSITIVE_INFINITY,
    dryRun: false,
    now: null,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--queue") {
      opts.queue = args[i + 1];
      i += 1;
    } else if (arg === "--out") {
      opts.out = args[i + 1];
      i += 1;
    } else if (arg === "--cadence-days") {
      opts.cadenceDays = Number.parseInt(args[i + 1], 10);
      i += 1;
    } else if (arg === "--max-per-run") {
      opts.maxPerRun = Number.parseInt(args[i + 1], 10);
      i += 1;
    } else if (arg === "--dry-run") {
      opts.dryRun = true;
    } else if (arg === "--now") {
      opts.now = args[i + 1];
      i += 1;
    } else if (arg === "--help") {
      printUsage();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!Number.isFinite(opts.cadenceDays) || opts.cadenceDays <= 0) {
    throw new Error("--cadence-days must be a positive integer");
  }

  if (!Number.isFinite(opts.maxPerRun) || opts.maxPerRun <= 0) {
    opts.maxPerRun = Number.POSITIVE_INFINITY;
  }

  const queuePath = path.resolve(process.cwd(), opts.queue);
  const outRoot = path.resolve(process.cwd(), opts.out);
  const now = opts.now ? parseDateTime(opts.now) : new Date();

  const { header, rows } = await readCsv(queuePath);
  const expectedHeader = [
    "scheduled_at",
    "cluster",
    "intent",
    "keyword_he",
    "keyword_en",
    "keyword_ru",
    "keyword_uk",
  ];

  if (header.join(",") !== expectedHeader.join(",")) {
    throw new Error(
      `Unexpected CSV header. Expected: ${expectedHeader.join(",")} | Got: ${header.join(",")}`,
    );
  }

  const dueRows = [];
  const remainingRows = [];
  let processedCount = 0;

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    const scheduledAt = parseDateTime(row.scheduled_at);
    const isDue = scheduledAt <= now;

    if (isDue && processedCount < opts.maxPerRun) {
      dueRows.push({ ...row, _scheduledDate: scheduledAt });
      processedCount += 1;
    } else {
      remainingRows.push(...rows.slice(i));
      break;
    }
  }

  if (dueRows.length === 0) {
    console.log("No scheduled items due.");
    process.exit(0);
  }

  const maxScheduledAt = getMaxScheduledAt(remainingRows, dueRows);
  let rollingDate = maxScheduledAt;
  const rescheduledRows = [];

  for (const row of dueRows) {
    rollingDate = addDays(rollingDate, opts.cadenceDays);
    rescheduledRows.push({
      scheduled_at: formatDateTime(rollingDate),
      cluster: row.cluster,
      intent: row.intent,
      keyword_he: row.keyword_he,
      keyword_en: row.keyword_en,
      keyword_ru: row.keyword_ru,
      keyword_uk: row.keyword_uk,
    });
  }

  if (!opts.dryRun) {
    for (const row of dueRows) {
      const datePart = row.scheduled_at.split(" ")[0];
      const dirName = `${datePart}-${row.intent}`;
      const dirPath = path.join(outRoot, dirName);
      await fs.mkdir(dirPath, { recursive: true });

      const prompts = buildPrompts(row);
      for (const [filename, content] of Object.entries(prompts)) {
        await fs.writeFile(path.join(dirPath, filename), content, "utf8");
      }
    }

    const updatedRows = remainingRows.concat(rescheduledRows);
    await writeCsv(queuePath, expectedHeader, updatedRows);
  }

  console.log(`Processed ${dueRows.length} item(s).`);
  console.log(`Output directory: ${outRoot}`);
  for (let i = 0; i < dueRows.length; i += 1) {
    const row = dueRows[i];
    console.log(`- ${row.intent} -> ${rescheduledRows[i].scheduled_at}`);
  }
  if (opts.dryRun) {
    console.log("Dry run: no files written and queue not updated.");
  }
}

async function readCsv(filePath) {
  const text = await fs.readFile(filePath, "utf8");
  const rows = [];
  let currentRow = [];
  let currentVal = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentVal += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        currentVal += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        currentRow.push(currentVal);
        currentVal = "";
      } else if (char === "\n" || (char === "\r" && nextChar === "\n")) {
        currentRow.push(currentVal);
        rows.push(currentRow);
        currentRow = [];
        currentVal = "";
        if (char === "\r") i++;
      } else if (char === "\r") {
        currentRow.push(currentVal);
        rows.push(currentRow);
        currentRow = [];
        currentVal = "";
      } else {
        currentVal += char;
      }
    }
  }

  if (currentRow.length > 0 || currentVal !== "") {
    currentRow.push(currentVal);
    rows.push(currentRow);
  }

  // Filter empty rows
  const nonEmptyRows = rows.filter(
    (row) => row.length > 0 && row.some((cell) => cell.trim() !== ""),
  );

  if (nonEmptyRows.length === 0) {
    throw new Error("CSV file is empty");
  }

  const header = nonEmptyRows[0];
  const dataRows = nonEmptyRows.slice(1).map((values) => {
    const row = {};
    for (let i = 0; i < header.length; i += 1) {
      row[header[i]] = values[i] ?? "";
    }
    return row;
  });

  return { header, rows: dataRows };
}

// parseCsvLine removed as it is integrated into readCsv

export function escapeCsv(value) {
  const needsQuotes = /[",\n]/.test(value);
  if (!needsQuotes) {
    return value;
  }
  return `"${value.replace(/"/g, '""')}"`;
}

async function writeCsv(filePath, header, rows) {
  const lines = [
    header.join(","),
    ...rows.map((row) =>
      header.map((column) => escapeCsv(String(row[column] ?? ""))).join(","),
    ),
  ];

  await fs.writeFile(filePath, `${lines.join("\n")}\n`, "utf8");
}

export function parseDateTime(value) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})$/);
  if (!match) {
    throw new Error(`Invalid datetime: ${value}`);
  }
  const year = Number.parseInt(match[1], 10);
  const month = Number.parseInt(match[2], 10) - 1;
  const day = Number.parseInt(match[3], 10);
  const hour = Number.parseInt(match[4], 10);
  const minute = Number.parseInt(match[5], 10);
  return new Date(year, month, day, hour, minute, 0, 0);
}

export function formatDateTime(date) {
  const pad = (num) => String(num).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

export function addDays(date, days) {
  const next = new Date(date.getTime());
  next.setDate(next.getDate() + days);
  return next;
}

function getMaxScheduledAt(remainingRows, dueRows) {
  let max = null;
  for (const row of remainingRows) {
    const dt = parseDateTime(row.scheduled_at);
    if (!max || dt > max) {
      max = dt;
    }
  }
  if (!max) {
    for (const row of dueRows) {
      if (!max || row._scheduledDate > max) {
        max = row._scheduledDate;
      }
    }
  }
  return max;
}

function buildPrompts(row) {
  const locations = {
    he: "אשדוד, ישראל",
    en: "Ashdod, Israel",
    ru: "Ашдод, Израиль",
    uk: "Ашдод, Ізраїль",
  };

  const prompts = {
    "he.md": buildPrompt("Hebrew", "he", row.keyword_he, row, locations.he),
    "en.md": buildPrompt("English", "en", row.keyword_en, row, locations.en),
    "ru.md": buildPrompt("Russian", "ru", row.keyword_ru, row, locations.ru),
    "uk.md": buildPrompt("Ukrainian", "uk", row.keyword_uk, row, locations.uk),
  };

  return prompts;
}

function buildPrompt(languageName, languageCode, keyword, row, location) {
  const lines = [
    "---",
    `title: ${keyword}`,
    `language: ${languageCode}`,
    `keyword: ${keyword}`,
    `cluster: ${row.cluster}`,
    `intent: ${row.intent}`,
    `scheduled_at: ${row.scheduled_at}`,
    "---",
    "",
    `Write a 450-650 word article in ${languageName}.`,
    `Primary keyword: \"${keyword}\".`,
    `Location: ${location} (use this exact phrasing).`,
    "",
    "Requirements:",
    "- Calm, professional, empathetic tone; no alarmism.",
    "- No individualized legal advice and no outcome guarantees.",
    "- Use placeholders: [שם המשרד], [שם עורכת הדין], [טלפון], [אימייל].",
    "- Do not invent real firm details or contact info.",
    "- Include at least one soft CTA.",
    "- Write unique, substantive paragraphs. Do not use generic stock paragraphs or repetitive filler.",
    `- Ensure natural phrasing. Do not awkwardly mix English keywords into the ${languageName} text. Translate or adapt keywords naturally.`,
    "- End with a short disclaimer line: general info only.",
  ];

  return `${lines.join("\n")}\n`;
}

function printUsage() {
  console.log("Usage: node scripts/keyword-queue.mjs [options]\n");
  console.log("Options:");
  console.log(
    "  --queue <path>       Path to keyword-queue.csv (default: keyword-queue.csv)",
  );
  console.log(
    "  --out <path>         Output directory (default: content_queue)",
  );
  console.log(
    "  --cadence-days <int> Days between rescheduled items (default: 1)",
  );
  console.log(
    "  --max-per-run <int>  Max items to process per run (default: unlimited)",
  );
  console.log("  --dry-run            Print actions without writing files");
  console.log('  --now "YYYY-MM-DD HH:MM"  Override current time for testing');
}
