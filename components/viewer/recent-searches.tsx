"use client";

import { AnimatePresence, motion } from "motion/react";
import { History, X } from "lucide-react";
import { PlatformBadge } from "@/components/platform-icon";
import { useMessages } from "@/lib/i18n/client";
import { clearRecent, recentStore, removeRecent, type RecentSearch } from "@/lib/stores";

export function RecentSearches({ onSelect }: { onSelect: (entry: RecentSearch) => void }) {
  const t = useMessages();
  const items = recentStore.useValue();
  if (items.length === 0) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-xs font-medium text-subtle">
          <History className="size-3.5" />
          {t.recent.title}
          <span className="font-normal">· {t.recent.local}</span>
        </p>
        <button type="button" onClick={clearRecent} className="text-xs text-subtle transition-colors hover:text-fg">
          {t.recent.clear}
        </button>
      </div>
      <ul className="flex flex-wrap gap-2">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.li
              key={`${item.platform}:${item.username}`}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.18 }}
              className="group/chip flex items-center rounded-full border border-line bg-surface pr-1 transition-colors hover:border-line-strong"
            >
              <button
                type="button"
                onClick={() => onSelect(item)}
                className="flex items-center gap-2 py-1 pr-1 pl-1 text-sm"
              >
                <PlatformBadge id={item.platform} size="sm" className="rounded-full" />
                <span className="max-w-[10rem] truncate">@{item.username}</span>
              </button>
              <button
                type="button"
                onClick={() => removeRecent(item)}
                aria-label={t.recent.remove(item.username)}
                className="grid size-6 place-items-center rounded-full text-subtle opacity-60 transition hover:bg-surface-2 hover:text-fg group-hover/chip:opacity-100"
              >
                <X className="size-3" />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </motion.div>
  );
}
