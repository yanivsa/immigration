import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.js';

const mockEnv = {
  ASSETS: {
    fetch: async () => new Response('Not Found', { status: 404 })
  }
};

test('submit-form blocks non-Google Forms destination', async () => {
  const formData = new FormData();
  formData.append('test', 'data');
  const request = new Request('http://localhost/api/submit-form?destination=https://example.com/malicious', {
    method: 'POST',
    body: formData
  });

  const response = await worker.fetch(request, mockEnv);
  assert.strictEqual(response.status, 400);
  assert.strictEqual(await response.text(), 'Invalid form destination');
});

test('submit-form accepts valid Google Forms destination and handles successful submission', async () => {
  const originalFetch = global.fetch;
  global.fetch = async (url, options) => {
    if (url.startsWith('https://docs.google.com/forms')) {
      return new Response('OK', { status: 200 });
    }
    return new Response('Error', { status: 500 });
  };

  try {
    const formData = new FormData();
    formData.append('test', 'data');

    const request = new Request('http://localhost/api/submit-form?destination=https://docs.google.com/forms/d/e/1FAIpQLSc/formResponse', {
      method: 'POST',
      body: formData
    });

    const response = await worker.fetch(request, mockEnv);
    assert.strictEqual(response.status, 200);
    assert.strictEqual(await response.text(), 'Form submitted successfully');
  } finally {
    global.fetch = originalFetch;
  }
});

test('submit-form handles Google Forms error response', async () => {
  const originalFetch = global.fetch;
  global.fetch = async (url, options) => {
    return new Response('Error', { status: 400 });
  };

  try {
    const formData = new FormData();
    const request = new Request('http://localhost/api/submit-form?destination=https://docs.google.com/forms/d/e/1FAIpQLSc/formResponse', {
      method: 'POST',
      body: formData
    });

    const response = await worker.fetch(request, mockEnv);
    assert.strictEqual(response.status, 502);
    assert.strictEqual(await response.text(), 'Google Forms error');
  } finally {
    global.fetch = originalFetch;
  }
});

test('submit-form handles network error', async () => {
  const originalFetch = global.fetch;
  global.fetch = async (url, options) => {
    throw new TypeError('Network request failed');
  };

  try {
    const formData = new FormData();
    const request = new Request('http://localhost/api/submit-form?destination=https://docs.google.com/forms/d/e/1FAIpQLSc/formResponse', {
      method: 'POST',
      body: formData
    });

    const response = await worker.fetch(request, mockEnv);
    assert.strictEqual(response.status, 502);
    assert.strictEqual(await response.text(), 'Network error');
  } finally {
    global.fetch = originalFetch;
  }
});
