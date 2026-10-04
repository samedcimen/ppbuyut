"use client";

import { Activity } from "lucide-react";
import type { PlatformId } from "@/lib/platforms";
import { STATE_DOT, STATE_HINT, STATE_LABEL, type ServiceState } from "@/lib/service-state";
import { useServiceStatus, useStatusAge } from "@/lib/service-status";
import { cn } from "@/lib/cn";

/** Live service state of one platform, as a small dot + label. */
export function LiveStatus({ platform }: { platform: PlatformId }) {
  const health = useServiceStatus()?.[platform];

  if (!health) {
    return (
      <span className="flex items-center gap-1.5 text-[11px] font-medium text-subtle">
        <span className="size-1.5 animate-pulse rounded-full bg-line-strong" />
        Kontrol ediliyor
      </span>
    );
  }

  return (
    <span title={STATE_HINT[health.state]} className="flex items-center gap-1.5 text-[11px] font-medium text-muted">
      <span className="relative flex size-1.5">
        {health.state === "up" && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-50" />
        )}
        <span className={cn("relative inline-flex size-1.5 rounded-full", STATE_DOT[health.state])} />
      </span>
      {STATE_LABEL[health.state]}
    </span>
  );
}

/** "9/11 platform çalışıyor · 3 dk önce kontrol edildi" */
export function StatusSummary() {
  const status = useServiceStatus();
  const age = useStatusAge();
  const all = status ? Object.values(status) : [];

  if (!status || all.length === 0) {
    return (
      <div className="inline-flex h-9 items-center gap-2 rounded-full border border-line bg-surface px-3.5 text-sm text-muted">
        <Activity className="size-4 animate-pulse" />
        {status ? "Servis durumu alınamadı" : "Servis durumu kontrol ediliyor…"}
      </div>
    );
  }

  const count = (state: ServiceState) => all.filter((h) => h.state === state).length;
  const minutes = age ?? 0;

  return (
    <div className="inline-flex flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl border border-line bg-surface px-4 py-2 text-sm">
      <span className="flex items-center gap-2 font-medium">
        <Activity className="size-4" />
        {count("up")}/{all.length} platform çalışıyor
      </span>
      {(["degraded", "down"] as const).map(
        (state) =>
          count(state) > 0 && (
            <span key={state} className="flex items-center gap-1.5 text-muted">
              <span className={cn("size-1.5 rounded-full", STATE_DOT[state])} />
              {count(state)} {STATE_LABEL[state].toLocaleLowerCase("tr")}
            </span>
          ),
      )}
      <span className="text-subtle">· {minutes < 1 ? "az önce kontrol edildi" : `${minutes} dk önce kontrol edildi`}</span>
    </div>
  );
}
