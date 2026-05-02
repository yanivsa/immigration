## 2024-06-03 - Defer Cryptographic Operations in Cloudflare Workers
**Learning:** Generating cryptographic nonces via `crypto.getRandomValues` adds measurable synchronous overhead. Doing this unconditionally at the start of a Cloudflare Worker request means every request, even for static assets (images, CSS, JS), pays this tax.
**Action:** Optimize asset delivery by deferring generation of nonces or other cryptographic values until it is strictly necessary, such as after validating the response is `text/html`.
