## 2025-05-05 - Optimize file I/O processing in repair-seo.mjs

**Learning:** Replaced a sequential `for...of` loop awaiting I/O operations with a concurrent `Promise.all(files.map(...))` to significantly speed up file processing.
**Action:** When handling bulk file operations in build scripts, prefer mapping over files and using `Promise.all` to maximize concurrency and reduce execution time.
