import test from "node:test";
import assert from "node:assert";
import { extractLang } from "./generate-search-index.mjs";

test("extractLang", async (t) => {
  await t.test("extracts lang correctly from double quotes", () => {
    const html = '<html lang="en-US">';
    const lang = extractLang(html);
    assert.strictEqual(lang, "en");
  });

  await t.test("extracts lang correctly from single quotes", () => {
    const html = "<html lang='ru-RU'>";
    const lang = extractLang(html);
    assert.strictEqual(lang, "ru");
  });

  await t.test("extracts lang from uppercase html tags and attributes", () => {
    const html = '<HTML LANG="UA">';
    const lang = extractLang(html);
    assert.strictEqual(lang, "ua");
  });

  await t.test("extracts lang with other attributes in html tag", () => {
    const html = '<html dir="ltr" lang="he">';
    const lang = extractLang(html);
    assert.strictEqual(lang, "he");
  });

  await t.test("returns empty string when lang attribute is missing", () => {
    const html = '<html>';
    const lang = extractLang(html);
    assert.strictEqual(lang, "");
  });

  await t.test("returns empty string when html tag is missing", () => {
    const html = '<body><p>Hello</p></body>';
    const lang = extractLang(html);
    assert.strictEqual(lang, "");
  });
});
