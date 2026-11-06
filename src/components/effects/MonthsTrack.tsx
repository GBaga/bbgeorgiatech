"use client";

import { motion } from "framer-motion";
import { KeyRound } from "lucide-react";

// "Pay 12 months, then the site is yours" as a picture: one square per
// monthly payment fills in turn, then a key appears.
export function MonthsTrack({ months, label }: { months: number; label: string }) {
  const step = 0.07;
  return (
    <div className="mt-6" role="img" aria-label={label}>
      <motion.div
        className="flex items-center gap-1.5"
        initial="off"
        whileInView="on"
        viewport={{ once: true, margin: "-60px" }}
      >
        {Array.from({ length: months }, (_, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className="h-3 flex-1 max-w-6 border border-primary/40"
            variants={{
              off: { backgroundColor: "rgba(92,156,255,0)" },
              on: { backgroundColor: "rgba(92,156,255,1)", transition: { delay: 0.2 + i * step, duration: 0.25 } },
            }}
          />
        ))}
        <motion.span
          aria-hidden="true"
          className="ml-2 inline-flex h-7 w-7 shrink-0 items-center justify-center border border-primary bg-primary/10 text-primary"
          variants={{
            off: { opacity: 0, scale: 0.4, rotate: -30 },
            on: { opacity: 1, scale: 1, rotate: 0, transition: { delay: 0.3 + months * step, type: "spring", stiffness: 260, damping: 14 } },
          }}
        >
          <KeyRound className="w-3.5 h-3.5" />
        </motion.span>
      </motion.div>
      <motion.p
        aria-hidden="true"
        className="mt-2 font-mono text-[11px] uppercase tracking-wider text-neutral-400"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ delay: 0.4 + months * step, duration: 0.4 }}
      >
        {label}
      </motion.p>
    </div>
  );
}
