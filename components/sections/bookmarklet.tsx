"use client";

import { ArrowUpRight, Bookmark, FileImage, MousePointer2, MousePointerClick, MoveUpRight, Send } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { PlatformBadge } from "@/components/platform-icon";
import { bookmarkletFor } from "@/lib/bookmarklet";
import { CHROMIUM, detectBrowser, type Browser } from "@/lib/browser";
import { cn } from "@/lib/cn";
import { useLocale, useMessages } from "@/lib/i18n/client";
import { LOCALE_PREFIX } from "@/lib/i18n/routes";
import { site } from "@/lib/site";

/** Desktop ways to use ppbüyüt while browsing: bookmarklet, Chrome extension, Telegram bot. */
export function Bookmarklet() {
  const t = useMessages().tools;
  return (
    <section className="mx-auto hidden max-w-6xl px-4 pb-24 sm:px-6 sm:pb-32 lg:block">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold tracking-[0.14em] text-subtle uppercase">{t.eyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em]">{t.title}</h2>
        <p className="mx-auto mt-3 max-w-xl leading-relaxed text-muted">{t.body}</p>
      </div>
      <div className="grid grid-cols-3 gap-5">
        <BookmarkletCard />
        <ExtensionCard />
        <TelegramCard />
      </div>
    </section>
  );
}

function Card({
  visual,
  eyebrow,
  title,
  body,
  children,
}: {
  visual: React.ReactNode;
  eyebrow: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-3xl border border-line bg-surface p-5 shadow-soft">
      <div className="relative grid h-48 place-items-center overflow-hidden rounded-2xl bg-surface-2">{visual}</div>
      <div className="flex flex-1 flex-col px-2 pt-6 pb-2">
        <p className="text-xs font-semibold tracking-[0.14em] text-subtle uppercase">{eyebrow}</p>
        <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em]">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
        <div className="mt-auto pt-6">{children}</div>
      </div>
    </div>
  );
}

function BookmarkletCard() {
  const t = useMessages().bookmarklet;
  const locale = useLocale();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [hint, setHint] = useState(false);

  // React refuses javascript: URLs in href, so the attribute is set directly.
  useEffect(() => {
    linkRef.current?.setAttribute("href", bookmarkletFor(window.location.origin + LOCALE_PREFIX[locale], t));
  }, [locale, t]);

  return (
    <Card
      eyebrow={t.eyebrow}
      title={t.title}
      body={t.body}
      visual={
        <div className="flex flex-col items-center">
          <a
            ref={linkRef}
            href="#"
            draggable
            title={t.drag}
            onClick={(e) => {
              // On our own page the bookmarklet makes no sense; nudge to drag instead.
              e.preventDefault();
              setHint(true);
            }}
            className="flex h-11 cursor-grab items-center gap-2.5 rounded-full bg-fg px-5 text-sm font-semibold text-bg shadow-float transition-transform hover:scale-[1.03] active:cursor-grabbing"
          >
            <Bookmark className="size-4" />
            {t.button}
          </a>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-subtle">
            {hint ? <MoveUpRight className="size-3.5" /> : <MousePointerClick className="size-3.5" />}
            {hint ? t.dragHint : t.hold}
          </p>
          <div className="mt-5 flex gap-1.5 opacity-80">
            {(["instagram", "tiktok", "x", "youtube", "facebook"] as const).map((id) => (
              <PlatformBadge key={id} id={id} size="sm" />
            ))}
          </div>
        </div>
      }
    >
      <ol className="space-y-2.5 text-[13px] text-muted">
        <li className="flex items-center gap-2.5">
          <Step n={1} />
          <span>
            {t.step1} <Kbd>Ctrl</Kbd> <Kbd>Shift</Kbd> <Kbd>B</Kbd>
            {t.step1After === "." ? "" : " "}
            {t.step1After}
          </span>
        </li>
        <li className="flex items-center gap-2.5">
          <Step n={2} />
          {t.step2}
        </li>
        <li className="flex items-center gap-2.5">
          <Step n={3} />
          {t.step3}
        </li>
      </ol>
    </Card>
  );
}

const noopSubscribe = () => () => {};
const currentBrowser = () => detectBrowser(navigator.userAgent, "brave" in navigator);

function ExtensionCard() {
  const t = useMessages().tools.extension;
  // null while server-rendering; the generic "add to your browser" until then.
  const browser = useSyncExternalStore<Browser | null>(noopSubscribe, currentBrowser, () => null);
  return (
    <Card
      eyebrow={t.eyebrow}
      title={t.title}
      body={t.body}
      visual={
        // A right-click menu with our entry highlighted.
        <div className="relative">
          <div className="w-60 rounded-xl bg-surface py-1.5 text-[13px] text-muted shadow-float ring-1 ring-line">
            {t.menuOther.map((item) => (
              <div key={item} className="px-3.5 py-1.5">
                {item}
              </div>
            ))}
            <div className="my-1 border-t border-line" />
            <div className="mx-1.5 flex items-center gap-2 rounded-lg bg-fg/[0.06] px-2 py-1.5 font-medium text-fg">
              {/* eslint-disable-next-line @next/next/no-img-element -- tiny static icon */}
              <img src="/icons/icon-192.png" alt="" className="size-4 rounded" />
              {t.menu}
            </div>
          </div>
          <MousePointer2 className="absolute -right-3 bottom-1 size-5 fill-fg text-surface" />
        </div>
      }
    >
      {browser === "firefox" || browser === "safari" ? (
        <p className="rounded-xl bg-surface-2 p-3 text-[13px] leading-relaxed text-muted">
          {t.unsupported(t.browserNames[browser])}
        </p>
      ) : (
        <>
          <CtaLink href={site.chromeExtension}>
            {browser && CHROMIUM.has(browser) ? t.button[browser as keyof typeof t.button] : t.button.other}
          </CtaLink>
          <p className="mt-2.5 text-center text-xs text-subtle">
            {browser === "edge" ? t.note.edge : browser === "opera" ? t.note.opera : t.note.chromium}
          </p>
        </>
      )}
    </Card>
  );
}

/** Also on phones, next to the install card (components/sections/install-app.tsx). */
export function TelegramCard() {
  const t = useMessages().tools.telegram;
  return (
    <Card
      eyebrow={t.eyebrow}
      title={t.title}
      body={t.body}
      visual={
        // A tiny chat: the user's message, the bot's reply with the file.
        <div className="flex w-64 flex-col gap-2 text-[13px]">
          <div className="self-end rounded-2xl rounded-br-md bg-[#2AABEE] px-3.5 py-2 text-white shadow-soft">
            {t.sample}
          </div>
          <div className="w-52 overflow-hidden rounded-2xl rounded-bl-md bg-surface shadow-float ring-1 ring-line">
            <div className="flex items-center gap-2.5 p-2.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#2AABEE]/15 text-[#2AABEE]">
                <FileImage className="size-4.5" />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-medium text-fg">{t.file}</span>
                <span className="block text-[11px] text-subtle">{t.fileMeta}</span>
              </span>
            </div>
            <div className="border-t border-line py-1.5 text-center text-xs font-medium text-[#2AABEE]">{t.open}</div>
          </div>
        </div>
      }
    >
      <CtaLink href={`https://t.me/${site.telegramBot}`} icon={<Send className="size-4" />}>
        {t.button}
      </CtaLink>
      <p className="mt-2.5 text-center text-xs text-subtle">@{site.telegramBot}</p>
    </Card>
  );
}

function CtaLink({ href, icon, children }: { href: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-fg text-sm font-semibold text-bg",
        "transition-all hover:opacity-90 active:scale-[0.98]",
      )}
    >
      {icon}
      {children}
      <ArrowUpRight className="size-4 opacity-60" />
    </a>
  );
}

function Step({ n }: { n: number }) {
  return (
    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-surface-2 font-mono text-[11px] text-fg ring-1 ring-line">
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
