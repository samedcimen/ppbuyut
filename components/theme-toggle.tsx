"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  function toggle() {
    const dark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      // theme still applies for this visit
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Temayı değiştir"
      title="Temayı değiştir"
      className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg"
    >
      {/* Both icons render; CSS picks one, so there is no hydration mismatch. */}
      <Sun className="size-[18px] dark:hidden" />
      <Moon className="hidden size-[18px] dark:block" />
    </button>
  );
}
