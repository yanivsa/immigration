export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    headers.set(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "frame-ancestors 'none'",
        "img-src 'self' data:",
        "font-src 'self'",
        "style-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "frame-src https://docs.google.com",
        "form-action 'self' https://docs.google.com",
        "connect-src 'self'",
      ].join("; ")
    );
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("X-Frame-Options", "DENY");
    headers.set("Cross-Origin-Opener-Policy", "same-origin");
    headers.set("Cross-Origin-Resource-Policy", "same-origin");
    headers.set("Origin-Agent-Cluster", "?1");
    headers.set(
      "Permissions-Policy",
      "geolocation=(), microphone=(), camera=(), payment=(), usb=()"
    );
    headers.set("X-Download-Options", "noopen");
    headers.set("X-Permitted-Cross-Domain-Policies", "none");
    headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }
};
