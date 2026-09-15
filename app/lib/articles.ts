import { articles } from "../../.velite/index.js";
import { isSection, type Lang, type Section } from "./i18n-routes";

export type ArticleRecord = (typeof articles)[number];

function isPublished(article: ArticleRecord): boolean {
  return article.status === "published";
}

export function getPublishedArticles(lang?: Lang): ArticleRecord[] {
  return articles.filter(
    (article) =>
      isPublished(article) &&
      isSection(article.section) &&
      (lang === undefined || article.lang === lang),
  );
}

export function getArticle(
  section: string,
  slug: string,
  lang: Lang,
): ArticleRecord | undefined {
  if (!isSection(section)) {
    return undefined;
  }

  return getPublishedArticles(lang).find(
    (article) => article.section === section && article.slug === slug,
  );
}

export function getPublishedArticleParams(lang: Lang): {
  section: Section;
  slug: string;
}[] {
  return getPublishedArticles(lang).map((article) => ({
    section: article.section,
    slug: article.slug,
  }));
}

export function getArticleTranslation(article: ArticleRecord): ArticleRecord | undefined {
  const otherLang: Lang = article.lang === "zh" ? "en" : "zh";
  return getArticle(article.section, article.slug, otherLang);
}
