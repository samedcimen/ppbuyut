import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Viewer } from "@/components/viewer/viewer";
import { detect, parseProfilePath, profilePathText } from "@/lib/detect";
import { PLATFORMS } from "@/lib/platforms";

// Any path that isn't a real page is tried as a profile link:
// ppbuyut.vercel.app/instagram.com/kullanici → search box prefilled, search starts.
// A link we can't use (other site, non-profile page) is still shown in the box with the reason.

export async function generateMetadata(props: PageProps<"/[...slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const profile = parseProfilePath(slug);
  return {
    title: profile ? `@${profile.username} · ${PLATFORMS[profile.platform].name} profil fotoğrafı` : undefined,
    robots: { index: false },
  };
}

export default async function ProfilePathPage(props: PageProps<"/[...slug]">) {
  const { slug } = await props.params;
  const profile = parseProfilePath(slug);
  const text = profilePathText(slug);
  // Plain words like /olmayan-sayfa are a normal 404; only link-looking paths get the explanation.
  if (!profile && detect(text).kind !== "invalid") notFound();

  return (
    <>
      <div className="min-h-[calc(100svh-4.5rem)] pb-16">
        <Viewer initial={profile ?? undefined} initialText={profile ? undefined : text} />
      </div>
      <HowItWorks />
    </>
  );
}
