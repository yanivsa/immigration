import fs from "fs/promises";
import path from "path";

export const walk = async (dir, options = {}) => {
  const {
    ignoreDirs = new Set(),
    fileFilter = (entry) => entry.name.endsWith(".html")
  } = options;

  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (ignoreDirs.has(entry.name)) continue;
      files.push(...(await walk(fullPath, options)));
    } else if (entry.isFile() && fileFilter(entry)) {
      files.push(fullPath);
    }
  }

  return files;
};
