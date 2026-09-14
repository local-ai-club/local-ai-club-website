import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.SITE_URL ?? "https://local-ai.club";
const siteRoot = new URL(siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`);

export const metadata: Metadata = {
  metadataBase: siteRoot,
  title: "Local AI Club 网站原型",
  description: "面向本地、端侧、边缘与私有化 AI 的开放技术社区。",
  openGraph: { title: "Local AI Club", description: "让 AI 在自己的设备上运行。", type: "website", images: [{ url: new URL("og.png", siteRoot).toString(), width: 1200, height: 630, alt: "Local AI Club" }] },
  twitter: { card: "summary_large_image", title: "Local AI Club", description: "Run AI Locally. Build AI Together.", images: [new URL("og.png", siteRoot).toString()] },
  icons: { icon: new URL("favicon.svg", siteRoot).toString(), shortcut: new URL("favicon.svg", siteRoot).toString() },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
