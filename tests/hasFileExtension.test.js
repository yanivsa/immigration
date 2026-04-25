import { hasFileExtension } from '../src/index.js';

describe('hasFileExtension', () => {
  it('should return true for files with standard extensions', () => {
    expect(hasFileExtension('index.html')).toBe(true);
    expect(hasFileExtension('/path/to/image.png')).toBe(true);
    expect(hasFileExtension('/css/style.css')).toBe(true);
    expect(hasFileExtension('/js/app.js')).toBe(true);
  });

  it('should return true for files with multiple dots', () => {
    expect(hasFileExtension('archive.tar.gz')).toBe(true);
    expect(hasFileExtension('/path/to/script.min.js')).toBe(true);
  });

  it('should return false for paths without extensions', () => {
    expect(hasFileExtension('/path/to/directory/')).toBe(false);
    expect(hasFileExtension('/path/to/directory')).toBe(false);
    expect(hasFileExtension('/about')).toBe(false);
    expect(hasFileExtension('/')).toBe(false);
    expect(hasFileExtension('')).toBe(false);
  });

  it('should return true for dotfiles', () => {
    expect(hasFileExtension('.gitignore')).toBe(true);
    expect(hasFileExtension('/path/.env')).toBe(true);
  });

  it('should handle edge cases correctly', () => {
    expect(hasFileExtension('.hidden.txt')).toBe(true);
    expect(hasFileExtension('/path/to/file.')).toBe(false);
    expect(hasFileExtension('/my.dir/file')).toBe(false);
  });
});
