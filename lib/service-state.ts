import type { PlatformId } from "./platforms";

// Live service state per platform, shared by the server (lib/health.ts) and the UI.

export type ServiceState = "up" | "degraded" | "down";

export interface PlatformHealth {
  platform: PlatformId;
  state: ServiceState;
  checkedAt: number;
}

export const STATE_LABEL: Record<ServiceState, string> = {
  up: "Çalışıyor",
  degraded: "Kısıtlı",
  down: "Çalışmıyor",
};

export const STATE_HINT: Record<ServiceState, string> = {
  up: "Platformun kendi yöntemiyle sorunsuz çalışıyor.",
  degraded: "Çalışıyor ama şu an yedek kaynaktan ya da küçük boyutta sonuç veriyor.",
  down: "Şu an sonuç alınamıyor. Birazdan tekrar dene.",
};

export const STATE_DOT: Record<ServiceState, string> = {
  up: "bg-success",
  degraded: "bg-warning",
  down: "bg-danger",
};
