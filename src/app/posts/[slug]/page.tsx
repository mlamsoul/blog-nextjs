import type { Metadata } from "next";
import { getPostBySlug, getAllSlugs } from "@/lib/posts";
import PostContent from "@/components/PostContent";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return (
    <main>
      <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-6">{post.date}</p>
      <PostContent html={post.contentHtml} />
    </main>
  );
}

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }): Promise<Metadata> {
//   const { slug } = await params;
//   const post = await getPostBySlug(slug);

//   return {
//     title: post.title,
//     description: post.description,
//     openGraph: {
//       title: post.title,
//       description: post.description,
//       type: "article",
//       images: post.image
//         ? [
//             {
//               url: post.image,
//             },
//           ]
//         : [],
//     },
//   };
// }
