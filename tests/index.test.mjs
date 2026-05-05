import test from 'node:test';
import assert from 'node:assert';
import worker from '../src/index.js';

test('Form submission destination validation', async (t) => {
  await t.test('Missing destination parameter', async () => {
    const req = new Request('http://localhost/api/submit-form', {
      method: 'POST'
    });
    const res = await worker.fetch(req, {});
    assert.strictEqual(res.status, 400);
    assert.strictEqual(await res.text(), 'Invalid form destination');
  });

  await t.test('Invalid destination parameter - not Google Forms', async () => {
    const req = new Request('http://localhost/api/submit-form?destination=https://example.com/forms', {
      method: 'POST'
    });
    const res = await worker.fetch(req, {});
    assert.strictEqual(res.status, 400);
    assert.strictEqual(await res.text(), 'Invalid form destination');
  });

  await t.test('Invalid destination protocol - HTTP instead of HTTPS', async () => {
    const req = new Request('http://localhost/api/submit-form?destination=http://docs.google.com/forms', {
      method: 'POST'
    });
    const res = await worker.fetch(req, {});
    assert.strictEqual(res.status, 400);
    assert.strictEqual(await res.text(), 'Invalid form destination');
  });

  await t.test('Valid destination parameter', async () => {
    const formData = new FormData();
    formData.append('entry.123456', 'test data');

    const req = new Request('http://localhost/api/submit-form?destination=https://docs.google.com/forms/d/e/1FAIpQLSc/formResponse', {
      method: 'POST',
      body: formData
    });

    const originalFetch = globalThis.fetch;
    let fetchCalled = false;
    globalThis.fetch = async (url, options) => {
      fetchCalled = true;
      assert.strictEqual(url, 'https://docs.google.com/forms/d/e/1FAIpQLSc/formResponse');
      assert.strictEqual(options.method, 'POST');
      return new Response('ok', { status: 200 });
    };

    try {
      const res = await worker.fetch(req, {});
      assert.strictEqual(res.status, 200);
      assert.strictEqual(await res.text(), 'Form submitted successfully');
      assert.ok(fetchCalled);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
