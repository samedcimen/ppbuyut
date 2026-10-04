import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Viewer } from "@/components/viewer/viewer";
import { sharedTarget } from "@/lib/share-target";

// Web Share Target (see app/manifest.ts): Android's Share menu opens
// /paylas?url=…&text=…&title=… when someone shares to the installed app.

export const metadata: Metadata = {
  title: "Paylaşılan profil",
  robots: { index: false },
};

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export default async function SharePage(props: PageProps<"/paylas">) {
  const params = await props.searchParams;
  const target = sharedTarget({ url: first(params.url), text: first(params.text), title: first(params.title) });

  if (!target) redirect("/");
  if (target.kind === "profile") redirect(target.path);

  return (
    <>
      <div className="min-h-[calc(100svh-4.5rem)] pb-16">
        <Viewer initialText={target.text} />
      </div>
      <HowItWorks locale="tr" />
    </>
  );
}
