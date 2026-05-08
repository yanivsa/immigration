import { test } from 'node:test';
import assert from 'node:assert';
import { stripLocalePrefix } from './seo-fix.mjs';

test('stripLocalePrefix removes supported locale prefixes', () => {
    assert.strictEqual(stripLocalePrefix('en/files'), 'files');
    assert.strictEqual(stripLocalePrefix('ru/files/more'), 'files/more');
    assert.strictEqual(stripLocalePrefix('ua/index.html'), 'index.html');
});

test('stripLocalePrefix leaves unprotected roots and non-matching paths intact', () => {
    assert.strictEqual(stripLocalePrefix('he/files'), 'he/files');
    assert.strictEqual(stripLocalePrefix('fr/files'), 'fr/files');
    assert.strictEqual(stripLocalePrefix('files/en/test'), 'files/en/test');
    assert.strictEqual(stripLocalePrefix('english/files'), 'english/files');
    assert.strictEqual(stripLocalePrefix('files'), 'files');
});
