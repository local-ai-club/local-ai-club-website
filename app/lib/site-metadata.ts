import type { Metadata } from "next";
import { viewToPath, type Lang, type View } from "./i18n-routes";

const siteUrl = process.env.SITE_URL ?? process.env.CF_PAGES_URL ?? "https://local-ai.club";
const siteRoot = new URL(siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`);
const ogImage = new URL("og.png", siteRoot).toString();

type PageCopy = {
  title: string;
  description: string;
  openGraphDescription: string;
};

export const PAGE_COPY: Record<View, Record<Lang, PageCopy>> = {
  home: {
    zh: {
      title: "Local AI Club",
      description: "面向本地、端侧、边缘与私有化 AI 的开放技术社区。",
      openGraphDescription: "让 AI 在自己的设备上运行。",
    },
    en: {
      title: "Local AI Club",
      description: "An open technical community for local, on-device, edge and private AI.",
      openGraphDescription: "Run AI on your own device.",
    },
  },
  learn: {
    zh: {
      title: "学习 · Local AI Club",
      description: "围绕设备、模型、推理、应用与安全组织的连续知识体系。每篇实践内容都标明版本、环境与复现状态。",
      openGraphDescription: "从第一次运行，到构建完整的本地 AI。",
    },
    en: {
      title: "Learn · Local AI Club",
      description: "A continuous body of knowledge organized around devices, models, inference, applications and security. Every guide lists versions, environment and reproduction status.",
      openGraphDescription: "From your first run to building complete local AI.",
    },
  },
  benchmarks: {
    zh: {
      title: "评测 · Local AI Club",
      description: "公开模型、量化、引擎、设备、参数、脚本与原始数据。结论必须说明适用边界。",
      openGraphDescription: "不只看排行榜，更要能够复现。",
    },
    en: {
      title: "Benchmarks · Local AI Club",
      description: "Open models, quantizations, engines, devices, parameters, scripts and raw data. Every conclusion states its limits.",
      openGraphDescription: "Beyond leaderboards — reproducible.",
    },
  },
  projects: {
    zh: {
      title: "项目 · Local AI Club",
      description: "项目档案不止收录链接，还展示许可证、支持矩阵、维护状态、实测记录与适合首次贡献的任务。",
      openGraphDescription: "找到工具，也找到参与项目的入口。",
    },
    en: {
      title: "Projects · Local AI Club",
      description: "Project profiles go beyond links: licenses, support matrices, maintenance status, benchmarks and first-contribution tasks.",
      openGraphDescription: "Find tools — and ways to get involved.",
    },
  },
  agents: {
    zh: {
      title: "企业 Agent · Local AI Club",
      description: "聚焦能够连接本地模型与企业内部系统，并具备权限、审计、可观测、安全隔离和可靠运行能力的 Agent。",
      openGraphDescription: "让企业级 Agent 真正运行在本地 AI 之上。",
    },
    en: {
      title: "Enterprise Agents · Local AI Club",
      description: "Agents that connect local models to internal systems, with permissions, audit, observability, isolation and reliability.",
      openGraphDescription: "Enterprise agents that truly run on local AI.",
    },
  },
  bounties: {
    zh: {
      title: "悬赏 · Local AI Club",
      description: "每项悬赏都明确交付物、验收标准、开放许可证、评审人、期限和奖励。",
      openGraphDescription: "把真实需求，变成可验收的开放任务。",
    },
    en: {
      title: "Bounties · Local AI Club",
      description: "Every bounty states deliverables, acceptance criteria, open license, reviewers, deadline and reward.",
      openGraphDescription: "Turn real needs into verifiable open tasks.",
    },
  },
  community: {
    zh: {
      title: "社区 · Local AI Club",
      description: "加入工作组、参加活动、回答问题或完成一次微小贡献。重要讨论将被整理为长期可搜索的知识。",
      openGraphDescription: "交流的终点，是沉淀新的公共成果。",
    },
    en: {
      title: "Community · Local AI Club",
      description: "Join working groups, attend events, answer questions or make a small contribution. Key discussions become searchable knowledge.",
      openGraphDescription: "Conversations that become public goods.",
    },
  },
};

export function buildPageMetadata(lang: Lang, view: View): Metadata {
  const copy = PAGE_COPY[view][lang];
  const canonicalPath = viewToPath(lang, view);

  return {
    title: copy.title,
    description: copy.description,
    openGraph: {
      title: copy.title,
      description: copy.openGraphDescription,
      type: "website",
      url: new URL(canonicalPath.slice(1), siteRoot).toString(),
      images: [{ url: ogImage, width: 1200, height: 630, alt: "Local AI Club" }],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.openGraphDescription,
      images: [ogImage],
    },
    alternates: {
      canonical: canonicalPath,
      languages: {
        "zh-CN": viewToPath("zh", view),
        en: viewToPath("en", view),
      },
    },
  };
}
