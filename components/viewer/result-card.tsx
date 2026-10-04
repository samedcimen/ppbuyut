"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Download, ExternalLink, Info, Maximize2 } from "lucide-react";
import { useState } from "react";
import { PlatformBadge } from "@/components/platform-icon";
import type { AvatarResponse } from "@/lib/avatar-client";
import { downloadImage } from "@/lib/download";
import { PLATFORMS } from "@/lib/platforms";
import { cn } from "@/lib/cn";
import { useMessages } from "@/lib/i18n/client";
import { Lightbox } from "./lightbox";

interface ResultCardProps {
  result: AvatarResponse;
  onImageError: () => void;
}

export function ResultCard({ result, onImageError }: ResultCardProps) {
  const t = useMessages();
  const platform = PLATFORMS[result.platform];
  const [dims, setDims] = useState<{ w: number; h: number } | null>(
    result.width && result.height ? { w: result.width, h: result.height } : null,
  );
  const [loaded, setLoaded] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  const alt = t.result.alt(platform.name, result.username);
  const sizeText = dims ? `${dims.w} × ${dims.h}` : "—";
  const reachedMax = result.original || (dims ? dims.w >= platform.maxSize * 0.95 : false);
  // A result-specific caveat (e.g. Bitmoji, small size) beats the platform's general one.
  const note = result.note ? t.notes[result.note] : t.platformNotes[platform.id];

  const handleDownload = () => downloadImage(result.url);

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-float">
      <div className="grid md:grid-cols-[minmax(0,1fr)_300px]">
        {/* Preview */}
        <div className="relative border-b border-line p-3 sm:p-4 md:border-r md:border-b-0">
          <button
            type="button"
            onClick={() => loaded && setLightbox(true)}
            className="group bg-checker relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl"
            aria-label={t.result.fullscreen}
          >
            {!loaded && <Shimmer className="absolute inset-0" />}
            {/* eslint-disable-next-line @next/next/no-img-element -- remote avatar, served via our proxy later */}
            <img
              src={result.url}
              alt={alt}
              onLoad={(e) => {
                const img = e.currentTarget;
                setDims({ w: img.naturalWidth, h: img.naturalHeight });
                setLoaded(true);
              }}
              onError={onImageError}
              className={cn(
                "size-full object-contain transition-[opacity,transform] duration-500 ease-out group-hover:scale-[1.015]",
                loaded ? "opacity-100" : "opacity-0",
              )}
            />
            <span className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
              <Maximize2 className="size-4" />
            </span>
            <AnimatePresence>
              {loaded && (
                <motion.span
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur"
                >
                  <span className="font-mono">{sizeText}</span>
                  {reachedMax && <span className="text-emerald-300">· {t.result.largest}</span>}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Details */}
        <div className="flex flex-col p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <PlatformBadge id={platform.id} size="lg" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-subtle">{platform.name}</p>
              <p className="truncate text-lg font-semibold tracking-tight">@{result.username}</p>
            </div>
          </div>

          <dl className="mt-6 divide-y divide-line rounded-xl border border-line text-sm">
            <Spec label={t.result.resolution}>
              <span className="font-mono">{sizeText}</span>
            </Spec>
            <Spec label={t.result.source}>{t.result.sources[result.source]}</Spec>
          </dl>

          {note && (
            <p className="mt-4 flex gap-2 rounded-xl bg-surface-2 p-3 text-[13px] leading-relaxed text-muted">
              <Info className="mt-0.5 size-4 shrink-0" />
              {note}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-2 md:mt-auto md:pt-6">
            <button
              type="button"
              onClick={handleDownload}
              disabled={!loaded}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-fg text-sm font-semibold text-bg transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
            >
              <Download className="size-4" />
              {t.result.download}
            </button>
            <a
              href={platform.profileUrl(result.username)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 items-center justify-center gap-2 rounded-xl border border-line text-sm font-medium text-fg transition-colors hover:bg-surface-2"
            >
              <ExternalLink className="size-4" />
              {t.result.openProfile(platform.name)}
              <ArrowUpRight className="-ml-1 size-3.5 text-subtle" />
            </a>
          </div>
        </div>
      </div>

      <Lightbox
        open={lightbox}
        onClose={() => setLightbox(false)}
        src={result.url}
        alt={alt}
        caption={`@${result.username} · ${platform.name} · ${sizeText}`}
        onDownload={handleDownload}
      />
    </div>
  );
}

function Spec({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
      <dt className="text-muted">{label}</dt>
      <dd className="flex items-center text-right font-medium whitespace-nowrap">{children}</dd>
    </div>
  );
}

export function Shimmer({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden bg-surface-2", className)}>
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-[color-mix(in_oklab,var(--fg)_6%,transparent)] to-transparent" />
    </div>
  );
}

export function ResultSkeleton({ username, platformName }: { username: string; platformName: string }) {
  const t = useMessages();
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-float" aria-busy="true">
      <div className="grid md:grid-cols-[minmax(0,1fr)_300px]">
        <div className="border-b border-line p-3 sm:p-4 md:border-r md:border-b-0">
          <Shimmer className="aspect-square w-full rounded-2xl" />
        </div>
        <div className="flex flex-col p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <Shimmer className="size-10 rounded-xl" />
            <div className="space-y-2">
              <Shimmer className="h-3 w-16 rounded" />
              <Shimmer className="h-4 w-32 rounded" />
            </div>
          </div>
          <div className="mt-6 space-y-px overflow-hidden rounded-xl border border-line">
            {[0, 1].map((i) => (
              <div key={i} className="flex items-center justify-between px-3.5 py-3">
                <Shimmer className="h-3 w-20 rounded" />
                <Shimmer className="h-3 w-14 rounded" />
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted md:mt-auto md:pt-6">
            <span className="text-fg">@{username}</span> {t.result.searching(platformName)}
          </p>
          <Shimmer className="mt-3 h-11 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
