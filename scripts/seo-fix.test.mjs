import test from "node:test";
import assert from "node:assert";
import { getLocalizedRel } from "./seo-fix.mjs";

test("getLocalizedRel logic", () => {
  assert.strictEqual(getLocalizedRel("about.html", "he"), "about.html");
  assert.strictEqual(getLocalizedRel("about.html", "uk"), "ua/about.html");
  assert.strictEqual(getLocalizedRel("about.html", "en"), "en/about.html");
  assert.strictEqual(getLocalizedRel("about.html", "ru"), "ru/about.html");
});
