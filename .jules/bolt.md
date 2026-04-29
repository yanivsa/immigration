## 2024-05-24 - Deferring Cryptographic Operations in Cloudflare Workers
**Learning:** In Cloudflare Workers, generating cryptographic nonces via `crypto.getRandomValues` adds measurable synchronous overhead. Doing this for every request, including static assets (images, CSS, JS), unnecessarily consumes compute time.
**Action:** Optimize asset delivery by deferring generation until validating the response is `text/html`. This saves compute time on static resources.
