"use client";

import { Bookmark, MousePointerClick, MoveUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PlatformBadge } from "@/components/platform-icon";

/**
 * Bookmarklet that opens the current page in ppbüyüt, using the profile-path
 * route (/<profile link>). "?" is escaped so query-based profile links
 * (facebook.com/profile.php?id=…) survive; the #fragment is dropped. The
 * escape is built at run time: browsers percent-decode javascript: URLs before
 * running them, so a literal "%3F" here would turn back into "?".
 */
function bookmarkletFor(origin: string) {
  return `javascript:(function(){window.open('${origin}/'+location.href.split('#')[0].replace(/\\?/g,encodeURIComponent('?')),'_blank')})()`;
}

export function Bookmarklet() {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [hint, setHint] = useState(false);

  // React refuses javascript: URLs in href, so the attribute is set directly.
  useEffect(() => {
    linkRef.current?.setAttribute("href", bookmarkletFor(window.location.origin));
  }, []);

  return (
    <section className="mx-auto hidden max-w-6xl px-4 pb-24 sm:px-6 sm:pb-32 lg:block">
      <div className="grid items-center gap-10 rounded-3xl border border-line bg-surface p-10 shadow-soft lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-subtle uppercase">Yer imi</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em]">Gezinirken tek tıkla büyüt</h2>
          <p className="mt-3 max-w-md leading-relaxed text-muted">
            Butonu yer imleri çubuğuna sürükle. Instagram, TikTok ya da başka bir platformda bir profildeyken ona
            tıkla; ppbüyüt o profille yeni sekmede açılsın.
          </p>
          <ol className="mt-6 space-y-3 text-sm text-muted">
            <li className="flex items-center gap-3">
              <Step n={1} />
              Yer imleri çubuğu görünmüyorsa <Kbd>Ctrl</Kbd>
              <Kbd>Shift</Kbd>
              <Kbd>B</Kbd> ile aç.
            </li>
            <li className="flex items-center gap-3">
              <Step n={2} />
              Sağdaki butonu tutup çubuğa sürükle.
            </li>
            <li className="flex items-center gap-3">
              <Step n={3} />
              Bir profildeyken yer imine tıkla.
            </li>
          </ol>
        </div>

        <div className="relative flex flex-col items-center justify-center rounded-2xl bg-surface-2 px-8 py-12">
          <a
            ref={linkRef}
            href="#"
            draggable
            title="Yer imleri çubuğuna sürükle"
            onClick={(e) => {
              // On our own page the bookmarklet makes no sense; nudge to drag instead.
              e.preventDefault();
              setHint(true);
            }}
            className="flex h-12 cursor-grab items-center gap-2.5 rounded-full bg-fg px-6 text-sm font-semibold text-bg shadow-float transition-transform hover:scale-[1.03] active:cursor-grabbing"
          >
            <Bookmark className="size-4" />
            ppbüyüt&apos;te aç
          </a>
          <p className="mt-4 flex items-center gap-1.5 text-xs text-subtle">
            {hint ? (
              <>
                <MoveUpRight className="size-3.5" />
                Tıklama yerine yer imleri çubuğuna sürükle
              </>
            ) : (
              <>
                <MousePointerClick className="size-3.5" />
                Tut ve sürükle
              </>
            )}
          </p>
          <div className="mt-8 flex gap-2 opacity-80">
            {(["instagram", "tiktok", "x", "youtube", "facebook"] as const).map((id) => (
              <PlatformBadge key={id} id={id} size="sm" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({ n }: { n: number }) {
  return (
    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-surface-2 font-mono text-xs text-fg ring-1 ring-line">
      {n}
    </span>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-line bg-surface px-1 font-mono text-[11px] text-fg">
      {children}
    </kbd>
  );
}
