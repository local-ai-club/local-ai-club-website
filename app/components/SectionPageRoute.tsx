import { notFound } from "next/navigation";
import { getPublishedArticleList } from "../lib/articles";
import SitePage from "./SitePage";
import { isSection, type Lang } from "../lib/i18n-routes";

export default function SectionPageRoute({
  lang,
  section,
}: {
  lang: Lang;
  section: string;
}) {
  if (!isSection(section)) {
    notFound();
  }

  return (
    <SitePage
      key={section}
      lang={lang}
      view={section}
      articles={getPublishedArticleList(section, lang)}
    />
  );
}
