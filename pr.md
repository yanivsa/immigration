# 🧹 Refactor keyword-queue to use asynchronous file operations

🎯 **What:** Migrated synchronous file operations (`fs.readFileSync`, `fs.writeFileSync`, `fs.mkdirSync`) to their asynchronous counterparts (`fsPromises.readFile`, `fsPromises.writeFile`, `fsPromises.mkdir`) in `scripts/keyword-queue.mjs`.

💡 **Why:** Using async/await prevents the script from blocking the Node.js event loop during I/O operations, improving overall code health and execution efficiency, particularly when processing large queues or when refactoring logic for concurrent execution. Replaced sequential loops writing content files with `Promise.all` maps to maximize I/O concurrency.

✅ **Verification:** Ran `node -c scripts/keyword-queue.mjs` to ensure valid syntax. Executed the script locally with `--dry-run` and with `--max-per-run 1` to ensure it still successfully processed the scheduled items and generated correct `.md` output files without breaking.

✨ **Result:** Improved maintainability, modernized file operations, and eliminated event loop blocking without altering application behavior.
