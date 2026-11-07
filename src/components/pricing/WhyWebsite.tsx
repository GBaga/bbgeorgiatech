"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "../../i18n/routing";
import { Reveal } from "../marketing/Reveal";
import { ScanCard } from "../marketing/ScanCard";
import { formatUsd, packageByKey, packagePrices, usesLocalPrices } from "../../data/pricing";

// The payback maths uses Launch paid monthly, as this visitor sees it.
function useLaunchMonthly() {
  return packagePrices(packageByKey("launch"), usesLocalPrices(useLocale())).monthly;
}

const PRESETS = [20, 50, 100, 300];

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
const MIN = 5;
const MAX = 500;

// "How many extra clients a month pay for the monthly plan?" — the visitor
// types their own average order value, so the number is theirs, not ours.
function PaybackCalculator() {
  const t = useTranslations("Pricing");
  const [value, setValue] = useState(70);
  const valid = Number.isFinite(value) && value > 0;
  const launchMonthly = useLaunchMonthly();
  const clients = valid ? Math.max(1, Math.ceil(launchMonthly / value)) : null;
  const monthly = formatUsd(launchMonthly);

  return (
    <div className="relative h-full flex flex-col overflow-hidden border border-primary/60 bg-gradient-to-b from-surface-bright to-surface p-6 md:p-8 shadow-[0_0_60px_-16px_rgba(92,156,255,0.5)]">
      <div aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
      <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{t("why.calc.eyebrow")}</div>
      <h3 className="mt-3 font-logo text-xl uppercase tracking-tighter text-neutral-50">{t("why.calc.title")}</h3>

      <label htmlFor="payback-value" className="mt-6 block text-sm text-neutral-300 leading-relaxed">
        {t("why.calc.label")}
      </label>
      <div className="mt-3 flex items-center border border-white/15 bg-background-deep focus-within:border-primary transition-colors">
        <span className="pl-4 font-mono text-lg text-neutral-500" aria-hidden="true">$</span>
        <input
          id="payback-value"
          type="number"
          inputMode="numeric"
          min={1}
          value={Number.isFinite(value) ? value : ""}
          onChange={(e) => setValue(e.target.value === "" ? NaN : Number(e.target.value))}
          className="w-full bg-transparent px-2 py-3 font-mono text-lg text-neutral-50 outline-none tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
      </div>
      <input
        type="range"
        min={MIN}
        max={MAX}
        step={5}
        value={valid ? Math.min(Math.max(value, MIN), MAX) : MIN}
        onChange={(e) => setValue(Number(e.target.value))}
        aria-label={t("why.calc.label")}
        className="mt-4 w-full accent-[#5c9cff]"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setValue(p)}
            className={`border px-3 py-1 font-mono text-xs transition-colors ${
              value === p ? "border-primary bg-primary/15 text-primary" : "border-white/10 text-neutral-400 hover:border-white/30"
            }`}
          >
            {formatUsd(p)}
          </button>
        ))}
      </div>

      <div className="mt-6 flex-1 border-t border-white/10 pt-5" aria-live="polite">
        <p className="text-sm text-neutral-400">{t("why.calc.lead", { name: t("packages.launch.name"), monthly })}</p>
        <div className="mt-2 min-h-[3.5rem]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p
              key={clients ?? "none"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="font-logo text-2xl md:text-3xl uppercase tracking-tighter text-primary"
            >
              {clients === null ? "—" : t("why.calc.result", { n: clients })}
            </motion.p>
          </AnimatePresence>
        </div>
        <p className="mt-2 text-sm text-neutral-300">{t("why.calc.rest")}</p>
      </div>
      <p className="mt-4 font-mono text-[11px] text-neutral-500">{t("why.calc.note")}</p>
    </div>
  );
}

// "What does a website give you?" — for small businesses that don't yet see
// the point of a site. Real-life scenarios instead of tech terms, a payback
// calculator, and three common objections. No invented statistics.
export function WhyWebsite() {
  const t = useTranslations("Pricing");
  const scenarios = t.raw("why.scenarios") as { time: string; title: string; text: string; punch: string }[];
  const monthly = formatUsd(useLaunchMonthly());
  const doubts = (t.raw("why.doubts") as { q: string; a: string }[]).map((d) => ({
    q: d.q,
    a: d.a.replaceAll("{monthly}", monthly),
  }));

  return (
    <section id="why" className="relative py-24 px-6 bg-surface border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <Reveal className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-1.5 bg-primary" aria-hidden="true" />
            <div className="font-mono text-xs tracking-[0.2em] text-primary uppercase">{t("why.eyebrow")}</div>
          </div>
          <h2 className="font-logo text-3xl md:text-5xl text-neutral-50 uppercase tracking-tighter max-w-4xl break-words">
            {t("why.title1")} <span className="text-primary">{t("why.title2")}</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-neutral-400 leading-relaxed">{t("why.subtitle")}</p>
        </Reveal>

        {/* 5 scenarios + calculator = a full 3 × 2 grid on desktop */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {scenarios.map((s, i) => (
            <Reveal key={s.time} delay={(i % 3) * 0.08} className="h-full">
              <ScanCard className="h-full flex flex-col p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-primary animate-pulse" aria-hidden="true" />
                  <Clock time={s.time} />
                  <div className="h-px flex-1 bg-white/10" aria-hidden="true" />
                </div>
                <h3 className="mt-6 font-logo text-lg uppercase tracking-tighter text-neutral-50 leading-snug">{s.title}</h3>
                <p className="mt-4 flex-1 text-sm text-neutral-400 leading-relaxed">{s.text}</p>
                <p className="mt-6 border-l-2 border-primary pl-4 font-heading font-semibold text-neutral-50 leading-snug">{s.punch}</p>
              </ScanCard>
            </Reveal>
          ))}
          <Reveal delay={0.16} className="h-full">
            <PaybackCalculator />
          </Reveal>
        </div>

        {/* Common doubts */}
        <Reveal className="mt-16">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500 mb-6">{t("why.doubtsTitle")}</div>
          <dl className="grid gap-px bg-white/10 border border-white/10 md:grid-cols-3">
            {doubts.map((d) => (
              <div key={d.q} className="bg-background-deep p-6">
                <dt className="font-heading font-semibold text-neutral-200">{d.q}</dt>
                <dd className="mt-2 text-sm text-primary leading-relaxed">{d.a}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* Brand promise + consultation */}
        <Reveal className="mt-16 flex flex-col items-center text-center">
          <p className="font-logo text-2xl md:text-4xl uppercase tracking-tighter text-neutral-50 max-w-4xl break-words">
            {t("why.closing1")} <span className="text-primary">{t("why.closing2")}</span>
          </p>
          <p className="mt-6 max-w-2xl text-neutral-400 leading-relaxed">{t("why.ctaText")}</p>
          <Link
            href="/#contact"
            className="group/cta mt-8 inline-flex items-center gap-2 border-2 border-primary bg-primary px-8 py-4 font-mono text-sm uppercase tracking-wider text-white transition-all hover:bg-primary/80"
          >
            {t("final.button")}
            <ArrowRight className="w-4 h-4 transition-transform group-hover/cta:translate-x-0.5" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
