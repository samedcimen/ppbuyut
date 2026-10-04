import { Fragment } from "react";

const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

/** Renders **bold**, `code` and [links](url) — the inline Markdown used in CHANGELOG.md. */
export function InlineMarkdown({ text }: { text: string }) {
  return (
    <>
      {text.split(TOKEN).map((part, i) => {
        if (part.startsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-fg">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`")) {
          return (
            <code key={i} className="rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em] text-fg">
              {part.slice(1, -1)}
            </code>
          );
        }
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          const external = /^https?:/.test(link[2]);
          return (
            <a
              key={i}
              href={link[2]}
              {...(external && { target: "_blank", rel: "noopener noreferrer" })}
              className="font-medium text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg"
            >
              {link[1]}
            </a>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
