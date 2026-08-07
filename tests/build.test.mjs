import { test } from "node:test";
import assert from "node:assert";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import { build } from "../scripts/build.mjs";

async function withTmpDir(fn) {
  const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'build-test-'));
  const tmpDist = path.join(tmpRoot, "dist");
  try {
    await fn(tmpRoot, tmpDist);
  } finally {
    await fs.rm(tmpRoot, { recursive: true, force: true });
  }
}

test("successful build with default _redirects", async () => {
  await withTmpDir(async (tmpRoot, tmpDist) => {
    const items = ["index.html", "about.html"];
    for (const item of items) {
      await fs.writeFile(path.join(tmpRoot, item), `Content of ${item}`);
    }

    await build(tmpRoot, tmpDist, items);

    for (const item of items) {
      const destPath = path.join(tmpDist, item);
      const content = await fs.readFile(destPath, 'utf8');
      assert.strictEqual(content, `Content of ${item}`);
    }

    const redirectsDest = path.join(tmpDist, "_redirects");
    const redirectsContent = await fs.readFile(redirectsDest, 'utf8');
    assert.strictEqual(redirectsContent, "/* /index.html 200\n", "Expected default _redirects file to be created");
  });
});

test("failed build due to missing source item", async () => {
  await withTmpDir(async (tmpRoot, tmpDist) => {
    const items = ["index.html", "missing.html"];
    await fs.writeFile(path.join(tmpRoot, "index.html"), "Content");

    await assert.rejects(
      async () => {
        await build(tmpRoot, tmpDist, items);
      },
      (err) => err.message === "Source item not found: missing.html"
    );
  });
});

test("existing _redirects file is copied", async () => {
  await withTmpDir(async (tmpRoot, tmpDist) => {
    const items = ["index.html"];
    await fs.writeFile(path.join(tmpRoot, "index.html"), "Content");
    await fs.writeFile(path.join(tmpRoot, "_redirects"), "/old /new 301\n");

    await build(tmpRoot, tmpDist, items);

    const redirectsDest = path.join(tmpDist, "_redirects");
    const redirectsContent = await fs.readFile(redirectsDest, 'utf8');
    assert.strictEqual(redirectsContent, "/old /new 301\n", "Expected existing _redirects file to be copied");
  });
});

test("build fails gracefully on permission error", async () => {
  await withTmpDir(async (tmpRoot, tmpDist) => {
    const items = ["index.html"];
    await fs.writeFile(path.join(tmpRoot, "index.html"), "Content");

    // Create an unreadable file to simulate permission error
    const noAccessPath = path.join(tmpRoot, "index.html");
    await fs.chmod(noAccessPath, 0o000);

    let errorThrown = false;
    try {
      await build(tmpRoot, tmpDist, items);
    } catch (err) {
      errorThrown = true;
      assert.ok(err.code === "EACCES" || err.message.includes("EACCES"), "Expected permission denied error");
    } finally {
      // Restore permissions so the tmpdir can be cleaned up
      await fs.chmod(noAccessPath, 0o644);
    }

    assert.ok(errorThrown, "Expected build to fail due to permission error");
  });
});
