import test from "node:test";
import assert from "node:assert";
import { extractAttribute } from "../scripts/seo-fix.mjs";

test("extractAttribute extracts standard attribute", () => {
  assert.strictEqual(extractAttribute('<a href="https://example.com">', "href"), "https://example.com");
});

test("extractAttribute handles empty tag", () => {
  assert.strictEqual(extractAttribute("", "href"), "");
});

test("extractAttribute handles undefined tag", () => {
  assert.strictEqual(extractAttribute(undefined, "href"), "");
});

test("extractAttribute returns empty string if attribute not found", () => {
  assert.strictEqual(extractAttribute('<a href="https://example.com">', "title"), "");
});
