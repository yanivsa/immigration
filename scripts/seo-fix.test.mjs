import test from "node:test";
import assert from "node:assert";
import { clipText } from "./seo-fix.mjs";

test("clipText handles basic truncation at word boundaries", () => {
  const input = "This is a simple sentence that should be clipped right about here or maybe a little bit further depending on the text length and max threshold.";
  const max = 40;

  const result = clipText(input, max);
  assert.strictEqual(result, "This is a simple sentence that should be");
});

test("clipText does not clip if under or equal to max", () => {
  assert.strictEqual(clipText("Short string", 50), "Short string");
  assert.strictEqual(clipText("Exactly ten!", 12), "Exactly ten!");
});

test("clipText normalizes whitespace and strips trailing punctuation", () => {
  assert.strictEqual(clipText("   Hello   world,;   ", 50), "Hello world");
});

test("clipText clips without word boundary if space is too early", () => {
  assert.strictEqual(clipText("Averylongword thatgoes beyond limits", 10), "Averylongw");
});

test("clipText strips trailing punctuation after clipping", () => {
  assert.strictEqual(clipText("Hello world, testing", 15), "Hello world");
});
