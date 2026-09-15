export type Lang = "zh" | "en";

export const SECTIONS = [
  "learn",
  "benchmarks",
  "projects",
  "agents",
  "bounties",
  "community",
] as const;

export type Section = (typeof SECTIONS)[number];
export type View = "home" | Section;

const SECTION_SET = new Set<string>(SECTIONS);

export function isSection(value: string): value is Section {
  return SECTION_SET.has(value);
}

export function viewToPath(lang: Lang, view: View): string {
  if (view === "home") {
    return lang === "en" ? "/en" : "/";
  }

  return lang === "en" ? `/en/${view}` : `/${view}`;
}

export function toggleLangPath(lang: Lang, view: View): string {
  return viewToPath(lang === "zh" ? "en" : "zh", view);
}

export const ROUTE_EXPORT_MARKERS: Record<View, { zh: string; en: string }> = {
  home: {
    zh: "我的设备能运行什么模型",
    en: "What models can my device run",
  },
  learn: {
    zh: "从第一次运行，到构建完整的本地 AI",
    en: "From your first run to building complete local AI",
  },
  benchmarks: {
    zh: "不只看排行榜，更要能够复现",
    en: "Beyond leaderboards — reproducible",
  },
  projects: {
    zh: "找到工具，也找到参与项目的入口",
    en: "Find tools — and ways to get involved",
  },
  agents: {
    zh: "让企业级 Agent 真正运行在本地 AI 之上",
    en: "Enterprise agents that truly run on local AI",
  },
  bounties: {
    zh: "把真实需求，变成可验收的开放任务",
    en: "Turn real needs into verifiable open tasks",
  },
  community: {
    zh: "交流的终点，是沉淀新的公共成果",
    en: "Conversations that become public goods",
  },
};

export function allLocalizedRoutes(): {
  path: string;
  output: string;
  marker: string;
}[] {
  const views: View[] = ["home", ...SECTIONS];

  return views.flatMap((view) =>
    (["zh", "en"] as const).map((lang) => {
      const pathname = viewToPath(lang, view);
      const output =
        pathname === "/"
          ? "index.html"
          : `${pathname.slice(1)}/index.html`;

      return {
        path: `https://local-ai.club${pathname === "/" ? "/" : pathname}`,
        output,
        marker: ROUTE_EXPORT_MARKERS[view][lang],
      };
    }),
  );
}
