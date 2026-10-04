import { ChangelogPage, changelogMetadata } from "@/components/pages/changelog";

export const metadata = changelogMetadata("en");

export default function Page() {
  return <ChangelogPage locale="en" />;
}
