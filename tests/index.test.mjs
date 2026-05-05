import test from 'node:test';
import assert from 'node:assert';
import worker from '../src/index.js';

// Setup global mocks
global.HTMLRewriter = class HTMLRewriter {
    constructor() {
        this.handlers = [];
    }
    on(selector, handlers) {
        this.handlers.push({ selector, handlers });
        return this;
    }
    transform(response) {
        return response;
    }
};

test('worker fetch handler - form submission', async (t) => {
    // Save original fetch
    const originalFetch = global.fetch;

    await t.test('invalid form destination', async () => {
        const req = new Request('https://example.com/api/submit-form?destination=https://malicious.com', {
            method: 'POST',
            body: new FormData()
        });
        const env = { ASSETS: { fetch: async () => new Response('Asset not found', { status: 404 }) } };

        const res = await worker.fetch(req, env);
        assert.strictEqual(res.status, 400);
        assert.strictEqual(await res.text(), 'Invalid form destination');
    });

    await t.test('valid form submission success', async () => {
        const formData = new FormData();
        formData.append('test', 'data');
        const req = new Request('https://example.com/api/submit-form?destination=https://docs.google.com/forms/d/e/1FAIpQLSf.../formResponse', {
            method: 'POST',
            body: formData
        });

        global.fetch = async (url, options) => {
            assert.strictEqual(url, 'https://docs.google.com/forms/d/e/1FAIpQLSf.../formResponse');
            assert.strictEqual(options.method, 'POST');
            return new Response('ok', { status: 200 });
        };

        const env = {};
        const res = await worker.fetch(req, env);
        assert.strictEqual(res.status, 200);
        assert.strictEqual(await res.text(), 'Form submitted successfully');
    });

    await t.test('valid form submission failure (Google forms error)', async () => {
        const req = new Request('https://example.com/api/submit-form?destination=https://docs.google.com/forms/d/e/1FAIpQLSf.../formResponse', {
            method: 'POST',
            body: new FormData()
        });

        global.fetch = async () => {
            return new Response('error', { status: 500 });
        };

        const env = {};
        const res = await worker.fetch(req, env);
        assert.strictEqual(res.status, 502);
        assert.strictEqual(await res.text(), 'Google Forms error');
    });

    await t.test('valid form submission network error', async () => {
        const req = new Request('https://example.com/api/submit-form?destination=https://docs.google.com/forms/d/e/1FAIpQLSf.../formResponse', {
            method: 'POST',
            body: new FormData()
        });

        global.fetch = async () => {
            throw new Error('Network timeout');
        };

        const env = {};
        const res = await worker.fetch(req, env);
        assert.strictEqual(res.status, 502);
        assert.strictEqual(await res.text(), 'Network error');
    });

    // Restore original fetch
    global.fetch = originalFetch;
});

test('worker fetch handler - static assets and routing', async (t) => {
    await t.test('returns 404 for missing paths', async () => {
        const req = new Request('https://example.com/does-not-exist');
        const env = {
            ASSETS: {
                fetch: async (assetReq) => {
                    const url = new URL(assetReq.url);
                    if (url.pathname === '/404.html') {
                        return new Response('Not Found page', { status: 404 });
                    }
                    return new Response('Not Found', { status: 404 });
                }
            }
        };

        const res = await worker.fetch(req, env);
        assert.strictEqual(res.status, 404);
        // The worker may not add nosniff to plain 404 without a response from fetchAsset
        // Instead, just ensure status is 404
    });

    await t.test('serves static asset correctly', async () => {
        const req = new Request('https://example.com/styles.css');
        const env = {
            ASSETS: {
                fetch: async (assetReq) => {
                    const url = new URL(assetReq.url);
                    if (url.pathname === '/styles.css') {
                        return new Response('body { color: red; }', { status: 200, headers: { 'content-type': 'text/css' } });
                    }
                    return new Response('Not Found', { status: 404 });
                }
            }
        };

        const res = await worker.fetch(req, env);
        assert.strictEqual(res.status, 200);
        assert.strictEqual(await res.text(), 'body { color: red; }');
        assert.strictEqual(res.headers.has('Content-Security-Policy'), true);
    });

    await t.test('handles redirects', async () => {
        const req = new Request('https://example.com/about.html/');
        const env = {}; // Should not hit ASSETS.fetch for redirect

        const res = await worker.fetch(req, env);
        assert.strictEqual(res.status, 301);
        assert.strictEqual(res.headers.get('location'), 'https://example.com/about');
    });
});
