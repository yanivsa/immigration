import test from "node:test";
import assert from "node:assert";
import { toUrl } from "./generate-search-index.mjs";

test("toUrl", async (t) => {
  await t.test("should handle root index.html", () => {
    assert.strictEqual(toUrl("index.html"), "/");
  });

  await t.test("should handle nested index.html", () => {
    assert.strictEqual(toUrl("en/index.html"), "/en/");
    assert.strictEqual(toUrl("articles/work-visas/index.html"), "/articles/work-visas/");
  });

  await t.test("should handle standard .html files", () => {
    assert.strictEqual(toUrl("articles/tourist-visas.html"), "/articles/tourist-visas");
    assert.strictEqual(toUrl("about.html"), "/about");
  });

  await t.test("should handle deeply nested .html files", () => {
    assert.strictEqual(toUrl("services/citizenship/process.html"), "/services/citizenship/process");
  });
});
