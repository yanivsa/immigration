import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const args = process.argv.slice(2);
const write = args.includes("--write");
const consistent = args.includes("--consistent");
const help = args.includes("--help");

const localeArg = args.find((arg) => arg.startsWith("--locale="));
const reportArg = args.find((arg) => arg.startsWith("--report="));

const localeFilter = localeArg
  ? new Set(localeArg.split("=")[1].split(",").map((item) => item.trim()).filter(Boolean))
  : null;

const reportPath = reportArg ? reportArg.split("=")[1] : null;

if (help) {
  const usage = [
    "Usage: node scripts/humanize-articles.mjs [--write] [--consistent] [--locale=he,en,ru,ua] [--report=path]",
    "",
    "--write       Apply changes in place (default: dry run)",
    "--consistent  Use the same variant across all files for each phrase",
    "--locale      Comma-separated locales to process",
    "--report      Write a JSON report of replacements",
  ].join("\n");
  console.log(usage);
  process.exit(0);
}

const root = process.cwd();
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const replacementsPath = path.join(scriptDir, "humanize-phrases.json");

const replacementsByLocale = JSON.parse(fs.readFileSync(replacementsPath, "utf8"));

const contentDirs = [
  "articles",
  path.join("en", "articles"),
  path.join("ru", "articles"),
  path.join("ua", "articles"),
];

const files = [];
for (const dir of contentDirs) {
  const fullDir = path.join(root, dir);
  if (!fs.existsSync(fullDir)) {
    continue;
  }
  const entries = fs.readdirSync(fullDir);
  for (const entry of entries) {
    if (entry.endsWith(".html")) {
      files.push(path.join(fullDir, entry));
    }
  }
}

function normalizePath(filePath) {
  return path.relative(root, filePath).split(path.sep).join("/");
}

function detectLocale(relPath) {
  if (relPath.startsWith("en/")) return "en";
  if (relPath.startsWith("ru/")) return "ru";
  if (relPath.startsWith("ua/")) return "ua";
  return "he";
}

function hashString(value) {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return hash >>> 0;
}

function pickVariant(variants, key) {
  if (!variants.length) return "";
  if (variants.length === 1) return variants[0];
  const index = hashString(key) % variants.length;
  return variants[index];
}

function countOccurrences(text, search) {
  if (!search) return 0;
  let count = 0;
  let index = 0;
  while (true) {
    index = text.indexOf(search, index);
    if (index === -1) break;
    count += 1;
    index += search.length;
  }
  return count;
}

let processed = 0;
let changed = 0;
const report = [];

const processingPromises = files.map(async (filePath) => {
  const relPath = normalizePath(filePath);
  const locale = detectLocale(relPath);

  if (localeFilter && !localeFilter.has(locale)) {
    return null;
  }

  const replacements = replacementsByLocale[locale] || [];
  if (!replacements.length) {
    return null;
  }

  const original = await fs.promises.readFile(filePath, "utf8");
  let updated = original;
  const fileChanges = [];

  for (const replacement of replacements) {
    if (!updated.includes(replacement.from)) {
      continue;
    }

    const key = consistent ? replacement.from : `${relPath}::${replacement.from}`;
    const variant = pickVariant(replacement.to, key);
    const count = countOccurrences(updated, replacement.from);

    updated = updated.split(replacement.from).join(variant);
    fileChanges.push({
      from: replacement.from,
      to: variant,
      count,
    });
  }

  if (fileChanges.length) {
    if (write) {
      await fs.promises.writeFile(filePath, updated, "utf8");
    }
    return {
      processed: true,
      changed: true,
      reportItem: {
        file: relPath,
        locale,
        changes: fileChanges,
      },
    };
  }

  return { processed: true, changed: false };
});

const results = await Promise.all(processingPromises);

for (const result of results) {
  if (result && result.processed) {
    processed += 1;
    if (result.changed) {
      changed += 1;
      report.push(result.reportItem);
    }
  }
}

const action = write ? "Updated" : "Would update";
console.log(`${action} ${changed}/${processed} files.`);

if (reportPath) {
  await fs.promises.writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log(`Wrote report to ${reportPath}.`);
}
