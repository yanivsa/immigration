import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

async function publishNext() {
  // 1. Find the current article count
  const articlesDir = path.join(root, "articles");
  const files = await fs.readdir(articlesDir);
  const articleFiles = files.filter(f => f.startsWith("article-") && f.endsWith(".html"));
  const currentCount = articleFiles.length;
  const nextNumber = currentCount + 1;
  const nextFilename = `article-${nextNumber.toString().padStart(2, '0')}.html`;

  // 2. Find the next folder in content_queue
  const queueDir = path.join(root, "content_queue");
  const folders = (await fs.readdir(queueDir)).sort();
  // We'll skip the ones already published (if we kept a log), 
  // but for now, we'll just take the (currentCount + 1)-th folder if we assume 1:1 mapping
  // Or, more robustly, find the first folder that doesn't have a corresponding article name 
  // (but since filenames are article-XX, we'll just use the index)
  
  if (currentCount >= folders.length) {
    console.log("No more articles in the queue!");
    return;
  }
  
  const nextFolder = folders[currentCount]; 
  const folderPath = path.join(queueDir, nextFolder);
  
  console.log(`Publishing folder: ${nextFolder} as ${nextFilename}`);

  // 3. This is where an LLM call would happen.
  // For the automation script, we assume the content is already generated or 
  // we use a placeholder/template.
  
  // NOTE: In a real automated setup, you would call an AI API here 
  // to convert the prompts in folderPath (he.md, en.md, etc.) into HTML content.

  // 4. Update index and sitemap
  // For now, this script prepares the file structure.
  
  // Running the SEO repair script to ensure metadata is consistent
  // execSync("npm run seo:fix");
}

publishNext().catch(console.error);
