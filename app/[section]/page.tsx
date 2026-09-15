import type { Metadata } from "next";
import SectionPageRoute from "../components/SectionPageRoute";
import { buildPageMetadata } from "../lib/site-metadata";
import { isSection, SECTIONS } from "../lib/i18n-routes";

export function generateStaticParams() {
  return SECTIONS.map((section) => ({ section }));
}

export function generateMetadata({
  params,
}: {
  params: { section: string };
}): Metadata {
  if (!isSection(params.section)) {
    return {};
  }

  return buildPageMetadata("zh", params.section);
}

export default function ChineseSectionPage({
  params,
}: {
  params: { section: string };
}) {
  return <SectionPageRoute lang="zh" section={params.section} />;
}
