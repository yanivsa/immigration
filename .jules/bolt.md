## 2024-05-18 - Optimize File Processing Loops in Node.js Build Scripts

**Learning:** When performing independent file operations (e.g., reading, updating, and writing HTML files) in a build script or maintenance task, executing them sequentially using `for...await` loops leaves CPU and I/O resources severely underutilized. Batching these operations using `Promise.all` allows Node.js to perform asynchronous I/O concurrently, drastically reducing overall runtime.

**Action:** Look for sequential `for...await` loops handling independent files in data migration or build scripts. Replace them with `await Promise.all(array.map(async item => { ... }))`. If the number of files is massive, consider batching with libraries like `p-map` to avoid OS-level file descriptor limits, but for moderately sized batches, pure `Promise.all` provides an excellent zero-dependency speed boost.
