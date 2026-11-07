"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useInView } from "framer-motion";

// A story card (scenario, problem…) with a glowing horizontal "scan line".
// Desktop: on hover the line sweeps down while the card lifts and its border
// and shadow take the line's color. Touch screens have no hover, so the line
// sweeps once when the card scrolls into view. Off with reduced motion.
// The CSS lives in globals.css (.scan-card / .scan-line).
export function ScanCard({
  children,
  color = "#5c9cff",
  className = "",
}: {
  children: ReactNode;
  /** Line, border and shadow color (any CSS color) */
  color?: string;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <article
      ref={ref}
      data-inview={inView}
      style={{ "--scan-color": color } as CSSProperties}
      className={`scan-card relative overflow-hidden border border-white/10 bg-background-deep ${className}`}
    >
      <span aria-hidden="true" className="scan-line" />
      {children}
    </article>
  );
}
