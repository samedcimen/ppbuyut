"use client";

import { useEffect, useSyncExternalStore } from "react";

// Applies the saved theme (or the system one) by toggling `.dark` on <html>.
function applyTheme() {
  try {
    const saved = localStorage.getItem("theme");
    const dark = saved ? saved === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
  } catch {
    // storage blocked — keep the default theme
  }
}

const inlineScript = `(${applyTheme.toString()})()`;
const noopSubscribe = () => () => {};

/**
 * Inline script that sets the theme before first paint. It is only emitted in
 * server-rendered HTML: when React renders the layout on the client (e.g. a
 * not-found page) a <script> would never run and React warns about it, so
 * there the theme is applied from an effect instead.
 */
export function ThemeScript() {
  const serverRendered = useSyncExternalStore(noopSubscribe, () => false, () => true);

  useEffect(applyTheme, []);

  return serverRendered ? <script dangerouslySetInnerHTML={{ __html: inlineScript }} /> : null;
}
