import Link from "next/link";
import { PostMeta } from "@/lib/posts";
import { Clock } from "lucide-react";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <li>
      <Link
        href={`/posts/${encodeURIComponent(post.slug)}`}
        className="text-xl font-semibold hover:underline"
      >
        {post.title}
      </Link>
      <p className="flex items-center gap-2 text-sm text-gray-500">
        <span>
          Publié le{" "}
          {new Date(post.date).toLocaleDateString("fr-BE", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
        <span className="mx-1">·</span>
        <span className="inline-flex items-center gap-1">
          <Clock size={15} />
          {post.readingTime}’ de lecture
        </span>
      </p>
      {post.excerpt && <p className="mt-1 text-gray-600">{post.excerpt}</p>}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs bg-gray-800 text-gray-500">
              {tag}
            </span>
          ))}
        </div>
      )}
    </li>
  );
}
