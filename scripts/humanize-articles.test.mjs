import test from "node:test";
import assert from "node:assert";
import { hashString } from "./humanize-articles.mjs";

test("hashString", async (t) => {
  await t.test("generates reproducible hash for empty string", () => {
    assert.strictEqual(hashString(""), 5381);
  });

  await t.test("generates reproducible hashes for strings", () => {
    assert.strictEqual(hashString("hello"), 178056679);
    assert.strictEqual(hashString("world"), 191451879);
    assert.strictEqual(hashString("hello"), 178056679); // Ensure reproducibility
  });

  await t.test("distinguishes similar strings", () => {
    assert.notStrictEqual(hashString("test"), hashString("Test"));
    assert.notStrictEqual(hashString("abc"), hashString("abd"));
  });

  await t.test("handles long strings", () => {
    const longString = "a".repeat(1000);
    const hash1 = hashString(longString);
    const hash2 = hashString(longString);
    assert.strictEqual(hash1, hash2);
    assert.ok(hash1 > 0);
  });

  await t.test("always returns a positive integer", () => {
    // Generate a lot of variations to try and force a negative result
    // if the unsigned right shift (>>> 0) is removed
    const cases = ["", "a", "A", "hello world!", "\u2603", "\u0000"];
    for (const c of cases) {
      const hash = hashString(c);
      assert.ok(Number.isInteger(hash), `Hash should be integer for ${c}`);
      assert.ok(hash >= 0, `Hash should be positive for ${c}`);
    }
  });
});
