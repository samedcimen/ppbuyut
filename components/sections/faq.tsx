import { Plus } from "lucide-react";
import { InlineMarkdown } from "@/components/inline-markdown";
import type { FaqItem } from "@/lib/content/faq";

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-medium tracking-tight [&::-webkit-details-marker]:hidden">
            {item.q}
            <span className="grid size-7 shrink-0 place-items-center rounded-full border border-line text-muted transition-all duration-300 group-open:rotate-45 group-open:bg-fg group-open:text-bg">
              <Plus className="size-3.5" />
            </span>
          </summary>
          <div className="pr-12 pb-6 text-[15px] leading-relaxed text-muted">
            <InlineMarkdown text={item.a} />
          </div>
        </details>
      ))}
    </div>
  );
}
