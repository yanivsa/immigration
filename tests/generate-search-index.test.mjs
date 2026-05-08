import test from "node:test";
import assert from "node:assert";
import { extractTag } from "../scripts/generate-search-index.mjs";

test("extractTag", async (t) => {
  await t.test("returns empty string when no match is found", () => {
    const html = "<div>No match here</div>";
    const regex = /<title>(.*?)<\/title>/;
    assert.strictEqual(extractTag(html, regex), "");
  });

  await t.test("extracts and normalizes text from a matched tag", () => {
    const html = "<title>  Hello   World  </title>";
    const regex = /<title>(.*?)<\/title>/;
    assert.strictEqual(extractTag(html, regex), "Hello World");
  });

  await t.test("strips HTML tags within the extracted content", () => {
    const html = "<h1>  Hello <span>World</span>  </h1>";
    const regex = /<h1>(.*?)<\/h1>/;
    assert.strictEqual(extractTag(html, regex), "Hello World");
  });

  await t.test("decodes HTML entities within the extracted content", () => {
    const html = "<p>Hello &amp; Welcome to &quot;My&quot; World</p>";
    const regex = /<p>(.*?)<\/p>/;
    assert.strictEqual(extractTag(html, regex), "Hello & Welcome to \"My\" World");
  });
});
