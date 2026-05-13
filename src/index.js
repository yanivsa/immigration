const hasFileExtension = (pathname) => /\.[^/]+$/.test(pathname);

const cleanPath = (pathname) => pathname.replace(/\/{2,}/g, "/");

const localeRoots = new Set(["en", "ru", "ua"]);
const directoryRoots = new Set(["articles", "services"]);

const shouldHaveTrailingSlash = (pathname) => {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 1 && localeRoots.has(segments[0])) {
    return true;
  }

  if (segments.length === 1 && directoryRoots.has(segments[0])) {
    return true;
  }

  if (
    segments.length === 2 &&
    localeRoots.has(segments[0]) &&
    directoryRoots.has(segments[1])
  ) {
    return true;
  }

  return false;
};

const buildRedirectResponse = (request, pathname, status = 301) => {
  const url = new URL(request.url);
  url.pathname = pathname;
  return Response.redirect(url.toString(), status);
};

const buildAssetRequest = (request, pathname) => {
  const url = new URL(request.url);
  url.pathname = pathname;
  return new Request(url, request);
};

const normalizeRedirectPath = (pathname) => {
  let next = cleanPath(pathname);

  if (/\.html\/+$/i.test(next)) {
    next = next.replace(/\/+$/g, "");
  }

  if (next.endsWith("/index.html")) {
    next = next.replace(/index\.html$/, "");
  }

  if (next.endsWith(".html") && next !== "/404.html") {
    next = next.slice(0, -5);
  }

  if (!hasFileExtension(next) && next !== "/") {
    if (next.endsWith("/") && !shouldHaveTrailingSlash(next)) {
      next = next.slice(0, -1);
    }

    if (!next.endsWith("/") && shouldHaveTrailingSlash(next)) {
      next = `${next}/`;
    }
  }

  return next || "/";
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
    const rawPathname = url.pathname;
    const pathname = normalizeRedirectPath(rawPathname);
    let response = null;
    let notFound = false;

    if (pathname === "/api/submit-form" && request.method === "POST") {
      const url = new URL(request.url);
      const destination = url.searchParams.get("destination");

      let isValidDestination = false;
      if (destination) {
        try {
          const destUrl = new URL(destination);
          if (
            destUrl.protocol === "https:" &&
            destUrl.hostname === "docs.google.com" &&
            (destUrl.pathname === "/forms" || destUrl.pathname.startsWith("/forms/"))
          ) {
            isValidDestination = true;
          }
        } catch (e) {
          // Invalid URL
        }
      }

      if (!isValidDestination) {
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

    if (rawPathname !== pathname) {
      return buildRedirectResponse(request, pathname);
    }

    if (pathname === "/404" || pathname === "/404.html") {
      const notFoundResponse = await fetchAsset(request, env, "/404.html");
      if (!notFoundResponse) {
        return new Response("Not Found", { status: 404 });
      }
      response = notFoundResponse;
      notFound = true;
    }

    if (!response && hasFileExtension(pathname)) {
      response = await env.ASSETS.fetch(request);
    } else if (!response) {
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

    if (!response || response.status === 404) {
      const notFoundResponse = await fetchAsset(request, env, "/404.html");
      if (notFoundResponse) {
        response = notFoundResponse;
        notFound = true;
      } else {
        return new Response("Not Found", { status: 404 });
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
            status: notFound || response.status === 404 ? 404 : response.status,
            statusText: response.statusText,
            headers,
          })
        );
    }

    return new Response(response.body, {
      status: notFound || response.status === 404 ? 404 : response.status,
      statusText: response.statusText,
      headers,
    });
  }
};
