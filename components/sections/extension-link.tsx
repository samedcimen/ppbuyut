"use client";

import { Puzzle } from "lucide-react";
import { cn } from "@/lib/cn";
import { useMessages } from "@/lib/i18n/client";
import { site } from "@/lib/site";

/** A small row linking to the browser extension (extension/) in the Chrome Web Store. */
export function ExtensionLink({ className }: { className?: string }) {
  const t = useMessages().bookmarklet.extension;
  return (
    <a
      href={site.chromeExtension}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-3 rounded-xl border border-line p-3 text-[13px] leading-relaxed text-muted transition-colors hover:bg-surface-2",
        className,
      )}
    >
      <span className="grid size-6 shrink-0 place-items-center rounded-md bg-surface-2 text-fg ring-1 ring-line">
        <Puzzle className="size-3.5" />
      </span>
      <span>
        <span className="font-medium text-fg">{t[0]}</span> · {t[1]}
      </span>
    </a>
  );
}
