"use client";

import { motion } from "framer-motion";
import { KeyRound } from "lucide-react";

// "Pay 12 months, then the site is yours" as a picture: one square per
// monthly payment fills in turn, then a key appears.
// `compact`: a slim version for small cards, without the caption.
export function MonthsTrack({ months, label, compact = false }: { months: number; label: string; compact?: boolean }) {
  // The fill slows down towards the end (10… 11… 12…), so the key lands as
  // the payoff: delay grows with (i / last)^2.2 over about `span` seconds.
  const span = compact ? 1 : 1.3;
  const fillAt = (i: number) => 0.2 + span * Math.pow(i / Math.max(months - 1, 1), 2.2);
  const keyAt = fillAt(months - 1) + 0.35;
  return (
    <div className={compact ? "mt-4" : "mt-6"} role="img" aria-label={label}>
      <motion.div
        className={`flex items-center ${compact ? "gap-1" : "gap-1.5"}`}
        initial="off"
        whileInView="on"
        viewport={{ once: true, margin: "-60px" }}
      >
        {Array.from({ length: months }, (_, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className={`flex-1 border border-primary/40 ${compact ? "h-2 max-w-4" : "h-3 max-w-6"}`}
            variants={{
              off: { backgroundColor: "rgba(92,156,255,0)" },
              on: { backgroundColor: "rgba(92,156,255,1)", transition: { delay: fillAt(i), duration: 0.25 } },
            }}
          />
        ))}
        <motion.span
          aria-hidden="true"
          className={`ml-2 inline-flex shrink-0 items-center justify-center border border-primary bg-primary/10 text-primary ${compact ? "h-5 w-5" : "h-7 w-7"}`}
          variants={{
            off: { opacity: 0, scale: 0.4, rotate: -30 },
            on: { opacity: 1, scale: 1, rotate: 0, transition: { delay: keyAt, type: "spring", stiffness: 260, damping: 14 } },
          }}
        >
          <KeyRound className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} />
        </motion.span>
      </motion.div>
      {!compact && (
      <motion.p
        aria-hidden="true"
        className="mt-2 font-mono text-[11px] uppercase tracking-wider text-neutral-400"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ delay: keyAt + 0.2, duration: 0.4 }}
      >
        {label}
      </motion.p>
      )}
    </div>
  );
}
