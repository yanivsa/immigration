import test from "node:test";
import assert from "node:assert";
import { extractAttribute } from "../scripts/seo-fix.mjs";

test("extractAttribute extracts attribute value enclosed in double quotes", () => {
  const tag = '<img src="image.jpg" alt="A beautiful scenery">';
  assert.strictEqual(extractAttribute(tag, "alt"), "A beautiful scenery");
});

test("extractAttribute extracts attribute value enclosed in single quotes", () => {
  const tag = "<a href='https://example.com' title='Example'>Link</a>";
  assert.strictEqual(extractAttribute(tag, "href"), "https://example.com");
});

test("extractAttribute returns an empty string if attribute is missing", () => {
  const tag = '<script src="app.js"></script>';
  assert.strictEqual(extractAttribute(tag, "async"), "");
});

test("extractAttribute returns an empty string if tag is falsy", () => {
  assert.strictEqual(extractAttribute(null, "class"), "");
  assert.strictEqual(extractAttribute(undefined, "class"), "");
  assert.strictEqual(extractAttribute("", "class"), "");
});

test("extractAttribute decodes HTML entities in attribute value", () => {
  const tag = '<a title="Tom &amp; Jerry">Cartoon</a>';
  assert.strictEqual(extractAttribute(tag, "title"), "Tom & Jerry");
});
