"use client";

import { Download, Share, SquarePlus } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { PlatformBadge } from "@/components/platform-icon";
import { useMessages } from "@/lib/i18n/client";

/** Chrome's install prompt event (not in the DOM typings). */
interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const noopSubscribe = () => () => {};
type Device = "ios" | "android" | "other" | "installed" | null;

function detectDevice(): Device {
  if (window.matchMedia("(display-mode: standalone)").matches) return "installed";
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "other";
}

/** Phone counterpart of the bookmarklet card: install the app and use the Share menu. */
export function InstallApp() {
  const t = useMessages().install;
  const device = useSyncExternalStore(noopSubscribe, detectDevice, () => null);
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault(); // keep it for our button instead of the browser's mini-bar
      setPrompt(e as InstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (device === null || device === "installed" || installed) return null;

  async function install() {
    if (!prompt) return;
    await prompt.prompt();
    if ((await prompt.userChoice).outcome === "accepted") setInstalled(true);
    setPrompt(null);
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:hidden">
      <div className="rounded-3xl border border-line bg-surface p-6 shadow-soft sm:p-8">
        <p className="text-xs font-semibold tracking-[0.14em] text-subtle uppercase">{t.eyebrow}</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">{t.title}</h2>

        {device === "ios" ? (
          <>
            <p className="mt-2 leading-relaxed text-muted">{t.ios}</p>
            <ol className="mt-5 space-y-3 text-sm text-muted">
              <li className="flex items-center gap-3">
                <Step n={1} /> {t.iosStep1[0]} <Share className="size-4 text-fg" /> {t.iosStep1[1]}
              </li>
              <li className="flex items-center gap-3">
                <Step n={2} /> <SquarePlus className="size-4 text-fg" /> {t.iosStep2}
              </li>
            </ol>
            {/* iPhone users look for ppbüyüt in the Share menu, as on Android; say what works instead. */}
            <p className="mt-5 rounded-xl bg-surface-2 p-3 text-[13px] leading-relaxed text-muted">
              {t.iosShare[0]} <span className="font-medium text-fg">{t.iosShare[1]}</span> {t.iosShare[2]}
            </p>
          </>
        ) : (
          <>
            <p className="mt-2 leading-relaxed text-muted">
              {t.android[0]} <span className="font-medium text-fg">{t.android[1]}</span> {t.android[2]}
            </p>
            <div className="mt-4 flex gap-2 opacity-80">
              {(["instagram", "tiktok", "x", "youtube", "facebook"] as const).map((id) => (
                <PlatformBadge key={id} id={id} size="sm" />
              ))}
            </div>
            {prompt ? (
              <button
                type="button"
                onClick={install}
                className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-fg text-sm font-semibold text-bg transition-all hover:opacity-90 active:scale-[0.98]"
              >
                <Download className="size-4" />
                {t.button}
              </button>
            ) : (
              <p className="mt-6 rounded-xl bg-surface-2 p-3 text-[13px] leading-relaxed text-muted">
                {t.menu[0]} <span className="font-medium text-fg">{t.menu[1]}</span> {t.menu[2]}{" "}
                <span className="font-medium text-fg">{t.menu[3]}</span>
                {t.menu[4]}
              </p>
            )}
          </>
        )}
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
