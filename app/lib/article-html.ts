import type { Lang } from "./i18n-routes";

const FENCE = /<pre><code(?:\s+class="language-([^"]*)")?>([\s\S]*?)<\/code><\/pre>/g;

function safeLang(value: string | undefined): string {
  const lang = value?.trim().toLowerCase() ?? "";
  return /^[a-z0-9+#-]+$/.test(lang) ? lang : "code";
}

export function enhanceArticleHtml(html: string, lang: Lang): string {
  const copy = lang === "zh" ? "复制" : "Copy";

  return html.replace(FENCE, (_match, rawLang: string | undefined, code: string) => {
    const language = safeLang(rawLang);

    return `<figure class="article-code" data-lang="${language}"><figcaption><span class="article-code-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="article-code-lang">${language}</span><button type="button" class="article-code-copy" data-copy-code>${copy}</button></figcaption><pre><code class="language-${language}">${code}</code></pre></figure>`;
  });
}
