import test from 'node:test';
import assert from 'node:assert';
import { _util } from './index.js';

const { normalizeRedirectPath } = _util;

test('normalizeRedirectPath', async (t) => {
  await t.test('collapses multiple slashes', () => {
    assert.strictEqual(normalizeRedirectPath('//foo///bar//'), '/foo/bar');
  });

  await t.test('removes trailing slashes from .html paths', () => {
    assert.strictEqual(normalizeRedirectPath('/foo.html/'), '/foo');
    assert.strictEqual(normalizeRedirectPath('/foo.html///'), '/foo');
  });

  await t.test('removes index.html from paths', () => {
    assert.strictEqual(normalizeRedirectPath('/index.html'), '/');
    assert.strictEqual(normalizeRedirectPath('/foo/index.html'), '/foo');
    assert.strictEqual(normalizeRedirectPath('///index.html'), '/');
  });

  await t.test('removes .html extension (except for 404.html)', () => {
    assert.strictEqual(normalizeRedirectPath('/about.html'), '/about');
    assert.strictEqual(normalizeRedirectPath('/404.html'), '/404.html');
    assert.strictEqual(normalizeRedirectPath('/contact.html'), '/contact');
  });

  await t.test('enforces trailing slashes for locale roots', () => {
    assert.strictEqual(normalizeRedirectPath('/en'), '/en/');
    assert.strictEqual(normalizeRedirectPath('/ru'), '/ru/');
    assert.strictEqual(normalizeRedirectPath('/ua'), '/ua/');
    assert.strictEqual(normalizeRedirectPath('/fr'), '/fr'); // not a locale root
  });

  await t.test('enforces trailing slashes for directory roots', () => {
    assert.strictEqual(normalizeRedirectPath('/articles'), '/articles/');
    assert.strictEqual(normalizeRedirectPath('/services'), '/services/');
    assert.strictEqual(normalizeRedirectPath('/about'), '/about'); // not a directory root
  });

  await t.test('enforces trailing slashes for locale + directory combinations', () => {
    assert.strictEqual(normalizeRedirectPath('/en/articles'), '/en/articles/');
    assert.strictEqual(normalizeRedirectPath('/ru/services'), '/ru/services/');
    assert.strictEqual(normalizeRedirectPath('/ua/about'), '/ua/about'); // about is not directory root
    assert.strictEqual(normalizeRedirectPath('/fr/articles'), '/fr/articles'); // fr is not locale root
  });

  await t.test('removes trailing slashes from standard paths', () => {
    assert.strictEqual(normalizeRedirectPath('/foo/'), '/foo');
    assert.strictEqual(normalizeRedirectPath('/foo/bar/'), '/foo/bar');
    assert.strictEqual(normalizeRedirectPath('/en/articles/my-post/'), '/en/articles/my-post');
  });

  await t.test('preserves paths with file extensions (other than .html)', () => {
    assert.strictEqual(normalizeRedirectPath('/image.png'), '/image.png');
    assert.strictEqual(normalizeRedirectPath('/styles/main.css'), '/styles/main.css');
  });

  await t.test('handles empty or root paths', () => {
    assert.strictEqual(normalizeRedirectPath('/'), '/');
    assert.strictEqual(normalizeRedirectPath(''), '/');
  });
});
