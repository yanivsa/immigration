import test from 'node:test';
import assert from 'node:assert';
import { normalizeRedirectPath } from '../src/index.js';

test('normalizeRedirectPath', async (t) => {
  await t.test('cleans redundant slashes', () => {
    assert.strictEqual(normalizeRedirectPath('//about'), '/about');
    assert.strictEqual(normalizeRedirectPath('/about//'), '/about');
    assert.strictEqual(normalizeRedirectPath('///about///me///'), '/about/me');
  });

  await t.test('strips .html/ variations', () => {
    assert.strictEqual(normalizeRedirectPath('/about.html/'), '/about');
    assert.strictEqual(normalizeRedirectPath('/about.html//'), '/about');
  });

  await t.test('strips /index.html suffix', () => {
    assert.strictEqual(normalizeRedirectPath('/about/index.html'), '/about');
    assert.strictEqual(normalizeRedirectPath('/index.html'), '/');
  });

  await t.test('strips .html extensions', () => {
    assert.strictEqual(normalizeRedirectPath('/about.html'), '/about');
    assert.strictEqual(normalizeRedirectPath('/services/service1.html'), '/services/service1');
  });

  await t.test('preserves /404.html exact match', () => {
    assert.strictEqual(normalizeRedirectPath('/404.html'), '/404.html');
  });

  await t.test('adds trailing slashes for locale and directory roots', () => {
    assert.strictEqual(normalizeRedirectPath('/en'), '/en/');
    assert.strictEqual(normalizeRedirectPath('/ru'), '/ru/');
    assert.strictEqual(normalizeRedirectPath('/ua'), '/ua/');
    assert.strictEqual(normalizeRedirectPath('/articles'), '/articles/');
    assert.strictEqual(normalizeRedirectPath('/services'), '/services/');
    assert.strictEqual(normalizeRedirectPath('/en/articles'), '/en/articles/');
    assert.strictEqual(normalizeRedirectPath('/ru/services'), '/ru/services/');
  });

  await t.test('strips trailing slashes for paths that should not have them', () => {
    assert.strictEqual(normalizeRedirectPath('/about/'), '/about');
    assert.strictEqual(normalizeRedirectPath('/en/articles/some-article/'), '/en/articles/some-article');
    assert.strictEqual(normalizeRedirectPath('/en/some-page/'), '/en/some-page');
    assert.strictEqual(normalizeRedirectPath('/fr/'), '/fr');
  });

  await t.test('preserves root path', () => {
    assert.strictEqual(normalizeRedirectPath('/'), '/');
  });

  await t.test('handles combinations', () => {
    assert.strictEqual(normalizeRedirectPath('//en///articles//index.html'), '/en/articles/');
    assert.strictEqual(normalizeRedirectPath('//about.html///'), '/about');
  });
});
