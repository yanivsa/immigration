import test from "node:test";
import assert from "node:assert";
import { pickVariant, hashString } from "./humanize-articles.mjs";

test("pickVariant", async (t) => {
  await t.test("returns empty string if variants array is empty", () => {
    assert.strictEqual(pickVariant([], "key"), "");
  });

  await t.test("returns the single item if variants array has only 1 item", () => {
    assert.strictEqual(pickVariant(["only-one"], "key"), "only-one");
  });

  await t.test("returns item based on hash if variants array has > 1 items", () => {
    const variants = ["v1", "v2", "v3", "v4"];

    // We can pre-calculate hashes to verify
    const key1 = "a"; // Let's just trust the function for a second
    const result1 = pickVariant(variants, key1);
    assert.ok(variants.includes(result1));

    // Calculate index manually
    const index1 = hashString(key1) % variants.length;
    assert.strictEqual(result1, variants[index1]);
  });

  await t.test("returns consistent item for same key", () => {
    const variants = ["v1", "v2", "v3", "v4"];
    assert.strictEqual(pickVariant(variants, "some-key"), pickVariant(variants, "some-key"));
    assert.strictEqual(pickVariant(variants, "another-key"), pickVariant(variants, "another-key"));
  });

  await t.test("handles numeric and different string keys properly", () => {
    const variants = ["a", "b"];
    const r1 = pickVariant(variants, "123");
    const r2 = pickVariant(variants, 123 + "");
    assert.strictEqual(r1, r2);
  });
});
