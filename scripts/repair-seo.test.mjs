import test from "node:test";
import assert from "node:assert";
import { ensureSentence } from "./repair-seo.mjs";

test("ensureSentence", async (t) => {
  await t.test("adds a period to a sentence without punctuation", () => {
    assert.strictEqual(ensureSentence("Hello world"), "Hello world.");
  });

  await t.test("does not add a period to a sentence already ending with a period", () => {
    assert.strictEqual(ensureSentence("Hello world."), "Hello world.");
  });

  await t.test("does not add a period to a sentence ending with an exclamation mark", () => {
    assert.strictEqual(ensureSentence("Hello world!"), "Hello world!");
  });

  await t.test("does not add a period to a sentence ending with a question mark", () => {
    assert.strictEqual(ensureSentence("Hello world?"), "Hello world?");
  });

  await t.test("does not add a period to a sentence ending with an ellipsis", () => {
    assert.strictEqual(ensureSentence("Hello world…"), "Hello world…");
  });

  await t.test("does not add a period to a sentence ending with a closing guillemet", () => {
    assert.strictEqual(ensureSentence("Hello world»"), "Hello world»");
  });

  await t.test("does not add a period to a sentence ending with a closing double quote", () => {
    assert.strictEqual(ensureSentence("Hello world”"), "Hello world”");
  });

  await t.test("returns falsy values as-is", () => {
    assert.strictEqual(ensureSentence(""), "");
    assert.strictEqual(ensureSentence(null), null);
    assert.strictEqual(ensureSentence(undefined), undefined);
  });
});
