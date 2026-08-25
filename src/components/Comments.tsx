"use client";

import Giscus from "@giscus/react";

export default function Comments({ title }: { title: string }) {
  return (
    <Giscus
      id="comments"
      repo="mlamsoul/blog-nextjs"
      repoId="R_kgDOThLLpg"
      category="General"
      categoryId="DIC_kwDOThLLps4DDp5l"
      mapping="og:title"
      term={title}
      strict="1"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme="dark_dimmed"
      lang="fr"
      loading="lazy"
    />
  );
}
