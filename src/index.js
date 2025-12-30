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

    const contentType = headers.get("content-type") ?? "";
    if (contentType.includes("text/html")) {
      const body = await response.text();
      const updatedBody = body.replace(
        /<script\b(?![^>]*\bnonce=)/g,
        `<script nonce="${nonce}"`
      );
      headers.delete("Content-Length");
      return new Response(updatedBody, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }
};
