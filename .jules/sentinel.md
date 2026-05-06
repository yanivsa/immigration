## 2024-05-15 - [SSRF bypass via weak string prefix matching]
**Vulnerability:** The Google Forms proxy endpoint (`/api/submit-form`) validated URLs using `destination.startsWith("https://docs.google.com/forms")`, allowing SSRF and Open Redirect via URLs like `https://docs.google.com/forms@attacker.com` or `https://docs.google.com/forms/../attacker`.
**Learning:** String matching handles URL components (credentials, host structures, path resolution) differently than URL parsing engines.
**Prevention:** Always parse untrusted URLs using `new URL()` and explicitly validate the `protocol`, `hostname`, and `pathname` properties. Avoid `.startsWith()` for URL origin validation.
