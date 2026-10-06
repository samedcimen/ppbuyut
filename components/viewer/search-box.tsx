"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, AtSign, ClipboardPaste, LoaderCircle, X } from "lucide-react";
import { useEffect, useState, useSyncExternalStore, type ClipboardEvent, type RefObject } from "react";
import { PlatformBadge } from "@/components/platform-icon";
import type { PlatformId } from "@/lib/platforms";
import { cn } from "@/lib/cn";
import { useMessages } from "@/lib/i18n/client";

const noopSubscribe = () => () => {};

interface SearchBoxProps {
  inputRef: RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  /** Called with clipboard text when pasting into an empty field or via the paste button. */
  onPasteText: (text: string) => void;
  platform: PlatformId | null;
  /** True when the platform was detected from a link (not just chosen). */
  detected: boolean;
  invalid: boolean;
  canSubmit: boolean;
  loading: boolean;
}

export function SearchBox({
  inputRef,
  value,
  onChange,
  onSubmit,
  onPasteText,
  platform,
  detected,
  invalid,
  canSubmit,
  loading,
}: SearchBoxProps) {
  const t = useMessages();
  const [focused, setFocused] = useState(false);
  const clipboardSupported = useSyncExternalStore(
    noopSubscribe,
    () => !!navigator.clipboard?.readText,
    () => false,
  );

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const el = e.currentTarget;
    const replacesAll = el.value === "" || (el.selectionStart === 0 && el.selectionEnd === el.value.length);
    if (!replacesAll) return;
    const text = e.clipboardData.getData("text").trim();
    if (!text) return;
    e.preventDefault();
    onPasteText(text);
  }

  async function pasteFromClipboard() {
    try {
      const text = (await navigator.clipboard.readText()).trim();
      if (text) onPasteText(text);
    } catch {
      inputRef.current?.focus();
    }
  }

  return (
    // A search, not a login form: role, type and the password-manager opt-outs keep
    // browsers from offering saved credentials here.
    <form
      role="search"
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit && !loading) onSubmit();
      }}
      className={cn(
        "group relative flex h-16 items-center gap-1 rounded-2xl border bg-surface pr-2 pl-3 shadow-float transition-[border-color,box-shadow] duration-300",
        invalid
          ? "border-danger/50 ring-4 ring-danger/10"
          : "border-line-strong/70 focus-within:border-[color-mix(in_oklab,var(--accent)_45%,var(--line-strong))] focus-within:ring-4 focus-within:ring-[color-mix(in_oklab,var(--accent)_14%,transparent)]",
      )}
    >
      {/* Leading platform indicator */}
      <div className="relative grid size-10 shrink-0 place-items-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={platform ?? "none"}
            initial={{ scale: 0.6, opacity: 0, rotate: -12 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.6, opacity: 0, rotate: 12 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="grid place-items-center"
          >
            {platform ? (
              <PlatformBadge id={platform} size="md" className={cn(!detected && "opacity-90")} />
            ) : (
              <span className="grid size-8 place-items-center rounded-lg bg-surface-2 text-subtle">
                <AtSign className="size-4" />
              </span>
            )}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="relative min-w-0 flex-1 self-stretch">
        <input
          ref={inputRef}
          type="search"
          name="q"
          data-1p-ignore
          data-lpignore="true"
          data-form-type="other"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onPaste={handlePaste}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape" && value) {
              e.preventDefault();
              onChange("");
            }
          }}
          aria-label={t.search.label}
          aria-invalid={invalid}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="search"
          className="h-full w-full appearance-none bg-transparent px-2 text-[17px] tracking-tight text-fg outline-none placeholder:text-transparent [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
          placeholder={t.search.label}
        />
        {!value && <RotatingPlaceholder paused={focused} />}
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        {value ? (
          <button
            type="button"
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            aria-label={t.search.clear}
            className="grid size-9 place-items-center rounded-full text-subtle transition-colors hover:bg-surface-2 hover:text-fg"
          >
            <X className="size-4" />
          </button>
        ) : (
          clipboardSupported && (
            <button
              type="button"
              onClick={pasteFromClipboard}
              className="flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-fg"
            >
              <ClipboardPaste className="size-4" />
              <span className="hidden sm:inline">{t.search.paste}</span>
            </button>
          )
        )}
        <button
          type="submit"
          disabled={!canSubmit || loading}
          aria-label={t.search.submit}
          className="grid size-11 place-items-center rounded-xl bg-fg text-bg transition-all duration-200 hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:bg-surface-3 disabled:text-subtle"
        >
          {loading ? <LoaderCircle className="size-5 animate-spin" /> : <ArrowRight className="size-5" />}
        </button>
      </div>
    </form>
  );
}

function RotatingPlaceholder({ paused }: { paused: boolean }) {
  const t = useMessages();
  const examples = t.search.examples;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % examples.length), 2600);
    return () => clearInterval(id);
  }, [paused, examples.length]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center overflow-hidden px-2">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={paused ? "static" : index}
          initial={{ y: 14, opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -14, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="truncate text-[17px] tracking-tight text-subtle"
        >
          {paused ? t.search.label : examples[index % examples.length]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
