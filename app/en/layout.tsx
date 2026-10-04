import { RootHtml } from "@/components/root-html";
import { siteMetadata } from "@/lib/site-metadata";

export { viewport } from "@/lib/site-metadata";

// English pages, under /en.
export const metadata = siteMetadata("en");

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <RootHtml locale="en">{children}</RootHtml>;
}
