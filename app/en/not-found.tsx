import { NotFoundView } from "@/components/pages/not-found";
import { getMessages } from "@/lib/i18n";

export const metadata = { title: getMessages("en").notFound.title };

export default function NotFound() {
  return <NotFoundView locale="en" />;
}
