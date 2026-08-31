import fs from "fs";
import path from "path";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";

export async function getLegalContent() {
  const contentBase = process.env.BLOG_CONTENT_PATH
    ? path.resolve(process.cwd(), process.env.BLOG_CONTENT_PATH)
    : path.join(process.cwd(), "blog-content");

  const fullPath = path.join(contentBase, "legal.md");
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypePrettyCode, { theme: "dark-plus", keepBackground: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(fileContents);

  return { contentHtml: processedContent.toString() };
}
