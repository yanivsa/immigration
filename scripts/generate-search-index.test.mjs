import test from "node:test";
import assert from "node:assert";
import { unique } from "./generate-search-index.mjs";

test("unique", async (t) => {
  await t.test("removes duplicates from an array", () => {
    const input = ["apple", "banana", "apple", "orange"];
    const expected = ["apple", "banana", "orange"];
    assert.deepStrictEqual(unique(input), expected);
  });

  await t.test("removes falsy values", () => {
    const input = ["apple", "", null, undefined, false, 0, "banana"];
    const expected = ["apple", "banana"];
    assert.deepStrictEqual(unique(input), expected);
  });

  await t.test("returns empty array for all falsy input", () => {
    const input = [null, undefined, false, 0, ""];
    const expected = [];
    assert.deepStrictEqual(unique(input), expected);
  });

  await t.test("handles empty array", () => {
    const input = [];
    const expected = [];
    assert.deepStrictEqual(unique(input), expected);
  });

  await t.test("preserves order of first appearance", () => {
    const input = ["c", "a", "b", "a", "c", "d"];
    const expected = ["c", "a", "b", "d"];
    assert.deepStrictEqual(unique(input), expected);
  });
});
