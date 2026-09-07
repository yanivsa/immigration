import test from "node:test";
import assert from "node:assert";
import { stripLocalePrefix } from "../scripts/seo-fix.mjs";

test("stripLocalePrefix removes 'en/' prefix", () => {
  assert.strictEqual(stripLocalePrefix("en/articles/article-1.html"), "articles/article-1.html");
});

test("stripLocalePrefix removes 'ru/' prefix", () => {
  assert.strictEqual(stripLocalePrefix("ru/contact.html"), "contact.html");
});

test("stripLocalePrefix removes 'ua/' prefix", () => {
  assert.strictEqual(stripLocalePrefix("ua/services/tourist-visas.html"), "services/tourist-visas.html");
});

test("stripLocalePrefix returns original path if no locale prefix", () => {
  assert.strictEqual(stripLocalePrefix("articles/article-1.html"), "articles/article-1.html");
});
