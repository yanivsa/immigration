import test from "node:test";
import assert from "node:assert";
import { splitSentences } from "../scripts/seo-fix.mjs";

test("splitSentences handles empty text", () => {
  assert.deepStrictEqual(splitSentences(""), []);
});

test("splitSentences handles single sentence", () => {
  assert.deepStrictEqual(splitSentences("Hello world."), ["Hello world."]);
});

test("splitSentences splits multiple sentences", () => {
  assert.deepStrictEqual(splitSentences("First sentence. Second sentence! Third sentence?"), ["First sentence.", "Second sentence!", "Third sentence?"]);
});

test("splitSentences normalizes whitespace", () => {
  assert.deepStrictEqual(splitSentences("  First   sentence.  Second   sentence. "), ["First sentence.", "Second sentence."]);
});
