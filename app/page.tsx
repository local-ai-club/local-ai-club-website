"use client";

import { useMemo, useState } from "react";

type View = "home" | "learn" | "benchmarks" | "projects" | "agents" | "bounties" | "community";

const navItems: { id: View; label: string; en: string }[] = [
  { id: "home", label: "首页", en: "Home" },
  { id: "learn", label: "学习", en: "Learn" },
  { id: "benchmarks", label: "评测", en: "Benchmarks" },
  { id: "projects", label: "项目", en: "Projects" },
  { id: "agents", label: "Agent", en: "Enterprise" },
  { id: "bounties", label: "悬赏", en: "Bounties" },
  { id: "community", label: "社区", en: "Community" },
];

const content = {
  learn: {
    eyebrow: "KNOWLEDGE PATHS",
    title: "从第一次运行，到构建完整的本地 AI",
    intro: "围绕设备、模型、推理、应用与安全组织的连续知识体系。每篇实践内容都标明版本、环境与复现状态。",
    filters: ["全部", "入门", "推理引擎", "本地 Agent", "RAG", "端侧 AI"],
    cards: [
      { tag: "入门 · 12分钟", title: "在一台普通电脑上运行第一个本地模型", text: "从设备检查、模型选择到完成第一次对话，不要求独立显卡。", meta: "已复现 · 更新于 2 天前", accent: "green" },
      { tag: "推理引擎 · 18分钟", title: "Ollama、llama.cpp 与 LM Studio 应该怎样选择？", text: "从易用性、性能、API、平台支持与可维护性进行比较。", meta: "对比指南 · 6 个环境", accent: "orange" },
      { tag: "本地 Agent · 26分钟", title: "让编程 Agent 使用你自己的本地模型", text: "搭建兼容 API，配置工具调用，并理解上下文与性能边界。", meta: "进阶 · 附配置文件", accent: "blue" },
      { tag: "RAG · 34分钟", title: "构建完全离线的个人文档知识库", text: "文档解析、嵌入模型、向量检索与答案引用的完整实践。", meta: "项目教程 · 可运行", accent: "purple" },
    ],
  },
  benchmarks: {
    eyebrow: "OPEN BENCHMARKS",
    title: "不只看排行榜，更要能够复现",
    intro: "公开模型、量化、引擎、设备、参数、脚本与原始数据。结论必须说明适用边界。",
    filters: ["最新实测", "Apple Silicon", "NVIDIA", "纯 CPU", "移动端", "多模态"],
    cards: [
      { tag: "Apple M4 Pro · 48GB", title: "7B—32B 中文模型横向实测", text: "比较首Token延迟、生成速度、内存占用与长上下文表现。", meta: "12 个模型 · 4 个引擎", accent: "green" },
      { tag: "RTX 4090 · 24GB", title: "本地编程模型与 Agent 任务评测", text: "从代码补全扩展到工具调用、多文件修改和任务恢复。", meta: "86 个任务 · 原始数据开放", accent: "orange" },
      { tag: "CPU ONLY", title: "没有独显，Local AI 能做到什么？", text: "覆盖8款常见桌面CPU，给出模型上限与可接受体验区间。", meta: "社区联合评测 · 已复现", accent: "blue" },
      { tag: "ANDROID", title: "手机端小模型的速度、功耗与温升", text: "统一任务和环境下比较端侧引擎与不同量化方案。", meta: "6 款设备 · 3 个引擎", accent: "purple" },
    ],
  },
  projects: {
    eyebrow: "PROJECT LANDSCAPE",
    title: "找到工具，也找到参与项目的入口",
    intro: "项目档案不止收录链接，还展示许可证、支持矩阵、维护状态、实测记录与适合首次贡献的任务。",
    filters: ["全部项目", "推理引擎", "桌面应用", "Agent", "多模态", "边缘设备"],
    cards: [
      { tag: "推理引擎 · 活跃", title: "llama.cpp", text: "面向广泛硬件的高性能本地推理引擎与 GGUF 生态基础。", meta: "C/C++ · MIT · 23 个入门任务", accent: "green" },
      { tag: "模型运行 · 活跃", title: "Ollama", text: "面向开发者的本地模型运行、管理与 API 服务工具。", meta: "Go · MIT · 14 篇社区实测", accent: "orange" },
      { tag: "跨平台部署 · 活跃", title: "MLC LLM", text: "通过机器学习编译将模型部署到桌面、手机、浏览器与 GPU。", meta: "Apache-2.0 · 8 个实验", accent: "blue" },
      { tag: "开放征集", title: "提交你的 Local AI 项目", text: "使用统一模板补充兼容矩阵、许可证、快速开始与贡献入口。", meta: "预计 10 分钟", accent: "purple" },
    ],
  },
  agents: {
    eyebrow: "ENTERPRISE AGENTS",
    title: "让企业级 Agent 真正运行在本地 AI 之上",
    intro: "聚焦能够连接本地模型与企业内部系统，并具备权限、审计、可观测、安全隔离和可靠运行能力的 Agent。",
    filters: ["全部 Agent", "知识助手", "研发 Agent", "业务流程", "行业 Agent", "治理与安全"],
    cards: [
      { tag: "参考架构 · 企业级", title: "本地模型驱动的企业 Agent 技术栈", text: "从推理服务、模型网关、知识库和工具系统，到身份、权限、审计与可观测性。", meta: "架构指南 · 持续更新", accent: "green" },
      { tag: "研发 Agent · 已验证", title: "完全私有运行的代码研发 Agent", text: "连接本地代码仓库、CI和知识库，在受控沙箱内完成分析、修改、测试与审查。", meta: "3 套模型组合 · 附评测", accent: "orange" },
      { tag: "知识助手 · 企业部署", title: "带权限继承的内部知识 Agent", text: "回答必须遵守文档权限、引用来源，并留下可追溯的检索与生成记录。", meta: "RBAC · SSO · 审计日志", accent: "blue" },
      { tag: "兼容性矩阵", title: "哪些 Agent 能够连接你的本地模型？", text: "比较开放API、模型网关、工具协议、离线能力、部署方式和企业治理能力。", meta: "Agent × 引擎 × 模型", accent: "purple" },
    ],
  },
  bounties: {
    eyebrow: "OPEN BOUNTIES",
    title: "把真实需求，变成可验收的开放任务",
    intro: "每项悬赏都明确交付物、验收标准、开放许可证、评审人、期限和奖励。",
    filters: ["招募中", "硬件适配", "模型量化", "性能优化", "文档", "高校课题"],
    cards: [
      { tag: "¥8,000 · 招募中", title: "为国产 AI PC 建立首套公开推理基准", text: "完成三款设备、五个模型和两个引擎的可复现测试。", meta: "剩余 18 天 · 中等难度", accent: "green" },
      { tag: "¥5,000 · 2人协作", title: "移动端语音助手参考实现", text: "实现离线 ASR、轻量语言模型与 TTS 的端到端 Demo。", meta: "剩余 26 天 · 进阶", accent: "orange" },
      { tag: "¥3,000 · 招募中", title: "Local AI 开源项目许可证数据整理", text: "核验100个项目的代码和模型许可证，并标记商业使用边界。", meta: "剩余 12 天 · 入门友好", accent: "blue" },
      { tag: "联合课题", title: "征集企业真实场景与悬赏课题", text: "社区协助将需求拆解为可公开协作、可评审、可验收的任务。", meta: "持续征集 · 联系社区", accent: "purple" },
    ],
  },
  community: {
    eyebrow: "BUILD TOGETHER",
    title: "交流的终点，是沉淀新的公共成果",
    intro: "加入工作组、参加活动、回答问题或完成一次微小贡献。重要讨论将被整理为长期可搜索的知识。",
    filters: ["全部", "工作组", "线上活动", "城市 Meetup", "问答", "贡献指南"],
    cards: [
      { tag: "工作组 · 周三", title: "开放评测工作组例会", text: "讨论设备信息模板、性能指标和首轮联合评测清单。", meta: "线上 · 41 人关注", accent: "green" },
      { tag: "Demo Day · 周六", title: "把你的 Local AI 应用带来演示", text: "每个项目10分钟：演示、技术选择、踩坑与下一步需求。", meta: "开放报名 · 8 个席位", accent: "orange" },
      { tag: "贡献指南", title: "第一次贡献，不一定从写代码开始", text: "复现教程、补充设备数据、整理问答，都能成为有效贡献。", meta: "6 条推荐路径", accent: "blue" },
      { tag: "每周通讯", title: "Local AI Weekly #001", text: "精选项目更新、实测数据、教程、悬赏和社区活动。", meta: "每周一发送 · 免费订阅", accent: "purple" },
    ],
  },
};

function BrandMark() {
  return <div className="brand-mark" aria-hidden="true"><span className="brand-core">AI</span><span className="brand-signal" /></div>;
}

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [platform, setPlatform] = useState("Apple Silicon");
  const [memory, setMemory] = useState("32GB");
  const [purpose, setPurpose] = useState("通用对话");
  const [ranMatcher, setRanMatcher] = useState(false);
  const [filter, setFilter] = useState("全部");
  const [query, setQuery] = useState("");

  const recommendation = useMemo(() => {
    if (platform === "纯 CPU") return { model: "Qwen 3 · 4B · Q4_K_M", engine: "llama.cpp", speed: "约 8—18 tok/s", note: "适合轻量对话与文档摘要" };
    if (platform === "NVIDIA GPU") return memory === "64GB+"
      ? { model: "32B 级开放模型 · Q4", engine: "llama.cpp / vLLM", speed: "约 35—70 tok/s", note: "适合编程、Agent 与高质量对话" }
      : { model: "14B 级开放模型 · Q4", engine: "Ollama / llama.cpp", speed: "约 45—90 tok/s", note: "质量与响应速度较均衡" };
    if (memory === "16GB") return { model: "7B 级开放模型 · Q4", engine: "Ollama / LM Studio", speed: "约 18—35 tok/s", note: "建议控制上下文长度" };
    return purpose === "视觉理解"
      ? { model: "7B 级视觉语言模型 · Q4", engine: "MLX / llama.cpp", speed: "约 14—28 tok/s", note: "适合图片理解与文档截图" }
      : { model: "14B 级开放模型 · Q4_K_M", engine: "MLX / Ollama", speed: "约 22—45 tok/s", note: "适合日常对话、写作与知识问答" };
  }, [platform, memory, purpose]);

  function go(next: View) {
    setView(next); setFilter("全部"); setQuery(""); setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const section = view === "home" ? null : content[view];
  const visibleCards = section?.cards.filter((card, index) => {
    const q = query.trim().toLowerCase();
    const firstFilter = section.filters[0];
    const filterMatch = filter === "全部" || filter === firstFilter || index === (section.filters.indexOf(filter) - 1) % section.cards.length;
    const queryMatch = !q || `${card.title} ${card.text} ${card.tag}`.toLowerCase().includes(q);
    return filterMatch && queryMatch;
  });

  return (
    <div className="site-shell">
      <header className="topbar">
        <button className="brand" onClick={() => go("home")} aria-label="返回 Local AI Club 首页">
          <BrandMark /><span className="brand-copy"><strong>LOCAL AI</strong><small>CLUB</small></span>
        </button>
        <nav className={mobileOpen ? "main-nav open" : "main-nav"} aria-label="主要导航">
          {navItems.map((item) => <button key={item.id} className={view === item.id ? "nav-item active" : "nav-item"} onClick={() => go(item.id)}><span>{item.label}</span><small>{item.en}</small></button>)}
        </nav>
        <div className="header-actions">
          <button className="search-icon" aria-label="搜索" onClick={() => view !== "home" && document.getElementById("section-search")?.focus()}>⌕</button>
          <button className="join-button" onClick={() => go("community")}>加入社区 <span>↗</span></button>
          <button className="menu-button" aria-label="展开菜单" aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}>☰</button>
        </div>
      </header>

      {view === "home" ? <main>
        <section className="hero">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-copy">
            <div className="status-line"><span className="pulse" /> OPEN COMMUNITY · BUILDING IN PUBLIC</div>
            <h1>让 AI 在<br /><em>自己的设备</em>上运行</h1>
            <p>面向本地、端侧、边缘与私有化 AI 的开放技术社区。学习技术、选择模型、复现评测、参与项目，共同解决真实问题。</p>
            <div className="hero-actions"><button className="primary" onClick={() => document.getElementById("device-lab")?.scrollIntoView({ behavior: "smooth" })}>匹配我的设备 <span>↓</span></button><button className="text-button" onClick={() => go("learn")}>从入门路线开始 <span>→</span></button></div>
            <div className="community-stats"><div><strong>48</strong><span>技术文章</span></div><div><strong>31</strong><span>项目档案</span></div><div><strong>12</strong><span>开放评测</span></div><div><strong>05</strong><span>招募课题</span></div></div>
          </div>
          <div className="signal-panel" aria-label="Local AI 技术范围">
            <div className="signal-head"><span>LOCAL STACK / 01</span><span className="live-dot">LIVE</span></div>
            <div className="orbit-wrap"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" /><div className="center-chip"><span>LOCAL</span><strong>AI</strong><small>RUNS HERE</small></div><span className="node node-model">OPEN<br />MODELS</span><span className="node node-device">YOUR<br />DEVICE</span><span className="node node-data">PRIVATE<br />DATA</span><span className="node node-app">REAL<br />APPS</span></div>
            <div className="signal-foot"><span>DEVICE OWNED</span><span>OFFLINE READY</span><span>OPEN SOURCE</span></div>
          </div>
        </section>

        <section className="device-lab" id="device-lab">
          <div className="section-kicker">DEVICE ADVISOR · ALPHA</div>
          <div className="lab-heading"><div><h2>我的设备能运行什么模型？</h2><p>选择你的配置和用途，获得第一套可实践的本地 AI 方案。</p></div><span className="community-data">基于社区实测数据 · 当前为原型估算</span></div>
          <div className="lab-console">
            <div className="lab-controls"><ChoiceGroup label="01 · 计算平台" value={platform} values={["Apple Silicon", "NVIDIA GPU", "纯 CPU"]} onChange={setPlatform} /><ChoiceGroup label="02 · 内存 / 显存" value={memory} values={["16GB", "32GB", "64GB+"]} onChange={setMemory} /><ChoiceGroup label="03 · 主要用途" value={purpose} values={["通用对话", "本地编程", "视觉理解"]} onChange={setPurpose} /><button className="match-button" onClick={() => setRanMatcher(true)}>生成推荐方案 <span>→</span></button></div>
            <div className={ranMatcher ? "recommendation revealed" : "recommendation"}><div className="rec-head"><span>RECOMMENDED STACK</span><span className="confidence">匹配度 86%</span></div><div className="rec-number">01</div><span className="rec-label">推荐模型</span><h3>{recommendation.model}</h3><div className="rec-grid"><div><span>推荐引擎</span><strong>{recommendation.engine}</strong></div><div><span>预估速度</span><strong>{recommendation.speed}</strong></div></div><p>{recommendation.note}。实际表现与模型版本、上下文长度及系统环境有关。</p><div className="rec-actions"><button onClick={() => go("learn")}>查看安装教程</button><button onClick={() => go("benchmarks")}>查看相似实测</button></div></div>
          </div>
        </section>

        <section className="radar-section">
          <div className="section-title-row"><div><span>COMMUNITY RADAR</span><h2>本周值得关注</h2></div><button onClick={() => go("learn")}>浏览全部内容 →</button></div>
          <div className="radar-grid">
            <article className="feature-card dark-card"><span className="card-index">01 / GUIDE</span><h3>2026 本地模型<br />入门与选型指南</h3><p>从你的设备和真实任务出发，而不是从参数榜单出发。</p><button onClick={() => go("learn")}>开始阅读 ↗</button><div className="mini-terminal"><span>$ local-ai check --device</span><span className="terminal-ok">✓ 32GB unified memory</span><span className="terminal-ok">✓ local inference ready</span></div></article>
            <article className="feature-card"><span className="card-index green">02 / BENCHMARK</span><h3>Apple M4 Pro：<br />12款模型实测</h3><p>速度、内存、长上下文和中文任务的完整记录。</p><div className="metric"><strong>42.8</strong><span>tok/s<br />BEST RESULT</span></div><button onClick={() => go("benchmarks")}>查看评测 →</button></article>
            <article className="feature-card bounty-feature"><span className="card-index orange">03 / BOUNTY</span><h3>国产 AI PC<br />开放评测课题</h3><p>建立公开、可复现的首套推理基准。</p><div className="reward"><span>任务奖励</span><strong>¥8,000</strong></div><button onClick={() => go("bounties")}>查看任务 →</button></article>
          </div>
        </section>

        <section className="pathways"><div className="pathways-copy"><span>START YOUR PATH</span><h2>不论从哪里开始，<br />都能找到下一步。</h2><p>学习、复现、贡献、发起项目——社区为不同阶段的参与者提供清晰入口。</p></div><div className="path-list">{[["01", "我是新手", "完成第一次本地模型运行", "learn"],["02", "我是开发者", "发现项目、实验与开放任务", "projects"],["03", "我在建设企业 Agent", "查找架构、产品与兼容性评测", "agents"],["04", "我是项目维护者", "提交项目并寻找贡献者", "projects"],["05", "我是企业 / 高校", "发布课题与联合研究", "bounties"]].map(([n,title,desc,target]) => <button key={n} onClick={() => go(target as View)}><span>{n}</span><strong>{title}</strong><small>{desc}</small><b>↗</b></button>)}</div></section>
      </main> : section ? <main className="section-page">
        <section className="section-hero"><span>{section.eyebrow}</span><h1>{section.title}</h1><p>{section.intro}</p></section>
        <section className="explorer"><div className="explorer-bar"><div className="filters">{section.filters.map((item,index) => <button key={item} className={filter === item || (index === 0 && filter === "全部") ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div><label className="section-search"><span>⌕</span><input id="section-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索当前栏目" /></label></div>
          <div className="content-layout"><div className="content-grid">{visibleCards?.map((card,index) => <article className={`content-card ${card.accent}`} key={card.title}><div className="content-number">{String(index+1).padStart(2,"0")}</div><span>{card.tag}</span><h2>{card.title}</h2><p>{card.text}</p><footer><small>{card.meta}</small><button aria-label={`打开${card.title}`}>↗</button></footer></article>)}{visibleCards?.length === 0 && <div className="empty-state"><strong>没有找到相关内容</strong><span>换一个关键词，或者浏览全部内容。</span><button onClick={() => setQuery("")}>清除搜索</button></div>}</div>
            <aside className="section-aside"><span className="aside-label">GET INVOLVED</span><h3>{view === "bounties" ? "有一个真实问题？" : view === "projects" ? "维护一个相关项目？" : view === "agents" ? "正在部署企业 Agent？" : "愿意贡献一份经验？"}</h3><p>{view === "bounties" ? "社区可以协助把需求定义为可公开协作、可评审、可验收的任务。" : view === "agents" ? "提交架构、产品、兼容性数据或部署案例，共建企业 Agent 选型与评测体系。" : "提交文章、实测、项目或勘误，让一次实践成为所有人可复用的知识。"}</p><button>查看贡献指南 →</button><div className="aside-stat"><strong>100+</strong><span>首年公共成果目标</span></div></aside>
          </div>
        </section>
      </main> : null}

      <footer className="footer"><div className="footer-brand"><BrandMark /><div><strong>LOCAL AI CLUB</strong><span>Run AI Locally. Build AI Together.</span></div></div><div className="footer-links"><button onClick={() => go("learn")}>学习</button><button onClick={() => go("benchmarks")}>评测</button><button onClick={() => go("projects")}>项目</button><button onClick={() => go("agents")}>Agent</button><button onClick={() => go("community")}>关于社区</button></div><p>Local AI Club 是独立开放技术社区，与 LocalAI 开源项目不存在隶属关系。<br />© 2026 Local AI Club · local-ai.club</p></footer>
    </div>
  );
}

function ChoiceGroup({ label, value, values, onChange }: { label: string; value: string; values: string[]; onChange: (next: string) => void }) {
  return <fieldset className="choice-group"><legend>{label}</legend><div>{values.map((item) => <button type="button" key={item} className={value === item ? "selected" : ""} onClick={() => onChange(item)}>{item}<span>{value === item ? "●" : "○"}</span></button>)}</div></fieldset>;
}
