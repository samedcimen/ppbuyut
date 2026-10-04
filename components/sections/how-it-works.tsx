import { ArrowRight, ClipboardPaste, Download, ScanSearch } from "lucide-react";
import { PlatformBadge } from "@/components/platform-icon";
import { getMessages, type Locale } from "@/lib/i18n";
import { SectionHeading } from "./section-heading";

export function HowItWorks({ locale }: { locale: Locale }) {
  const t = getMessages(locale).howItWorks;
  const [paste, scan, download] = t.steps;
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeading
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
      />

      <ol className="mt-12 grid gap-4 md:grid-cols-3">
        <Step n={1} icon={ClipboardPaste} title={paste.title} body={paste.body}>
          <div className="flex h-10 items-center gap-2 rounded-xl border border-line bg-surface px-2 text-sm shadow-soft">
            <PlatformBadge id="tiktok" size="sm" />
            <span className="truncate text-muted">
              tiktok.com/<span className="text-fg">@{t.exampleUser}</span>
            </span>
            <span className="ml-auto grid size-6 shrink-0 place-items-center rounded-md bg-fg text-bg">
              <ArrowRight className="size-3.5" />
            </span>
          </div>
        </Step>

        <Step n={2} icon={ScanSearch} title={scan.title} body={scan.body}>
          <div className="space-y-1.5 font-mono text-[12px]">
            <Transform from="…/abc_normal.jpg" to="…/abc.jpg" />
            <Transform from="…/photo=s88-c" to="…/photo=s800-c" />
          </div>
        </Step>

        <Step n={3} icon={Download} title={download.title} body={download.body}>
          <div className="flex h-10 items-center gap-2.5 rounded-xl border border-line bg-surface px-3 text-sm shadow-soft">
            <span className="size-5 shrink-0 rounded-full bg-gradient-to-br from-fuchsia-400 to-orange-300" />
            <span className="truncate font-mono text-[12px]">{t.exampleFile}</span>
            <span className="ml-auto shrink-0 font-mono text-[11px] text-subtle">320×320</span>
          </div>
        </Step>
      </ol>
    </section>
  );
}

function Step({
  n,
  icon: Icon,
  title,
  body,
  children,
}: {
  n: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex flex-col rounded-3xl border border-line bg-surface p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="grid size-10 place-items-center rounded-xl bg-surface-2 text-fg ring-1 ring-line ring-inset">
          <Icon className="size-5" />
        </span>
        <span className="font-mono text-xs text-subtle">0{n}</span>
      </div>
      <h3 className="mt-5 font-semibold tracking-tight">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
      <div className="mt-6 rounded-2xl bg-surface-2/70 p-3 ring-1 ring-line/70 ring-inset md:mt-auto">{children}</div>
    </li>
  );
}

function Transform({ from, to }: { from: string; to: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-surface px-2.5 py-2 shadow-soft">
      <span className="truncate text-subtle line-through decoration-subtle/60">{from}</span>
      <ArrowRight className="size-3 shrink-0 text-subtle" />
      <span className="truncate text-success">{to}</span>
    </div>
  );
}
