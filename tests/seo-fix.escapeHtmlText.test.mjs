import test from "node:test";
import assert from "node:assert";
import { escapeHtmlText } from "../scripts/seo-fix.mjs";

test("escapeHtmlText escapes HTML characters correctly", () => {
  assert.strictEqual(escapeHtmlText("Tom & Jerry"), "Tom &amp; Jerry");
  assert.strictEqual(escapeHtmlText("<script>alert(1)</script>"), "&lt;script&gt;alert(1)&lt;/script&gt;");
  assert.strictEqual(escapeHtmlText("No special chars here."), "No special chars here.");
  assert.strictEqual(escapeHtmlText(""), "");
});

test("escapeHtmlText handles undefined input safely", () => {
  assert.strictEqual(escapeHtmlText(undefined), "");
});
