import test from "node:test";
import assert from "node:assert";
import { escapeAttribute } from "../scripts/seo-fix.mjs";

test("escapeAttribute escapes HTML characters correctly", () => {
  const input = 'test & "string" <with> characters';
  const expected = "test &amp; &quot;string&quot; &lt;with&gt; characters";
  assert.strictEqual(escapeAttribute(input), expected);
});

test("escapeAttribute handles undefined input safely", () => {
  assert.strictEqual(escapeAttribute(undefined), "");
});
