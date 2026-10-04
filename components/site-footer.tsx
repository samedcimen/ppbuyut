import Link from "next/link";
import { LogoMark } from "./logo";
import { PlatformIcon } from "./platform-icon";
import { getReleases } from "@/lib/changelog";
import { getMessages, type Locale } from "@/lib/i18n";
import { pagePath } from "@/lib/i18n/routes";
import { site } from "@/lib/site";

// Page links live in the header; the footer only carries what isn't there.
export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const version = getReleases().find((r) => r.date)?.version;

  return (
    <footer className="border-t border-line/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 text-sm text-muted sm:px-6">
        <div className="flex items-center gap-2.5">
          <LogoMark className="size-5" />
          <span>
            © {site.year} ·{" "}
            <a href={site.owner.url} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-fg">
              {site.owner.name}
            </a>
          </span>
        </div>

        <div className="flex items-center gap-1">
          {version && (
            <Link
              href={pagePath("changelog", locale)}
              className="flex h-8 items-center gap-2 rounded-full px-2.5 transition-colors hover:bg-surface-2 hover:text-fg"
            >
              <span className="hidden sm:inline">{t.footer.changelog}</span>
              <span className="font-mono text-xs text-subtle">v{version}</span>
            </Link>
          )}
          <a
            href={site.owner.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="grid size-8 place-items-center rounded-full transition-colors hover:bg-surface-2 hover:text-fg"
          >
            <PlatformIcon id="github" />
          </a>
        </div>
      </div>
    </footer>
  );
}
