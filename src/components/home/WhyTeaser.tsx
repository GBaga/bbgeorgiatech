"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "../../i18n/routing";
import { Reveal } from "../marketing/Reveal";

// Picked from the full /pricing block: the late-night call, "how much?",
// and "Instagram isn't yours" — the three most universal situations.
const SCENARIOS = [0, 1, 3];

// One word of the headline; it lights up as the heading scrolls through the
// viewport, so the sentence "reads itself" as you scroll.
function Word({ word, progress, range, accent }: { word: string; progress: MotionValue<number>; range: [number, number]; accent: boolean }) {
  const reduceMotion = useReducedMotion();
  const opacity = useTransform(progress, range, [reduceMotion ? 1 : 0.15, 1]);
  return (
    <motion.span style={{ opacity }} className={`inline-block mr-[0.28em] ${accent ? "text-primary" : "text-neutral-50"}`}>
      {word}
    </motion.span>
  );
}

// The digits of a scenario's time drop in one by one, like a clock display.
function Clock({ time }: { time: string }) {
  return (
    <time className="inline-flex font-mono text-sm text-primary tabular-nums" aria-label={time}>
      {Array.from(time).map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.25 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {ch}
        </motion.span>
      ))}
    </time>
  );
}

export function WhyTeaser() {
  const t = useTranslations("Pricing.why");
  const th = useTranslations("Home.why");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({ target: headingRef, offset: ["start 85%", "end 45%"] });

  const words = [
    ...t("title1").split(" ").map((w) => ({ w, accent: false })),
    ...t("title2").split(" ").map((w) => ({ w, accent: true })),
  ];
  const scenarios = (t.raw("scenarios") as { time: string; title: string; text: string; punch: string }[]).filter((_, i) =>
    SCENARIOS.includes(i),
  );

  return (
    <section className="relative py-24 md:py-32 px-6 bg-surface border-t border-white/5 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] opacity-20 blur-3xl"
        style={{ background: "radial-gradient(closest-side, #5c9cff, transparent)" }}
      />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1.5 h-1.5 bg-primary" aria-hidden="true" />
          <div className="font-mono text-xs tracking-[0.2em] text-primary uppercase">{t("eyebrow")}</div>
        </div>

        <h2 ref={headingRef} className="font-logo text-3xl md:text-5xl lg:text-6xl uppercase tracking-tighter leading-[1.1] max-w-5xl break-words">
          {words.map(({ w, accent }, i) => (
            <Word
              key={i}
              word={w}
              accent={accent}
              progress={scrollYProgress}
              range={[i / words.length, Math.min((i + 1.5) / words.length, 1)]}
            />
          ))}
        </h2>
        <Reveal>
          <p className="mt-8 max-w-2xl text-lg text-neutral-400 leading-relaxed">{t("subtitle")}</p>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {scenarios.map((s, i) => (
            <Reveal key={s.time} delay={i * 0.1} className="h-full">
              <article className="group relative h-full flex flex-col overflow-hidden border border-white/10 bg-background-deep p-6 md:p-8 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_50px_-20px_rgba(92,156,255,0.35)]">
                {/* Scan line sweeps down the card on hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-all duration-700 group-hover:top-full group-hover:opacity-100"
                />
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-primary animate-pulse" aria-hidden="true" />
                  <Clock time={s.time} />
                  <div className="h-px flex-1 bg-white/10" aria-hidden="true" />
                </div>
                <h3 className="mt-6 font-logo text-lg uppercase tracking-tighter text-neutral-50 leading-snug">{s.title}</h3>
                <p className="mt-4 flex-1 text-sm text-neutral-400 leading-relaxed">{s.text}</p>
                <p className="mt-6 border-l-2 border-primary pl-4 font-heading font-semibold text-neutral-50 leading-snug">{s.punch}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <Link
            href="/pricing#why"
            className="group/link inline-flex items-center gap-3 font-mono text-sm uppercase tracking-wider text-primary hover:text-white transition-colors"
          >
            <span className="relative">
              {th("link")}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 group-hover/link:scale-x-100" />
            </span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
