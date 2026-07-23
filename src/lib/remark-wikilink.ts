import { visit } from "unist-util-visit";
import type { Root, Text, Link } from "mdast";

interface WikilinkMap {
  [key: string]: string;
}

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"];

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
}

function isImage(filename: string): boolean {
  return IMAGE_EXTENSIONS.some((ext) => filename.toLowerCase().endsWith(ext));
}

// Parse ![[image.png#right|200]] → { filename, align, width }
function parseImageEmbed(
  target: string,
  label?: string,
): {
  filename: string;
  align: string | null;
  width: number | null;
} {
  // Sépare le nom de fichier et le fragment (#right, #left, #center)
  const [filepart, fragment] = target.split("#");
  const filename = filepart.trim();

  let align: string | null = null;
  let width: number | null = null;

  if (fragment) {
    const alignMatch = fragment.match(/left|right|center/);
    if (alignMatch) align = alignMatch[0];
    const widthMatch = fragment.match(/\d+/);
    if (widthMatch) width = parseInt(widthMatch[0]);
  }

  // Le label peut contenir une largeur : ![[image.png|300]] ou ![[image.png#right|200]]
  if (label) {
    const widthFromLabel = parseInt(label);
    if (!isNaN(widthFromLabel)) width = widthFromLabel;
  }

  return { filename, align, width };
}

function buildImageHtml(
  filename: string,
  align: string | null,
  width: number | null,
): string {
  const src = `/images/${filename.split("/").pop()}`;
  const alt = filename;

  let style = "";
  if (align === "right") style = "float:right;margin:0 0 1rem 1.5rem;";
  else if (align === "left") style = "float:left;margin:0 1.5rem 1rem 0;";
  else if (align === "center") style = "display:block;margin:0 auto;";

  if (width) style += `width:${width}px;`;

  return `<img src="${src}" alt="${alt}" style="${style}" />`;
}

export default function remarkWikilink(options: { map: WikilinkMap }) {
  const { map } = options;

  return (tree: Root) => {
    visit(tree, "text", (node: Text, index, parent) => {
      if (!parent || index === undefined) return;

      const regex = /(!?)\[\[([^\]|]+)(\|([^\]]*))?\]\]/g;
      const value = node.value;

      if (!regex.test(value)) return;

      regex.lastIndex = 0;
      const newNodes: (Text | Link | { type: "html"; value: string })[] = [];
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(value)) !== null) {
        const [full, bang, target, , label] = match;

        if (match.index > lastIndex) {
          newNodes.push({
            type: "text",
            value: value.slice(lastIndex, match.index),
          });
        }

        if (bang === "!" && isImage(target.split("#")[0])) {
          const { filename, align, width } = parseImageEmbed(target, label);
          newNodes.push({
            type: "html",
            value: buildImageHtml(filename, align, width),
          });
        } else {
          const key = normalize(target);
          const realSlug = map[key];

          if (realSlug) {
            newNodes.push({
              type: "link",
              url: `/posts/${encodeURIComponent(realSlug)}`,
              children: [{ type: "text", value: label ?? target }],
            });
          } else {
            newNodes.push({
              type: "text",
              value: label ?? target,
            });
          }
        }

        lastIndex = match.index + full.length;
      }

      if (lastIndex < value.length) {
        newNodes.push({ type: "text", value: value.slice(lastIndex) });
      }

      parent.children.splice(index, 1, ...newNodes);
    });
  };
}
