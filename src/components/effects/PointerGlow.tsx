"use client";

import { useEffect, useRef } from "react";

// Drop inside any element that has `group relative isolate overflow-hidden`
// and an `--accent` colour (isolate keeps the light behind the content): a soft light in that colour follows the pointer while
// hovering (styles: .accent-spotlight). Lets server markup stay server-side.
export function PointerGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return;
    const move = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      host.style.setProperty("--mx", `${e.clientX - r.left}px`);
      host.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    host.addEventListener("pointermove", move);
    return () => host.removeEventListener("pointermove", move);
  }, []);

  return <div ref={ref} className="accent-spotlight -z-10" aria-hidden="true" />;
}
