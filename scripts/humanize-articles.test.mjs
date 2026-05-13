import test from "node:test";
import assert from "node:assert";
import { countOccurrences } from "./humanize-articles.mjs";

test("countOccurrences", async (t) => {
  await t.test("returns 0 for empty search string", () => {
    assert.strictEqual(countOccurrences("hello world", ""), 0);
  });

  await t.test("returns 0 for null search string", () => {
    assert.strictEqual(countOccurrences("hello world", null), 0);
  });

  await t.test("returns 0 when no match is found", () => {
    assert.strictEqual(countOccurrences("hello world", "foo"), 0);
  });

  await t.test("counts single occurrence correctly", () => {
    assert.strictEqual(countOccurrences("hello world", "hello"), 1);
  });

  await t.test("counts multiple occurrences correctly", () => {
    assert.strictEqual(countOccurrences("hello hello hello", "hello"), 3);
  });

  await t.test("handles non-overlapping matches correctly", () => {
    // "aaa" in "aaaaa"
    // matches at index 0: "aaa", next index 3
    // remaining "aa", no match
    assert.strictEqual(countOccurrences("aaaaa", "aaa"), 1);
  });

  await t.test("handles empty text correctly", () => {
    assert.strictEqual(countOccurrences("", "hello"), 0);
  });
});
