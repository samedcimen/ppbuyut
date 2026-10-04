"use client";

import { AnimatePresence, motion } from "motion/react";
import { Download, X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface LightboxProps {
  open: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  caption: string;
  onDownload: () => void;
}

export function Lightbox({ open, onClose, src, alt, caption, onDownload }: LightboxProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 text-white sm:px-6">
            <p className="truncate font-mono text-sm text-white/70">{caption}</p>
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={onDownload}
                className="flex h-9 items-center gap-2 rounded-full px-3.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/10"
              >
                <Download className="size-4" />
                İndir
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Kapat"
                className="grid size-9 place-items-center rounded-full text-white/90 transition-colors hover:bg-white/10"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center p-4 sm:p-8">
            <motion.img
              src={src}
              alt={alt}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
            />
          </div>
          <p className="pb-4 text-center text-xs text-white/40">Gerçek boyutunda gösteriliyor · Kapatmak için Esc</p>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
