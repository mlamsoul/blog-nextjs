"use client";

import Giscus from "@giscus/react";
import { useState } from "react";

export default function Comments({ title }: { title: string }) {
  const [isLoaded, setIsLoaded] = useState(false);

  if (!isLoaded) {
    return (
      <section className="mt-12 border-t border-gray-700 pt-8">
        <p className="mb-4 text-sm leading-6 text-gray-400">
          Les commentaires sont fournis par GitHub via Giscus. En les affichant,
          vous acceptez que GitHub traite des données conformément à sa
          politique de confidentialité.
        </p>
        <button
          type="button"
          onClick={() => setIsLoaded(true)}
          className="rounded-md border border-gray-600 bg-gray-800 px-4 py-2 text-sm text-gray-200 transition-colors hover:border-gray-400 hover:text-white"
        >
          Afficher les commentaires GitHub
        </button>
      </section>
    );
  }

  return (
    <section className="mt-12 border-t border-gray-700 pt-8">
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
    </section>
  );
}
