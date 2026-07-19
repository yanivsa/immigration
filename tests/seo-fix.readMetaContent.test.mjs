import test from "node:test";
import assert from "node:assert";
import { readMetaContent } from "../scripts/seo-fix.mjs";

test("readMetaContent reads standard meta content", () => {
  const html = '<html><head><meta name="description" content="A great page"></head></html>';
  assert.strictEqual(readMetaContent(html, "description"), "A great page");
});

test("readMetaContent handles different quotes", () => {
  const html = "<html><head><meta name='author' content='John Doe'></head></html>";
  assert.strictEqual(readMetaContent(html, "author"), "John Doe");
});

test("readMetaContent handles missing tags", () => {
  const html = "<html><head></head></html>";
  assert.strictEqual(readMetaContent(html, "description"), "");
});

test("readMetaContent decodes entities in content", () => {
  const html = '<html><head><meta name="description" content="Fish &amp; Chips"></head></html>';
  assert.strictEqual(readMetaContent(html, "description"), "Fish & Chips");
});

test("readMetaContent uses custom attribute", () => {
  const html = '<html><head><meta property="og:title" content="My Title"></head></html>';
  assert.strictEqual(readMetaContent(html, "og:title", "property"), "My Title");
});
