"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "../../i18n/routing";
import { Reveal } from "../marketing/Reveal";
import { SectionHeader } from "../marketing/SectionHeader";
import { CountUp } from "../marketing/CountUp";
import { MonthsTrack } from "../effects/MonthsTrack";
import { useLocale } from "next-intl";
import { CARE_PLANS, MONTHS, formatUsd, packageByKey, packagePrices, usesLocalPrices } from "../../data/pricing";

// One word of the "why" headline; it lights up as the heading scrolls through
// the viewport, so the sentence "reads itself" as you scroll.
function Word({ word, progress, range, accent }: { word: string; progress: MotionValue<number>; range: [number, number]; accent: boolean }) {
  const reduceMotion = useReducedMotion();
  const opacity = useTransform(progress, range, [reduceMotion ? 1 : 0.15, 1]);
  return (
    <motion.span style={{ opacity }} className={`inline-block mr-[0.28em] ${accent ? "text-primary" : "text-neutral-50"}`}>
      {word}
    </motion.span>
  );
}

// Home: why a website matters, then what it costs. The "why" lead-in (headline,
// one line, link to the full scenarios on /pricing) sits right before the
// prices, then a compact pricing strip (the two easy starts plus the two main
// packages) hands off to /pricing for everything else.
export function PricingTeaser() {
  const t = useTranslations("Pricing");
  const th = useTranslations("Home.pricing");
  const tw = useTranslations("Home.why");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({ target: headingRef, offset: ["start 85%", "end 45%"] });

  const words = [
    ...t("why.title1").split(" ").map((w) => ({ w, accent: false })),
    ...t("why.title2").split(" ").map((w) => ({ w, accent: true })),
  ];

  const locale = useLocale();
  const local = usesLocalPrices(locale);
  const launch = packagePrices(packageByKey("launch"), local);
  const business = packagePrices(packageByKey("business"), local);
  const orMonthly = (monthly: number) => t("ui.orMonthly", { monthly: formatUsd(monthly), months: MONTHS });

  const cards = [
    { key: "launch", name: t("packages.launch.name"), tagline: t("packages.launch.tagline"), value: launch.price, from: true, meta: orMonthly(launch.monthly), href: "/pricing#packages", track: true },
    {
      key: "business",
      name: t("packages.business.name"),
      tagline: t("packages.business.tagline"),
      value: business.price,
      from: true,
      meta: orMonthly(business.monthly),
      href: "/pricing#packages",
      featured: true,
      track: true,
    },
    { key: "care", name: t("care.plans.care.name"), tagline: t("care.plans.care.tagline"), value: CARE_PLANS[0].monthly, per: t("ui.perMonth"), meta: t("care.eyebrow"), href: "/pricing#care" },
  ];

  // "from $990" / "$990-დან" — split the localized pattern around the number
  // so only the number animates.
  const [fromBefore, fromAfter] = t("ui.from", { price: "§" }).split("§");

  return (
    <section className="relative py-24 md:py-32 px-6 bg-background-deep border-t border-white/5 lucien-blueprint overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[420px]"
        style={{ background: "radial-gradient(45% 60% at 50% 100%, rgba(92,156,255,0.12), transparent)" }}
      />
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Why a website */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1.5 h-1.5 bg-primary" aria-hidden="true" />
          <div className="font-mono text-xs tracking-[0.2em] text-primary uppercase">{t("why.eyebrow")}</div>
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
          <p className="mt-8 max-w-2xl text-lg text-neutral-400 leading-relaxed">{t("why.subtitle")}</p>
        </Reveal>
        <Reveal className="mt-8">
          <Link
            href="/pricing#why"
            className="group/link inline-flex items-center gap-3 font-mono text-sm uppercase tracking-wider text-primary hover:text-white transition-colors"
          >
            <span className="relative">
              {tw("link")}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 group-hover/link:scale-x-100" />
            </span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" aria-hidden="true" />
          </Link>
        </Reveal>

        <div className="my-16 md:my-20 h-px bg-white/10" aria-hidden="true" />

        {/* What it costs */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
          <SectionHeader eyebrow={th("eyebrow")} title1={th("title1")} title2={th("title2")} subtitle={th("subtitle")} />
          <Reveal className="mb-12 md:mb-16">
            <Link
              href="/pricing"
              className="group/link inline-flex items-center gap-2 border-2 border-primary/50 px-5 py-2.5 font-mono text-sm uppercase tracking-wider text-primary transition-all hover:bg-primary hover:text-white whitespace-nowrap"
            >
              {th("all")}
              <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={c.key} delay={i * 0.08} className="h-full">
              <Link
                href={c.href}
                className={`group relative flex h-full flex-col overflow-hidden border p-6 transition-all duration-500 hover:-translate-y-1 bg-gradient-to-b from-surface-bright to-surface ${
                  c.featured
                    ? "border-transparent border-orbit shadow-[0_0_60px_-20px_rgba(92,156,255,0.6)]"
                    : "border-white/10 hover:border-primary/40 hover:shadow-[0_20px_50px_-24px_rgba(92,156,255,0.45)]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-logo text-lg uppercase tracking-tighter text-neutral-50">{c.name}</h3>
                  {c.featured && (
                    <span className="shrink-0 border border-primary/50 bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
                      {t("ui.popular")}
                    </span>
                  )}
                </div>
                <p className="mt-2 flex-1 text-sm text-neutral-400 leading-relaxed">{c.tagline}</p>

                <div className="mt-8 flex items-baseline gap-2 font-logo text-3xl tracking-tighter text-neutral-50">
                  {c.from ? (
                    <span>
                      {fromBefore && <span className="font-mono text-xs tracking-normal text-neutral-500 mr-1.5">{fromBefore.trim()}</span>}
                      <CountUp value={c.value} />
                      {fromAfter && <span className="font-mono text-xs tracking-normal text-neutral-500">{fromAfter}</span>}
                    </span>
                  ) : (
                    <CountUp value={c.value} />
                  )}
                  {c.per && <span className="font-mono text-xs tracking-normal text-neutral-500 whitespace-nowrap">{c.per}</span>}
                </div>
                {c.track ? (
                  <MonthsTrack compact months={MONTHS} label={t("monthly.track", { months: MONTHS })} />
                ) : (
                  // Same height as the track, so the price rows line up across cards
                  <div className="mt-4 h-5" aria-hidden="true" />
                )}
                <div className="mt-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-neutral-500">
                  <span>{c.meta}</span>
                  <ArrowRight
                    className="w-4 h-4 -translate-x-2 opacity-0 text-primary transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
