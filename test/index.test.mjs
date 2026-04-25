import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cleanPath } from '../src/index.js';

test('cleanPath removes consecutive slashes', () => {
    assert.strictEqual(cleanPath('/a/b'), '/a/b');
    assert.strictEqual(cleanPath('//a/b'), '/a/b');
    assert.strictEqual(cleanPath('/a//b'), '/a/b');
    assert.strictEqual(cleanPath('/a/b//'), '/a/b/');
    assert.strictEqual(cleanPath('///a///b///'), '/a/b/');
    assert.strictEqual(cleanPath(''), '');
    assert.strictEqual(cleanPath('/'), '/');
    assert.strictEqual(cleanPath('//'), '/');
});
