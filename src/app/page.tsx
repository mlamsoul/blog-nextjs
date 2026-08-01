import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  const posts = getAllPosts();

  return (
    <main>
      <ul className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </ul>
    </main>
  );
}
