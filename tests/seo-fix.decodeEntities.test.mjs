import test from "node:test";
import assert from "node:assert";
import { decodeEntities } from "../scripts/seo-utils.mjs";

test("decodeEntities decodes common HTML entities", () => {
  const input = "test &amp; string &quot;with&quot; &#39;entities&#39; &lt;and&gt;&nbsp;spaces";
  const expected = "test & string \"with\" 'entities' <and> spaces";
  assert.strictEqual(decodeEntities(input), expected);
});

test("decodeEntities handles empty string", () => {
  const input = "";
  const expected = "";
  assert.strictEqual(decodeEntities(input), expected);
});

test("decodeEntities handles undefined", () => {
  const expected = "";
  assert.strictEqual(decodeEntities(undefined), expected);
});
