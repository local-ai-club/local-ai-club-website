import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleView from "../../../components/ArticleView";
import { getArticle, getPublishedArticleParams } from "../../../lib/articles";
import { isSection } from "../../../lib/i18n-routes";
import { buildArticleMetadata } from "../../../lib/site-metadata";

export function generateStaticParams() {
  return getPublishedArticleParams("en");
}

export function generateMetadata({
  params,
}: {
  params: { section: string; slug: string };
}): Metadata {
  const article = getArticle(params.section, params.slug, "en");
  if (!article) {
    return {};
  }

  return buildArticleMetadata(article);
}

export default function EnglishArticlePage({
  params,
}: {
  params: { section: string; slug: string };
}) {
  if (!isSection(params.section)) {
    notFound();
  }

  const article = getArticle(params.section, params.slug, "en");
  if (!article) {
    notFound();
  }

  return <ArticleView article={article} />;
}
