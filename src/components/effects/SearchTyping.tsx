"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Search } from "lucide-react";

// A search box that types what real customers type, phrase after phrase.
// Screen readers get the phrases as a plain list; the animation is visual only.
export function SearchTyping({ phrases, label }: { phrases: string[]; label: string }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    const total = Array.from(phrases[index]).length;
    let delay = deleting ? 28 : 65;
    if (!deleting && length === total) delay = 1800;
    if (deleting && length === 0) delay = 350;
    const id = window.setTimeout(() => {
      if (!deleting && length === total) setDeleting(true);
      else if (deleting && length === 0) {
        setDeleting(false);
        setIndex((i) => (i + 1) % phrases.length);
      } else setLength((l) => l + (deleting ? -1 : 1));
    }, delay);
    return () => window.clearTimeout(id);
  }, [reduceMotion, phrases, index, length, deleting]);

  const shown = reduceMotion ? phrases[0] : Array.from(phrases[index]).slice(0, length).join("");

  return (
    <div className="mb-10 max-w-xl">
      <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">{label}</div>
      <ul className="sr-only">
        {phrases.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <div aria-hidden="true" className="mt-3 flex items-center gap-3 border border-white/15 bg-background-deep px-4 py-3.5 shadow-[0_10px_40px_-20px_rgba(92,156,255,0.5)]">
        <Search className="w-4 h-4 shrink-0 text-primary" />
        <span className="min-w-0 flex-1 truncate font-inter text-base text-neutral-100">
          {shown}
          <span className="caret ml-0.5 inline-block h-[1.1em] w-px translate-y-[0.2em] bg-primary" />
        </span>
      </div>
    </div>
  );
}
