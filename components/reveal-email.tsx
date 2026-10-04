"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Eye, EyeOff, Mail } from "lucide-react";
import { useState } from "react";
import { useMessages } from "@/lib/i18n/client";
import { decodeEmail } from "@/lib/obfuscate";

const iconButton =
  "grid size-10 place-items-center rounded-xl border border-line text-muted transition-colors hover:bg-surface-2 hover:text-fg";

/** Shows an e-mail address only on demand; the page source holds just an encoded form. */
export function RevealEmail({ encoded }: { encoded: string }) {
  const t = useMessages();
  const [email, setEmail] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable — the address is visible and selectable anyway
    }
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {email ? (
        <motion.div
          key="shown"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="flex flex-wrap items-center gap-2"
        >
          <span className="flex h-10 items-center rounded-xl bg-surface-2 px-3.5 font-mono text-sm select-all">
            {email}
          </span>
          <button type="button" onClick={copy} aria-label={t.email.copy} title={t.email.copyShort} className={iconButton}>
            {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
          </button>
          <a href={`mailto:${email}`} aria-label={t.email.send} title={t.email.send} className={iconButton}>
            <Mail className="size-4" />
          </a>
          <button
            type="button"
            onClick={() => setEmail(null)}
            aria-label={t.email.hide}
            title={t.email.hideShort}
            className={iconButton}
          >
            <EyeOff className="size-4" />
          </button>
        </motion.div>
      ) : (
        <motion.button
          key="hidden"
          type="button"
          onClick={() => setEmail(decodeEmail(encoded))}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="flex h-10 items-center gap-2 rounded-xl bg-fg px-4 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
        >
          <Eye className="size-4" />
          {t.email.show}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
