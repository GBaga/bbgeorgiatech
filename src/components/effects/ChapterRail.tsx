"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// A fixed index of the page's chapters on wide screens. The chapter you're
// reading gets the same sliding [ ] brackets as the header, plus its label.
export function ChapterRail({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    const els = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => !!el);
    els.forEach((el) => observer.observe(el));
    // Leaving the first or last chapter (hero, FAQ…) clears the rail.
    const clear = () => {
      const first = els[0]?.getBoundingClientRect();
      const last = els[els.length - 1]?.getBoundingClientRect();
      const mid = window.innerHeight / 2;
      if ((first && first.top > mid) || (last && last.bottom < mid)) setActive(null);
    };
    window.addEventListener("scroll", clear, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", clear);
    };
  }, [items]);

  return (
    <nav
      aria-label="Page sections"
      className={`fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 transition-opacity duration-500 min-[1400px]:block ${active ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <ol className="flex flex-col gap-3">
        {items.map((item, i) => {
          const isActive = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`group relative flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider transition-colors ${isActive ? "text-white" : "text-neutral-600 hover:text-neutral-300"}`}
              >
                <span className="relative px-1.5">
                  {isActive && (
                    <motion.span
                      layoutId="chapter-active"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-0 flex items-center justify-between text-primary"
                      aria-hidden="true"
                    >
                      <span>[</span>
                      <span>]</span>
                    </motion.span>
                  )}
                  <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                </span>
                <span
                  className={`max-w-[7.5rem] truncate transition-all duration-300 ${isActive ? "opacity-100" : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"}`}
                >
                  {item.label}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
