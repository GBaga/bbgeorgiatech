"use client";

import { motion } from "framer-motion";

// A hairline that draws from left to right when it scrolls into view.
export function DrawLine({ delay = 0, className = "bg-primary/40" }: { delay?: number; className?: string }) {
  return (
    <div className="relative h-px flex-1 bg-white/10" aria-hidden="true">
      <motion.div
        className={`absolute inset-0 origin-left ${className}`}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
