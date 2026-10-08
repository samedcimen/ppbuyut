"use client";

import { AnimatePresence, motion } from "motion/react";
import { CircleAlert, CircleCheck, CornerDownLeft, ShieldCheck, TriangleAlert } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AvatarError, getAvatar, type AvatarResponse } from "@/lib/avatar-client";
import { detect, isValidFor } from "@/lib/detect";
import { useLocale, useMessages } from "@/lib/i18n/client";
import { profilePath } from "@/lib/i18n/routes";
import { PLATFORMS, PLATFORM_LIST, profileLabel, type PlatformId } from "@/lib/platforms";
import { useServiceStatus } from "@/lib/service-status";
import { addRecent, platformStore, type RecentSearch } from "@/lib/stores";
import { cn } from "@/lib/cn";
import { BrandBackdrop } from "./brand-backdrop";
import { ErrorCard, type ViewerErrorCode } from "./error-card";
import { PlatformPicker } from "./platform-picker";
import { RecentSearches } from "./recent-searches";
import { ResultCard, ResultSkeleton } from "./result-card";
import { SearchBox } from "./search-box";

type ViewState =
  | { status: "idle" }
  | { status: "loading"; platform: PlatformId; username: string }
  | { status: "success"; result: AvatarResponse }
  | { status: "error"; code: ViewerErrorCode; platform: PlatformId; username: string };

const ease = [0.22, 1, 0.36, 1] as const;

interface ViewerProps {
  /** Profile to search right away (opened via a profile path). */
  initial?: { platform: PlatformId; username: string };
  /** Text to prefill without searching (an unusable link, so its error shows). */
  initialText?: string;
  /** Platform to select on arrival (platform landing pages). */
  presetPlatform?: PlatformId;
  /** Hero heading (defaults to the home page's): first line, highlighted part, and the words after it. */
  heading?: { line: string; highlight: string; after?: string };
  subtitle?: string;
}

export function Viewer({ initial, initialText, presetPlatform, heading, subtitle }: ViewerProps) {
  const t = useMessages();
  const locale = useLocale();
  const title = heading ?? t.hero;
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [value, setValue] = useState(() =>
    initial ? PLATFORMS[initial.platform].profileUrl(initial.username) : (initialText ?? ""),
  );
  // A profile path starts searching at once, so the loading card is there from the first paint.
  const [state, setState] = useState<ViewState>(
    initial ? { status: "loading", platform: initial.platform, username: initial.username } : { status: "idle" },
  );
  const selected = platformStore.useValue();
  const status = useServiceStatus();

  const detection = useMemo(() => detect(value), [value]);

  const target =
    detection.kind === "link"
      ? { platform: detection.platform, username: detection.username }
      : detection.kind === "username"
        ? { platform: selected, username: detection.username }
        : null;

  const fieldError =
    detection.kind === "invalid"
      ? t.detect[detection.reason](detection.platform ? PLATFORMS[detection.platform].name : "")
      : detection.kind === "username" && !isValidFor(selected, detection.username)
        ? t.detect.invalid_for(PLATFORMS[selected].name)
        : null;

  const canSubmit = target !== null && fieldError === null;
  const linkPlatform =
    detection.kind === "link" || detection.kind === "invalid" ? (detection.platform ?? null) : null;
  const pickerValue = linkPlatform ?? selected;
  const boxPlatform = value ? (target?.platform ?? linkPlatform) : null;

  const statePlatform =
    state.status === "success" ? state.result.platform : state.status === "idle" ? null : state.platform;
  const accentPlatform = boxPlatform ?? statePlatform ?? selected;
  const accent = accentPlatform ? (PLATFORMS[accentPlatform].accent ?? "var(--fg)") : "var(--fg)";

  const run = useCallback(
    async (platform: PlatformId, username: string) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setState({ status: "loading", platform, username });
      requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }));

      try {
        const result = await getAvatar(platform, username, controller.signal);
        setState({ status: "success", result });
        addRecent({ platform, username, name: result.name });
        // Shareable address for this result (e.g. /instagram/kullanici, /en/instagram/username).
        const path = profilePath(platform, username, locale);
        if (window.location.pathname !== path) window.history.replaceState(null, "", path);
      } catch (err) {
        if (controller.signal.aborted) return;
        setState({
          status: "error",
          code: err instanceof AvatarError ? err.code : "unknown",
          platform,
          username,
        });
      }
    },
    [locale],
  );

  const handlePasteText = useCallback(
    (text: string) => {
      setValue(text);
      inputRef.current?.focus();
      const d = detect(text);
      // A recognized profile link is unambiguous — fetch right away.
      if (d.kind === "link") run(d.platform, d.username);
    },
    [run],
  );

  // Paste anywhere on the page, and "/" to focus the field.
  useEffect(() => {
    const isEditable = (el: EventTarget | null) =>
      el instanceof HTMLElement && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));

    function onPaste(e: ClipboardEvent) {
      if (isEditable(e.target)) return;
      const text = e.clipboardData?.getData("text").trim();
      if (!text) return;
      e.preventDefault();
      handlePasteText(text);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "/" && !isEditable(e.target) && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener("paste", onPaste);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("paste", onPaste);
      document.removeEventListener("keydown", onKey);
    };
  }, [handlePasteText]);

  useEffect(() => {
    if (presetPlatform) platformStore.set(presetPlatform);
  }, [presetPlatform]);

  // Opened via a profile path (ppbuyut.com/instagram.com/…): start right away.
  const initialRef = useRef(initial);
  useEffect(() => {
    const start = initialRef.current;
    if (start) run(start.platform, start.username);
  }, [run]);

  function handlePick(id: PlatformId) {
    platformStore.set(id);
    // Switching platform on a link keeps the username: "same handle, other platform".
    if (detection.kind === "link" && detection.platform !== id) setValue(detection.username);
    else if (detection.kind === "invalid" && detection.platform && detection.platform !== id) setValue("");
    inputRef.current?.focus();
  }

  function handleRecent(entry: RecentSearch) {
    platformStore.set(entry.platform);
    setValue(entry.username);
    run(entry.platform, entry.username);
  }

  function retry() {
    if (state.status === "error") run(state.platform, state.username);
  }

  return (
    <section className="accent-scope relative isolate" style={{ "--accent": accent } as CSSProperties}>
      <BrandBackdrop platform={accentPlatform} />

      <div className="mx-auto max-w-2xl px-4 pt-16 sm:px-6 sm:pt-24">
        {/* The heading is the largest thing on the page (LCP), so it paints at once; only the
            line above and the text below get a CSS entrance, which needs no JavaScript. */}
        <div className="text-center">
          <span className="hero-in inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1 text-xs font-medium text-muted shadow-soft backdrop-blur">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-success" />
            </span>
            {t.hero.eyebrow(PLATFORM_LIST.length)}
          </span>
          <h1 className="mt-6 text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.045em] text-balance sm:text-6xl">
            {title.line}
            <br />
            <span
              className="bg-gradient-to-r from-fg via-[color-mix(in_oklab,var(--accent)_75%,var(--fg))] to-fg bg-clip-text text-transparent"
              style={
                accentPlatform && PLATFORMS[accentPlatform].accent
                  ? {
                      backgroundImage: `linear-gradient(90deg, ${PLATFORMS[accentPlatform].glow
                        .map((c) => `color-mix(in oklab, ${c} 82%, var(--fg))`)
                        .join(", ")})`,
                    }
                  : undefined
              }
            >
              {title.highlight}
            </span>
            {title.after && ` ${title.after}`}
          </h1>
          <p className="hero-in mx-auto mt-5 max-w-md text-base leading-relaxed text-pretty text-muted sm:text-lg">
            {subtitle ?? t.hero.subtitle}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease }}
          className="mt-10"
        >
          <SearchBox
            inputRef={inputRef}
            value={value}
            onChange={setValue}
            onSubmit={() => target && run(target.platform, target.username)}
            onPasteText={handlePasteText}
            platform={boxPlatform}
            detected={detection.kind === "link"}
            invalid={fieldError !== null}
            canSubmit={canSubmit}
            loading={state.status === "loading"}
          />

          <HelperLine
            detection={detection}
            selected={selected}
            fieldError={fieldError}
            down={target !== null && status?.[target.platform]?.state === "down"}
          />

          <div className="mt-3">
            <PlatformPicker value={pickerValue} onChange={handlePick} attention={detection.kind === "username"} />
          </div>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-subtle">
            <ShieldCheck className="size-3.5 shrink-0" />
            {t.search.noPassword}
          </p>

          {/* Under the picker while nothing is shown; below the result otherwise, so the result stays on top. */}
          {state.status === "idle" && <RecentSearches onSelect={handleRecent} />}
        </motion.div>
      </div>

      <div ref={resultRef} className="mx-auto max-w-3xl scroll-mt-20 px-4 pt-10 sm:px-6">
        <AnimatePresence mode="wait">
          {state.status !== "idle" && (
            <motion.div
              key={
                state.status === "success"
                  ? `ok:${state.result.url}`
                  : `${state.status}:${state.platform}:${state.username}`
              }
              initial={{ opacity: 0, y: 16, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.985 }}
              transition={{ duration: 0.35, ease }}
            >
              {state.status === "loading" && (
                <ResultSkeleton username={state.username} platformName={PLATFORMS[state.platform].name} />
              )}
              {state.status === "success" && (
                <ResultCard
                  result={state.result}
                  onImageError={() =>
                    setState({
                      status: "error",
                      code: "image_failed",
                      platform: state.result.platform,
                      username: state.result.username,
                    })
                  }
                />
              )}
              {state.status === "error" && (
                <ErrorCard code={state.code} platform={state.platform} username={state.username} onRetry={retry} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
        {state.status !== "idle" && <RecentSearches onSelect={handleRecent} />}
      </div>
    </section>
  );
}

function HelperLine({
  detection,
  selected,
  fieldError,
  down,
}: {
  detection: ReturnType<typeof detect>;
  selected: PlatformId;
  fieldError: string | null;
  /** The platform about to be searched is currently down. */
  down: boolean;
}) {
  const t = useMessages();
  let content: React.ReactNode;
  let key: string;
  const targetPlatform = detection.kind === "link" ? detection.platform : selected;

  if (fieldError) {
    key = `err:${fieldError}`;
    content = (
      <span className="flex items-center gap-1.5 text-danger">
        <CircleAlert className="size-3.5 shrink-0" />
        {fieldError}
      </span>
    );
  } else if (down) {
    key = `down:${targetPlatform}`;
    content = (
      <span className="flex items-center gap-1.5 text-warning">
        <TriangleAlert className="size-3.5 shrink-0" />
        {t.search.platformDown(PLATFORMS[targetPlatform].name)}
      </span>
    );
  } else if (detection.kind === "link") {
    key = `link:${detection.platform}`;
    content = (
      <span className="flex items-center gap-1.5">
        <CircleCheck className="size-3.5 shrink-0 text-success" />
        <span>
          {t.search.linkDetected(PLATFORMS[detection.platform].name)}
          <span className="text-subtle"> · {profileLabel(detection.username, undefined, t.result.artist)}</span>
        </span>
      </span>
    );
  } else if (detection.kind === "username") {
    key = `user:${selected}`;
    content = (
      <span>{t.search.willSearch(PLATFORMS[selected].name)}</span>
    );
  } else {
    key = "empty";
    content = (
      <span className="flex items-center gap-3">
        <span>{t.search.empty}</span>
        <span className="hidden items-center gap-1.5 text-subtle sm:flex">
          <Kbd>/</Kbd> {t.search.focusHint}
          <Kbd>
            <CornerDownLeft className="size-3" />
          </Kbd>
          {t.search.submitHint}
        </span>
      </span>
    );
  }

  return (
    <div className="flex h-9 items-center px-1 text-[13px] text-muted" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={key}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.15 }}
          className={cn("min-w-0 truncate")}
        >
          {content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-line bg-surface px-1 font-mono text-[11px] text-muted shadow-[0_1px_0_var(--line)]">
      {children}
    </kbd>
  );
}
