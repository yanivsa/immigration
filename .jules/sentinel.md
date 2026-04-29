## 2024-04-29 - [SSRF Bypass in string prefix validation]
**Vulnerability:** The `/api/submit-form` endpoint used `.startsWith("https://docs.google.com/forms")` to validate the destination URL, which allows SSRF bypass using URLs like `https://docs.google.com/forms@attacker.com/`.
**Learning:** String prefix matching is not sufficient for URL validation because URL parsing structures credentials, hosts, and paths differently.
**Prevention:** Always parse untrusted URLs using `new URL()` and explicitly validate the parsed `hostname` and `pathname` properties.
