import ArticleBody from "./ArticleBody";
import { enhanceArticleHtml } from "../lib/article-html";
import { getArticleTranslation, type ArticleRecord } from "../lib/articles";
import {
  articleToPath,
  viewToPath,
  type Lang,
} from "../lib/i18n-routes";
import SiteChrome from "./SiteChrome";

const copy = {
  zh: {
    back: "返回栏目",
    environment: "运行环境",
    os: "系统",
    engine: "引擎",
    model: "模型",
    version: "版本",
    license: "许可证",
    author: "作者",
    updated: "更新",
    difficulty: {
      beginner: "入门",
      intermediate: "进阶",
      advanced: "高级",
    },
    reproStatus: {
      draft: "草稿",
      reproduced: "已复现",
      pending: "待复现",
      failed: "复现失败",
    },
  },
  en: {
    back: "Back to section",
    environment: "Environment",
    os: "OS",
    engine: "Engine",
    model: "Model",
    version: "Version",
    license: "License",
    author: "Author",
    updated: "Updated",
    difficulty: {
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
    },
    reproStatus: {
      draft: "Draft",
      reproduced: "Reproduced",
      pending: "Pending",
      failed: "Failed",
    },
  },
} as const;

function formatDate(value: string): string {
  return value.slice(0, 10);
}

function readTimeLabel(lang: Lang, minutes: number): string {
  return lang === "zh" ? `${minutes} 分钟` : `${minutes} min`;
}

export default function ArticleView({ article }: { article: ArticleRecord }) {
  const lang = article.lang as Lang;
  const t = copy[lang];
  const translation = getArticleTranslation(article);
  const langHref = translation
    ? articleToPath(translation.lang, translation.section, translation.slug)
    : viewToPath(lang === "zh" ? "en" : "zh", article.section);
  const published = formatDate(article.publishedAt);
  const updated = article.updatedAt ? formatDate(article.updatedAt) : published;

  return (
    <SiteChrome lang={lang} view={article.section} langHref={langHref}>
      <main className="article-page">
        <header className="article-hero">
          <a className="article-back" href={viewToPath(lang, article.section)}>
            ← {t.back}
          </a>
          <span className="article-kicker">{article.section.toUpperCase()}</span>
          <h1>{article.title}</h1>
          <p>{article.summary}</p>
          <ul className="article-meta">
            <li>{t.difficulty[article.difficulty]}</li>
            <li>{t.reproStatus[article.reproStatus]}</li>
            <li>{readTimeLabel(lang, article.readTime)}</li>
            <li>{published}</li>
          </ul>
        </header>
        <section className="article-layout">
          <ArticleBody html={enhanceArticleHtml(article.body, lang)} lang={lang} />
          <aside className="article-aside">
            <span className="aside-label">{t.environment}</span>
            <dl>
              {article.environment?.os ? <div><dt>{t.os}</dt><dd>{article.environment.os}</dd></div> : null}
              {article.environment?.engine ? <div><dt>{t.engine}</dt><dd>{article.environment.engine}</dd></div> : null}
              {article.environment?.model ? <div><dt>{t.model}</dt><dd>{article.environment.model}</dd></div> : null}
              {article.version ? <div><dt>{t.version}</dt><dd>{article.version}</dd></div> : null}
              {article.license ? <div><dt>{t.license}</dt><dd>{article.license}</dd></div> : null}
              <div><dt>{t.author}</dt><dd>{article.author}</dd></div>
              <div><dt>{t.updated}</dt><dd>{updated}</dd></div>
            </dl>
          </aside>
        </section>
      </main>
    </SiteChrome>
  );
}
