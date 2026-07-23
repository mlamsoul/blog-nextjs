import { cpSync, mkdirSync, copyFileSync } from "fs";
import { join, resolve, basename } from "path";
import { config } from "dotenv";
import chokidar from "chokidar";

config({ path: ".env.local" });

const contentBase = process.env.BLOG_CONTENT_PATH
  ? resolve(process.cwd(), process.env.BLOG_CONTENT_PATH)
  : join(process.cwd(), "blog-content");

const src = join(contentBase, "content/posts/images");
const dest = join(process.cwd(), "public/images");

mkdirSync(dest, { recursive: true });

// Sync initial
cpSync(src, dest, { recursive: true });
console.log("Images synced.");

// Watch
chokidar.watch(src).on("add", (filePath) => {
  const filename = basename(filePath);
  copyFileSync(filePath, join(dest, filename));
  console.log("New image synced:", filename);
});

console.log("Watching for new images...");
