## 2024-03-01 - [SSRF in Form Proxy]
**Vulnerability:** The form proxy endpoint (`/api/submit-form`) validated the destination URL using string matching (`.startsWith("https://docs.google.com/forms")`), allowing attackers to bypass validation using crafted URLs like `https://docs.google.com/forms@attacker.com` or `https://docs.google.com/forms.attacker.com`.
**Learning:** URL string matching is inherently unsafe for validating origins because URL parsing logic handles credentials (`@`), subdomains, and paths differently than simple string prefixes.
**Prevention:** Always parse destination URLs using `new URL()` and explicitly validate the `protocol`, `hostname`, and `pathname` properties to ensure the request is bounded correctly.
