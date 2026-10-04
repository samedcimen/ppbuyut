"use client";

import { ExternalLink, ImageOff, PlugZap, RotateCcw, SearchX, ShieldAlert, Timer, type LucideIcon } from "lucide-react";
import type { AvatarErrorCode } from "@/lib/avatar-client";
import { PLATFORMS, type PlatformId } from "@/lib/platforms";

export type ViewerErrorCode = AvatarErrorCode | "image_failed";

const COPY: Record<ViewerErrorCode, { icon: LucideIcon; title: string; body: (p: string, u: string) => string }> = {
  not_found: {
    icon: SearchX,
    title: "Profil bulunamadı",
    body: (p, u) => `${p} üzerinde @${u} adlı bir hesap bulamadık. Kullanıcı adını kontrol edip tekrar dene.`,
  },
  rate_limited: {
    icon: Timer,
    title: "Biraz yavaşlayalım",
    body: () => "Kısa sürede çok fazla istek gönderildi. Bir dakika bekleyip tekrar dene.",
  },
  blocked: {
    icon: ShieldAlert,
    title: "Platform isteği engelledi",
    body: (p) => `${p} şu anda erişimi kısıtlıyor. Bu genellikle geçicidir, birazdan tekrar dene.`,
  },
  unavailable: {
    icon: PlugZap,
    title: "Bu platform şu an kullanılamıyor",
    body: (p) => `${p} için şu an çalışan bir yöntem yok. Durumu Platformlar sayfasından takip edebilirsin.`,
  },
  image_failed: {
    icon: ImageOff,
    title: "Görsel yüklenemedi",
    body: () => "Fotoğrafın adresi bulundu ama görsel açılamadı. Bağlantının süresi dolmuş olabilir.",
  },
  unknown: {
    icon: ShieldAlert,
    title: "Bir şeyler ters gitti",
    body: () => "Beklenmeyen bir hata oluştu. Lütfen tekrar dene.",
  },
};

interface ErrorCardProps {
  code: ViewerErrorCode;
  platform: PlatformId;
  username: string;
  onRetry: () => void;
}

export function ErrorCard({ code, platform, username, onRetry }: ErrorCardProps) {
  const p = PLATFORMS[platform];
  const { icon: Icon, title, body } = COPY[code];

  return (
    <div role="alert" className="rounded-3xl border border-line bg-surface px-6 py-10 text-center shadow-float sm:py-12">
      <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-danger/10 text-danger ring-1 ring-danger/15 ring-inset">
        <Icon className="size-6" />
      </div>
      <h2 className="mt-5 text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">{body(p.name, username)}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={onRetry}
          className="flex h-10 items-center gap-2 rounded-xl bg-fg px-4 text-sm font-semibold text-bg transition-all hover:opacity-90 active:scale-[0.98]"
        >
          <RotateCcw className="size-4" />
          Tekrar dene
        </button>
        {code !== "not_found" && (
          <a
            href={p.profileUrl(username)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 items-center gap-2 rounded-xl border border-line px-4 text-sm font-medium transition-colors hover:bg-surface-2"
          >
            <ExternalLink className="size-4" />
            {p.name} profilini aç
          </a>
        )}
      </div>
    </div>
  );
}
