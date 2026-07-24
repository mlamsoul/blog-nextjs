import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remarkWikilink from "./remark-wikilink";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";

const postsDirectory = path.join(process.cwd(), "blog-content/content/posts");

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
    .use(rehypePrettyCode, {
      theme: "dark-plus",
      keepBackground: true,
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  const contentHtml = processedContent.toString();

  return {
    slug: decodedSlug,
    title: data.title ?? decodedSlug,
    date: data.date ?? "",
    tags: data.tags ?? [],
    cover: data.cover ?? null,
    contentHtml,
  };
}

export function getAllSlugs(): string[] {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""));
}
