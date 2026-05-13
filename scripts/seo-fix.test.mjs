import test from "node:test";
import assert from "node:assert";
import { decodeEntities } from "./seo-fix.mjs";

test("decodeEntities - should decode common HTML entities", () => {
  assert.strictEqual(decodeEntities("&nbsp;hello&amp;world&quot;and&#39;test&lt;html&gt;"), " hello&world\"and'test<html>");
});

test("decodeEntities - should handle missing or empty input", () => {
  assert.strictEqual(decodeEntities(""), "");
  assert.strictEqual(decodeEntities(), "");
});

test("decodeEntities - should handle input without entities", () => {
  assert.strictEqual(decodeEntities("hello world"), "hello world");
});
