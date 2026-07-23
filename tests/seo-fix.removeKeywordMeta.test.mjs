import test from "node:test";
import assert from "node:assert";
import { removeKeywordMeta } from "../scripts/seo-fix.mjs";

test("removeKeywordMeta removes keywords meta tag from head", () => {
  const head = '<head><meta name="keywords" content="test, keyword"><title>Test</title></head>';
  const expected = '<head><title>Test</title></head>';
  assert.strictEqual(removeKeywordMeta(head), expected);
});

test("removeKeywordMeta handles empty head safely", () => {
  const head = '<head></head>';
  assert.strictEqual(removeKeywordMeta(head), head);
});

test("removeKeywordMeta handles single quotes and spaces", () => {
  const head = "<head><meta  name='keywords'  content='test' ></head>";
  const expected = '<head></head>';
  assert.strictEqual(removeKeywordMeta(head), expected);
});
