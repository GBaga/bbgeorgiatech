"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "../../i18n/routing";
import { Reveal } from "../marketing/Reveal";
import { SectionHeader } from "../marketing/SectionHeader";
import { MONTHLY, PACKAGES, START, formatUsd } from "../../data/pricing";

// The price counts up from zero the first time it scrolls into view. The
// final value is rendered on the server, so crawlers and no-JS see it.
function CountUp({ value }: { value: number }) {
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

// Home: a compact pricing strip — the two easy starts plus the two main
// packages — that hands off to /pricing for everything else.
export function PricingTeaser() {
  const t = useTranslations("Pricing");
  const th = useTranslations("Home.pricing");

  const launch = PACKAGES.find((p) => p.key === "launch")!;
  const business = PACKAGES.find((p) => p.key === "business")!;

  const cards = [
    { key: "start", name: t("easy.start.name"), tagline: t("easy.start.tagline"), value: START.price, from: true, meta: t("ui.oneTime"), href: "/pricing#easy-start" },
    {
      key: "monthly",
      name: t("easy.monthly.name"),
      tagline: t("easy.monthly.tagline"),
      value: MONTHLY.monthly,
      per: t("easy.monthly.per"),
      meta: t("easy.monthly.term", { months: MONTHLY.months }),
      href: "/pricing#easy-start",
      featured: true,
    },
    { key: "launch", name: t("packages.launch.name"), tagline: t("packages.launch.tagline"), value: launch.price, from: true, meta: t("ui.oneTime"), href: "/pricing#packages" },
    { key: "business", name: t("packages.business.name"), tagline: t("packages.business.tagline"), value: business.price, from: true, meta: t("ui.oneTime"), href: "/pricing#packages" },
  ];

  // "from $490" / "$490-დან" — split the localized pattern around the number
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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                      {th("popular")}
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
                  {c.per && <span className="font-mono text-xs tracking-normal text-neutral-500">{c.per}</span>}
                </div>
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
