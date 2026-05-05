## 2024-05-24 - Async IO Batching for SEO script
**Learning:** The `seo-remediate.mjs` maintenance script used a sequential `for...of` loop to read, process, and write hundreds of HTML files.
**Action:** Replaced sequential operations with `Promise.all` and array map, reducing runtime by ~30% (from 740ms to 516ms) by parallelizing the file IO. I'll look for similar batching opportunities in other tree-walking scripts.
