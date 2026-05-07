
## 2024-05-07 - URL parsing logic gap in proxy validation
**Vulnerability:** A Server-Side Request Forgery (SSRF) bypass existed because the `destination` URL for the Google Forms proxy was validated using a simple `String.prototype.startsWith("https://docs.google.com/forms")`.
**Learning:** Checking for prefix matching on URLs is highly vulnerable because the hostname component ends at the `@` character or the first `/`, `?`, or `#`. An attacker could bypass the check by passing `https://docs.google.com/forms@attacker.com`, which technically evaluates to `attacker.com` as the host.
**Prevention:** Always use a formal URL parsing mechanism (like `new URL()`) and explicitly validate specific subcomponents like `hostname` and `pathname` instead of executing raw string checks on entire URLs.
