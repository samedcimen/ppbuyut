"use client";

import { PlatformBadge } from "@/components/platform-icon";
import { useMessages } from "@/lib/i18n/client";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

/** A small row linking to the Telegram bot (app/api/telegram), on the bookmarklet and install cards. */
export function TelegramLink({ className }: { className?: string }) {
  const t = useMessages().install.telegram;
  return (
    <a
      href={`https://t.me/${site.telegramBot}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-3 rounded-xl border border-line p-3 text-[13px] leading-relaxed text-muted transition-colors hover:bg-surface-2",
        className,
      )}
    >
      <PlatformBadge id="telegram" size="sm" />
      <span>
        <span className="font-medium text-fg">
          {t[0]} @{site.telegramBot}
        </span>{" "}
        · {t[1]}
      </span>
    </a>
  );
}
