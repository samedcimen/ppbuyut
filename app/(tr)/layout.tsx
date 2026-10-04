import { RootHtml } from "@/components/root-html";
import { siteMetadata } from "@/lib/site-metadata";

export { viewport } from "@/lib/site-metadata";

// Turkish pages (the site root). The route group keeps their URLs unchanged.
export const metadata = siteMetadata("tr");

export default function TurkishLayout({ children }: { children: React.ReactNode }) {
  return <RootHtml locale="tr">{children}</RootHtml>;
}
