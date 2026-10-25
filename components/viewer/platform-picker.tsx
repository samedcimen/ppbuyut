"use client";

import { motion } from "motion/react";
import { PlatformIcon } from "@/components/platform-icon";
import { PLATFORMS, PLATFORM_LIST, type PlatformId } from "@/lib/platforms";
import { STATE_DOT } from "@/lib/service-state";
import { useMessages } from "@/lib/i18n/client";
import { useServiceStatus } from "@/lib/service-status";
import { cn } from "@/lib/cn";

/** The first row: the platforms people search most. The rest follow in list order. */
const FIRST: PlatformId[] = ["instagram", "tiktok", "x", "youtube", "facebook", "threads", "snapchat", "kick"];
const ORDER: PlatformId[] = [...FIRST, ...PLATFORM_LIST.map((p) => p.id).filter((id) => !FIRST.includes(id))];

interface PlatformPickerProps {
  value: PlatformId | null;
  onChange: (id: PlatformId) => void;
  /** Highlights the grid when the user needs to pick a platform. */
  attention: boolean;
}

// Every platform at once, eight to a row (a phone fits eight 40 px buttons too).
export function PlatformPicker({ value, onChange, attention }: PlatformPickerProps) {
  const t = useMessages();
  const status = useServiceStatus();

  return (
    <div
      role="radiogroup"
      aria-label={t.search.platform}
      className={cn(
        "grid grid-cols-8 gap-1 rounded-2xl border p-1 transition-colors duration-300",
        attention ? "border-line-strong bg-surface" : "border-transparent",
      )}
    >
      {ORDER.map((id) => {
        const p = PLATFORMS[id];
        const active = value === id;
        // Only problems get a dot; a grid of green dots would just be noise.
        const state = status?.[id]?.state;
        const problem = state && state !== "up" ? state : null;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={problem ? `${p.name} (${t.status.labels[problem]})` : p.name}
            onClick={() => onChange(id)}
            className={cn(
              "group/item relative grid h-10 place-items-center rounded-xl outline-none transition-colors",
              !active && "text-subtle hover:bg-surface-2 hover:text-fg focus-visible:bg-surface-2",
            )}
            style={active ? { color: p.brandFg } : undefined}
          >
            {active && (
              <motion.span
                layoutId="platform-pill"
                className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5 dark:ring-white/10"
                style={{ background: p.brand }}
                transition={{ type: "spring", stiffness: 520, damping: 38 }}
              />
            )}
            <PlatformIcon id={id} className="relative size-[18px]" />
            {problem && (
              <span
                className={cn("absolute top-1.5 right-1.5 size-1.5 rounded-full ring-2 ring-bg sm:right-2.5", STATE_DOT[problem])}
              />
            )}
            <span className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 translate-y-1 rounded-md bg-fg px-2 py-1 text-xs font-medium whitespace-nowrap text-bg opacity-0 shadow-soft transition-all duration-150 group-hover/item:translate-y-0 group-hover/item:opacity-100">
              {p.name}
              {problem && <span className="font-normal opacity-70"> · {t.status.labels[problem]}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
