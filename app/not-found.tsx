import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = { title: "Sayfa bulunamadı" };

export default function NotFound() {
  return (
    <div className="relative isolate flex min-h-[calc(100svh-4.5rem)] items-center justify-center px-4 py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 -top-[4.5rem] -z-10 overflow-hidden">
        <div className="bg-dots absolute inset-0" />
      </div>

      <div className="flex max-w-md flex-col items-center text-center">
        {/* The logo's viewfinder, framing a profile that isn't there */}
        <div className="relative size-40">
          <svg viewBox="0 0 160 160" aria-hidden className="absolute inset-0 size-full text-line-strong">
            <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M8 40V20A12 12 0 0 1 20 8h20" />
              <path d="M120 8h20a12 12 0 0 1 12 12v20" />
              <path d="M152 120v20a12 12 0 0 1-12 12h-20" />
              <path d="M40 152H20a12 12 0 0 1-12-12v-20" />
            </g>
          </svg>
          <div className="absolute inset-7 grid place-items-center overflow-hidden rounded-full border-2 border-dashed border-line-strong bg-surface-2">
            <svg viewBox="0 0 100 100" aria-hidden className="size-full text-surface-3">
              <circle cx="50" cy="40" r="17" fill="currentColor" />
              <path d="M18 92c4-18 17-28 32-28s28 10 32 28" fill="currentColor" />
            </svg>          </div>
        </div>

        <p className="mt-8 font-mono text-sm text-subtle">404 · profil bulunamadı</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-balance">Bu sayfayı bulamadık.</h1>
        <p className="mt-3 leading-relaxed text-muted">
          Aradığın sayfa taşınmış ya da hiç var olmamış olabilir. Profil fotoğrafı arıyorsan ana sayfadan devam et.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/"
            className="flex h-11 items-center gap-2 rounded-xl bg-fg px-5 text-sm font-semibold text-bg transition-all hover:opacity-90 active:scale-[0.98]"
          >
            Ana sayfaya dön
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/sss"
            className="flex h-11 items-center rounded-xl border border-line px-5 text-sm font-medium transition-colors hover:bg-surface-2"
          >
            Sık sorulan sorular
          </Link>
        </div>
      </div>
    </div>
  );
}
