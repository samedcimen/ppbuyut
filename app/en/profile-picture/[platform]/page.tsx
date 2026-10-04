import { notFound } from "next/navigation";
import { LandingPage, landingMetadata } from "@/components/pages/landing";
import { PLATFORM_IDS, isPlatformId } from "@/lib/platforms";

export const dynamicParams = false;

export function generateStaticParams() {
  return PLATFORM_IDS.map((platform) => ({ platform }));
}

export async function generateMetadata(props: PageProps<"/en/profile-picture/[platform]">) {
  const { platform } = await props.params;
  return isPlatformId(platform) ? landingMetadata(platform, "en") : {};
}

export default async function Page(props: PageProps<"/en/profile-picture/[platform]">) {
  const { platform } = await props.params;
  if (!isPlatformId(platform)) notFound();
  return <LandingPage platform={platform} locale="en" />;
}
