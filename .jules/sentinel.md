
## 2025-05-03 - SSRF Bypass via URL Prefix Matching
**Vulnerability:** The `/api/submit-form` proxy validated the `destination` parameter using `destination.startsWith("https://docs.google.com/forms")`, which could be bypassed with `https://docs.google.com/forms@attacker.com`, causing an SSRF.
**Learning:** URL prefix matching is inherently insecure because URL components (credentials, domains, paths) behave differently than string prefixes.
**Prevention:** Always use the `URL` constructor to parse URLs and validate individual components (`hostname`, `pathname`, `protocol`) instead of using string methods like `startsWith`.
