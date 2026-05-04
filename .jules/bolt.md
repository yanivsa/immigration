## 2024-05-24 - Defer CSP Nonce Generation
**Learning:** In Cloudflare Workers, generating cryptographic nonces via `crypto.getRandomValues` adds measurable synchronous overhead. Doing this for every request, including static assets, is inefficient.
**Action:** Optimize asset delivery by deferring nonce generation until validating that the response is `text/html`. This saves compute time on static resources.
