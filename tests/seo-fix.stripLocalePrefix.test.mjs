import test from "node:test";
import assert from "node:assert";
import { stripLocalePrefix } from "../scripts/seo-fix.mjs";

test("stripLocalePrefix removes supported locale prefixes", () => {
  assert.strictEqual(stripLocalePrefix("en/articles/article-1"), "articles/article-1");
  assert.strictEqual(stripLocalePrefix("ru/index.html"), "index.html");
  assert.strictEqual(stripLocalePrefix("ua/about.html"), "about.html");
});

test("stripLocalePrefix does not remove hebrew (no prefix) or unknown prefixes", () => {
  assert.strictEqual(stripLocalePrefix("articles/article-1"), "articles/article-1");
  assert.strictEqual(stripLocalePrefix("fr/index.html"), "fr/index.html");
});

test("stripLocalePrefix handles empty strings", () => {
  assert.strictEqual(stripLocalePrefix(""), "");
});
