import { getPostBySlug, getAllSlugs } from "@/lib/posts";
import PostContent from "@/components/PostContent";
import TableOfContents from "@/components/TableOfContents";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    <div className="relative">
      <main className="min-w-0">
        <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-8">
          {post.date} · {post.readingTime}’ de lecture
        </p>
        <PostContent html={post.contentHtml} />
      </main>

      <div className="hidden xl:block absolute top-0 left-full h-full pl-16">
        <aside className="sticky top-8 w-64 bg-[#1a1a1a] rounded-lg p-4 border border-gray-800">
          <TableOfContents headings={post.headings} />
        </aside>
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: ["Michel"],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}
