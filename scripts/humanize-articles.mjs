import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export function normalizePath(filePath, root) {
  return path.relative(root, filePath).split(path.sep).join("/");
}

export function detectLocale(relPath) {
  if (relPath.startsWith("en/")) return "en";
  if (relPath.startsWith("ru/")) return "ru";
  if (relPath.startsWith("ua/")) return "ua";
  return "he";
}

export function hashString(value) {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return hash >>> 0;
}

export function pickVariant(variants, key) {
  if (!variants.length) return "";
  if (variants.length === 1) return variants[0];
  const index = hashString(key) % variants.length;
  return variants[index];
}

export function countOccurrences(text, search) {
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


if (process.argv[1] === fileURLToPath(import.meta.url)) {

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


  let processed = 0;
  let changed = 0;
  const report = [];

  for (const filePath of files) {
    const relPath = normalizePath(filePath, root);
    const locale = detectLocale(relPath);

    if (localeFilter && !localeFilter.has(locale)) {
      continue;
    }

    const replacements = replacementsByLocale[locale] || [];
    if (!replacements.length) {
      continue;
    }

    processed += 1;
    const original = fs.readFileSync(filePath, "utf8");
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
      changed += 1;
      if (write) {
        fs.writeFileSync(filePath, updated, "utf8");
      }
      report.push({
        file: relPath,
        locale,
        changes: fileChanges,
      });
    }
  }

  const action = write ? "Updated" : "Would update";
  console.log(`${action} ${changed}/${processed} files.`);

  if (reportPath) {
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`Wrote report to ${reportPath}.`);
  }

}
