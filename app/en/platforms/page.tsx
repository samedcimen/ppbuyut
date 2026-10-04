import { PlatformsPage, platformsMetadata } from "@/components/pages/platforms";

export const metadata = platformsMetadata("en");

export default function Page() {
  return <PlatformsPage locale="en" />;
}
