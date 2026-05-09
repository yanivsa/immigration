import test from "node:test";
import assert from "node:assert";
import worker from "./index.js";

global.Request = class Request {
  constructor(url, init = {}) {
    this.url = url;
    this.method = init.method || "GET";
    this._formData = init.body || new Map();
  }
  async formData() {
    return this._formData;
  }
};

global.Headers = class Headers {
  constructor(init) {
    this.map = new Map();
    if (init instanceof Headers) {
      for (const [k, v] of init.map.entries()) {
        this.map.set(k, v);
      }
    } else if (init) {
      for (const [k, v] of Object.entries(init)) {
        this.map.set(k, v);
      }
    }
  }
  set(k, v) { this.map.set(k, v); }
  get(k) { return this.map.get(k); }
  delete(k) { this.map.delete(k); }
};

global.Response = class Response {
  constructor(body, init = {}) {
    this.body = body;
    this.status = init.status || 200;
    this.statusText = init.statusText || "";
    this.headers = new global.Headers(init.headers || {});
  }
  get ok() {
    return this.status >= 200 && this.status < 300;
  }
  static redirect(url, status) {
    return new global.Response(null, { status, headers: { Location: url } });
  }
};

global.HTMLRewriter = class {
  on() { return this; }
  transform(res) { return res; }
};

Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr) => {
      for(let i=0; i<arr.length; i++) arr[i] = 1;
      return arr;
    }
  },
  configurable: true
});

global.btoa = (str) => Buffer.from(str).toString('base64');

test("submit-form endpoint rejects invalid destination URLs", async () => {
  const invalidDestinations = [
    "https://docs.google.com.attacker.com/forms",
    "http://docs.google.com/forms",
    "https://docs.attacker.com/forms",
    "https://docs.google.com/notforms",
    "https://attacker.com?https://docs.google.com/forms",
    "javascript:alert(1)"
  ];

  for (const dest of invalidDestinations) {
    const req = new global.Request(`http://localhost/api/submit-form?destination=${encodeURIComponent(dest)}`, {
      method: "POST"
    });
    const res = await worker.fetch(req, {});
    assert.strictEqual(res.status, 400, `Expected 400 for ${dest}, got ${res.status}`);
  }
});

test("submit-form endpoint accepts valid destination URLs", async () => {
  global.fetch = async () => new global.Response("ok", { status: 200 });

  const validDestinations = [
    "https://docs.google.com/forms/d/e/1FAIpQLSc..."
  ];

  for (const dest of validDestinations) {
    const req = new global.Request(`http://localhost/api/submit-form?destination=${encodeURIComponent(dest)}`, {
      method: "POST",
      body: new Map([["test", "value"]])
    });
    const res = await worker.fetch(req, {});
    assert.strictEqual(res.status, 200, `Expected 200 for ${dest}, got ${res.status}`);
  }
});
