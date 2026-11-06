"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "../../i18n/routing";
import { CARE_PLANS, YEARLY_MONTHS, formatUsd } from "../../data/pricing";

// Care plan cards with a monthly / yearly switch. Yearly = YEARLY_MONTHS
// months' price for 12 months.
export function CarePlans() {
  const t = useTranslations("Pricing");
  const [yearly, setYearly] = useState(false);

  return (
    <div>
      {/* Billing switch */}
      <div className="mb-10 flex flex-wrap items-center gap-4">
        <div role="radiogroup" className="inline-flex border border-white/10 bg-background-deep p-1">
          {[false, true].map((isYearly) => {
            const active = yearly === isYearly;
            return (
              <button
                key={String(isYearly)}
                role="radio"
                aria-checked={active}
                onClick={() => setYearly(isYearly)}
                className={`relative px-5 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
                  active ? "text-white" : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="care-billing"
                    className="absolute inset-0 bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                <span className="relative">{isYearly ? t("care.yearly") : t("care.monthly")}</span>
              </button>
            );
          })}
        </div>
        <span className="border border-primary/40 bg-primary/10 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-primary">
          {t("care.save")}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {CARE_PLANS.map((plan, i) => {
          const amount = yearly ? plan.monthly * YEARLY_MONTHS : plan.monthly;
          return (
            <motion.article
              key={plan.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex flex-col overflow-hidden border p-6 md:p-8 bg-gradient-to-b from-surface-bright to-surface ${
                plan.featured ? "border-primary/60 shadow-[0_0_40px_-12px_rgba(92,156,255,0.5)]" : "border-white/10"
              }`}
            >
              <div aria-hidden="true" className={`absolute left-0 top-0 bottom-0 w-1 ${plan.featured ? "bg-primary" : "bg-white/10"}`} />
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-logo text-xl uppercase tracking-tighter text-neutral-50">{t(`care.plans.${plan.key}.name`)}</h3>
                {plan.featured && (
                  <span className="shrink-0 border border-primary/50 bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
                    {t("ui.popular")}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-neutral-400">{t(`care.plans.${plan.key}.tagline`)}</p>

              <div className="mt-6 flex items-baseline gap-2 min-h-[3rem]">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={amount}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="font-logo text-4xl text-neutral-50 tracking-tighter tabular-nums"
                  >
                    {formatUsd(amount)}
                  </motion.span>
                </AnimatePresence>
                <span className="font-mono text-xs text-neutral-500 whitespace-nowrap">{yearly ? t("care.perYear") : t("care.perMonth")}</span>
              </div>
              <div className="h-5 font-mono text-[11px] text-neutral-500">
                {yearly && t("care.equivalent", { amount: formatUsd(Math.round(amount / 12)) })}
              </div>

              <Link
                href="/#contact"
                className={`mt-6 inline-flex justify-center items-center border-2 px-5 py-2.5 font-mono text-sm uppercase tracking-wider transition-all ${
                  plan.featured
                    ? "border-primary bg-primary text-white hover:bg-primary/80"
                    : "border-primary/50 text-primary hover:bg-primary hover:text-white"
                }`}
              >
                {t("ui.getStarted")}
              </Link>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
