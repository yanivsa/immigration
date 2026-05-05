import test from "node:test";
import assert from "node:assert";
import { clipText, normalizeWhitespace } from "./seo-fix.mjs";

test("normalizeWhitespace", (t) => {
  assert.strictEqual(normalizeWhitespace("  hello   world  "), "hello world");
  assert.strictEqual(normalizeWhitespace("no-spaces"), "no-spaces");
  assert.strictEqual(normalizeWhitespace(""), "");
  assert.strictEqual(normalizeWhitespace(), "");
});

test("clipText - short text", (t) => {
  const shortText = "This is a short string.";
  assert.strictEqual(clipText(shortText, 155), shortText);
});

test("clipText - exact length text", (t) => {
  const text = "a".repeat(155);
  assert.strictEqual(clipText(text, 155), text);
});

test("clipText - long text clips at last space", (t) => {
  // Total length is around 25 chars. Max is 20. Last space is at index 15.
  // Math.floor(20 * 0.6) = 12. So 15 > 12. It should clip at index 15.
  const text = "01234567891234 6789012345";
  assert.strictEqual(clipText(text, 20), "01234567891234");
});

test("clipText - long text clips at max if space is too early", (t) => {
  // Total length > 20. Max is 20. Space is at index 10.
  // Math.floor(20 * 0.6) = 12. Space is 10 <= 12, so it clips at exact max.
  const text = "0123456789 23456789012345";
  assert.strictEqual(clipText(text, 20), "0123456789 234567890");
});

test("clipText - long text without spaces clips at exact max", (t) => {
  const text = "a".repeat(200);
  assert.strictEqual(clipText(text, 155), "a".repeat(155));
});

test("clipText - removes trailing punctuation after clipping", (t) => {
  // Space is at index 15.
  // text.slice(0, 15) is "01234567891234," which ends in comma.
  // The trailing punctuation should be removed.
  const text = "01234567891234, 789012345";
  assert.strictEqual(clipText(text, 20), "01234567891234");
});

test("clipText - removes trailing punctuation on exact clip", (t) => {
  // length 21 string, max 20, no spaces. Character at 19 is a comma.
  const text = "0123456789123456789,0";
  assert.strictEqual(clipText(text, 20), "0123456789123456789");
});

test("clipText - default max length is 155", (t) => {
  const text = "a".repeat(200);
  assert.strictEqual(clipText(text).length, 155);
});
