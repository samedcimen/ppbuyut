/** Title block shared by the content pages, with a soft neutral glow behind it. */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative isolate">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-[4.5rem] -z-10 h-[420px] overflow-hidden">
        <div className="bg-dots absolute inset-0" />
        <div className="absolute top-[-200px] left-1/2 h-[420px] w-[min(900px,140vw)] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--fg)_10%,transparent),transparent)] blur-2xl" />
      </div>
      <div className="mx-auto max-w-6xl px-4 pt-16 pb-12 sm:px-6 sm:pt-24 sm:pb-16">
        <p className="text-xs font-semibold tracking-[0.14em] text-subtle uppercase">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-4xl leading-[1.05] font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-pretty text-muted sm:text-lg">{description}</p>
        )}
        {children}
      </div>
    </div>
  );
}
