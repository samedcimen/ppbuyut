import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@/components/analytics";
import { SiteChrome } from "@/components/site-chrome";
import { ThemeScript } from "@/components/theme-script";
import type { Locale } from "@/lib/i18n";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
  // Only small labels use it; not preloading keeps it from competing with the
  // heading's font on the first load (LCP).
  preload: false,
});

/**
 * The document of one language. Each language has its own root layout
 * (app/(tr)/layout.tsx, app/en/layout.tsx), so <html lang> is right in the
 * server-rendered page; switching language is a full page load.
 */
export function RootHtml({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <ThemeScript />
        <SiteChrome locale={locale}>{children}</SiteChrome>
        <Analytics />
      </body>
    </html>
  );
}
