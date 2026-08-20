import test from "node:test";
import assert from "node:assert";
import { escapeAttribute } from "../scripts/seo-fix.mjs";

test("escapeAttribute escapes standard html attribute chars", () => {
  assert.strictEqual(
    escapeAttribute('test & "quote" <tag>'),
    'test &amp; &quot;quote&quot; &lt;tag&gt;'
  );
});

test("escapeAttribute handles empty string", () => {
  assert.strictEqual(escapeAttribute(""), "");
});

test("escapeAttribute handles undefined", () => {
  assert.strictEqual(escapeAttribute(), "");
});
