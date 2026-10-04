"use client";

import { motion } from "motion/react";
import { PlatformIcon } from "@/components/platform-icon";
import { PLATFORM_LIST, type PlatformId } from "@/lib/platforms";
import { cn } from "@/lib/cn";

interface PlatformPickerProps {
  value: PlatformId | null;
  onChange: (id: PlatformId) => void;
  /** Highlights the row when the user needs to pick a platform. */
  attention: boolean;
}

export function PlatformPicker({ value, onChange, attention }: PlatformPickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Platform"
      className={cn(
        "grid grid-cols-5 gap-1 rounded-2xl border p-1 transition-colors duration-300 sm:flex sm:justify-between",
        attention ? "border-line-strong bg-surface" : "border-transparent",
      )}
    >
      {PLATFORM_LIST.map((p) => {
        const active = value === p.id;
        return (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={p.name}
            onClick={() => onChange(p.id)}
            className={cn(
              "group/item relative grid h-10 place-items-center rounded-xl outline-none transition-colors sm:w-full",
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
            <PlatformIcon id={p.id} className="relative size-[18px]" />
            <span className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 translate-y-1 rounded-md bg-fg px-2 py-1 text-xs font-medium whitespace-nowrap text-bg opacity-0 shadow-soft transition-all duration-150 group-hover/item:translate-y-0 group-hover/item:opacity-100">
              {p.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
