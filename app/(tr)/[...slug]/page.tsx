import type { Metadata } from "next";
import { ProfilePathPage, profilePathMetadata } from "@/components/pages/profile-path";

export async function generateMetadata(props: PageProps<"/[...slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  return profilePathMetadata(slug, "tr");
}

export default async function Page(props: PageProps<"/[...slug]">) {
  const { slug } = await props.params;
  return <ProfilePathPage slug={slug} locale="tr" />;
}
