## 2024-05-24 - Deferring Nonce Generation in Cloudflare Workers
**Learning:** In Cloudflare Workers, generating cryptographic nonces via `crypto.getRandomValues` adds measurable synchronous overhead on every request. Generating it blindly at the start of the `fetch` handler hurts performance for static assets (e.g. images, css) which don't even use nonces.
**Action:** Optimize asset delivery by deferring nonce generation until the end of the request flow, specifically only when the response is validated as `text/html` and actually requires nonce injection.
