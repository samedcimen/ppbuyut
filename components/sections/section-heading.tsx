export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-xl">
      <p className="text-xs font-semibold tracking-[0.14em] text-subtle uppercase">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-balance sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 leading-relaxed text-pretty text-muted">{description}</p>}
    </div>
  );
}
