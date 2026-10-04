import { PlatformsPage, platformsMetadata } from "@/components/pages/platforms";

export const metadata = platformsMetadata("tr");

export default function Page() {
  return <PlatformsPage locale="tr" />;
}
