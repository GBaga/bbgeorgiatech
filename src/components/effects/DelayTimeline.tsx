"use client";

import { motion } from "framer-motion";

// The on-time guarantee as bars: each late week adds 10%, up to 30%.
export function DelayTimeline({ rows, caption }: { rows: { label: string; value: number }[]; caption: string }) {
  const max = Math.max(...rows.map((r) => r.value));
  return (
    <figure className="mt-6 border-t border-white/10 pt-5">
      <figcaption className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">{caption}</figcaption>
      <ul className="mt-3 space-y-2.5">
        {rows.map((r, i) => (
          <li key={r.label} className="grid grid-cols-[5.5rem_1fr_3rem] items-center gap-3 font-mono text-xs">
            <span className="text-neutral-400">{r.label}</span>
            <span className="relative h-2 bg-white/5" aria-hidden="true">
              <motion.span
                className="absolute inset-y-0 left-0 bg-primary"
                initial={{ width: 0 }}
                whileInView={{ width: `${(r.value / max) * 100}%` }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.2, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
            <span className="text-right text-primary tabular-nums">−{r.value}%</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
