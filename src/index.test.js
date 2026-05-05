import { describe, it } from "node:test";
import assert from "node:assert";
import worker from "./index.js";

describe("Cloudflare Worker fetch handler - /api/submit-form", () => {
  it("should handle network errors gracefully by returning a 502 status", async () => {
    // Save original fetch
    const originalFetch = global.fetch;

    // Mock global fetch to throw an error
    global.fetch = async () => {
      throw new Error("Simulated network failure");
    };

    try {
      const url = "https://example.com/api/submit-form?destination=https://docs.google.com/forms/d/e/1FAIpQLSfw/formResponse";

      const formData = new FormData();
      formData.append("entry.123", "test value");

      const request = new Request(url, {
        method: "POST",
        body: formData
      });

      const env = {
        ASSETS: {
          fetch: async () => new Response("Asset Not Found", { status: 404 })
        }
      };

      const response = await worker.fetch(request, env);

      assert.strictEqual(response.status, 502);
      const text = await response.text();
      assert.strictEqual(text, "Network error");

    } finally {
      // Restore original fetch
      global.fetch = originalFetch;
    }
  });

  it("should return a 502 status when Google Forms returns a non-ok response", async () => {
    const originalFetch = global.fetch;
    global.fetch = async () => {
      return new Response("Bad Request", { status: 400 });
    };

    try {
      const url = "https://example.com/api/submit-form?destination=https://docs.google.com/forms/d/e/1FAIpQLSfw/formResponse";

      const formData = new FormData();
      formData.append("entry.123", "test value");

      const request = new Request(url, {
        method: "POST",
        body: formData
      });

      const env = {
        ASSETS: {
          fetch: async () => new Response("Asset Not Found", { status: 404 })
        }
      };

      const response = await worker.fetch(request, env);

      assert.strictEqual(response.status, 502);
      const text = await response.text();
      assert.strictEqual(text, "Google Forms error");

    } finally {
      global.fetch = originalFetch;
    }
  });

  it("should return a 200 status when Google Forms submission succeeds", async () => {
    const originalFetch = global.fetch;
    global.fetch = async () => {
      return new Response("OK", { status: 200 });
    };

    try {
      const url = "https://example.com/api/submit-form?destination=https://docs.google.com/forms/d/e/1FAIpQLSfw/formResponse";

      const formData = new FormData();
      formData.append("entry.123", "test value");

      const request = new Request(url, {
        method: "POST",
        body: formData
      });

      const env = {
        ASSETS: {
          fetch: async () => new Response("Asset Not Found", { status: 404 })
        }
      };

      const response = await worker.fetch(request, env);

      assert.strictEqual(response.status, 200);
      const text = await response.text();
      assert.strictEqual(text, "Form submitted successfully");

    } finally {
      global.fetch = originalFetch;
    }
  });

  it("should return a 400 status when destination is missing or invalid", async () => {
    const url = "https://example.com/api/submit-form";

    const request = new Request(url, {
      method: "POST",
    });

    const env = {
      ASSETS: {
        fetch: async () => new Response("Asset Not Found", { status: 404 })
      }
    };

    const response = await worker.fetch(request, env);

    assert.strictEqual(response.status, 400);
    const text = await response.text();
    assert.strictEqual(text, "Invalid form destination");
  });
});
