import Link from "next/link";
import { PostMeta } from "@/lib/posts";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <li>
      <Link
        href={`/posts/${encodeURIComponent(post.slug)}`}
        className="text-xl font-semibold hover:underline"
      >
        {post.title}
      </Link>
      <p className="text-sm text-gray-500">{post.date}</p>
      {post.excerpt && <p className="mt-1 text-gray-700">{post.excerpt}</p>}
    </li>
  );
}
