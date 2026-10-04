import { detect } from "./detect";

/**
 * Where to go when something is shared to the installed app (Android "Share"
 * menu → ppbüyüt). Apps put the link in different fields, often inside a
 * sentence ("Bu profile göz at: https://instagram.com/…"), so the first URL
 * in any field wins; a bare "@username" is passed on as typed.
 */
export type SharedTarget =
  | { kind: "profile"; path: string }
  | { kind: "text"; text: string }
  | null;

export function sharedTarget(fields: { url?: string; text?: string; title?: string }): SharedTarget {
  const all = [fields.url, fields.text, fields.title].filter(Boolean).join(" ");
  const link = all.match(/https?:\/\/[^\s"'<>]+/)?.[0];

  if (link) {
    const result = detect(link);
    if (result.kind === "link") return { kind: "profile", path: `/${result.platform}/${encodeURIComponent(result.username)}` };
    return { kind: "text", text: link };
  }

  const text = all.trim();
  return text ? { kind: "text", text: text.slice(0, 200) } : null;
}
