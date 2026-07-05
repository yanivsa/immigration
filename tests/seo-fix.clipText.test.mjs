import test from "node:test";
import assert from "node:assert";
import { clipText } from "../scripts/seo-fix.mjs";

test("clipText shortens text over max length", () => {
  const input = "This is a very long text that should be clipped at the word boundary and definitely not exceed the maximum length specified by the clipText function because it is too long.";
  const expected = "This is a very long text that should be clipped at the word boundary and definitely not exceed the maximum length specified by the clipText function";
  assert.strictEqual(clipText(input, 155), expected);
});

test("clipText handles short text without clipping", () => {
  const input = "Short text.";
  const expected = "Short text.";
  assert.strictEqual(clipText(input, 155), expected);
});

test("clipText handles undefined", () => {
  assert.strictEqual(clipText(undefined, 155), "");
});
