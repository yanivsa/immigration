import test from 'node:test';
import assert from 'node:assert';
import worker from '../src/index.js';

test('Form submission tests', async (t) => {
  const originalFetch = global.fetch;

  t.afterEach(() => {
    global.fetch = originalFetch;
  });

  await t.test('Successful form submission', async () => {
    global.fetch = async (url, options) => {
      assert.strictEqual(url, 'https://docs.google.com/forms/d/e/1FAIpQLSfx/formResponse');
      assert.strictEqual(options.method, 'POST');
      return new Response('ok', { status: 200 });
    };

    const formData = new FormData();
    formData.append('entry.123', 'test value');

    const request = new Request('http://localhost/api/submit-form?destination=https://docs.google.com/forms/d/e/1FAIpQLSfx/formResponse', {
      method: 'POST',
      body: formData
    });

    const env = {};
    const response = await worker.fetch(request, env);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(await response.text(), 'Form submitted successfully');
  });

  await t.test('Google Forms error', async () => {
    global.fetch = async () => {
      return new Response('error', { status: 400 }); // Not ok
    };

    const formData = new FormData();
    const request = new Request('http://localhost/api/submit-form?destination=https://docs.google.com/forms/d/e/1FAIpQLSfx/formResponse', {
      method: 'POST',
      body: formData
    });

    const env = {};
    const response = await worker.fetch(request, env);

    assert.strictEqual(response.status, 502);
    assert.strictEqual(await response.text(), 'Google Forms error');
  });

  await t.test('Network error', async () => {
    global.fetch = async () => {
      throw new Error('Network error');
    };

    const formData = new FormData();
    const request = new Request('http://localhost/api/submit-form?destination=https://docs.google.com/forms/d/e/1FAIpQLSfx/formResponse', {
      method: 'POST',
      body: formData
    });

    const env = {};
    const response = await worker.fetch(request, env);

    assert.strictEqual(response.status, 502);
    assert.strictEqual(await response.text(), 'Network error');
  });

  await t.test('Invalid destination', async () => {
    const formData = new FormData();
    const request = new Request('http://localhost/api/submit-form?destination=https://example.com/forms/d/e/1FAIpQLSfx/formResponse', {
      method: 'POST',
      body: formData
    });

    const env = {};
    const response = await worker.fetch(request, env);

    assert.strictEqual(response.status, 400);
    assert.strictEqual(await response.text(), 'Invalid form destination');
  });
});
