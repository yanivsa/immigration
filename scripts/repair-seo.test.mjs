import test from "node:test";
import assert from "node:assert";
import { trimAtWord } from "./repair-seo.mjs";

test("trimAtWord", async (t) => {
  await t.test("returns value if length <= max", () => {
    assert.strictEqual(trimAtWord("hello world", 15), "hello world");
    assert.strictEqual(trimAtWord("hello world", 11), "hello world");
  });

  await t.test("trims at space and removes trailing punctuation", () => {
    // max=11 "hello world!" -> length 12
    // slice(0, 12) -> "hello world!"
    // best is 5 (space). 60% of 11 is 6.
    // 5 > 6 is false. cutoff = max = 11.
    // slice(0, 11) -> "hello world"
    assert.strictEqual(trimAtWord("hello world!", 11), "hello world");

    // Test standard cutoff matching > 60% max
    // "this is a long text", max=14. 60% of 14 = 8.
    // slice(0, 15) -> "this is a long ". lastIndexOf(" ") -> 14.
    // 14 > 8 is true. cutoff = 14.
    // slice(0, 14) -> "this is a long" -> replace punctuation/space -> "this is a long"
    assert.strictEqual(trimAtWord("this is a long text", 14), "this is a long");
  });

  await t.test("trims at hyphen", () => {
    // "multi-part-word", max=12. 60% of 12 = 7.
    // slice(0, 13) -> "multi-part-wo". lastIndexOf("-") -> 10.
    // 10 > 7 is true. cutoff = 10.
    // slice(0, 10) -> "multi-part"
    assert.strictEqual(trimAtWord("multi-part-word", 12), "multi-part");
  });

  await t.test("trims at en dash", () => {
    assert.strictEqual(trimAtWord("something–else entirely", 12), "something");
  });

  await t.test("trims at em dash", () => {
    assert.strictEqual(trimAtWord("something—else entirely", 12), "something");
  });

  await t.test("trims at maqaf (Hebrew hyphen)", () => {
    // "בדיקה־נוספת כאן", length=15. max=12. 60% of 12 = 7.
    // slice(0, 13) -> "בדיקה־נוספת כ"
    // best = 11 (space). 11 > 7 is true. cutoff = 11.
    // slice(0, 11) -> "בדיקה־נוספת"
    assert.strictEqual(trimAtWord("בדיקה־נוספת כאן", 12), "בדיקה־נוספת");

    // To trigger maqaf:
    // "בדיקה־נוספת כאן", max=10. 60% of 10 = 6.
    // slice(0, 11) -> "בדיקה־נוספת".
    // best is maqaf at 5. 5 > 6 is false. cutoff = max = 10.
    // slice(0, 10) -> "בדיקה־נוספ"
    assert.strictEqual(trimAtWord("בדיקה־נוספת כאן", 10), "בדיקה־נוספ");

    // Let's ensure maqaf is chosen > 60% max.
    // "בדיקות־עוד כאן", max=9. 60% of 9 = 5.
    // slice(0, 10) -> "בדיקות־עוד"
    // maqaf at 6. 6 > 5 is true. cutoff = 6.
    // slice(0, 6) -> "בדיקות", replace -> "בדיקות"
    assert.strictEqual(trimAtWord("בדיקות־עוד כאן", 9), "בדיקות");
  });

  await t.test("falls back to hard cutoff if best breakpoint is too early (<60% of max)", () => {
    // max=10. 60% of 10 is 6.
    // "a verylongword"
    // slice(0, 11) is "a verylongw". Breakpoint at space is 1.
    // best = 1. 1 is NOT > 6, so cutoff is max (10).
    // slice(0, 10) is "a verylong".
    assert.strictEqual(trimAtWord("a verylongword", 10), "a verylong");
  });

  await t.test("strips multiple trailing punctuation characters", () => {
    // "hello ;:,.- world", max=13. 60% of 13 = 7.
    // slice(0, 14) -> "hello ;:,.- wo"
    // best is space at 11. 11 > 7 is true.
    // cutoff = 11.
    // slice(0, 11) -> "hello ;:,.-"
    // replace trailing -> "hello"
    assert.strictEqual(trimAtWord("hello ;:,.- world", 13), "hello");
  });
});
