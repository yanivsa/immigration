import test from "node:test";
import assert from "node:assert";
import { extractParagraphCandidates } from "../scripts/seo-fix.mjs";

test("extractParagraphCandidates ignores short paragraphs", () => {
  const html =
    "<main><p>Too short.</p><p>This paragraph is intentionally made long enough to pass the forty-five character threshold.</p></main>";
  const candidates = extractParagraphCandidates(html);
  assert.strictEqual(candidates.length, 1);
  assert.strictEqual(
    candidates[0],
    "This paragraph is intentionally made long enough to pass the forty-five character threshold.",
  );
});

test("extractParagraphCandidates ignores excluded texts", () => {
  const html =
    "<main><p>General information only, this is a disclaimer that is definitely longer than forty-five characters.</p><p>Valid content that is also long enough to be considered a candidate.</p></main>";
  const candidates = extractParagraphCandidates(html);
  assert.strictEqual(candidates.length, 1);
  assert.strictEqual(
    candidates[0],
    "Valid content that is also long enough to be considered a candidate.",
  );
});

test("extractParagraphCandidates dedupes candidates", () => {
  const html =
    "<main><p>This is a duplicate paragraph that is long enough to be included.</p><p>This is a duplicate paragraph that is long enough to be included.</p></main>";
  const candidates = extractParagraphCandidates(html);
  assert.strictEqual(candidates.length, 1);
  assert.strictEqual(
    candidates[0],
    "This is a duplicate paragraph that is long enough to be included.",
  );
});
