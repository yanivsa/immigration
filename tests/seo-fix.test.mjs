import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { toPathname } from "../scripts/seo-fix.mjs";

describe("toPathname", () => {
  it("should return / for index.html", () => {
    assert.equal(toPathname("index.html"), "/");
  });

  it("should return correct path for nested index.html", () => {
    assert.equal(toPathname("en/index.html"), "/en/");
    assert.equal(toPathname("ru/services/index.html"), "/ru/services/");
  });

  it("should return correct path for regular html files", () => {
    assert.equal(toPathname("about.html"), "/about");
    assert.equal(toPathname("contact.html"), "/contact");
  });

  it("should return correct path for nested html files", () => {
    assert.equal(toPathname("en/about.html"), "/en/about");
    assert.equal(toPathname("ua/articles/article-32.html"), "/ua/articles/article-32");
  });
});
