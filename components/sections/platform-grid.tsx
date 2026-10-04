import Link from "next/link";
import { LiveStatus } from "@/components/live-status";
import { PlatformBadge } from "@/components/platform-icon";
import { getMessages, sizeLabel, type Locale } from "@/lib/i18n";
import { landingPath } from "@/lib/i18n/routes";
import { PLATFORM_LIST, type PlatformStatus } from "@/lib/platforms";
import { cn } from "@/lib/cn";

export const STATUS_DOT: Record<PlatformStatus, string> = {
  stable: "bg-success",
  beta: "bg-warning",
  experimental: "bg-danger",
};

const LARGEST = Math.max(...PLATFORM_LIST.map((p) => p.maxSize));

export function PlatformGrid({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const sorted = [...PLATFORM_LIST].sort((a, b) => b.maxSize - a.maxSize);

  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {sorted.map((p) => (
        <li key={p.id} className="flex">
          <Link
            href={landingPath(p.id, locale)}
            className="group flex w-full flex-col rounded-2xl border border-line bg-surface p-4 transition-[border-color,box-shadow] duration-300 hover:border-line-strong hover:shadow-soft"
          >
          <div className="flex items-center justify-between">
            <PlatformBadge id={p.id} />
            <LiveStatus platform={p.id} />
          </div>
          <p className="mt-4 font-semibold tracking-tight">{p.name}</p>
          <p className="flex items-center gap-1.5 text-xs text-subtle">
            {t.methods.labels[p.method]}
            <span className={cn("size-1 rounded-full", STATUS_DOT[p.status])} />
            {t.reliability.labels[p.status]}
          </p>

          <div className="mt-5">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] text-subtle">{t.sizes.max}</span>
              <span className="font-mono text-sm font-medium">{sizeLabel(p.maxSizeLabel, t)}</span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-fg/70 transition-colors duration-300 group-hover:bg-fg"
                style={{ width: `${Math.max(8, (p.maxSize / LARGEST) * 100)}%` }}
              />
            </div>
          </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
