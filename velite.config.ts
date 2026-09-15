import { defineConfig, s } from "velite";
import { SECTIONS, type Lang, type Section } from "./app/lib/i18n-routes";

const SECTION_SET = new Set<string>(SECTIONS);
const LANGS = ["zh", "en"] as const;

function isSection(value: string): value is Section {
  return SECTION_SET.has(value);
}

function isLang(value: string): value is Lang {
  return (LANGS as readonly string[]).includes(value);
}

export default defineConfig({
  root: "content",
  strict: true,
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    clean: true,
  },
  collections: {
    articles: {
      name: "Article",
      pattern: "articles/**/*.md",
      schema: s
        .object({
          title: s.string().max(120),
          summary: s.string().max(300),
          tags: s.array(s.string()).default([]),
          difficulty: s.enum(["beginner", "intermediate", "advanced"]),
          readTime: s.number().min(1),
          author: s.string(),
          publishedAt: s.isodate(),
          updatedAt: s.isodate().optional(),
          reproStatus: s.enum(["draft", "reproduced", "pending", "failed"]),
          version: s.string().optional(),
          license: s.string().optional(),
          status: s.enum(["draft", "published"]).default("published"),
          environment: s
            .object({
              os: s.string().optional(),
              engine: s.string().optional(),
              model: s.string().optional(),
            })
            .optional(),
          path: s.path({ removeIndex: false }),
          body: s.markdown(),
        })
        .transform((data) => {
          const segments = data.path.split("/").filter(Boolean);
          const file = segments.at(-1) ?? "";
          const slug = segments.at(-2) ?? "";
          const section = segments.at(-3) ?? "";
          const lang = file.split(".").at(-1) ?? "";

          if (!isSection(section) || !isLang(lang) || slug.length === 0) {
            throw new Error(
              `Article path must be articles/{section}/{slug}/index.{zh|en}: ${data.path}`,
            );
          }

          return {
            ...data,
            section,
            slug,
            lang,
          };
        }),
    },
  },
});
