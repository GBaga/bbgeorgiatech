"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { formatUsd } from "../../data/pricing";

// A USD price that counts up from zero the first time it scrolls into view.
// The final value is rendered on the server, so crawlers and no-JS see it.
export function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {formatUsd(shown)}
    </span>
  );
}

// A localized price pattern ("from {price}", "{price}-დან") with only the
// number animated. Pass the pattern with "§" in place of the price.
export function PricePattern({ pattern, value, affixClassName = "font-mono text-xs tracking-normal text-neutral-500" }: { pattern: string; value: number; affixClassName?: string }) {
  const [before, after] = pattern.split("§");
  return (
    <span>
      {before && <span className={`${affixClassName} mr-1.5`}>{before.trim()}</span>}
      <CountUp value={value} />
      {after && <span className={affixClassName}>{after}</span>}
    </span>
  );
}
