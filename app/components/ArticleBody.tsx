"use client";

import type { Lang } from "../lib/i18n-routes";

const copiedLabel: Record<Lang, string> = {
  zh: "已复制",
  en: "Copied",
};

export default function ArticleBody({
  html,
  lang,
}: {
  html: string;
  lang: Lang;
}) {
  return (
    <article
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
        void navigator.clipboard.writeText(code).then(() => {
          button.textContent = copiedLabel[lang];
          window.setTimeout(() => {
            button.textContent = original;
          }, 1600);
        }).catch(() => {});
      }}
    />
  );
}
