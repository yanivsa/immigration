## 2026-05-01 - [Deferred Nonce Generation in Cloudflare Workers]
**Learning:** Generating cryptographic nonces via `crypto.getRandomValues` adds measurable synchronous overhead. Optimizing asset delivery by deferring generation until validating the response is `text/html` saves compute time on static resources.
**Action:** Always check if computationally expensive security features (like nonces) can be deferred or scoped only to the content types that require them (like text/html), avoiding overhead on static assets.
