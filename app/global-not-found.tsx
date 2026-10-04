import type { Metadata } from "next";
import { NotFoundView } from "@/components/pages/not-found";
import { RootHtml } from "@/components/root-html";
import { getMessages } from "@/lib/i18n";
import { site } from "@/lib/site";
import { siteMetadata } from "@/lib/site-metadata";

// With one root layout per language there is no shared layout for addresses
// that match no route at all; this page stands in for them (in Turkish, the
// site root's language). The catch-all profile routes leave it little to do.

export const metadata: Metadata = {
  ...siteMetadata("tr"),
  title: `${getMessages("tr").notFound.title} · ${site.name}`,
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <RootHtml locale="tr">
      <NotFoundView locale="tr" />
    </RootHtml>
  );
}
