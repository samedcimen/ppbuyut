"use client";

import { AnimatePresence, motion } from "motion/react";
import { PLATFORMS, type PlatformId } from "@/lib/platforms";

const glow = (color: string, strength: number) =>
  `radial-gradient(closest-side, color-mix(in oklab, ${color} ${strength}%, transparent), transparent)`;

/**
 * Blurred aura in the active platform's brand colors. Platforms crossfade
 * into each other; with no platform a neutral glow is shown.
 */
export function BrandBackdrop({ platform }: { platform: PlatformId | null }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-[4.5rem] -z-10 h-[780px] overflow-hidden">
      <div className="bg-dots absolute inset-0" />

      <AnimatePresence initial={false}>
        <motion.div
          key={platform ?? "none"}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          {platform ? <Aura colors={PLATFORMS[platform].glow} /> : <NeutralGlow />}
        </motion.div>
      </AnimatePresence>

      {/* Melt into the page background */}
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-bg" />
    </div>
  );
}

function Aura({ colors: [left, center, right] }: { colors: [string, string, string] }) {
  return (
    <div className="absolute inset-0 opacity-70 dark:opacity-100">
      <div className="absolute top-[-140px] left-[calc(50%-620px)] size-[620px]">
        <div className="size-full animate-drift-a rounded-full blur-3xl" style={{ background: glow(left, 42) }} />
      </div>
      <div className="absolute top-[-260px] left-[calc(50%-380px)] h-[560px] w-[760px]">
        <div className="size-full animate-drift-c rounded-full blur-3xl" style={{ background: glow(center, 48) }} />
      </div>
      <div className="absolute top-[-120px] left-[calc(50%+0px)] size-[620px]">
        <div className="size-full animate-drift-b rounded-full blur-3xl" style={{ background: glow(right, 42) }} />
      </div>
    </div>
  );
}

function NeutralGlow() {
  return (
    <div
      className="absolute top-[-220px] left-1/2 h-[520px] w-[min(1000px,140vw)] -translate-x-1/2 rounded-[100%] blur-2xl"
      style={{ background: glow("var(--fg)", 14) }}
    />
  );
}
