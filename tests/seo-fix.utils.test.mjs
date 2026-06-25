import test from "node:test";
import assert from "node:assert";
import { toPathname, toAbsoluteUrl, isNoindex } from "../scripts/seo-fix.mjs";

test("toPathname converts relPath to pathname correctly", () => {
  assert.strictEqual(toPathname("index.html"), "/");
  assert.strictEqual(toPathname("en/index.html"), "/en/");
  assert.strictEqual(toPathname("articles/article-1.html"), "/articles/article-1");
  assert.strictEqual(toPathname("services/something.html"), "/services/something");
});

test("toAbsoluteUrl returns full url correctly", () => {
  assert.strictEqual(toAbsoluteUrl("index.html"), "https://immigration.the-israeli-lawyer.com/");
  assert.strictEqual(toAbsoluteUrl("en/index.html"), "https://immigration.the-israeli-lawyer.com/en/");
  assert.strictEqual(toAbsoluteUrl("articles/article-1.html"), "https://immigration.the-israeli-lawyer.com/articles/article-1");
});

test("isNoindex returns true for noindex paths", () => {
  assert.strictEqual(isNoindex("404.html"), true);
});

test("isNoindex returns false for indexable paths", () => {
  assert.strictEqual(isNoindex("index.html"), false);
  assert.strictEqual(isNoindex("articles/article-1.html"), false);
});
