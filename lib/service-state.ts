import type { PlatformId } from "./platforms";

// Live service state per platform, shared by the server (lib/health.ts) and the UI.

export type ServiceState = "up" | "degraded" | "down";

export interface PlatformHealth {
  platform: PlatformId;
  state: ServiceState;
  checkedAt: number;
}

export const STATE_DOT: Record<ServiceState, string> = {
  up: "bg-success",
  degraded: "bg-warning",
  down: "bg-danger",
};
