"use client";

import { useEffect, useRef } from "react";
import type { Lang } from "../lib/i18n-routes";

const copiedLabel: Record<Lang, string> = {
  zh: "已复制",
  en: "Copied",
};

const failedLabel: Record<Lang, string> = {
  zh: "复制失败",
  en: "Copy failed",
};

export default function ArticleBody({
  html,
  lang,
}: {
  html: string;
  lang: Lang;
}) {
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const regions = articleRef.current?.querySelectorAll<HTMLElement>(".article-table-scroll");
    if (!regions?.length) return;

    const updateOverflow = () => {
      regions.forEach((region) => {
        const overflowing = region.scrollWidth > region.clientWidth + 1;
        region.parentElement?.toggleAttribute("data-overflow", overflowing);
        region.tabIndex = overflowing ? 0 : -1;
      });
    };
    const observer = new ResizeObserver(updateOverflow);
    regions.forEach((region) => {
      observer.observe(region);
      const table = region.querySelector("table");
      if (table) observer.observe(table);
    });
    updateOverflow();
    return () => observer.disconnect();
  }, [html]);

  return (
    <article
      ref={articleRef}
      className="article-body"
      dangerouslySetInnerHTML={{ __html: html }}
      onClick={(event) => {
        const button = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-copy-code]");
        if (!button) {
          return;
        }

        const code = button.closest(".article-code")?.querySelector("code")?.textContent ?? "";
        if (!code) {
          return;
        }

        const original = button.textContent ?? "";
        const restore = () => {
          button.textContent = original;
        };
        void navigator.clipboard.writeText(code).then(() => {
          button.textContent = copiedLabel[lang];
          window.setTimeout(restore, 1600);
        }).catch(() => {
          button.textContent = failedLabel[lang];
          window.setTimeout(restore, 1600);
        });
      }}
    />
  );
}
