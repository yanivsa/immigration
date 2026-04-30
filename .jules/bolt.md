
## 2024-05-01 - Defer Nonce Generation in Cloudflare Worker
**Learning:** In Cloudflare Workers, generating cryptographic nonces via `crypto.getRandomValues` unconditionally at the top of the fetch handler adds synchronous overhead to every request. For applications serving a mix of static assets and HTML, this compute is completely wasted on non-HTML responses.
**Action:** Always verify the content-type (e.g., `text/html`) before invoking expensive cryptographic functions or initializing `HTMLRewriter` to save compute time and improve response latency for static assets.
