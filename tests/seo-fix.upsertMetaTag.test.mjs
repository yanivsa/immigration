import test from "node:test";
import assert from "node:assert";
import { upsertMetaTag } from "../scripts/seo-fix.mjs";

test("upsertMetaTag adds meta tag if missing", () => {
  const html = `<head><title>Test</title></head>`;
  const result = upsertMetaTag(html, "description", "test description");
  assert.ok(result.includes('<meta name="description" content="test description" />'));
});

test("upsertMetaTag updates existing meta tag", () => {
  const html = `<head>\n  <meta name="description" content="old">\n  <title>Test</title>\n</head>`;
  const result = upsertMetaTag(html, "description", "new desc");
  assert.ok(result.includes('<meta name="description" content="new desc" />'));
  assert.ok(!result.includes('content="old"'));
});

test("upsertMetaTag works with properties like og:title", () => {
  const html = `<head><title>Test</title></head>`;
  const result = upsertMetaTag(html, "og:title", "test title", "property");
  assert.ok(result.includes('<meta property="og:title" content="test title" />'));
});
