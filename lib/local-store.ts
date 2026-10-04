"use client";

import { useSyncExternalStore } from "react";

/**
 * A tiny localStorage-backed store usable from multiple components.
 * Values never leave the browser; storage failures (private mode, blocked
 * site data) fall back to in-memory state.
 */
export function createLocalStore<T>(key: string, fallback: T, parse: (raw: unknown) => T | null) {
  const listeners = new Set<() => void>();
  let snapshot: T | undefined;

  function get(): T {
    if (snapshot !== undefined) return snapshot;
    try {
      const raw = localStorage.getItem(key);
      snapshot = raw === null ? fallback : (parse(JSON.parse(raw)) ?? fallback);
    } catch {
      snapshot = fallback;
    }
    return snapshot;
  }

  function set(next: T | ((prev: T) => T)) {
    snapshot = typeof next === "function" ? (next as (prev: T) => T)(get()) : next;
    try {
      localStorage.setItem(key, JSON.stringify(snapshot));
    } catch {
      // ignore — value still lives in memory for this session
    }
    listeners.forEach((l) => l());
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function useValue() {
    return useSyncExternalStore(subscribe, get, () => fallback);
  }

  return { get, set, useValue };
}
