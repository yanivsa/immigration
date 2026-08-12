import test from "node:test";
import assert from "node:assert";
import { extractFirstImageMeta } from "../scripts/seo-fix.mjs";

test("extractFirstImageMeta extracts src and alt from first image", () => {
  const html = '<html><body><img src="https://example.com/image.jpg" alt="Test Image"></body></html>';
  const result = extractFirstImageMeta(html, "index.html");
  assert.strictEqual(result.src, "https://example.com/image.jpg");
  assert.strictEqual(result.alt, "Test Image");
});

test("extractFirstImageMeta handles missing image tags", () => {
  const html = '<html><body>No image here</body></html>';
  const result = extractFirstImageMeta(html, "index.html");
  assert.ok(result.src.includes("law-office-scales-gavel-ashdod.jpg"));
  assert.strictEqual(result.alt, "Immigration law office in Ashdod");
});
