import test from "node:test";
import assert from "node:assert";
import { ensureSentence, clampText } from "../scripts/seo-remediate.mjs";

test("ensureSentence - appends period if missing", () => {
  assert.strictEqual(ensureSentence("Hello world"), "Hello world.");
  assert.strictEqual(ensureSentence("Hello world  "), "Hello world.");
});

test("ensureSentence - does not append period if punctuation exists", () => {
  assert.strictEqual(ensureSentence("Hello world."), "Hello world.");
  assert.strictEqual(ensureSentence("Hello world!"), "Hello world!");
  assert.strictEqual(ensureSentence("Hello world?"), "Hello world?");
  assert.strictEqual(ensureSentence("Hello world»"), "Hello world»");
  assert.strictEqual(ensureSentence("Hello world”"), "Hello world”");
  assert.strictEqual(ensureSentence("Hello world\""), "Hello world\"");
});

test("ensureSentence - returns empty string or trimmed string for falsy/empty values", () => {
  assert.strictEqual(ensureSentence(""), "");
  assert.strictEqual(ensureSentence("   "), "");
});

test("clampText - does nothing if under max limit", () => {
  const text = "This is a short text.";
  assert.strictEqual(clampText(text), text);
});

test("clampText - clamps at exactly max limit and ensures sentence", () => {
  const text = "a".repeat(155);
  assert.strictEqual(clampText(text), text + ".");
});

test("clampText - trims to last space if above limit and last space is > 90", () => {
  // 156 characters. Space at index 100.
  const part1 = "a".repeat(100);
  const part2 = "b".repeat(55); // part2 + extra will make sliced length 156.
  // "a"*100 + " " + "b"*55 = 156 chars. sliced is this exact string.
  // lastSpace is 100. It slices to 100, which is "a"*100.
  const text = `${part1} ${part2} extra`;
  assert.strictEqual(clampText(text), `${part1}.`);
});

test("clampText - hard clamps if last space is <= 90", () => {
  // Space at index 50
  const part1 = "a".repeat(50);
  const part2 = "b".repeat(110);
  const text = `${part1} ${part2} extra`;
  // sliced is length 156. Space at 50 is <= 90.
  // It hard clamps at 155. So it takes sliced.slice(0, 155).
  const expected = `${part1} ${part2.slice(0, 104)}.`;
  assert.strictEqual(clampText(text), expected);
});

test("clampText - cleans up trailing punctuation after clamping", () => {
  const part1 = "a".repeat(100);
  const part2 = "b".repeat(45) + ",";
  // The first 156 characters includes part1, space, part2, space, "extra" and space "te".
  // Space is at 153. It will slice to 153, which is `part1 part2 extra`.
  const text = `${part1} ${part2} extra text goes here to make it long`;
  assert.strictEqual(clampText(text), `${part1} ${part2} extra.`);
});

test("clampText - returns empty string for empty input", () => {
  assert.strictEqual(clampText(""), "");
  assert.strictEqual(clampText("   "), "");
});
