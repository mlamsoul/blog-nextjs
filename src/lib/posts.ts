import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remarkWikilink from "./remark-wikilink";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";
import { visit } from "unist-util-visit";
import type { Root, Image } from "mdast";

const AI_WATERMARK_CHARS = [
  "\u200B", // Zero-Width Space
  "\u200C", // Zero-Width Non-Joiner
  "\u200D", // Zero-Width Joiner
  "\uFEFF", // Zero-Width No-Break Space (BOM)
  "\u00AD", // Soft Hyphen
  "\u200E", // Left-to-Right Mark
  "\u200F", // Right-to-Left Mark
  "\u2060", // Word Joiner
  "\u2061", // Function Application
  "\u2062", // Invisible Times
  "\u2063", // Invisible Separator
  "\u2064", // Invisible Plus
  "\u206A", // Inhibit Symmetric Swapping
  "\u206B", // Activate Symmetric Swapping
  "\u206C", // Inhibit Arabic Form Shaping
  "\u206D", // Activate Arabic Form Shaping
  "\u206E", // National Digit Shapes
  "\u206F", // Nominal Digit Shapes
  "\uE0001", // Language Tag
];

const COLOR_RESET = "\x1b[0m";
const COLOR_RED = "\x1b[31m";
const COLOR_GREEN = "\x1b[32m";

const contentBase = process.env.BLOG_CONTENT_PATH
  ? path.resolve(process.cwd(), process.env.BLOG_CONTENT_PATH)
  : path.join(process.cwd(), "blog-content");

const postsDirectory = path.join(contentBase, "content/posts");

function stripAiWatermarks(content: string): string {
  const regex = new RegExp(AI_WATERMARK_CHARS.join("|"), "g");
  const stripped = content.replace(regex, "");

  const removed = content.length - stripped.length;

  if (removed > 0) {
    console.warn(
      `${COLOR_RED}[watermark] ⚠ stripped ${removed} invisible character(s) from content${COLOR_RESET}`,
    );
  } else {
    console.log(`${COLOR_GREEN}[watermark] ✓ OK${COLOR_RESET}`);
  }
  return stripped;
}

console.log("postsDirectory:", postsDirectory);

export interface Heading {
  id: string;
  text: string;
  level: number;
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt?: string;
  cover?: string | null;
  readingTime: number;
}

export function getAllPosts(): PostMeta[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const cleaned = stripAiWatermarks(fileContents);
      const { data, content } = matter(cleaned);
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? "",
        tags: data.tags ?? [],
        excerpt: data.excerpt ?? "",
        cover: data.cover ?? null,
        readingTime: calculateReadingTime(content),
        draft: data.draft ?? false,
      };
    })
    .filter((post) => !post.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

function buildWikilinkMap(): { [key: string]: string } {
  const fileNames = fs.readdirSync(postsDirectory);
  const map: { [key: string]: string } = {};

  for (const fileName of fileNames) {
    if (!fileName.endsWith(".md")) continue;
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    const normalize = (text: string) =>
      text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");

    map[normalize(slug)] = slug;
    if (data.title) {
      map[normalize(data.title)] = slug;
    }
  }
  return map;
}

function extractHeadingsFromHtml(html: string): Heading[] {
  const headings: Heading[] = [];
  const regex = /<h([1-3])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[1-3]>/g;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const id = match[2];
    const text = match[3].replace(/<[^>]+>/g, ""); // retire les balises HTML
    headings.push({ id, text, level });
  }

  return headings;
}

function remarkImageSize() {
  return (tree: Root) => {
    visit(tree, "image", (node: Image) => {
      const match = node.alt?.match(/^(.*)\|(\d+)$/);
      if (match) {
        node.alt = match[1].trim();
        node.data = node.data || {};
        node.data.hProperties = {
          ...(node.data.hProperties || {}),
          width: match[2],
          style: `width:${match[2]}px`,
        };
      }
    });
  };
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export async function getPostBySlug(slug: string) {
  const decodedSlug = decodeURIComponent(slug);
  const fullPath = path.join(postsDirectory, `${decodedSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content: rawContent } = matter(fileContents);
  const content = stripAiWatermarks(rawContent);

  const wikilinkMap = buildWikilinkMap();

  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkWikilink, { map: wikilinkMap })
    .use(remarkImageSize)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypePrettyCode, {
      theme: "material-theme-darker",
      keepBackground: true,
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  const contentHtml = processedContent.toString();
  const headings = extractHeadingsFromHtml(contentHtml);

  return {
    slug: decodedSlug,
    title: data.title ?? decodedSlug,
    date: data.date ?? "",
    tags: data.tags ?? [],
    cover: data.cover ?? null,
    excerpt: data.excerpt ?? "",
    readingTime: calculateReadingTime(content),
    contentHtml,
    headings,
  };
}

export function getAllSlugs(): string[] {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""));
}
