"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/cn";

export const NAV = [
  { href: "/platformlar", label: "Platformlar" },
  { href: "/sss", label: "SSS" },
  { href: "/hakkinda", label: "Hakkında" },
  { href: "/kullanim-sartlari", label: "Şartlar" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Close the mobile menu on navigation (state adjusted during render, no effect needed).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    // The wrapper spans the full width but must not block clicks on content scrolling beneath it.
    <header className="pointer-events-none sticky top-0 z-40 px-4 pt-4">
      <div className="pointer-events-auto mx-auto max-w-3xl">
        <nav className="flex h-14 items-center justify-between rounded-full border border-line/80 bg-surface/70 pr-2 pl-5 shadow-float backdrop-blur-xl backdrop-saturate-150">
          <Link href="/" aria-label="Ana sayfa" className="rounded-lg">
            <Logo />
          </Link>

          <div className="hidden items-center gap-0.5 sm:flex">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-3.5 py-1.5 text-sm transition-colors",
                    active ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-surface-2 ring-1 ring-line ring-inset"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={open}
              className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg sm:hidden"
            >
              {open ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="mt-2 overflow-hidden rounded-3xl border border-line/80 bg-surface/90 p-2 shadow-float backdrop-blur-xl sm:hidden"
            >
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex h-12 items-center rounded-2xl px-4 text-[15px] transition-colors",
                    pathname === item.href ? "bg-surface-2 font-medium text-fg" : "text-muted hover:bg-surface-2 hover:text-fg",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
