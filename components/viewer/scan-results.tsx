"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { PlatformBadge } from "@/components/platform-icon";
import { AvatarError, getAvatar, type AvatarResponse } from "@/lib/avatar-client";
import { isValidFor } from "@/lib/detect";
import { useMessages } from "@/lib/i18n/client";
import { PLATFORMS, PLATFORM_LIST, type PlatformId } from "@/lib/platforms";
import { cn } from "@/lib/cn";
import { Shimmer } from "./result-card";

// Spotify users have generated ids rather than names, and Threads shows the
// Instagram photo; neither says anything new about a username.
const SKIP: PlatformId[] = ["spotify", "threads"];
/** Searches running at once; the rest wait their turn. */
const CONCURRENCY = 5;

type Outcome =
  | { state: "pending" }
  | { state: "found"; result: AvatarResponse }
  | { state: "missing" | "hidden" | "error" };

/** A username searched on every platform it's valid for; found photos open in the main view. */
export function ScanResults({ username, onOpen }: { username: string; onOpen: (platform: PlatformId) => void }) {
  const t = useMessages();
  const platforms = PLATFORM_LIST.filter((p) => !SKIP.includes(p.id) && isValidFor(p.id, username)).map((p) => p.id);
  const [outcomes, setOutcomes] = useState<Partial<Record<PlatformId, Outcome>>>({});

  useEffect(() => {
    const controller = new AbortController();
    const queue = [...platforms];
    const worker = async () => {
      for (let id = queue.shift(); id; id = queue.shift()) {
        let outcome: Outcome;
        try {
          outcome = { state: "found", result: await getAvatar(id, username, controller.signal, { scan: true }) };
        } catch (err) {
          if (controller.signal.aborted) return;
          const code = err instanceof AvatarError ? err.code : "unknown";
          outcome = { state: code === "not_found" ? "missing" : code === "hidden" ? "hidden" : "error" };
        }
        setOutcomes((prev) => ({ ...prev, [id]: outcome }));
      }
    };
    void Promise.all(Array.from({ length: CONCURRENCY }, worker));
    return () => controller.abort();
    // `platforms` follows from `username`; the scan restarts only when the username changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const found = platforms.filter((id) => outcomes[id]?.state === "found").length;
  const done = platforms.filter((id) => outcomes[id] && outcomes[id].state !== "pending").length;

  return (
    <div className="rounded-3xl border border-line bg-surface p-5 shadow-float sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold tracking-tight">{t.scan.title(username)}</h2>
        <p className="text-sm text-muted tabular-nums" aria-live="polite">
          {done < platforms.length ? t.scan.progress(done, platforms.length) : t.scan.summary(found, platforms.length)}
        </p>
      </div>
      <p className="mt-2 flex gap-2 text-[13px] leading-relaxed text-subtle">
        <Info className="mt-0.5 size-3.5 shrink-0" />
        {t.scan.note}
      </p>

      <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {platforms.map((id) => {
          const outcome = outcomes[id] ?? { state: "pending" };
          const name = PLATFORMS[id].name;
          return (
            <motion.li key={id} layout transition={{ duration: 0.2 }}>
              {outcome.state === "found" ? (
                <button
                  type="button"
                  onClick={() => onOpen(id)}
                  className="group flex w-full items-center gap-3 rounded-2xl border border-line bg-surface p-2.5 text-left transition-colors hover:border-line-strong hover:bg-surface-2"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- remote avatar via our proxy */}
                  <img
                    src={outcome.result.url}
                    alt=""
                    className="bg-checker size-11 shrink-0 rounded-xl object-cover"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{name}</span>
                    <span className="flex items-center gap-0.5 text-xs text-success">
                      {t.scan.found}
                      <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </span>
                  </span>
                </button>
              ) : (
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border border-line/70 p-2.5",
                    outcome.state !== "pending" && "opacity-60",
                  )}
                >
                  {outcome.state === "pending" ? (
                    <Shimmer className="size-11 shrink-0 rounded-xl" />
                  ) : (
                    <span className="grid size-11 shrink-0 place-items-center">
                      <PlatformBadge id={id} size="sm" />
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{name}</span>
                    <span className="text-xs text-subtle">
                      {outcome.state === "pending" ? t.scan.searching : t.scan[outcome.state]}
                    </span>
                  </span>
                </div>
              )}
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
