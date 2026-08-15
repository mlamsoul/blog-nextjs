import { getPostBySlug, getAllSlugs } from "@/lib/posts";
import PostContent from "@/components/PostContent";
import TableOfContents from "@/components/TableOfContents";
import Link from "next/link";

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
          Publié le{" "}
          {new Date(post.date).toLocaleDateString("fr-BE", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}{" "}
          · {post.readingTime}’ de lecture
        </p>
        <PostContent html={post.contentHtml} />
      </main>

      <div className="hidden xl:block absolute top-0 left-full h-full pl-16">
        <div className="sticky top-8 w-64 flex flex-col gap-2">
          <Link
            href="/"
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors no-underline bg-[#1a1a1a] border border-gray-800 rounded-lg px-3 py-2"
          >
            <img src="/images/logo.svg" alt="Logo" className="w-5 h-5" />
            Retour aux articles
          </Link>

          <aside className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800">
            <TableOfContents headings={post.headings} title={post.title} />
          </aside>
        </div>
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
