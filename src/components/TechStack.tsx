"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Terminal } from "lucide-react";
import { useTranslations } from "next-intl";

const TYPE_MS = 28; // per character
const CARD_GAP_S = 0.35; // cards type one after another

// T1: the mono line types itself out like a terminal command. The full text
// stays in the DOM (sr-only for screen readers/crawlers, plus an invisible
// copy that reserves the final size so nothing jumps while typing).
function TypedLine({ text, start, delay }: { text: string; start: boolean; delay: number }) {
  const reduceMotion = useReducedMotion();
  const chars = Array.from(text); // code points, safe for Georgian
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start || reduceMotion) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setCount((c) => {
          if (c + 1 >= chars.length && interval) clearInterval(interval);
          return Math.min(c + 1, chars.length);
        });
      }, TYPE_MS);
    }, delay * 1000);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [start, reduceMotion, delay, chars.length]);

  const shown = reduceMotion ? chars.length : count;
  const typing = start && !reduceMotion && shown < chars.length;

  return (
    <span className="relative block">
      <span className="sr-only">{text}</span>
      {/* Reserves the final size */}
      <span className="invisible block" aria-hidden="true">
        {"> "}
        {text}
      </span>
      <span className="absolute inset-0" aria-hidden="true">
        <span className="text-primary">{"> "}</span>
        {chars.slice(0, shown).join("")}
        {typing && <span className="inline-block w-1.5 h-3 ml-0.5 align-middle bg-primary animate-pulse" />}
      </span>
    </span>
  );
}

// T3: feeds the pointer position to the card's spotlight (.tech-spotlight).
function trackPointer(e: PointerEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export function TechStack() {
  const t = useTranslations("TechStack");
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, amount: 0.3 });

  const technologies = [
    { name: "Next.js & React 19", code: t("t1Code") },
    { name: "NestJS & Node", code: t("t2Code") },
    { name: "MongoDB Atlas", code: t("t3Code") },
    { name: "Neon (PostgreSQL)", code: t("t4Code") },
    { name: "Vercel & Cloudflare", code: t("t5Code") },
    { name: "Sanity.io & Cloudinary", code: t("t6Code") },
  ];

  return (
    <section className="relative py-24 px-6 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:w-1/3"
          >
            <h2 className="font-logo text-3xl md:text-5xl text-neutral-50 mb-6 uppercase tracking-tighter">
              {t("title1")} <span className="text-primary">{t("title2")}</span>
            </h2>
            <p className="font-inter text-neutral-400 leading-relaxed mb-8">
              {t("desc")}
            </p>
            <div className="flex items-center gap-3 text-primary font-mono text-sm">
              <Terminal className="w-5 h-5" />
              <span>{t("validated")}</span>
            </div>
          </motion.div>

          {/* T2: cards rise in one after another */}
          <motion.div
            ref={gridRef}
            initial="hidden"
            animate={gridInView ? "visible" : "hidden"}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
            className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
                }}
                onPointerMove={trackPointer}
                className="group p-6 rounded-none lucien-card"
              >
                <div className="tech-spotlight opacity-0 group-hover:opacity-100" aria-hidden="true" />
                <h3 className="font-heading font-semibold text-neutral-50 mb-2">{tech.name}</h3>
                <div className="font-mono text-xs text-neutral-500 bg-black/40 p-3 rounded-none group-hover:text-secondary transition-colors">
                  <TypedLine text={tech.code} start={gridInView} delay={0.4 + index * CARD_GAP_S} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
