"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import {
  toggleLangPath,
  viewToPath,
  type Lang,
  type View,
} from "../lib/i18n-routes";

const navItems: { id: View; zh: string; en: string }[] = [
  { id: "home", zh: "首页", en: "Home" },
  { id: "learn", zh: "学习", en: "Learn" },
  { id: "benchmarks", zh: "评测", en: "Benchmarks" },
  { id: "projects", zh: "项目", en: "Projects" },
  { id: "agents", zh: "Agent", en: "Enterprise" },
  { id: "bounties", zh: "悬赏", en: "Bounties" },
  { id: "community", zh: "社区", en: "Community" },
];

const chromeCopy = {
  zh: {
    brandAria: "返回 Local AI Club 首页",
    navAria: "主要导航",
    search: "搜索",
    join: "加入社区",
    menu: "展开菜单",
    toggleLangAria: "切换为 English",
    toggleLangLabel: "EN",
    footerLinks: [
      { label: "学习", view: "learn" as const },
      { label: "评测", view: "benchmarks" as const },
      { label: "项目", view: "projects" as const },
      { label: "Agent", view: "agents" as const },
      { label: "关于社区", view: "community" as const },
    ],
    footerTagline: "Run AI Locally. Build AI Together.",
    footerDisclaimer: "Local AI Club 是独立开放技术社区，与 LocalAI 开源项目不存在隶属关系。",
    footerCopyright: "© 2026 Local AI Club · local-ai.club",
  },
  en: {
    brandAria: "Back to Local AI Club home",
    navAria: "Main navigation",
    search: "Search",
    join: "Join community",
    menu: "Open menu",
    toggleLangAria: "切换到中文",
    toggleLangLabel: "中",
    footerLinks: [
      { label: "Learn", view: "learn" as const },
      { label: "Benchmarks", view: "benchmarks" as const },
      { label: "Projects", view: "projects" as const },
      { label: "Agents", view: "agents" as const },
      { label: "About", view: "community" as const },
    ],
    footerTagline: "Run AI Locally. Build AI Together.",
    footerDisclaimer: "Local AI Club is an independent open technical community and is not affiliated with the LocalAI open-source project.",
    footerCopyright: "© 2026 Local AI Club · local-ai.club",
  },
};

export function BrandMark() {
  return <Image className="brand-mark" src="/logo.png" alt="Local AI Club logo" width={1254} height={1254} unoptimized />;
}

export default function SiteChrome({
  lang,
  view,
  langHref,
  children,
}: {
  lang: Lang;
  view: View;
  langHref?: string;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = chromeCopy[lang];

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href={viewToPath(lang, "home")} aria-label={t.brandAria}>
          <BrandMark /><span className="brand-copy"><strong>LOCAL AI</strong><small>CLUB</small></span>
        </a>
        <nav className={mobileOpen ? "main-nav open" : "main-nav"} aria-label={t.navAria}>
          {navItems.map((item) => <a key={item.id} className={view === item.id ? "nav-item active" : "nav-item"} href={viewToPath(lang, item.id)} onClick={() => setMobileOpen(false)}><span>{item[lang]}</span><small>{item[lang === "zh" ? "en" : "zh"]}</small></a>)}
        </nav>
        <div className="header-actions">
          <button className="search-icon" aria-label={t.search} onClick={() => view !== "home" && document.getElementById("section-search")?.focus()}>⌕</button>
          <a className="lang-toggle" href={langHref ?? toggleLangPath(lang, view)} aria-label={t.toggleLangAria}>{t.toggleLangLabel}</a>
          <a className="join-button" href={viewToPath(lang, "community")}>{t.join} <span>↗</span></a>
          <button className="menu-button" aria-label={t.menu} aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}>☰</button>
        </div>
      </header>
      {children}
      <footer className="footer"><div className="footer-brand"><BrandMark /><div><strong>LOCAL AI CLUB</strong><span>{t.footerTagline}</span></div></div><div className="footer-links">{t.footerLinks.map((link) => <a key={link.view} href={viewToPath(lang, link.view)}>{link.label}</a>)}</div><p>{t.footerDisclaimer}<br />{t.footerCopyright}</p></footer>
    </div>
  );
}
