import test from "node:test";
import assert from "node:assert";
import { promises as fs } from "fs";
import { readJson } from "./generate-search-index.mjs";

test("readJson parses valid JSON successfully", async () => {
  const originalReadFile = fs.readFile;
  fs.readFile = async () => '{"status":"ok"}';
  try {
    const result = await readJson("dummy-file.json");
    assert.deepStrictEqual(result, { status: "ok" });
  } finally {
    fs.readFile = originalReadFile;
  }
});

test("readJson returns null when reading fails", async () => {
  const originalReadFile = fs.readFile;
  fs.readFile = async () => { throw new Error("mock file read error"); };
  try {
    const result = await readJson("dummy-file.json");
    assert.strictEqual(result, null);
  } finally {
    fs.readFile = originalReadFile;
  }
});

test("readJson returns null when parsing fails", async () => {
  const originalReadFile = fs.readFile;
  fs.readFile = async () => '{invalid-json}';
  try {
    const result = await readJson("dummy-file.json");
    assert.strictEqual(result, null);
  } finally {
    fs.readFile = originalReadFile;
  }
});
