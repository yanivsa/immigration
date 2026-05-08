import test from "node:test";
import assert from "node:assert";

// Mock globals for Cloudflare Worker environment
global.Request = class Request {
  constructor(input, init) {
    this.url = input instanceof Request ? input.url : input;
    this.method = init?.method || "GET";
    this.headers = new Headers(init?.headers);
    this._formData = init?.body || new FormData();
  }
  async formData() {
    return this._formData;
  }
};

global.Response = class Response {
  constructor(body, init) {
    this.body = body;
    this.status = init?.status || 200;
    this.statusText = init?.statusText || "OK";
    this.headers = new Headers(init?.headers);
  }
  static redirect(url, status = 301) {
    return new Response(null, { status, headers: { Location: url } });
  }
};

global.Headers = class Headers {
  constructor(init) {
    this._map = new Map();
    if (init) {
      if (init instanceof Headers) {
        for (const [k, v] of init._map) {
          this._map.set(k.toLowerCase(), v);
        }
      } else if (Array.isArray(init)) {
        for (const [k, v] of init) {
          this._map.set(k.toLowerCase(), v);
        }
      } else {
        for (const [k, v] of Object.entries(init)) {
          this._map.set(k.toLowerCase(), v);
        }
      }
    }
  }
  get(k) { return this._map.get(k.toLowerCase()) || null; }
  set(k, v) { this._map.set(k.toLowerCase(), v); }
  delete(k) { this._map.delete(k.toLowerCase()); }
  entries() { return this._map.entries(); }
};

global.FormData = class FormData {
  constructor() {
    this._map = new Map();
  }
  append(key, value) {
    this._map.set(key, value);
  }
  get(key) {
    return this._map.get(key) || null;
  }
};

Object.defineProperty(global, "crypto", {
  value: {
    getRandomValues: (arr) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    }
  },
  configurable: true,
  writable: true
});

global.btoa = (str) => Buffer.from(str, 'binary').toString('base64');

global.HTMLRewriter = class HTMLRewriter {
  on() { return this; }
  transform(response) { return response; }
};

// We also need to mock `fetch` to simulate successful Google Form submits
const originalFetch = global.fetch;

// Import the worker
import worker from "./index.js";

test("URL validation prevents SSRF and Open Redirect in /api/submit-form", async (t) => {
  // Mock fetch just for these tests
  global.fetch = async (url, init) => {
    return { ok: true, status: 200 };

  };

  const env = {
    ASSETS: {
      fetch: async () => new Response("Not Found", { status: 404 })
    }
  };

  const maliciousUrls = [
    "https://docs.google.com/forms@evil.com/",
    "https://docs.google.com/forms\\@evil.com/",
    "https://docs.google.com/forms.evil.com/",
    "https://docs.google.com\\@evil.com/forms",
    "https://evil.com/?https://docs.google.com/forms",
    "https://docs.google.com/forms/../../some-other-path",
    "http://docs.google.com/forms/d/e/123/viewform",
    "https://docs.google.com/not-forms/d/e/123/viewform",
  ];

  for (const dest of maliciousUrls) {
    const reqUrl = `https://example.com/api/submit-form?destination=${encodeURIComponent(dest)}`;
    const request = new Request(reqUrl, { method: "POST", body: new FormData() });

    const response = await worker.fetch(request, env);

    assert.strictEqual(
      response.status,
      400,
      `Expected 400 Bad Request for malicious destination: ${dest}`
    );
    assert.strictEqual(
      response.body,
      "Invalid form destination",
      `Expected error message for malicious destination: ${dest}`
    );
  }

  const validUrls = [
    "https://docs.google.com/forms/d/e/1FAIpQLSc/formResponse",
    "https://docs.google.com/forms/d/e/1FAIpQLSd/viewform",
  ];

  for (const dest of validUrls) {
    const reqUrl = `https://example.com/api/submit-form?destination=${encodeURIComponent(dest)}`;
    const request = new Request(reqUrl, { method: "POST", body: new FormData() });

    const response = await worker.fetch(request, env);

    assert.strictEqual(
      response.status,
      200,
      `Expected 200 OK for valid destination: ${dest}`
    );
  }

  // Restore fetch
  global.fetch = originalFetch;
});
