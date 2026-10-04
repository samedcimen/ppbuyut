import { NotFoundView } from "@/components/pages/not-found";
import { getMessages } from "@/lib/i18n";

export const metadata = { title: getMessages("tr").notFound.title };

export default function NotFound() {
  return <NotFoundView locale="tr" />;
}
