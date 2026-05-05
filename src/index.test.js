import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  hasFileExtension,
  cleanPath,
  shouldHaveTrailingSlash,
  normalizeRedirectPath
} from './index.js';

describe('index.js utility functions', () => {
  describe('hasFileExtension', () => {
    it('returns true for files with extensions', () => {
      assert.strictEqual(hasFileExtension('index.html'), true);
      assert.strictEqual(hasFileExtension('/path/to/script.js'), true);
      assert.strictEqual(hasFileExtension('style.css'), true);
      assert.strictEqual(hasFileExtension('image.png'), true);
    });

    it('returns false for paths without extensions', () => {
      assert.strictEqual(hasFileExtension('/about'), false);
      assert.strictEqual(hasFileExtension('/services/'), false);
      assert.strictEqual(hasFileExtension('en'), false);
      assert.strictEqual(hasFileExtension('/en/articles/article-name'), false);
    });

    it('returns false for paths ending in a dot', () => {
      assert.strictEqual(hasFileExtension('.'), false);
      assert.strictEqual(hasFileExtension('/.'), false);
    });

    it('returns true for hidden files (as they are basically extensions)', () => {
      // The current regex /\.[^/]+$/ treats /.hidden as having an extension.
      // We document this current behavior in the test.
      assert.strictEqual(hasFileExtension('/.hidden'), true);
    });
  });

  describe('cleanPath', () => {
    it('removes duplicate slashes', () => {
      assert.strictEqual(cleanPath('//'), '/');
      assert.strictEqual(cleanPath('///about//me'), '/about/me');
      assert.strictEqual(cleanPath('/services////consulting'), '/services/consulting');
    });

    it('keeps normal paths unchanged', () => {
      assert.strictEqual(cleanPath('/'), '/');
      assert.strictEqual(cleanPath('/about'), '/about');
      assert.strictEqual(cleanPath('/about/'), '/about/');
      assert.strictEqual(cleanPath('about'), 'about');
    });
  });

  describe('shouldHaveTrailingSlash', () => {
    it('returns true for locale roots', () => {
      assert.strictEqual(shouldHaveTrailingSlash('en'), true);
      assert.strictEqual(shouldHaveTrailingSlash('/ru'), true);
      assert.strictEqual(shouldHaveTrailingSlash('ua/'), true);
    });

    it('returns true for directory roots', () => {
      assert.strictEqual(shouldHaveTrailingSlash('articles'), true);
      assert.strictEqual(shouldHaveTrailingSlash('/services/'), true);
    });

    it('returns true for combined locale and directory roots', () => {
      assert.strictEqual(shouldHaveTrailingSlash('en/articles'), true);
      assert.strictEqual(shouldHaveTrailingSlash('/ru/services/'), true);
    });

    it('returns false for other paths', () => {
      assert.strictEqual(shouldHaveTrailingSlash('about'), false);
      assert.strictEqual(shouldHaveTrailingSlash('/en/about'), false);
      assert.strictEqual(shouldHaveTrailingSlash('/articles/post-1'), false);
      assert.strictEqual(shouldHaveTrailingSlash('/en/services/consulting'), false);
    });
  });

  describe('normalizeRedirectPath', () => {
    it('cleans paths', () => {
      assert.strictEqual(normalizeRedirectPath('//about'), '/about');
      assert.strictEqual(normalizeRedirectPath('/about//me/'), '/about/me');
    });

    it('removes /index.html', () => {
      assert.strictEqual(normalizeRedirectPath('/about/index.html'), '/about');
      assert.strictEqual(normalizeRedirectPath('/index.html'), '/');
    });

    it('removes .html extension (unless it is /404.html)', () => {
      assert.strictEqual(normalizeRedirectPath('/about.html'), '/about');
      assert.strictEqual(normalizeRedirectPath('/services/consulting.html'), '/services/consulting');
      assert.strictEqual(normalizeRedirectPath('/404.html'), '/404.html');
    });

    it('adds trailing slash where needed', () => {
      assert.strictEqual(normalizeRedirectPath('/en'), '/en/');
      assert.strictEqual(normalizeRedirectPath('/ru/services'), '/ru/services/');
      assert.strictEqual(normalizeRedirectPath('/articles'), '/articles/');
    });

    it('removes trailing slash where it should not be', () => {
      assert.strictEqual(normalizeRedirectPath('/about/'), '/about');
      assert.strictEqual(normalizeRedirectPath('/en/about/'), '/en/about');
      assert.strictEqual(normalizeRedirectPath('/articles/post-1/'), '/articles/post-1');
    });

    it('leaves files with extensions (other than .html or /index.html) alone', () => {
      assert.strictEqual(normalizeRedirectPath('/style.css'), '/style.css');
      assert.strictEqual(normalizeRedirectPath('/script.js'), '/script.js');
      assert.strictEqual(normalizeRedirectPath('/image.png/'), '/image.png');
    });
  });
});
