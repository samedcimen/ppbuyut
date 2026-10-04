import { en } from "./en";
import type { Locale } from "./routes";
import { tr, type Messages } from "./tr";

export { LOCALES, type Locale } from "./routes";
export type { Messages } from "./tr";

const MESSAGES: Record<Locale, Messages> = { tr, en };

/** UI copy for a language (server components call this; client ones use `useMessages`). */
export function getMessages(locale: Locale): Messages {
  return MESSAGES[locale];
}

/** A platform's size label ("1080 px", or "original" where the platform keeps the upload as is). */
export function sizeLabel(label: string, t: Messages) {
  return label === "original" ? t.sizes.original : label;
}
