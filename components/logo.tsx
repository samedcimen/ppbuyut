import { cn } from "@/lib/cn";

/** Viewfinder corners around an avatar — "a profile picture, zoomed in". */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-7", className)}>
      <rect width="32" height="32" rx="9" className="fill-fg" />
      <g className="stroke-bg" strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M7 11.5V9a2 2 0 0 1 2-2h2.5" />
        <path d="M20.5 7H23a2 2 0 0 1 2 2v2.5" />
        <path d="M25 20.5V23a2 2 0 0 1-2 2h-2.5" />
        <path d="M11.5 25H9a2 2 0 0 1-2-2v-2.5" />
      </g>
      <circle cx="16" cy="14" r="3.25" className="fill-bg" />
      <path d="M10.75 22.25c.9-2.6 2.9-4 5.25-4s4.35 1.4 5.25 4" className="stroke-bg" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="text-[15px] font-semibold tracking-tight">
        pp<span className="text-muted">büyüt</span>
      </span>
    </span>
  );
}
