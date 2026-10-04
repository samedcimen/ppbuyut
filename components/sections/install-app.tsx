"use client";

import { Download, Share, SquarePlus } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { PlatformBadge } from "@/components/platform-icon";

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
        <p className="text-xs font-semibold tracking-[0.14em] text-subtle uppercase">Uygulama</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">Telefonuna ekle</h2>

        {device === "ios" ? (
          <>
            <p className="mt-2 leading-relaxed text-muted">
              Ana ekrandan tek dokunuşla aç; adres çubuğu olmadan uygulama gibi çalışır.
            </p>
            <ol className="mt-5 space-y-3 text-sm text-muted">
              <li className="flex items-center gap-3">
                <Step n={1} /> Safari&apos;de alttaki <Share className="size-4 text-fg" /> Paylaş düğmesine dokun.
              </li>
              <li className="flex items-center gap-3">
                <Step n={2} /> <SquarePlus className="size-4 text-fg" /> “Ana Ekrana Ekle”yi seç.
              </li>
            </ol>
          </>
        ) : (
          <>
            <p className="mt-2 leading-relaxed text-muted">
              Yükledikten sonra Instagram, TikTok gibi uygulamalarda bir profili{" "}
              <span className="font-medium text-fg">Paylaş → ppbüyüt</span> ile doğrudan açabilirsin.
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
                Uygulamayı yükle
              </button>
            ) : (
              <p className="mt-6 rounded-xl bg-surface-2 p-3 text-[13px] leading-relaxed text-muted">
                Tarayıcı menüsünden (⋮) <span className="font-medium text-fg">“Uygulamayı yükle”</span> ya da{" "}
                <span className="font-medium text-fg">“Ana ekrana ekle”</span>yi seç.
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
