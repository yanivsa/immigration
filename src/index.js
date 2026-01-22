const hasFileExtension = (pathname) => /\.[^/]+$/.test(pathname);

const buildAssetRequest = (request, pathname) => {
  const url = new URL(request.url);
  url.pathname = pathname;
  return new Request(url, request);
};

const fetchAsset = async (request, env, pathname) => {
  const assetRequest = buildAssetRequest(request, pathname);
  const response = await env.ASSETS.fetch(assetRequest);
  return response.status === 404 ? null : response;
};

export default {
  async fetch(request, env) {
    const nonceBytes = crypto.getRandomValues(new Uint8Array(16));
    const nonce = btoa(String.fromCharCode(...nonceBytes));

    const url = new URL(request.url);
    const { pathname } = url;
    let response = null;

    if (pathname === "/api/submit-form" && request.method === "POST") {
      const url = new URL(request.url);
      const destination = url.searchParams.get("destination");

      if (!destination || !destination.startsWith("https://docs.google.com/forms")) {
        return new Response("Invalid form destination", { status: 400 });
      }

      const body = await request.formData();
      try {
        const googleResponse = await fetch(destination, {
          method: "POST",
          body: body,
        });

        if (googleResponse.ok) {
          return new Response("Form submitted successfully", { status: 200 });
        } else {
          return new Response("Google Forms error", { status: 502 });
        }
      } catch (err) {
        return new Response("Network error", { status: 502 });
      }
    }

    if (hasFileExtension(pathname)) {
      response = await env.ASSETS.fetch(request);
    } else {
      if (pathname === "/") {
        response = await fetchAsset(request, env, "/index.html");
      } else if (pathname.endsWith("/")) {
        response = await fetchAsset(request, env, `${pathname}index.html`);
      } else {
        response = await fetchAsset(request, env, `${pathname}.html`);
        if (!response) {
          response = await fetchAsset(request, env, `${pathname}/index.html`);
        }
      }

      if (!response) {
        response = await env.ASSETS.fetch(request);
      }
    }

    if (!response) {
      return new Response("Not Found", { status: 404 });
    }

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
        "style-src 'self' 'unsafe-inline'", // unsafe-inline often needed for styles, verify if needed
        `script-src 'self' 'nonce-${nonce}'`,
        "script-src-attr 'none'",
        "frame-src https://docs.google.com",
        "form-action 'self' https://docs.google.com",
        "connect-src 'self' https://docs.google.com https://www.gstatic.com",
        "preconnect-src 'self' https://docs.google.com https://www.gstatic.com",
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

    // Strip headers that might conflict with modification
    headers.delete("Content-Length");
    headers.delete("Content-Encoding");
    headers.delete("Etag");

    const contentType = headers.get("content-type") ?? "";
    if (contentType.includes("text/html")) {
      // Use HTMLRewriter for robust injection
      return new HTMLRewriter()
        .on("script", {
          element(element) {
            element.setAttribute("nonce", nonce);
          },
        })
        .transform(
          new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers,
          })
        );
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }
};
