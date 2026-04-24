## 2024-05-24 - [SSRF vulnerability in forms submission]
**Vulnerability:** Server-Side Request Forgery (SSRF) and Open Redirect bypass using string-based check `startsWith("https://docs.google.com/forms")`.
**Learning:** String-based URL validation is insecure. Attackers can bypass it by using domains like `https://docs.google.com/forms@attacker.com` which resolves to `attacker.com`.
**Prevention:** Always use a proper URL parser like `new URL()` to explicitly validate the `hostname` and the `pathname` independently. Ensure `try...catch` is used to handle malformed URLs.
