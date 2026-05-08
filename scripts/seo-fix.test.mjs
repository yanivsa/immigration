import test from "node:test";
import assert from "node:assert";
import { normalizeWhitespace } from "./seo-fix.mjs";

test("normalizeWhitespace", async (t) => {
  await t.test("handles undefined", () => {
    assert.strictEqual(normalizeWhitespace(), "");
  });

  await t.test("removes leading and trailing whitespace", () => {
    assert.strictEqual(normalizeWhitespace("  hello world  "), "hello world");
  });

  await t.test("replaces multiple spaces with a single space", () => {
    assert.strictEqual(normalizeWhitespace("hello    world"), "hello world");
  });

  await t.test("replaces tabs with a single space", () => {
    assert.strictEqual(normalizeWhitespace("hello\tworld"), "hello world");
  });

  await t.test("replaces newlines with a single space", () => {
    assert.strictEqual(normalizeWhitespace("hello\nworld"), "hello world");
  });

  await t.test("handles combination of whitespaces", () => {
    assert.strictEqual(normalizeWhitespace("  \nhello \t  \n  world\n  "), "hello world");
  });
});
