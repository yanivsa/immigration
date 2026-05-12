import test from "node:test";
import assert from "node:assert";

// Mock globals for Cloudflare Workers
class Request {
  constructor(url, init = {}) {
    this.url = url;
    this.method = init.method || "GET";
    this._formData = init.formData || new Map();
  }
  async formData() {
    return this._formData;
  }
}
global.Request = Request;

class Response {
  constructor(body, init = {}) {
    this.body = body;
    this.status = init.status || 200;
    this.statusText = init.statusText || "";
    this.headers = new Headers(init.headers || {});
    this.ok = this.status >= 200 && this.status < 300;
  }
}
global.Response = Response;

class Headers {
  constructor(init = {}) {
    this._headers = new Map(Object.entries(init));
  }
  get(name) { return this._headers.get(name) || null; }
  set(name, value) { this._headers.set(name, value); }
  delete(name) { this._headers.delete(name); }
}
global.Headers = Headers;

global.fetch = async (url, init) => {
  return new Response("ok", { status: 200 });
};

Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr) => arr,
  },
  configurable: true
});

global.btoa = (str) => Buffer.from(str).toString('base64');
global.HTMLRewriter = class {
  on() { return this; }
  transform(response) { return response; }
};

import { _util } from "./index.js";

test("isValidFormDestination", async (t) => {
  await t.test("accepts valid google forms urls", () => {
    assert.strictEqual(_util.isValidFormDestination("https://docs.google.com/forms/d/e/1FAIpQLSf/formResponse"), true);
    assert.strictEqual(_util.isValidFormDestination("https://docs.google.com/forms"), true);
  });

  await t.test("rejects invalid domains", () => {
    assert.strictEqual(_util.isValidFormDestination("https://docs.google.com@attacker.com/forms"), false);
    assert.strictEqual(_util.isValidFormDestination("https://docs.google.com.attacker.com/forms"), false);
    assert.strictEqual(_util.isValidFormDestination("https://attacker.com/forms"), false);
  });

  await t.test("rejects http protocol", () => {
    assert.strictEqual(_util.isValidFormDestination("http://docs.google.com/forms"), false);
  });

  await t.test("rejects path bypasses", () => {
    assert.strictEqual(_util.isValidFormDestination("https://docs.google.com/forms@attacker.com"), false);
    assert.strictEqual(_util.isValidFormDestination("https://docs.google.com/forms.attacker.com"), false);
    assert.strictEqual(_util.isValidFormDestination("https://docs.google.com/formsattacker"), false);
    assert.strictEqual(_util.isValidFormDestination("https://docs.google.com/other"), false);
  });

  await t.test("handles malformed urls", () => {
    assert.strictEqual(_util.isValidFormDestination("not-a-url"), false);
    assert.strictEqual(_util.isValidFormDestination(""), false);
    assert.strictEqual(_util.isValidFormDestination(null), false);
    assert.strictEqual(_util.isValidFormDestination(undefined), false);
  });
});
