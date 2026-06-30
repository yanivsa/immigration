import test from "node:test";
import assert from "node:assert";
import { normalizeWhitespace } from "../scripts/seo-fix.mjs";

test("normalizeWhitespace removes extra spaces and trims", () => {
  const input = "  this   is \n a \t test  ";
  const expected = "this is a test";
  assert.strictEqual(normalizeWhitespace(input), expected);
});

test("normalizeWhitespace handles empty string", () => {
  const input = "";
  const expected = "";
  assert.strictEqual(normalizeWhitespace(input), expected);
});

test("normalizeWhitespace handles undefined", () => {
  const expected = "";
  assert.strictEqual(normalizeWhitespace(undefined), expected);
});
