import test from "node:test";
import assert from "node:assert";
import { toAbsoluteUrl } from "../scripts/seo-fix.mjs";

test("toAbsoluteUrl generates absolute url for index.html", () => {
  assert.strictEqual(toAbsoluteUrl("index.html"), "https://immigration.the-israeli-lawyer.com/");
});

test("toAbsoluteUrl generates absolute url for regular html page", () => {
  assert.strictEqual(toAbsoluteUrl("about.html"), "https://immigration.the-israeli-lawyer.com/about");
  assert.strictEqual(toAbsoluteUrl("en/articles/index.html"), "https://immigration.the-israeli-lawyer.com/en/articles/");
});
