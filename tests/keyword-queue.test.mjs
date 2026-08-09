import test from "node:test";
import assert from "node:assert";
import { parseDateTime, formatDateTime, addDays, escapeCsv } from "../scripts/keyword-queue.mjs";

test("parseDateTime parses valid datetime string", () => {
  const date = parseDateTime("2024-05-12 14:30");
  assert.strictEqual(date.getFullYear(), 2024);
  assert.strictEqual(date.getMonth(), 4); // May is 4
  assert.strictEqual(date.getDate(), 12);
  assert.strictEqual(date.getHours(), 14);
  assert.strictEqual(date.getMinutes(), 30);
});

test("formatDateTime formats date to string", () => {
  const date = new Date(2024, 4, 12, 14, 30, 0, 0); // May 12, 2024, 14:30
  const str = formatDateTime(date);
  assert.strictEqual(str, "2024-05-12 14:30");
});

test("addDays adds specified number of days", () => {
  const date = new Date(2024, 4, 12, 14, 30, 0, 0); // May 12, 2024
  const nextDate = addDays(date, 3);
  assert.strictEqual(nextDate.getFullYear(), 2024);
  assert.strictEqual(nextDate.getMonth(), 4);
  assert.strictEqual(nextDate.getDate(), 15);
  assert.strictEqual(nextDate.getHours(), 14);
});

test("addDays handles negative days", () => {
  const date = new Date(2024, 4, 12, 14, 30, 0, 0); // May 12, 2024
  const prevDate = addDays(date, -3);
  assert.strictEqual(prevDate.getFullYear(), 2024);
  assert.strictEqual(prevDate.getMonth(), 4);
  assert.strictEqual(prevDate.getDate(), 9);
  assert.strictEqual(prevDate.getHours(), 14);
});

test("escapeCsv escapes strings correctly", () => {
  assert.strictEqual(escapeCsv("simple"), "simple");
  assert.strictEqual(escapeCsv("with,comma"), '"with,comma"');
  assert.strictEqual(escapeCsv('with"quote'), '"with""quote"');
  assert.strictEqual(escapeCsv("with\nnewline"), '"with\nnewline"');
});

test("parseDateTime throws on invalid datetime string", () => {
  assert.throws(() => parseDateTime("invalid-date"), /Invalid datetime: invalid-date/);
});
