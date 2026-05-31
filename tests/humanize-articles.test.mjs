import test from "node:test";
import assert from "node:assert";
import { hashString, pickVariant, countOccurrences } from "../scripts/humanize-articles.mjs";

test("hashString", () => {
  assert.strictEqual(typeof hashString("test"), "number");
  assert.ok(hashString("test") > 0);
  // Consistent hashing
  assert.strictEqual(hashString("foo"), hashString("foo"));
  assert.notStrictEqual(hashString("foo"), hashString("bar"));
});

test("pickVariant", () => {
  const variants = ["a", "b", "c"];
  const key = "some_key";
  const result = pickVariant(variants, key);
  assert.ok(variants.includes(result));
  assert.strictEqual(pickVariant([], "key"), "");
  assert.strictEqual(pickVariant(["a"], "key"), "a");

  // Deterministic pick
  assert.strictEqual(pickVariant(variants, key), result);
});

test("countOccurrences", () => {
  assert.strictEqual(countOccurrences("foo bar foo", "foo"), 2);
  assert.strictEqual(countOccurrences("foo bar", "baz"), 0);
  assert.strictEqual(countOccurrences("foo", ""), 0);
  assert.strictEqual(countOccurrences("hello world", "l"), 3);
});
