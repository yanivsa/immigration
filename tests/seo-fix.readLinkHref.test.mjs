import test from "node:test";
import assert from "node:assert";
import { readLinkHref } from "../scripts/seo-fix.mjs";

test("readLinkHref reads standard link href", () => {
  const html = '<html><head><link rel="canonical" href="https://example.com/page"></head></html>';
  assert.strictEqual(readLinkHref(html, "canonical"), "https://example.com/page");
});

test("readLinkHref handles single quotes", () => {
  const html = "<html><head><link rel='alternate' href='https://example.com/alt'></head></html>";
  assert.strictEqual(readLinkHref(html, "alternate"), "https://example.com/alt");
});

test("readLinkHref handles missing link tags", () => {
  const html = "<html><head></head></html>";
  assert.strictEqual(readLinkHref(html, "canonical"), "");
});

test("readLinkHref handles empty href", () => {
  const html = '<html><head><link rel="canonical" href=""></head></html>';
  assert.strictEqual(readLinkHref(html, "canonical"), "");
});
