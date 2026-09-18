import type { Lang } from "./i18n-routes";

const FENCE = /<pre><code(?:\s+class="language-([^"]*)")?>([\s\S]*?)<\/code><\/pre>/g;
// Velite emits flat GFM tables; leave their contents and alignment intact.
const TABLE = /<table>[\s\S]*?<\/table>/g;

function safeLang(value: string | undefined): string {
  const lang = value?.trim().toLowerCase() ?? "";
  return /^[a-z0-9+#-]+$/.test(lang) ? lang : "code";
}

export function enhanceArticleHtml(html: string, lang: Lang): string {
  const copy = lang === "zh" ? "复制" : "Copy";
  const scrollHint = lang === "zh" ? "左右滑动查看完整表格" : "Scroll horizontally to see all columns";
  let tableNumber = 0;

  // Hero already renders the page h1; demote Markdown h1s so the article page has one heading outline.
  const demotedHeadings = html.replace(/<h1(\s[^>]*)?>([\s\S]*?)<\/h1>/g, "<h2$1>$2</h2>");
  const localized =
    lang === "zh"
      ? demotedHeadings
          .replace(/id="footnote-label">Footnotes<\/h2>/g, 'id="footnote-label">脚注</h2>')
          .replace(/aria-label="Back to reference ([^"]+)"/g, 'aria-label="返回引用 $1"')
      : demotedHeadings;

  const withCode = localized.replace(FENCE, (_match, rawLang: string | undefined, code: string) => {
    const language = safeLang(rawLang);

    return `<figure class="article-code" data-lang="${language}"><figcaption><span class="article-code-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="article-code-lang">${language}</span><button type="button" class="article-code-copy" data-copy-code aria-live="polite">${copy}</button></figcaption><pre><code class="language-${language}">${code}</code></pre></figure>`;
  });

  return withCode.replace(TABLE, (table) => {
    tableNumber += 1;
    const label = lang === "zh" ? `表格 ${tableNumber}` : `Table ${tableNumber}`;
    return `<div class="article-table"><p class="article-table-hint" aria-hidden="true">↔ ${scrollHint}</p><div class="article-table-scroll" role="region" aria-label="${label} · ${scrollHint}" tabindex="0">${table}</div></div>`;
  });
}
