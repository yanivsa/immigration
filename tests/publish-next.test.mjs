import test from "node:test";
import assert from "node:assert";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

test("publish-next generates 4 substantive articles without raw cluster IDs and duplicate sections", async () => {
  // Restore any previous run
  execSync("git restore keyword-queue.csv", { cwd: root });
  execSync("git clean -f -d articles en ru ua", { cwd: root });

  // Backup queue
  const queuePath = path.join(root, "keyword-queue.csv");
  const originalQueue = await fs.readFile(queuePath, "utf8");

  // Get current article count
  const entries = await fs.readdir(path.join(root, "articles"));
  const numbers = entries
    .map((name) => name.match(/^article-(\d+)\.html$/))
    .filter(Boolean)
    .map((m) => parseInt(m[1], 10));
  const articleNumStr = String(Math.max(...numbers) + 1).padStart(2, '0');

  // Run the script
  execSync("node scripts/publish-next.mjs", { stdio: "inherit", cwd: root });

  // Read modified queue to verify 1 row consumed
  const newQueue = await fs.readFile(queuePath, "utf8");
  const origRows = originalQueue.trim().split("\n").length;
  const newRows = newQueue.trim().split("\n").length;
  assert.strictEqual(newRows, origRows - 1, "Should consume exactly one queue row");

  const locales = ["", "en", "ru", "ua"];

  for (const loc of locales) {
    const articlePath = path.join(root, loc, "articles", `article-${articleNumStr}.html`);
    const content = await fs.readFile(articlePath, "utf8");

    // 2. Substantive body length (approx >= 700 words)
    const bodyMatch = content.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    assert.ok(bodyMatch, `Main content missing for locale ${loc}`);
    const textContent = bodyMatch[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const wordCount = textContent.split(" ").length;

    assert.ok(wordCount >= 700, `Locale ${loc} word count ${wordCount} is less than 700`);

    // 3. No duplicate body sections (e.g. overview[0] repeated)
    const quickAnswerMatch = content.match(/<div class="geo-inline-card">([\s\S]*?)<\/div>/);
    const overviewMatch = content.match(/<section id="overview">([\s\S]*?)<\/section>/);

    if (quickAnswerMatch && overviewMatch) {
      const qText = quickAnswerMatch[1].replace(/<[^>]+>/g, " ").trim();
      const oText = overviewMatch[1].replace(/<[^>]+>/g, " ").trim();
      assert.ok(!oText.includes(qText), "Overview should not duplicate Quick Answer");
    }

    // 4. No visible raw cluster id
    assert.ok(!content.includes(">citizenship-status<"), "Raw cluster id visible in text!");
    assert.ok(!content.includes(">work-visas<"), "Raw cluster id visible in text!");
  }
});
