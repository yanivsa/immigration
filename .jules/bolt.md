## 2024-06-25 - Parallelize File Operations
**Learning:** In scripts parsing a large number of independent files, executing asynchronous IO operations inside a `for...of` loop creates unnecessary sequential bottlenecks, resulting in higher latency.
**Action:** Always attempt to convert sequential, independent `await` loops to concurrent operations mapping `.map(async () => ...)` inside an `await Promise.all()` wrap when feasible, preserving functionality and skipping unwanted items with `.filter(Boolean)`.
