import type { Metadata } from "next";
import PostContent from "@/components/PostContent";
import { getLegalContent } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Mentions légales et vie privée",
  description: "Mentions légales et politique de confidentialité du blog de Michel Lamsoul.",
};

export default async function LegalPage() {
  const { contentHtml } = await getLegalContent();

  return (
    <main className="prose prose-neutral dark:prose-invert max-w-none">
      <PostContent html={contentHtml} />
    </main>
  );
}
