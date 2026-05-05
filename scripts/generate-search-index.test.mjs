import test from "node:test";
import assert from "node:assert";
import { clusterOf } from "./generate-search-index.mjs";

test("clusterOf - maps service paths to clusters correctly", () => {
  assert.strictEqual(clusterOf("services/work-visas.html"), "work-visas");
  assert.strictEqual(clusterOf("services/citizenship.html"), "citizenship-status");
  assert.strictEqual(clusterOf("services/tourist-visas.html"), "tourist-entry");
  assert.strictEqual(clusterOf("services/entry-permits.html"), "tourist-entry");
  assert.strictEqual(clusterOf("services/ben-gurion-emergency.html"), "ben-gurion-emergency");
});

test("clusterOf - maps article hub paths to clusters correctly", () => {
  assert.strictEqual(clusterOf("articles/work-visas/index.html"), "work-visas");
  assert.strictEqual(clusterOf("articles/citizenship-status/index.html"), "citizenship-status");
  assert.strictEqual(clusterOf("articles/tourist-entry/index.html"), "tourist-entry");
  assert.strictEqual(clusterOf("articles/ben-gurion-emergency/index.html"), "ben-gurion-emergency");
});

test("clusterOf - extracts explicit cluster from meta tag", () => {
  const html = '<meta name="article-cluster" content="custom-cluster">';
  assert.strictEqual(clusterOf("articles/unknown.html", html), "custom-cluster");

  const htmlSingleQuotes = "<meta name='article-cluster' content='another-cluster'>";
  assert.strictEqual(clusterOf("articles/unknown.html", htmlSingleQuotes), "another-cluster");
});

test("clusterOf - maps specific article numbers to clusters via regex and ranges", () => {
  // 1-10 -> work-visas
  assert.strictEqual(clusterOf("articles/article-1.html"), "work-visas");
  assert.strictEqual(clusterOf("articles/article-10.html"), "work-visas");

  // 11-20 -> citizenship-status
  assert.strictEqual(clusterOf("articles/article-11.html"), "citizenship-status");
  assert.strictEqual(clusterOf("articles/article-20.html"), "citizenship-status");

  // 21-30 -> tourist-entry
  assert.strictEqual(clusterOf("articles/article-21.html"), "tourist-entry");
  assert.strictEqual(clusterOf("articles/article-30.html"), "tourist-entry");

  // 31-40 -> ben-gurion-emergency
  assert.strictEqual(clusterOf("articles/article-31.html"), "ben-gurion-emergency");
  assert.strictEqual(clusterOf("articles/article-40.html"), "ben-gurion-emergency");
});

test("clusterOf - returns null for unmatched paths and numbers out of range", () => {
  // Out of range article number
  assert.strictEqual(clusterOf("articles/article-41.html"), null);

  // Non-matching path
  assert.strictEqual(clusterOf("about.html"), null);
  assert.strictEqual(clusterOf("contact.html"), null);
  assert.strictEqual(clusterOf("services/unknown.html"), null);
});
