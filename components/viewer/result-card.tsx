"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, Copy, Download, ExternalLink, Info, Maximize2 } from "lucide-react";
import { useState } from "react";
import { PlatformBadge } from "@/components/platform-icon";
import { SOURCE_LABEL, type AvatarResponse } from "@/lib/avatar-client";
import { downloadImage } from "@/lib/download";
import { PLATFORMS, STATUS_LABEL } from "@/lib/platforms";
import { cn } from "@/lib/cn";
import { Lightbox } from "./lightbox";

interface ResultCardProps {
  result: AvatarResponse;
  onImageError: () => void;
}

export function ResultCard({ result, onImageError }: ResultCardProps) {
  const platform = PLATFORMS[result.platform];
  const [dims, setDims] = useState<{ w: number; h: number } | null>(
    result.width && result.height ? { w: result.width, h: result.height } : null,
  );
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  const fileName = `${result.platform}-${result.username}`;
  const alt = `${platform.name} kullanıcısı @${result.username} profil fotoğrafı`;
  const sizeText = dims ? `${dims.w} × ${dims.h}` : "—";
  const reachedMax = dims ? dims.w >= platform.maxSize * 0.95 : false;

  async function handleDownload() {
    setDownloading(true);
    await downloadImage(result.url, fileName);
    setDownloading(false);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(result.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable — nothing sensible to do
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-float">
      <div className="grid md:grid-cols-[minmax(0,1fr)_300px]">
        {/* Preview */}
        <div className="relative border-b border-line p-3 sm:p-4 md:border-r md:border-b-0">
          <button
            type="button"
            onClick={() => loaded && setLightbox(true)}
            className="group bg-checker relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl"
            aria-label="Tam ekran görüntüle"
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
                  className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 font-mono text-xs font-medium text-white backdrop-blur"
                >
                  {sizeText}
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
            <Spec label="Çözünürlük">
              <span className="font-mono">{sizeText}</span>
              {reachedMax && (
                <span className="ml-2 rounded-full bg-success/12 px-1.5 py-0.5 text-[11px] font-medium text-success">
                  En büyük
                </span>
              )}
            </Spec>
            <Spec label="Platform sınırı">{platform.maxSizeLabel}</Spec>
            <Spec label="Kaynak">{SOURCE_LABEL[result.source]}</Spec>
            <Spec label="Yöntem">
              {platform.method}
              {platform.status !== "stable" && (
                <span className="ml-1.5 text-subtle">· {STATUS_LABEL[platform.status]}</span>
              )}
            </Spec>
          </dl>

          {platform.note && (
            <p className="mt-4 flex gap-2 rounded-xl bg-surface-2 p-3 text-[13px] leading-relaxed text-muted">
              <Info className="mt-0.5 size-4 shrink-0" />
              {platform.note}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-2 md:mt-auto md:pt-6">
            <button
              type="button"
              onClick={handleDownload}
              disabled={!loaded || downloading}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-fg text-sm font-semibold text-bg transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
            >
              <Download className={cn("size-4", downloading && "animate-bounce")} />
              {downloading ? "İndiriliyor…" : "İndir"}
            </button>
            <div className="grid grid-cols-2 gap-2">
              <SecondaryButton onClick={handleCopy}>
                {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
                {copied ? "Kopyalandı" : "Bağlantı"}
              </SecondaryButton>
              <SecondaryButton href={platform.profileUrl(result.username)}>
                <ExternalLink className="size-4" />
                Profil
              </SecondaryButton>
            </div>
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

function SecondaryButton({
  children,
  onClick,
  href,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  const className =
    "flex h-10 items-center justify-center gap-2 rounded-xl border border-line text-sm font-medium text-fg transition-colors hover:bg-surface-2";
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
        <ArrowUpRight className="-ml-1 size-3.5 text-subtle" />
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
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
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between px-3.5 py-3">
                <Shimmer className="h-3 w-20 rounded" />
                <Shimmer className="h-3 w-14 rounded" />
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted md:mt-auto md:pt-6">
            <span className="text-fg">@{username}</span> {platformName} üzerinde aranıyor…
          </p>
          <Shimmer className="mt-3 h-11 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
