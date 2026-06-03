import test from "node:test";
import assert from "node:assert";
import { extractMainHtml } from "../scripts/seo-fix.mjs";

test("extractMainHtml extracts content inside <main>", () => {
  const html = "<html><body><header>head</header><main><p>main content</p></main><footer>foot</footer></body></html>";
  const expected = "<p>main content</p>";
  assert.strictEqual(extractMainHtml(html), expected);
});

test("extractMainHtml falls back to <body> if <main> is missing", () => {
  const html = "<html><body><p>body content</p></body></html>";
  const expected = "<p>body content</p>";
  assert.strictEqual(extractMainHtml(html), expected);
});

test("extractMainHtml returns original html if both <main> and <body> are missing", () => {
  const html = "<div>Just some div</div>";
  assert.strictEqual(extractMainHtml(html), html);
});
