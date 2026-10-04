import { PLATFORMS, type PlatformId } from "@/lib/platforms";
import { cn } from "@/lib/cn";

export function PlatformIcon({ id, className }: { id: PlatformId; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden fill="currentColor" className={cn("size-4 shrink-0", className)}>
      <path d={PLATFORMS[id].iconPath} />
    </svg>
  );
}

/** Platform icon on its brand-colored tile. */
export function PlatformBadge({
  id,
  size = "md",
  className,
}: {
  id: PlatformId;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const p = PLATFORMS[id];
  return (
    <span
      className={cn(
        "inline-grid shrink-0 place-items-center ring-1 ring-inset ring-black/5 dark:ring-white/10",
        size === "sm" && "size-6 rounded-md",
        size === "md" && "size-8 rounded-lg",
        size === "lg" && "size-10 rounded-xl",
        className,
      )}
      style={{ background: p.brand, color: p.brandFg }}
    >
      <PlatformIcon
        id={id}
        className={cn(size === "sm" && "size-3.5", size === "md" && "size-4", size === "lg" && "size-5")}
      />
    </span>
  );
}
