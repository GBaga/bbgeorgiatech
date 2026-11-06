import { Check } from "lucide-react";

// Three plain facts that "switch on" one by one under a hero: real promises
// (fixed price, guarantee, ownership), not invented metrics.
export function TrustStrip({ items, start = 0.45 }: { items: string[]; start?: number }) {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-3">
      {items.map((item, i) => {
        const d = `${start + i * 0.18}s`;
        return (
          <li
            key={item}
            className="hero-fade flex items-center gap-2.5 font-mono text-xs uppercase tracking-wider text-neutral-300"
            style={{ ["--d" as string]: d }}
          >
            <span className="check-on inline-flex w-4 h-4 shrink-0 items-center justify-center border border-primary" style={{ ["--d" as string]: d }}>
              <Check className="w-3 h-3" strokeWidth={3} aria-hidden="true" />
            </span>
            {item}
          </li>
        );
      })}
    </ul>
  );
}
