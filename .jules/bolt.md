## 2024-05-24 - Parallelize I/O bounds in scripts
**Learning:** Build scripts like `repair-geo.mjs` suffer from significant I/O latency when processing files sequentially using `for...of` loops.
**Action:** Replace sequential loops with `Promise.all` over mapped arrays for concurrent execution when order does not strictly matter.
