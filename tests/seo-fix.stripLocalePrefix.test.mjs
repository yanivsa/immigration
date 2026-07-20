import test from "node:test";
import assert from "node:assert";
import { stripLocalePrefix } from "../scripts/seo-fix.mjs";

test("stripLocalePrefix removes en/ prefix", () => {
  assert.strictEqual(stripLocalePrefix("en/about.html"), "about.html");
});

test("stripLocalePrefix removes ru/ prefix", () => {
  assert.strictEqual(stripLocalePrefix("ru/index.html"), "index.html");
});

test("stripLocalePrefix removes ua/ prefix", () => {
  assert.strictEqual(stripLocalePrefix("ua/contact.html"), "contact.html");
});

test("stripLocalePrefix leaves no prefix unchanged", () => {
  assert.strictEqual(stripLocalePrefix("index.html"), "index.html");
  assert.strictEqual(stripLocalePrefix("articles/article-1.html"), "articles/article-1.html");
});
