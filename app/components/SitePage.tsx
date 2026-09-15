"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  toggleLangPath,
  viewToPath,
  type Lang,
  type View,
} from "../lib/i18n-routes";
type Accent = "green" | "orange" | "blue" | "purple";

const navItems: { id: View; zh: string; en: string }[] = [
  { id: "home", zh: "首页", en: "Home" },
  { id: "learn", zh: "学习", en: "Learn" },
  { id: "benchmarks", zh: "评测", en: "Benchmarks" },
  { id: "projects", zh: "项目", en: "Projects" },
  { id: "agents", zh: "Agent", en: "Enterprise" },
  { id: "bounties", zh: "悬赏", en: "Bounties" },
  { id: "community", zh: "社区", en: "Community" },
];

type Bi = { zh: string; en: string };

type SectionCard = {
  tag: Bi;
  title: Bi;
  text: Bi;
  meta: Bi;
  accent: Accent;
};

type SectionContent = {
  eyebrow: string;
  title: Bi;
  intro: Bi;
  filters: { zh: string[]; en: string[] };
  cards: SectionCard[];
};

const content: Record<Exclude<View, "home">, SectionContent> = {
  learn: {
    eyebrow: "KNOWLEDGE PATHS",
    title: { zh: "从第一次运行，到构建完整的本地 AI", en: "From your first run to building complete local AI" },
    intro: { zh: "围绕设备、模型、推理、应用与安全组织的连续知识体系。每篇实践内容都标明版本、环境与复现状态。", en: "A continuous body of knowledge organized around devices, models, inference, applications and security. Every guide lists versions, environment and reproduction status." },
    filters: { zh: ["全部", "入门", "推理引擎", "本地 Agent", "RAG", "端侧 AI"], en: ["All", "Beginner", "Inference engines", "Local agents", "RAG", "On-device AI"] },
    cards: [
      { tag: { zh: "入门 · 12分钟", en: "Beginner · 12 min" }, title: { zh: "在一台普通电脑上运行第一个本地模型", en: "Run your first local model on an ordinary computer" }, text: { zh: "从设备检查、模型选择到完成第一次对话，不要求独立显卡。", en: "From checking your device and choosing a model to your first chat — no dedicated GPU required." }, meta: { zh: "已复现 · 更新于 2 天前", en: "Reproduced · Updated 2 days ago" }, accent: "green" },
      { tag: { zh: "推理引擎 · 18分钟", en: "Inference engines · 18 min" }, title: { zh: "Ollama、llama.cpp 与 LM Studio 应该怎样选择？", en: "Ollama, llama.cpp or LM Studio — how to choose?" }, text: { zh: "从易用性、性能、API、平台支持与可维护性进行比较。", en: "Comparing ease of use, performance, APIs, platform support and maintainability." }, meta: { zh: "对比指南 · 6 个环境", en: "Comparison guide · 6 environments" }, accent: "orange" },
      { tag: { zh: "本地 Agent · 26分钟", en: "Local agents · 26 min" }, title: { zh: "让编程 Agent 使用你自己的本地模型", en: "Let coding agents use your own local model" }, text: { zh: "搭建兼容 API，配置工具调用，并理解上下文与性能边界。", en: "Set up a compatible API, configure tool calling, and understand context and performance limits." }, meta: { zh: "进阶 · 附配置文件", en: "Advanced · Config files included" }, accent: "blue" },
      { tag: { zh: "RAG · 34分钟", en: "RAG · 34 min" }, title: { zh: "构建完全离线的个人文档知识库", en: "Build a fully offline personal document knowledge base" }, text: { zh: "文档解析、嵌入模型、向量检索与答案引用的完整实践。", en: "Document parsing, embedding models, vector search and cited answers — end to end." }, meta: { zh: "项目教程 · 可运行", en: "Project tutorial · Runnable" }, accent: "purple" },
    ],
  },
  benchmarks: {
    eyebrow: "OPEN BENCHMARKS",
    title: { zh: "不只看排行榜，更要能够复现", en: "Beyond leaderboards — reproducible" },
    intro: { zh: "公开模型、量化、引擎、设备、参数、脚本与原始数据。结论必须说明适用边界。", en: "Open models, quantizations, engines, devices, parameters, scripts and raw data. Every conclusion states its limits." },
    filters: { zh: ["最新实测", "Apple Silicon", "NVIDIA", "纯 CPU", "移动端", "多模态"], en: ["Latest", "Apple Silicon", "NVIDIA", "CPU only", "Mobile", "Multimodal"] },
    cards: [
      { tag: { zh: "Apple M4 Pro · 48GB", en: "Apple M4 Pro · 48GB" }, title: { zh: "7B—32B 中文模型横向实测", en: "7B–32B Chinese models benchmarked" }, text: { zh: "比较首Token延迟、生成速度、内存占用与长上下文表现。", en: "Comparing time-to-first-token, generation speed, memory and long-context behavior." }, meta: { zh: "12 个模型 · 4 个引擎", en: "12 models · 4 engines" }, accent: "green" },
      { tag: { zh: "RTX 4090 · 24GB", en: "RTX 4090 · 24GB" }, title: { zh: "本地编程模型与 Agent 任务评测", en: "Local coding models and agent task evaluation" }, text: { zh: "从代码补全扩展到工具调用、多文件修改和任务恢复。", en: "From code completion to tool calling, multi-file edits and task recovery." }, meta: { zh: "86 个任务 · 原始数据开放", en: "86 tasks · Raw data open" }, accent: "orange" },
      { tag: { zh: "CPU ONLY", en: "CPU ONLY" }, title: { zh: "没有独显，Local AI 能做到什么？", en: "No GPU — what can local AI do?" }, text: { zh: "覆盖8款常见桌面CPU，给出模型上限与可接受体验区间。", en: "Covering 8 common desktop CPUs with model limits and acceptable experience ranges." }, meta: { zh: "社区联合评测 · 已复现", en: "Community benchmark · Reproduced" }, accent: "blue" },
      { tag: { zh: "ANDROID", en: "ANDROID" }, title: { zh: "手机端小模型的速度、功耗与温升", en: "Speed, power and thermals of small on-phone models" }, text: { zh: "统一任务和环境下比较端侧引擎与不同量化方案。", en: "Comparing on-device engines and quantization schemes under unified tasks and conditions." }, meta: { zh: "6 款设备 · 3 个引擎", en: "6 devices · 3 engines" }, accent: "purple" },
    ],
  },
  projects: {
    eyebrow: "PROJECT LANDSCAPE",
    title: { zh: "找到工具，也找到参与项目的入口", en: "Find tools — and ways to get involved" },
    intro: { zh: "项目档案不止收录链接，还展示许可证、支持矩阵、维护状态、实测记录与适合首次贡献的任务。", en: "Project profiles go beyond links: licenses, support matrices, maintenance status, benchmarks and first-contribution tasks." },
    filters: { zh: ["全部项目", "推理引擎", "桌面应用", "Agent", "多模态", "边缘设备"], en: ["All projects", "Inference engines", "Desktop apps", "Agents", "Multimodal", "Edge devices"] },
    cards: [
      { tag: { zh: "推理引擎 · 活跃", en: "Inference engine · Active" }, title: { zh: "llama.cpp", en: "llama.cpp" }, text: { zh: "面向广泛硬件的高性能本地推理引擎与 GGUF 生态基础。", en: "A high-performance local inference engine for broad hardware and the GGUF ecosystem." }, meta: { zh: "C/C++ · MIT · 23 个入门任务", en: "C/C++ · MIT · 23 starter tasks" }, accent: "green" },
      { tag: { zh: "模型运行 · 活跃", en: "Model runtime · Active" }, title: { zh: "Ollama", en: "Ollama" }, text: { zh: "面向开发者的本地模型运行、管理与 API 服务工具。", en: "Local model running, management and API serving for developers." }, meta: { zh: "Go · MIT · 14 篇社区实测", en: "Go · MIT · 14 community benchmarks" }, accent: "orange" },
      { tag: { zh: "跨平台部署 · 活跃", en: "Cross-platform · Active" }, title: { zh: "MLC LLM", en: "MLC LLM" }, text: { zh: "通过机器学习编译将模型部署到桌面、手机、浏览器与 GPU。", en: "Deploy models to desktop, mobile, browser and GPU via ML compilation." }, meta: { zh: "Apache-2.0 · 8 个实验", en: "Apache-2.0 · 8 experiments" }, accent: "blue" },
      { tag: { zh: "开放征集", en: "Open call" }, title: { zh: "提交你的 Local AI 项目", en: "Submit your Local AI project" }, text: { zh: "使用统一模板补充兼容矩阵、许可证、快速开始与贡献入口。", en: "Use a unified template to add a compatibility matrix, license, quick start and contribution entry points." }, meta: { zh: "预计 10 分钟", en: "About 10 minutes" }, accent: "purple" },
    ],
  },
  agents: {
    eyebrow: "ENTERPRISE AGENTS",
    title: { zh: "让企业级 Agent 真正运行在本地 AI 之上", en: "Enterprise agents that truly run on local AI" },
    intro: { zh: "聚焦能够连接本地模型与企业内部系统，并具备权限、审计、可观测、安全隔离和可靠运行能力的 Agent。", en: "Agents that connect local models to internal systems, with permissions, audit, observability, isolation and reliability." },
    filters: { zh: ["全部 Agent", "知识助手", "研发 Agent", "业务流程", "行业 Agent", "治理与安全"], en: ["All agents", "Knowledge assistants", "Dev agents", "Workflow", "Industry agents", "Governance & security"] },
    cards: [
      { tag: { zh: "参考架构 · 企业级", en: "Reference architecture · Enterprise" }, title: { zh: "本地模型驱动的企业 Agent 技术栈", en: "An enterprise agent stack powered by local models" }, text: { zh: "从推理服务、模型网关、知识库和工具系统，到身份、权限、审计与可观测性。", en: "From inference serving, model gateway, knowledge base and tools to identity, permissions, audit and observability." }, meta: { zh: "架构指南 · 持续更新", en: "Architecture guide · Updated regularly" }, accent: "green" },
      { tag: { zh: "研发 Agent · 已验证", en: "Dev agent · Verified" }, title: { zh: "完全私有运行的代码研发 Agent", en: "A fully private code development agent" }, text: { zh: "连接本地代码仓库、CI和知识库，在受控沙箱内完成分析、修改、测试与审查。", en: "Connect local repos, CI and knowledge bases to analyze, modify, test and review inside a controlled sandbox." }, meta: { zh: "3 套模型组合 · 附评测", en: "3 model combos · With benchmarks" }, accent: "orange" },
      { tag: { zh: "知识助手 · 企业部署", en: "Knowledge assistant · Enterprise" }, title: { zh: "带权限继承的内部知识 Agent", en: "An internal knowledge agent with permission inheritance" }, text: { zh: "回答必须遵守文档权限、引用来源，并留下可追溯的检索与生成记录。", en: "Answers respect document permissions, cite sources and leave traceable retrieval and generation records." }, meta: { zh: "RBAC · SSO · 审计日志", en: "RBAC · SSO · Audit logs" }, accent: "blue" },
      { tag: { zh: "兼容性矩阵", en: "Compatibility matrix" }, title: { zh: "哪些 Agent 能够连接你的本地模型？", en: "Which agents can connect to your local model?" }, text: { zh: "比较开放API、模型网关、工具协议、离线能力、部署方式和企业治理能力。", en: "Comparing open APIs, model gateways, tool protocols, offline capability, deployment and enterprise governance." }, meta: { zh: "Agent × 引擎 × 模型", en: "Agent × Engine × Model" }, accent: "purple" },
    ],
  },
  bounties: {
    eyebrow: "OPEN BOUNTIES",
    title: { zh: "把真实需求，变成可验收的开放任务", en: "Turn real needs into verifiable open tasks" },
    intro: { zh: "每项悬赏都明确交付物、验收标准、开放许可证、评审人、期限和奖励。", en: "Every bounty states deliverables, acceptance criteria, open license, reviewers, deadline and reward." },
    filters: { zh: ["招募中", "硬件适配", "模型量化", "性能优化", "文档", "高校课题"], en: ["Open", "Hardware", "Quantization", "Performance", "Docs", "University"] },
    cards: [
      { tag: { zh: "¥8,000 · 招募中", en: "¥8,000 · Open" }, title: { zh: "为国产 AI PC 建立首套公开推理基准", en: "Build the first public inference benchmark for domestic AI PCs" }, text: { zh: "完成三款设备、五个模型和两个引擎的可复现测试。", en: "Complete reproducible tests across three devices, five models and two engines." }, meta: { zh: "剩余 18 天 · 中等难度", en: "18 days left · Medium" }, accent: "green" },
      { tag: { zh: "¥5,000 · 2人协作", en: "¥5,000 · 2 collaborators" }, title: { zh: "移动端语音助手参考实现", en: "A reference mobile voice assistant" }, text: { zh: "实现离线 ASR、轻量语言模型与 TTS 的端到端 Demo。", en: "An end-to-end demo of offline ASR, a lightweight language model and TTS." }, meta: { zh: "剩余 26 天 · 进阶", en: "26 days left · Advanced" }, accent: "orange" },
      { tag: { zh: "¥3,000 · 招募中", en: "¥3,000 · Open" }, title: { zh: "Local AI 开源项目许可证数据整理", en: "License data cleanup for Local AI open-source projects" }, text: { zh: "核验100个项目的代码和模型许可证，并标记商业使用边界。", en: "Verify code and model licenses for 100 projects and flag commercial-use boundaries." }, meta: { zh: "剩余 12 天 · 入门友好", en: "12 days left · Beginner-friendly" }, accent: "blue" },
      { tag: { zh: "联合课题", en: "Joint bounty" }, title: { zh: "征集企业真实场景与悬赏课题", en: "Call for real enterprise scenarios and bounty topics" }, text: { zh: "社区协助将需求拆解为可公开协作、可评审、可验收的任务。", en: "The community helps break needs into open, reviewable, verifiable tasks." }, meta: { zh: "持续征集 · 联系社区", en: "Ongoing · Contact the community" }, accent: "purple" },
    ],
  },
  community: {
    eyebrow: "BUILD TOGETHER",
    title: { zh: "交流的终点，是沉淀新的公共成果", en: "Conversations that become public goods" },
    intro: { zh: "加入工作组、参加活动、回答问题或完成一次微小贡献。重要讨论将被整理为长期可搜索的知识。", en: "Join working groups, attend events, answer questions or make a small contribution. Key discussions become searchable knowledge." },
    filters: { zh: ["全部", "工作组", "线上活动", "城市 Meetup", "问答", "贡献指南"], en: ["All", "Working groups", "Online events", "City meetups", "Q&A", "Contribution guide"] },
    cards: [
      { tag: { zh: "工作组 · 周三", en: "Working group · Wed" }, title: { zh: "开放评测工作组例会", en: "Open benchmark working group meeting" }, text: { zh: "讨论设备信息模板、性能指标和首轮联合评测清单。", en: "Discuss device info templates, performance metrics and the first joint benchmark list." }, meta: { zh: "线上 · 41 人关注", en: "Online · 41 watching" }, accent: "green" },
      { tag: { zh: "Demo Day · 周六", en: "Demo Day · Sat" }, title: { zh: "把你的 Local AI 应用带来演示", en: "Bring your Local AI app to demo" }, text: { zh: "每个项目10分钟：演示、技术选择、踩坑与下一步需求。", en: "10 minutes each: demo, tech choices, pitfalls and next needs." }, meta: { zh: "开放报名 · 8 个席位", en: "Open signup · 8 slots" }, accent: "orange" },
      { tag: { zh: "贡献指南", en: "Contribution guide" }, title: { zh: "第一次贡献，不一定从写代码开始", en: "Your first contribution doesn't have to be code" }, text: { zh: "复现教程、补充设备数据、整理问答，都能成为有效贡献。", en: "Reproducing tutorials, adding device data or organizing Q&A all count." }, meta: { zh: "6 条推荐路径", en: "6 recommended paths" }, accent: "blue" },
      { tag: { zh: "每周通讯", en: "Weekly newsletter" }, title: { zh: "Local AI Weekly #001", en: "Local AI Weekly #001" }, text: { zh: "精选项目更新、实测数据、教程、悬赏和社区活动。", en: "Curated project updates, benchmark data, tutorials, bounties and events." }, meta: { zh: "每周一发送 · 免费订阅", en: "Mondays · Free subscription" }, accent: "purple" },
    ],
  },
};

const zh = {
  brandAria: "返回 Local AI Club 首页",
  navAria: "主要导航",
  signalAria: "Local AI 技术范围",
  search: "搜索",
  join: "加入社区",
  menu: "展开菜单",
  toggleLangAria: "切换为 English",
  toggleLangLabel: "EN",
  heroH1: { before: "让 AI 在", em: "自己的设备", after: "上运行" },
  heroDesc: "面向本地、端侧、边缘与私有化 AI 的开放技术社区。学习技术、选择模型、复现评测、参与项目，共同解决真实问题。",
  matchDevice: "匹配我的设备",
  startPath: "从入门路线开始",
  stats: [
    { value: "48", label: "技术文章" },
    { value: "31", label: "项目档案" },
    { value: "12", label: "开放评测" },
    { value: "05", label: "招募课题" },
  ],
  labTitle: "我的设备能运行什么模型？",
  labDesc: "选择你的配置和用途，获得第一套可实践的本地 AI 方案。",
  labNote: "基于社区实测数据",
  platformLabel: "01 · 计算平台",
  memoryLabel: "02 · 内存 / 显存",
  purposeLabel: "03 · 主要用途",
  generate: "生成推荐方案",
  recMatch: "匹配度 86%",
  recLabel: "推荐模型",
  recEngine: "推荐引擎",
  recSpeed: "预估速度",
  recSuffix: "。实际表现与模型版本、上下文长度及系统环境有关。",
  recInstall: "查看安装教程",
  recBench: "查看相似实测",
  radarTitle: "本周值得关注",
  radarAll: "浏览全部内容 →",
  radar: [
    { line1: "2026 本地模型", line2: "入门与选型指南", desc: "从你的设备和真实任务出发，而不是从参数榜单出发。", cta: "开始阅读" },
    { line1: "Apple M4 Pro：", line2: "12款模型实测", desc: "速度、内存、长上下文和中文任务的完整记录。", cta: "查看评测" },
    { line1: "国产 AI PC", line2: "开放评测课题", desc: "建立公开、可复现的首套推理基准。", cta: "查看任务" },
  ],
  rewardLabel: "任务奖励",
  metricLabel: "BEST RESULT",
  pathwaysTitle: { line1: "不论从哪里开始，", line2: "都能找到下一步。" },
  pathwaysDesc: "学习、复现、贡献、发起项目——社区为不同阶段的参与者提供清晰入口。",
  pathways: [
    { n: "01", title: "我是新手", desc: "完成第一次本地模型运行", target: "learn" },
    { n: "02", title: "我是开发者", desc: "发现项目、实验与开放任务", target: "projects" },
    { n: "03", title: "我在建设企业 Agent", desc: "查找架构、产品与兼容性评测", target: "agents" },
    { n: "04", title: "我是项目维护者", desc: "提交项目并寻找贡献者", target: "projects" },
    { n: "05", title: "我是企业 / 高校", desc: "发布课题与联合研究", target: "bounties" },
  ],
  searchPlaceholder: "搜索当前栏目",
  empty: { title: "没有找到相关内容", desc: "换一个关键词，或者浏览全部内容。", clear: "清除搜索" },
  aside: {
    label: "GET INVOLVED",
    titles: {
      bounties: "有一个真实问题？",
      projects: "维护一个相关项目？",
      agents: "正在部署企业 Agent？",
      default: "愿意贡献一份经验？",
    },
    bodies: {
      bounties: "社区可以协助把需求定义为可公开协作、可评审、可验收的任务。",
      agents: "提交架构、产品、兼容性数据或部署案例，共建企业 Agent 选型与评测体系。",
      default: "提交文章、实测、项目或勘误，让一次实践成为所有人可复用的知识。",
    },
    cta: "查看贡献指南 →",
    stat: "首年公共成果目标",
  },
  cardOpen: (title: string) => `打开${title}`,
  footerLinks: [
    { label: "学习", view: "learn" },
    { label: "评测", view: "benchmarks" },
    { label: "项目", view: "projects" },
    { label: "Agent", view: "agents" },
    { label: "关于社区", view: "community" },
  ],
  footerTagline: "Run AI Locally. Build AI Together.",
  footerDisclaimer: "Local AI Club 是独立开放技术社区，与 LocalAI 开源项目不存在隶属关系。",
  footerCopyright: "© 2026 Local AI Club · local-ai.club",
};

const en: typeof zh = {
  brandAria: "Back to Local AI Club home",
  navAria: "Main navigation",
  signalAria: "Local AI tech scope",
  search: "Search",
  join: "Join community",
  menu: "Open menu",
  toggleLangAria: "切换到中文",
  toggleLangLabel: "中",
  heroH1: { before: "Run AI", em: "on your own device", after: "" },
  heroDesc: "An open technical community for local, on-device, edge and private AI. Learn the tech, choose models, reproduce benchmarks, join projects and solve real problems together.",
  matchDevice: "Match my device",
  startPath: "Start with a learning path",
  stats: [
    { value: "48", label: "Articles" },
    { value: "31", label: "Project profiles" },
    { value: "12", label: "Open benchmarks" },
    { value: "05", label: "Open bounties" },
  ],
  labTitle: "What models can my device run?",
  labDesc: "Pick your setup and use case to get a practical local AI starting point.",
  labNote: "Based on community benchmarks",
  platformLabel: "01 · Platform",
  memoryLabel: "02 · Memory / VRAM",
  purposeLabel: "03 · Primary use",
  generate: "Generate recommendation",
  recMatch: "Match 86%",
  recLabel: "Recommended model",
  recEngine: "Engine",
  recSpeed: "Est. speed",
  recSuffix: ". Actual performance depends on model version, context length and system environment.",
  recInstall: "View install guide",
  recBench: "View similar benchmarks",
  radarTitle: "Worth watching this week",
  radarAll: "Browse all content →",
  radar: [
    { line1: "2026 local model", line2: "getting-started & selection guide", desc: "Start from your device and real tasks, not from a parameter leaderboard.", cta: "Start reading" },
    { line1: "Apple M4 Pro:", line2: "12 models tested", desc: "Complete records of speed, memory, long context and Chinese tasks.", cta: "View benchmark" },
    { line1: "Domestic AI PC", line2: "open benchmark bounty", desc: "Build the first open, reproducible inference benchmark.", cta: "View bounty" },
  ],
  rewardLabel: "Reward",
  metricLabel: "BEST RESULT",
  pathwaysTitle: { line1: "Wherever you start,", line2: "there's a next step." },
  pathwaysDesc: "Learn, reproduce, contribute, launch — the community offers clear entry points for every stage.",
  pathways: [
    { n: "01", title: "I'm new", desc: "Run my first local model", target: "learn" },
    { n: "02", title: "I'm a developer", desc: "Find projects, experiments and open tasks", target: "projects" },
    { n: "03", title: "I'm building enterprise agents", desc: "Find architecture, products and compatibility benchmarks", target: "agents" },
    { n: "04", title: "I maintain a project", desc: "Submit a project and find contributors", target: "projects" },
    { n: "05", title: "I'm a company / university", desc: "Post bounties and joint research", target: "bounties" },
  ],
  searchPlaceholder: "Search this section",
  empty: { title: "No results found", desc: "Try another keyword, or browse all content.", clear: "Clear search" },
  aside: {
    label: "GET INVOLVED",
    titles: {
      bounties: "Have a real problem?",
      projects: "Maintain a related project?",
      agents: "Deploying enterprise agents?",
      default: "Want to share your experience?",
    },
    bodies: {
      bounties: "The community can help turn it into an open, reviewable, verifiable task.",
      agents: "Submit architecture, products, compatibility data or deployment cases to build the enterprise agent evaluation system.",
      default: "Submit an article, benchmark, project or correction so one experiment becomes reusable knowledge for everyone.",
    },
    cta: "View contribution guide →",
    stat: "year-one public outcomes goal",
  },
  cardOpen: (title: string) => `Open ${title}`,
  footerLinks: [
    { label: "Learn", view: "learn" },
    { label: "Benchmarks", view: "benchmarks" },
    { label: "Projects", view: "projects" },
    { label: "Agents", view: "agents" },
    { label: "About", view: "community" },
  ],
  footerTagline: "Run AI Locally. Build AI Together.",
  footerDisclaimer: "Local AI Club is an independent open technical community and is not affiliated with the LocalAI open-source project.",
  footerCopyright: "© 2026 Local AI Club · local-ai.club",
};

const ui: Record<Lang, typeof zh> = { zh, en };

const platformChoices = [
  { key: "apple", zh: "Apple Silicon", en: "Apple Silicon" },
  { key: "nvidia", zh: "NVIDIA GPU", en: "NVIDIA GPU" },
  { key: "cpu", zh: "纯 CPU", en: "CPU only" },
];
const memoryChoices = [
  { key: "16", zh: "16GB", en: "16GB" },
  { key: "32", zh: "32GB", en: "32GB" },
  { key: "64", zh: "64GB+", en: "64GB+" },
];
const purposeChoices = [
  { key: "chat", zh: "通用对话", en: "General chat" },
  { key: "coding", zh: "本地编程", en: "Local coding" },
  { key: "vision", zh: "视觉理解", en: "Vision" },
];

function BrandMark() {
  return <Image className="brand-mark" src="/logo.png" alt="Local AI Club logo" width={1254} height={1254} unoptimized />;
}

export default function SitePage({ lang, view }: { lang: Lang; view: View }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [platform, setPlatform] = useState("apple");
  const [memory, setMemory] = useState("32");
  const [purpose, setPurpose] = useState("chat");
  const [ranMatcher, setRanMatcher] = useState(false);
  const [filter, setFilter] = useState(0);
  const [query, setQuery] = useState("");

  const t = ui[lang];

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);

  const recommendation = useMemo(() => {
    if (platform === "cpu") return { model: "Qwen 3 · 4B · Q4_K_M", engine: "llama.cpp", speed: { zh: "约 8—18 tok/s", en: "≈ 8–18 tok/s" }, note: { zh: "适合轻量对话与文档摘要", en: "Good for light chat and document summarization" } };
    if (platform === "nvidia") return memory === "64"
      ? { model: "32B 级开放模型 · Q4", engine: "llama.cpp / vLLM", speed: { zh: "约 35—70 tok/s", en: "≈ 35–70 tok/s" }, note: { zh: "适合编程、Agent 与高质量对话", en: "Great for coding, agents and high-quality chat" } }
      : { model: "14B 级开放模型 · Q4", engine: "Ollama / llama.cpp", speed: { zh: "约 45—90 tok/s", en: "≈ 45–90 tok/s" }, note: { zh: "质量与响应速度较均衡", en: "Balanced quality and speed" } };
    if (memory === "16") return { model: "7B 级开放模型 · Q4", engine: "Ollama / LM Studio", speed: { zh: "约 18—35 tok/s", en: "≈ 18–35 tok/s" }, note: { zh: "建议控制上下文长度", en: "Keep context length in check" } };
    return purpose === "vision"
      ? { model: "7B 级视觉语言模型 · Q4", engine: "MLX / llama.cpp", speed: { zh: "约 14—28 tok/s", en: "≈ 14–28 tok/s" }, note: { zh: "适合图片理解与文档截图", en: "Great for image understanding and document screenshots" } }
      : { model: "14B 级开放模型 · Q4_K_M", engine: "MLX / Ollama", speed: { zh: "约 22—45 tok/s", en: "≈ 22–45 tok/s" }, note: { zh: "适合日常对话、写作与知识问答", en: "Great for daily chat, writing and Q&A" } };
  }, [platform, memory, purpose]);

  function go(next: View) {
    setFilter(0);
    setQuery("");
    setMobileOpen(false);
    router.push(viewToPath(lang, next));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleLang() {
    router.push(toggleLangPath(lang, view));
  }

  const section = view === "home" ? null : content[view];
  const visibleCards = section?.cards.filter((card, index) => {
    const q = query.trim().toLowerCase();
    const filterMatch = filter === 0 || index === (filter - 1) % section.cards.length;
    const haystack = `${card.title[lang]} ${card.text[lang]} ${card.tag[lang]}`.toLowerCase();
    const queryMatch = !q || haystack.includes(q);
    return filterMatch && queryMatch;
  });

  const asideTitle = view === "bounties" ? t.aside.titles.bounties : view === "projects" ? t.aside.titles.projects : view === "agents" ? t.aside.titles.agents : t.aside.titles.default;
  const asideBody = view === "bounties" ? t.aside.bodies.bounties : view === "agents" ? t.aside.bodies.agents : t.aside.bodies.default;

  return (
    <div className="site-shell">
      <header className="topbar">
        <button className="brand" onClick={() => go("home")} aria-label={t.brandAria}>
          <BrandMark /><span className="brand-copy"><strong>LOCAL AI</strong><small>CLUB</small></span>
        </button>
        <nav className={mobileOpen ? "main-nav open" : "main-nav"} aria-label={t.navAria}>
          {navItems.map((item) => <button key={item.id} className={view === item.id ? "nav-item active" : "nav-item"} onClick={() => go(item.id)}><span>{item[lang]}</span><small>{item[lang === "zh" ? "en" : "zh"]}</small></button>)}
        </nav>
        <div className="header-actions">
          <button className="search-icon" aria-label={t.search} onClick={() => view !== "home" && document.getElementById("section-search")?.focus()}>⌕</button>
          <button className="lang-toggle" onClick={toggleLang} aria-label={t.toggleLangAria}>{t.toggleLangLabel}</button>
          <button className="join-button" onClick={() => go("community")}>{t.join} <span>↗</span></button>
          <button className="menu-button" aria-label={t.menu} aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}>☰</button>
        </div>
      </header>

      {view === "home" ? <main>
        <section className="hero">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-copy">
            <div className="status-line"><span className="pulse" /> OPEN COMMUNITY · BUILDING IN PUBLIC</div>
            <h1>{t.heroH1.before}<br /><em>{t.heroH1.em}</em>{t.heroH1.after}</h1>
            <p>{t.heroDesc}</p>
            <div className="hero-actions"><button className="primary" onClick={() => document.getElementById("device-lab")?.scrollIntoView({ behavior: "smooth" })}>{t.matchDevice} <span>↓</span></button><button className="text-button" onClick={() => go("learn")}>{t.startPath} <span>→</span></button></div>
            <div className="community-stats">{t.stats.map((s) => <div key={s.label}><strong>{s.value}</strong><span>{s.label}</span></div>)}</div>
          </div>
          <div className="signal-panel" aria-label={t.signalAria}>
            <div className="signal-head"><span>LOCAL STACK / 01</span><span className="live-dot">LIVE</span></div>
            <div className="orbit-wrap"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" /><div className="center-chip"><Image className="hero-logo" src="/logo.png" alt="Local AI Club logo" width={1254} height={1254} priority unoptimized /></div><span className="node node-model">OPEN<br />MODELS</span><span className="node node-device">YOUR<br />DEVICE</span><span className="node node-data">PRIVATE<br />DATA</span><span className="node node-app">REAL<br />APPS</span></div>
            <div className="signal-foot"><span>DEVICE OWNED</span><span>OFFLINE READY</span><span>OPEN SOURCE</span></div>
          </div>
        </section>

        <section className="device-lab" id="device-lab">
          <div className="section-kicker">DEVICE ADVISOR · ALPHA</div>
          <div className="lab-heading"><div><h2>{t.labTitle}</h2><p>{t.labDesc}</p></div><span className="community-data">{t.labNote}</span></div>
          <div className="lab-console">
            <div className="lab-controls"><ChoiceGroup label={t.platformLabel} value={platform} values={platformChoices} lang={lang} onChange={setPlatform} /><ChoiceGroup label={t.memoryLabel} value={memory} values={memoryChoices} lang={lang} onChange={setMemory} /><ChoiceGroup label={t.purposeLabel} value={purpose} values={purposeChoices} lang={lang} onChange={setPurpose} /><button className="match-button" onClick={() => setRanMatcher(true)}>{t.generate} <span>→</span></button></div>
            <div className={ranMatcher ? "recommendation revealed" : "recommendation"}><div className="rec-head"><span>RECOMMENDED STACK</span><span className="confidence">{t.recMatch}</span></div><div className="rec-number">01</div><span className="rec-label">{t.recLabel}</span><h3>{recommendation.model}</h3><div className="rec-grid"><div><span>{t.recEngine}</span><strong>{recommendation.engine}</strong></div><div><span>{t.recSpeed}</span><strong>{recommendation.speed[lang]}</strong></div></div><p>{recommendation.note[lang]}{t.recSuffix}</p><div className="rec-actions"><button onClick={() => go("learn")}>{t.recInstall}</button><button onClick={() => go("benchmarks")}>{t.recBench}</button></div></div>
          </div>
        </section>

        <section className="radar-section">
          <div className="section-title-row"><div><span>COMMUNITY RADAR</span><h2>{t.radarTitle}</h2></div><button onClick={() => go("learn")}>{t.radarAll}</button></div>
          <div className="radar-grid">
            <article className="feature-card dark-card"><span className="card-index">01 / GUIDE</span><h3>{t.radar[0].line1}<br />{t.radar[0].line2}</h3><p>{t.radar[0].desc}</p><button onClick={() => go("learn")}>{t.radar[0].cta} ↗</button><div className="mini-terminal"><span>$ local-ai check --device</span><span className="terminal-ok">✓ 32GB unified memory</span><span className="terminal-ok">✓ local inference ready</span></div></article>
            <article className="feature-card"><span className="card-index green">02 / BENCHMARK</span><h3>{t.radar[1].line1}<br />{t.radar[1].line2}</h3><p>{t.radar[1].desc}</p><div className="metric"><strong>42.8</strong><span>tok/s<br />{t.metricLabel}</span></div><button onClick={() => go("benchmarks")}>{t.radar[1].cta} →</button></article>
            <article className="feature-card bounty-feature"><span className="card-index orange">03 / BOUNTY</span><h3>{t.radar[2].line1}<br />{t.radar[2].line2}</h3><p>{t.radar[2].desc}</p><div className="reward"><span>{t.rewardLabel}</span><strong>¥8,000</strong></div><button onClick={() => go("bounties")}>{t.radar[2].cta} →</button></article>
          </div>
        </section>

        <section className="pathways"><div className="pathways-copy"><span>START YOUR PATH</span><h2>{t.pathwaysTitle.line1}<br />{t.pathwaysTitle.line2}</h2><p>{t.pathwaysDesc}</p></div><div className="path-list">{t.pathways.map((p) => <button key={p.n} onClick={() => go(p.target as View)}><span>{p.n}</span><strong>{p.title}</strong><small>{p.desc}</small><b>↗</b></button>)}</div></section>
      </main> : section ? <main className="section-page">
        <section className="section-hero"><span>{section.eyebrow}</span><h1>{section.title[lang]}</h1><p>{section.intro[lang]}</p></section>
        <section className="explorer"><div className="explorer-bar"><div className="filters">{section.filters[lang].map((item, index) => <button key={item} className={filter === index ? "active" : ""} onClick={() => setFilter(index)}>{item}</button>)}</div><label className="section-search"><span>⌕</span><input id="section-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchPlaceholder} /></label></div>
          <div className="content-layout"><div className="content-grid">{visibleCards?.map((card, index) => <article className={`content-card ${card.accent}`} key={card.title[lang]}><div className="content-number">{String(index + 1).padStart(2, "0")}</div><span>{card.tag[lang]}</span><h2>{card.title[lang]}</h2><p>{card.text[lang]}</p><footer><small>{card.meta[lang]}</small><button aria-label={t.cardOpen(card.title[lang])}>↗</button></footer></article>)}{visibleCards?.length === 0 && <div className="empty-state"><strong>{t.empty.title}</strong><span>{t.empty.desc}</span><button onClick={() => setQuery("")}>{t.empty.clear}</button></div>}</div>
            <aside className="section-aside"><span className="aside-label">{t.aside.label}</span><h3>{asideTitle}</h3><p>{asideBody}</p><button>{t.aside.cta}</button><div className="aside-stat"><strong>100+</strong><span>{t.aside.stat}</span></div></aside>
          </div>
        </section>
      </main> : null}

      <footer className="footer"><div className="footer-brand"><BrandMark /><div><strong>LOCAL AI CLUB</strong><span>{t.footerTagline}</span></div></div><div className="footer-links">{t.footerLinks.map((link) => <button key={link.view} onClick={() => go(link.view as View)}>{link.label}</button>)}</div><p>{t.footerDisclaimer}<br />{t.footerCopyright}</p></footer>
    </div>
  );
}

function ChoiceGroup({ label, value, values, lang, onChange }: { label: string; value: string; values: { key: string; zh: string; en: string }[]; lang: Lang; onChange: (next: string) => void }) {
  return <fieldset className="choice-group"><legend>{label}</legend><div>{values.map((item) => <button type="button" key={item.key} className={value === item.key ? "selected" : ""} onClick={() => onChange(item.key)}>{item[lang]}<span>{value === item.key ? "●" : "○"}</span></button>)}</div></fieldset>;
}
