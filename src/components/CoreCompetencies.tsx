"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { MonitorSmartphone, ShoppingCart, LifeBuoy, MapPin, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "../i18n/routing";
import { CountUp } from "./marketing/CountUp";
import { MONTHLY, SERVICE_PRICES, formatUsd } from "../data/pricing";

// Renders a localized price pattern ("from {price}", "{price}-დან / თვეში")
// with only the number animated.
function PricePattern({ pattern, value }: { pattern: string; value: number }) {
  const [before, after] = pattern.split("§");
  return (
    <span>
      {before && <span className="font-mono text-xs tracking-normal text-neutral-500 mr-1.5">{before.trim()}</span>}
      <CountUp value={value} />
      {after && <span className="font-mono text-xs tracking-normal text-neutral-500">{after}</span>}
    </span>
  );
}

type ServiceCopy = { title: string; desc: string; chips: string[] };

export function CoreCompetencies() {
  const t = useTranslations("CoreCompetencies");
  const listRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  // S1: progress 0 → 1 while the services list passes the middle of the
  // viewport; it fills the line in the desktop pillar.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start center", "end center"] });

  // S2: the service crossing the middle of the viewport is "active" — it gets
  // the same look as hover, so the effect also works on touch screens.
  const [active, setActive] = useState(-1);
  useMotionValueEvent(scrollYProgress, "change", () => {
    const mid = window.innerHeight / 2;
    const rows = rowRefs.current;
    let next = -1;
    rows.forEach((row, i) => {
      if (!row) return;
      const r = row.getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) next = i;
    });
    // Past the last row: keep the last one lit instead of switching off.
    const last = rows[rows.length - 1];
    if (next === -1 && last && last.getBoundingClientRect().bottom <= mid) next = rows.length - 1;
    setActive((prev) => (prev === next ? prev : next));
  });

  const tp = useTranslations("Pricing");
  const copy = t.raw("services") as ServiceCopy[];
  const from = tp("ui.from", { price: "§" });

  // Order and prices follow the packages: site, shop, Google, care.
  const services = [
    { icon: MonitorSmartphone, href: "/pricing#packages", price: <PricePattern pattern={from} value={SERVICE_PRICES.website} />, extra: t("orMonthly", { monthly: formatUsd(MONTHLY.monthly) }) },
    { icon: ShoppingCart, href: "/pricing#packages", price: <PricePattern pattern={from} value={SERVICE_PRICES.shop} /> },
    { icon: MapPin, href: "/pricing#add-ons", price: <PricePattern pattern={from} value={SERVICE_PRICES.google} /> },
    { icon: LifeBuoy, href: "/pricing#care", price: <PricePattern pattern={t("fromMonthly", { price: "§" })} value={SERVICE_PRICES.care} /> },
  ].map((s, i) => ({ ...s, ...copy[i] }));

  return (
    <section className="relative py-24 px-6 bg-background-deep overflow-hidden">
      {/* Background blueprint texture */}
      <div className="absolute inset-0 z-0 pointer-events-none lucien-blueprint opacity-10" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row border border-white/10 bg-surface/50 backdrop-blur-sm">
          
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="block lg:hidden border-b border-white/10 bg-surface p-6 sm:p-8">
            <div className="w-10 h-10 flex items-center justify-center border border-white/10 mb-6 bg-background-deep text-primary">
              <div className="w-1.5 h-1.5 bg-primary" />
            </div>
            <h2 className="font-logo text-3xl sm:text-4xl text-neutral-50 mb-2 uppercase tracking-tighter break-words">
              {t("core")} <span className="text-primary block sm:inline">{t("competencies")}</span>
            </h2>
            <p className="font-inter text-neutral-400 text-sm">
              {t("precisionEngineering")}
            </p>
          </div>

          {/* Sticky Left Vertical Pillar (Desktop Only) */}
          <div className="hidden lg:block w-24 xl:w-32 2xl:w-40 border-r border-white/10 bg-surface shrink-0">
            <div className="sticky top-0 h-screen flex flex-col items-center justify-between py-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="w-12 h-12 flex items-center justify-center border border-white/10 bg-background-deep text-primary shrink-0 mb-8"
              >
                <div className="w-2 h-2 bg-primary" />
              </motion.div>
              
              <motion.h2 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.08, delayChildren: 0.2 }
                  }
                }}
                className="font-logo text-[clamp(1.25rem,2.5vh,3rem)] uppercase tracking-tighter whitespace-nowrap opacity-90 shrink-0 flex items-center" 
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                <span className="text-neutral-50 flex">
                  {t("core").split("").map((char, i) => (
                    <motion.span
                      key={`core-${i}`}
                      variants={{
                        hidden: { opacity: 0, filter: "blur(8px)", y: -20 },
                        visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { type: "spring", stiffness: 200 } }
                      }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
                <span className="mx-4 text-primary flex">
                  {t("competencies").split("").map((char, i) => (
                    <motion.span
                      key={`comp-${i}`}
                      variants={{
                        hidden: { opacity: 0, filter: "blur(8px)", y: -20 },
                        visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { type: "spring", stiffness: 200 } }
                      }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              </motion.h2>

              {/* S1: which service you're on + scroll-driven line */}
              <div className="mt-8 font-mono text-xs text-neutral-500 tabular-nums" aria-hidden="true">
                <span className="text-primary">{String(Math.max(active, 0) + 1).padStart(2, "0")}</span>
                <span> / {String(services.length).padStart(2, "0")}</span>
              </div>
              <div className="relative w-px flex-1 mt-4 bg-white/10" aria-hidden="true">
                <motion.div className="absolute inset-0 bg-primary origin-top" style={{ scaleY: scrollYProgress }} />
              </div>
            </div>
          </div>

          {/* Scrolling Right Content Section */}
          <div ref={listRef} className="w-full lg:flex-1 flex flex-col">
            {services.map((service, index) => {
              const isActive = index === active;
              return (
              <motion.div
                key={service.title}
                ref={(el) => { rowRefs.current[index] = el; }}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative hover:bg-surface transition-colors duration-500 overflow-hidden ${
                  isActive ? "bg-surface/60" : "bg-background-deep"
                } ${
                  index !== services.length - 1 ? 'border-b border-white/10' : ''
                }`}
              >
                {/* Accent Line on hover */}
                <div className={`absolute top-0 left-0 w-1 bg-primary group-hover:h-full transition-all duration-500 ease-out ${isActive ? "h-full" : "h-0"}`} />

                <Link
                  href={service.href}
                  className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-8 p-8 md:p-10 xl:p-12 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-6 mb-6">
                      <span className="font-mono text-sm text-primary">{String(index + 1).padStart(2, "0")}</span>
                      <div className="relative h-px flex-1 bg-white/5" aria-hidden="true">
                        <motion.div
                          className="absolute inset-0 bg-primary/40 origin-left"
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 0.9, delay: 0.2 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    </div>

                    <h3 className={`font-logo text-2xl md:text-3xl tracking-tight mb-4 group-hover:text-primary transition-colors duration-500 break-words ${isActive ? "text-primary" : "text-neutral-50"}`}>
                      {service.title}
                    </h3>

                    <p className="font-inter text-lg text-neutral-400 leading-relaxed max-w-2xl">
                      {service.desc}
                    </p>

                    <ul className="mt-6 flex flex-wrap gap-2">
                      {service.chips.map((chip, ci) => (
                        <motion.li
                          key={chip}
                          initial={{ opacity: 0, y: 6 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-60px" }}
                          transition={{ duration: 0.35, delay: 0.3 + ci * 0.06 }}
                          className={`border px-3 py-1 font-inter text-xs transition-colors duration-500 ${
                            isActive ? "border-primary/30 text-neutral-200" : "border-white/10 text-neutral-400"
                          } group-hover:border-primary/30 group-hover:text-neutral-200`}
                        >
                          {chip}
                        </motion.li>
                      ))}
                    </ul>

                    <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-logo text-2xl tracking-tighter text-neutral-50">
                        {service.price}
                        {"extra" in service && service.extra && (
                          <span className="font-mono text-xs tracking-normal text-neutral-500">· {service.extra}</span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary group-hover:text-white transition-colors">
                        {t("details")}
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 order-first md:order-none">
                    <div className={`w-16 h-16 border flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 group-hover:text-primary transition-all duration-500 ${
                      isActive ? "border-primary bg-primary/5 text-primary" : "border-white/10 bg-surface text-neutral-400"
                    }`}>
                      <service.icon className="w-8 h-8" aria-hidden="true" />
                    </div>
                  </div>
                </Link>
              </motion.div>
              );
            })}

            {/* Everything else lives in the add-ons */}
            <div className="border-t border-white/10 bg-background-deep px-8 py-6 md:px-10 xl:px-12 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="font-inter text-sm text-neutral-400">{t("more")}</p>
              <Link
                href="/pricing#add-ons"
                className="group/more inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary hover:text-white transition-colors whitespace-nowrap"
              >
                {t("allAddons")}
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/more:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
