
## $(date +%Y-%m-%d) - URL Validation SSRF bypass using startsWith
**Vulnerability:** Server-Side Request Forgery (SSRF) / Open Redirect vulnerability in the proxy endpoint (`/api/submit-form`). The code relied on `destination.startsWith("https://docs.google.com/forms")` for validation.
**Learning:** This approach is fundamentally flawed as it can be trivially bypassed using credentials in the URL authority component (e.g., `https://docs.google.com/forms@attacker.com`), allowing arbitrary domains to be contacted by the proxy.
**Prevention:** Always parse destination URLs using the `URL` constructor (`new URL(url)`) and perform distinct equality checks on `protocol`, `hostname`, and prefix matching strictly on `pathname`. Do not trust string prefix validation for security-critical endpoints.
