## 2024-05-05 - Deferred Cryptographic Nonce Generation
**Learning:** `crypto.getRandomValues()` adds significant synchronous overhead (~20ms per 1000 requests in basic node benchmark) and isn't needed for all requests. The Cloudflare Worker handles both HTML and static assets (images, CSS), and nonces are only useful for HTML.
**Action:** When working with Cloudflare Workers or serverless edge computing, defer expensive operations (like crypto) until the response `content-type` is confirmed to be the type that requires that operation (e.g., `text/html`).
