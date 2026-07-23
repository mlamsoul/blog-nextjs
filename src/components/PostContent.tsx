"use client";

import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import CopyButton from "./CopyButton";

export default function PostContent({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const pres = ref.current.querySelectorAll("pre");
    console.log("pre blocks found:", pres.length);

    pres.forEach((pre) => {
      if (pre.querySelector(".copy-btn-mount")) return;

      const code = pre.querySelector("code");
      const text = code?.innerText ?? "";

      const mount = document.createElement("div");
      mount.className = "copy-btn-mount";
      mount.style.cssText = "position:absolute;top:8px;right:8px;z-index:10;";
      pre.style.position = "relative";
      pre.appendChild(mount);

      try {
        createRoot(mount).render(<CopyButton text={text} />);
      } catch (e) {
        console.error("createRoot error:", e);
      }
    });
  }, [html]);

  return (
    <article
      ref={ref}
      className="prose prose-neutral dark:prose-invert max-w-none prose-code:before:content-none prose-code:after:content-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
