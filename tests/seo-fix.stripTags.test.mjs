import test from "node:test";
import assert from "node:assert";
import { stripTags } from "../scripts/seo-fix.mjs";

test("stripTags removes HTML tags and decodes entities", () => {
  assert.strictEqual(stripTags("<p>Hello &amp; welcome!</p>").trim(), "Hello & welcome!");
  assert.strictEqual(stripTags("<div><script>alert('xss');</script>Safe</div>").trim(), "Safe");
  assert.strictEqual(stripTags("<style>body { color: red; }</style>Content").trim(), "Content");
});
