## 2024-05-24 - Defer cryptographic nonce generation
**Learning:** In Cloudflare Workers, generating cryptographic nonces via `crypto.getRandomValues` creates measurable synchronous overhead. Doing this for every request, including static assets (like images or CSS), wastes compute time since nonces are typically only used in HTML documents.
**Action:** Always check the response's `Content-Type` before generating cryptographic values for CSP headers. Only compute the nonce if the content type is `text/html`.
