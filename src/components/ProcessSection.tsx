"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useTranslations } from "next-intl";

type Step = { id: string; title: string; description: string };

function ProcessStep({
  step,
  index,
  total,
  active,
  progress,
}: {
  step: Step;
  index: number;
  total: number;
  active: boolean;
  progress: MotionValue<number>;
}) {
  // Mobile connector fills while scrolling from this step to the next one.
  const connector = useTransform(progress, [index / total, (index + 1) / total], [0, 1]);

  return (
    <div className="relative flex flex-col items-center md:items-start text-center md:text-left group">
      {/* Number node */}
      <div
        className={`w-24 h-24 mb-6 relative flex items-center justify-center bg-background-deep border z-10 transition-all duration-500 ${
          active
            ? "border-primary shadow-[0_0_24px_rgba(92,156,255,0.25)]"
            : "border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
        }`}
      >
        <div className={`absolute inset-2 border transition-colors duration-500 ${active ? "border-primary/30" : "border-white/5"}`} />
        <span className={`font-mono text-2xl font-bold transition-colors duration-500 ${active ? "text-primary" : "text-neutral-600"}`}>
          [{step.id}]
        </span>

        {/* Corner accents appear once the step is reached */}
        {[
          "top-0 left-0 border-t border-l",
          "top-0 right-0 border-t border-r",
          "bottom-0 left-0 border-b border-l",
          "bottom-0 right-0 border-b border-r",
        ].map((pos) => (
          <div
            key={pos}
            className={`absolute w-2 h-2 ${pos} border-primary transition-opacity duration-500 ${active ? "opacity-100" : "opacity-0"}`}
          />
        ))}
      </div>

      <h3
        className={`font-logo text-xl mb-3 tracking-widest uppercase transition-colors duration-500 ${
          active ? "text-neutral-50" : "text-neutral-500"
        }`}
      >
        {step.title}
      </h3>
      <p
        className={`font-inter text-sm leading-relaxed max-w-[250px] transition-colors duration-500 ${
          active ? "text-neutral-400" : "text-neutral-600"
        }`}
      >
        {step.description}
      </p>

      {/* Mobile connector to the next step */}
      {index < total - 1 && (
        <div className="md:hidden mt-8 w-px h-12 bg-white/10 relative" aria-hidden="true">
          <motion.div className="absolute inset-0 bg-primary origin-top" style={{ scaleY: connector }} />
          <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-2 h-2 border-b border-r border-white/20 rotate-45" />
        </div>
      )}
    </div>
  );
}

export function ProcessSection() {
  const t = useTranslations("ProcessSection");
  const stepsRef = useRef<HTMLDivElement>(null);

  const steps: Step[] = [
    { id: "01", title: t("step1"), description: t("step1Desc") },
    { id: "02", title: t("step2"), description: t("step2Desc") },
    { id: "03", title: t("step3"), description: t("step3Desc") },
    { id: "04", title: t("step4"), description: t("step4Desc") },
  ];
  const total = steps.length;

  // Progress runs 0 → 1 while the steps travel from 75% down the viewport
  // to the middle. It drives the line and decides which steps are lit.
  const { scrollYProgress } = useScroll({ target: stepsRef, offset: ["start 75%", "end 50%"] });
  const [reached, setReached] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    // Step i lights up when the line reaches its column (or its row on mobile).
    const next = steps.filter((_, i) => p >= i / total + 0.02).length;
    setReached((prev) => (prev === next ? prev : next));
  });

  return (
    <section className="relative py-24 px-6 bg-background-deep overflow-hidden border-t border-white/5">
      {/* Background blueprint texture */}
      <div className="absolute inset-0 z-0 pointer-events-none lucien-blueprint opacity-10" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-24"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-1.5 h-1.5 bg-primary" />
            <div className="w-1.5 h-1.5 bg-primary/50" />
            <div className="w-1.5 h-1.5 bg-primary/20" />
          </div>
          <h2 className="font-logo text-4xl md:text-5xl lg:text-6xl text-neutral-50 uppercase tracking-tighter">
            {t("title1")} <span className="text-primary">{t("title2")}</span>
          </h2>
        </motion.div>

        <div className="relative" ref={stepsRef}>
          {/* Base line (desktop) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-white/10" />

          {/* Scroll-driven line (desktop) */}
          <motion.div
            className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-gradient-to-r from-primary/80 via-primary to-primary/80 origin-left"
            style={{ scaleX: scrollYProgress }}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6">
            {steps.map((step, index) => (
              <ProcessStep
                key={step.id}
                step={step}
                index={index}
                total={total}
                active={index < reached}
                progress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
