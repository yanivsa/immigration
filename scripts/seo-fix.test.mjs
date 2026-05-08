import test from "node:test";
import assert from "node:assert";
import { escapeHtmlText } from "./seo-fix.mjs";

test("escapeHtmlText", async (t) => {
  await t.test("escapes ampersands", () => {
    assert.strictEqual(escapeHtmlText("Tom & Jerry"), "Tom &amp; Jerry");
  });

  await t.test("escapes less than signs", () => {
    assert.strictEqual(escapeHtmlText("1 < 2"), "1 &lt; 2");
  });

  await t.test("escapes greater than signs", () => {
    assert.strictEqual(escapeHtmlText("2 > 1"), "2 &gt; 1");
  });

  await t.test("escapes multiple special characters", () => {
    assert.strictEqual(escapeHtmlText("<div>&</div>"), "&lt;div&gt;&amp;&lt;/div&gt;");
  });

  await t.test("handles default value", () => {
    assert.strictEqual(escapeHtmlText(), "");
  });

  await t.test("returns string unchanged if no special characters", () => {
    assert.strictEqual(escapeHtmlText("hello world"), "hello world");
  });
});
