import type { Metadata } from "next";
import { buildPageMetadata } from "../lib/site-metadata";

export const metadata: Metadata = buildPageMetadata("en", "home");

export default function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
