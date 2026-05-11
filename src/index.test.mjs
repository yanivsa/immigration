import test from "node:test";
import assert from "node:assert";
import worker from "./index.js";

// Mock globals
class MockHeaders {
  constructor(init) {
    this.headers = new Map(init ? Object.entries(init) : []);
  }
  set(k, v) { this.headers.set(k.toLowerCase(), v); }
  get(k) { return this.headers.get(k.toLowerCase()) || null; }
  delete(k) { this.headers.delete(k.toLowerCase()); }
}

class MockRequest {
  constructor(url, init = {}) {
    this.url = url;
    this.method = init.method || "GET";
    this._formData = init._formData;
  }
  async formData() {
    return this._formData;
  }
}

class MockResponse {
  constructor(body, init = {}) {
    this.body = body;
    this.status = init.status || 200;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = init.statusText || "";
    this.headers = new MockHeaders(init.headers);
  }
}

global.Request = MockRequest;
global.Response = MockResponse;
global.Headers = MockHeaders;
global.HTMLRewriter = class {
  on() { return this; }
  transform(res) { return res; }
};

Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr) => {
      for (let i = 0; i < arr.length; i++) arr[i] = 0;
      return arr;
    }
  },
  configurable: true
});

global.fetch = async () => new MockResponse("ok", { status: 200 });

test("Invalid form destination is rejected (SSRF/Open Redirect bypass attempts)", async () => {
  const badUrls = [
    "https://docs.google.com.attacker.com/forms",
    "https://attacker.com/forms",
    "https://docs.google.com/forms@attacker.com",
    "https://docs.google.com@attacker.com/forms",
    "https://attacker.com/?https://docs.google.com/forms",
    "javascript:alert(1)",
    "//attacker.com/forms",
    "https://docs.google.com/not-forms"
  ];

  for (const dest of badUrls) {
    const req = new MockRequest(`http://localhost/api/submit-form?destination=${encodeURIComponent(dest)}`, {
      method: "POST"
    });
    const res = await worker.fetch(req, { ASSETS: { fetch: async () => new MockResponse("", {status: 404}) } });
    assert.strictEqual(res.status, 400, `Expected 400 for ${dest}`);
  }
});

test("Valid form destination is accepted", async () => {
  const req = new MockRequest("http://localhost/api/submit-form?destination=https://docs.google.com/forms/d/e/1FAIpQLSf.../formResponse", {
    method: "POST",
    _formData: {}
  });
  const res = await worker.fetch(req, { ASSETS: { fetch: async () => new MockResponse("", {status: 404}) } });
  assert.strictEqual(res.status, 200);
});
