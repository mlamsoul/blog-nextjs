import { cpSync, mkdirSync } from "fs";
import { join, resolve } from "path";
import { config } from "dotenv";

config({ path: ".env.local" });

const contentBase = process.env.BLOG_CONTENT_PATH
  ? resolve(process.cwd(), process.env.BLOG_CONTENT_PATH)
  : join(process.cwd(), "blog-content");

const src = join(contentBase, "content/posts/images");
const dest = join(process.cwd(), "public/images");

mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });
console.log("Images synced from", src);
console.log("BLOG_CONTENT_PATH:", process.env.BLOG_CONTENT_PATH);
console.log("src:", src);
console.log("dest:", dest);
