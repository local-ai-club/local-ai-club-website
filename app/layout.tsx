import type { Metadata } from "next";
import "./globals.css";
import { buildPageMetadata } from "./lib/site-metadata";

const siteUrl = process.env.SITE_URL ?? process.env.CF_PAGES_URL ?? "https://local-ai.club";
const siteRoot = new URL(siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`);

export const metadata: Metadata = {
  metadataBase: siteRoot,
  ...buildPageMetadata("zh", "home"),
  icons: { icon: new URL("logo.png", siteRoot).toString(), shortcut: new URL("logo.png", siteRoot).toString(), apple: new URL("logo.png", siteRoot).toString() },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
