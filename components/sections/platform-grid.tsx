import { LiveStatus } from "@/components/live-status";
import { PlatformBadge } from "@/components/platform-icon";
import { PLATFORM_LIST, STATUS_LABEL, type PlatformStatus } from "@/lib/platforms";
import { cn } from "@/lib/cn";

export const STATUS_DOT: Record<PlatformStatus, string> = {
  stable: "bg-success",
  beta: "bg-warning",
  experimental: "bg-danger",
};

const LARGEST = Math.max(...PLATFORM_LIST.map((p) => p.maxSize));

export function PlatformGrid() {
  const sorted = [...PLATFORM_LIST].sort((a, b) => b.maxSize - a.maxSize);

  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {sorted.map((p) => (
        <li
          key={p.id}
          className="group flex flex-col rounded-2xl border border-line bg-surface p-4 transition-[border-color,box-shadow] duration-300 hover:border-line-strong hover:shadow-soft"
        >
          <div className="flex items-center justify-between">
            <PlatformBadge id={p.id} />
            <LiveStatus platform={p.id} />
          </div>
          <p className="mt-4 font-semibold tracking-tight">{p.name}</p>
          <p className="flex items-center gap-1.5 text-xs text-subtle">
            {p.method}
            <span className={cn("size-1 rounded-full", STATUS_DOT[p.status])} />
            {STATUS_LABEL[p.status]}
          </p>

          <div className="mt-5">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] text-subtle">Maks. boyut</span>
              <span className="font-mono text-sm font-medium">{p.maxSizeLabel}</span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-fg/70 transition-colors duration-300 group-hover:bg-fg"
                style={{ width: `${Math.max(8, (p.maxSize / LARGEST) * 100)}%` }}
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
