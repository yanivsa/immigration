## 2024-05-04 - SSRF via Insecure String Prefix URL Validation
**Vulnerability:** URL validation for the proxy endpoint relied on simple string prefix matching (`.startsWith("https://docs.google.com/forms")`).
**Learning:** String matching on URLs is vulnerable to bypasses because URL parsing handles credentials, host structures, and path resolution differently. For example, `https://docs.google.com.attacker.com/forms` would pass the check but send requests to attacker.com.
**Prevention:** Always parse untrusted input using `new URL()` and explicitly validate the `hostname` and `pathname` properties.
