"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronUp } from "lucide-react";
import { useState } from "react";
import { PlatformIcon } from "@/components/platform-icon";
import { PLATFORMS, PLATFORM_LIST, type Platform, type PlatformId } from "@/lib/platforms";
import { STATE_DOT, type ServiceState } from "@/lib/service-state";
import { useMessages } from "@/lib/i18n/client";
import { useServiceStatus } from "@/lib/service-status";
import { cn } from "@/lib/cn";

/** Always in the row: the platforms people search most. The rest open below. */
const PRIMARY: PlatformId[] = ["instagram", "tiktok", "x", "youtube", "facebook", "threads", "snapchat", "kick"];

interface PlatformPickerProps {
  value: PlatformId | null;
  onChange: (id: PlatformId) => void;
  /** Highlights the row when the user needs to pick a platform. */
  attention: boolean;
}

export function PlatformPicker({ value, onChange, attention }: PlatformPickerProps) {
  const t = useMessages();
  const status = useServiceStatus();
  const [open, setOpen] = useState(false);

  // The chosen platform always shows in the row: a less common one takes the last slot.
  const row = value && !PRIMARY.includes(value) ? [...PRIMARY.slice(0, -1), value] : PRIMARY;
  const rest = PLATFORM_LIST.filter((p) => !row.includes(p.id));
  // Only problems get a dot; a row of green dots would just be noise.
  const problemOf = (id: PlatformId): ServiceState | null => {
    const state = status?.[id]?.state;
    return state && state !== "up" ? state : null;
  };

  return (
    <div
      className={cn(
        "rounded-2xl border p-1 transition-colors duration-300",
        attention || open ? "border-line-strong bg-surface" : "border-transparent",
      )}
    >
      <div role="radiogroup" aria-label={t.search.platform} className="flex justify-between gap-1">
        {row.map((id) => (
          <RowButton
            key={id}
            platform={PLATFORMS[id]}
            active={value === id}
            problem={problemOf(id)}
            problemLabel={(s) => t.status.labels[s]}
            onSelect={() => onChange(id)}
          />
        ))}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="more-platforms"
          aria-label={open ? t.search.lessPlatforms : t.search.morePlatforms(rest.length)}
          className={cn(
            "grid h-10 w-full min-w-9 place-items-center rounded-xl text-xs font-semibold tabular-nums transition-colors",
            open ? "bg-surface-2 text-fg" : "text-subtle hover:bg-surface-2 hover:text-fg",
          )}
        >
          {open ? <ChevronUp className="size-4" /> : `+${rest.length}`}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="more-platforms"
            role="radiogroup"
            aria-label={t.search.morePlatforms(rest.length)}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-1 grid grid-cols-2 gap-1 border-t border-line pt-1 sm:grid-cols-4">
              {rest.map((p) => {
                const problem = problemOf(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={false}
                    onClick={() => {
                      onChange(p.id);
                      setOpen(false);
                    }}
                    className="flex h-10 items-center gap-2.5 rounded-xl px-3 text-left text-sm text-muted transition-colors hover:bg-surface-2 hover:text-fg"
                  >
                    <PlatformIcon id={p.id} className="size-4 shrink-0" />
                    <span className="truncate">{p.name}</span>
                    {problem && (
                      <span
                        title={t.status.labels[problem]}
                        className={cn("ml-auto size-1.5 shrink-0 rounded-full", STATE_DOT[problem])}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RowButton({
  platform: p,
  active,
  problem,
  problemLabel,
  onSelect,
}: {
  platform: Platform;
  active: boolean;
  problem: ServiceState | null;
  problemLabel: (state: ServiceState) => string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      aria-label={problem ? `${p.name} (${problemLabel(problem)})` : p.name}
      onClick={onSelect}
      className={cn(
        "group/item relative grid h-10 w-full min-w-9 place-items-center rounded-xl outline-none transition-colors",
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
      {problem && (
        <span
          className={cn("absolute top-1.5 right-1.5 size-1.5 rounded-full ring-2 ring-bg sm:right-2.5", STATE_DOT[problem])}
        />
      )}
      <span className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 translate-y-1 rounded-md bg-fg px-2 py-1 text-xs font-medium whitespace-nowrap text-bg opacity-0 shadow-soft transition-all duration-150 group-hover/item:translate-y-0 group-hover/item:opacity-100">
        {p.name}
        {problem && <span className="font-normal opacity-70"> · {problemLabel(problem)}</span>}
      </span>
    </button>
  );
}
