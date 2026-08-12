import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remarkWikilink from "./remark-wikilink";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";
import remarkParse from "remark-parse";
import rehypeSlug from "rehype-slug";

const contentBase = process.env.BLOG_CONTENT_PATH
  ? path.resolve(process.cwd(), process.env.BLOG_CONTENT_PATH)
  : path.join(process.cwd(), "blog-content");

const postsDirectory = path.join(contentBase, "content/posts");

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
}

export function getAllPosts(): PostMeta[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? "",
        tags: data.tags ?? [],
        excerpt: data.excerpt ?? "",
        cover: data.cover ?? null,
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

export async function getPostBySlug(slug: string) {
  const decodedSlug = decodeURIComponent(slug);
  const fullPath = path.join(postsDirectory, `${decodedSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const wikilinkMap = buildWikilinkMap();

  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkWikilink, { map: wikilinkMap })
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
