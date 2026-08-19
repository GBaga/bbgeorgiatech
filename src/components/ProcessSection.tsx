"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";

/** Animated counter that rolls from 00 → target (e.g. "03") */
function CounterNumber({ target, inView }: { target: string; inView: boolean }) {
  const num = parseInt(target, 10);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const totalFrames = 12 + num * 4;          // faster for 01, slower for 04
    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      setCurrent(Math.min(Math.round(progress * num), num));
      if (frame >= totalFrames) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [inView, num]);

  return <>{String(current).padStart(2, "0")}</>;
}

export function ProcessSection() {
  const t = useTranslations("ProcessSection");
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const steps = [
    { id: "01", title: t("step1"), description: t("step1Desc") },
    { id: "02", title: t("step2"), description: t("step2Desc") },
    { id: "03", title: t("step3"), description: t("step3Desc") },
    { id: "04", title: t("step4"), description: t("step4Desc") },
  ];

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
          <h2 className="font-logo text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-50 uppercase tracking-tighter">
            {t("title1")} <span className="text-primary">{t("title2")}</span>
          </h2>
        </motion.div>

        <div className="relative" ref={sectionRef}>
          {/* Static base line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-white/10" />

          {/* Animated draw-line (Desktop) — draws left→right on scroll */}
          <motion.div
            className="hidden md:block absolute top-12 left-0 h-[1px] bg-gradient-to-r from-primary/80 via-primary to-primary/80 origin-left"
            initial={{ width: 0 }}
            animate={isInView ? { width: "100%" } : { width: 0 }}
            transition={{ duration: 3, ease: "easeInOut", delay: 0.3 }}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{
                  duration: 0.6,
                  delay: 0.2 + index * 0.25,      // stagger each card
                  ease: [0.21, 0.47, 0.32, 0.98],  // custom ease-out
                }}
                className="relative flex flex-col items-center md:items-start text-center md:text-left group"
              >
                {/* Number Node */}
                <motion.div
                  className="w-24 h-24 mb-6 relative flex items-center justify-center bg-background-deep border border-white/10 group-hover:border-primary transition-colors duration-300 z-10 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                  initial={{ scale: 0.8, borderColor: "rgba(255,255,255,0.05)" }}
                  animate={
                    isInView
                      ? { scale: 1, borderColor: "rgba(255,255,255,0.1)" }
                      : { scale: 0.8, borderColor: "rgba(255,255,255,0.05)" }
                  }
                  transition={{
                    duration: 0.5,
                    delay: 0.3 + index * 0.25,
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                >
                  <div className="absolute inset-2 border border-white/5 group-hover:border-primary/30 transition-colors duration-300" />
                  <span className="font-mono text-2xl text-primary font-bold">
                    [<CounterNumber target={step.id} inView={isInView} />]
                  </span>

                  {/* Corner accents — fade in after the card lands */}
                  {[
                    "top-0 left-0 border-t border-l",
                    "top-0 right-0 border-t border-r",
                    "bottom-0 left-0 border-b border-l",
                    "bottom-0 right-0 border-b border-r",
                  ].map((pos) => (
                    <motion.div
                      key={pos}
                      className={`absolute w-2 h-2 ${pos} border-primary`}
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ delay: 0.8 + index * 0.25, duration: 0.3 }}
                    />
                  ))}
                </motion.div>

                {/* Title — slides up slightly after the node */}
                <motion.h3
                  className="font-logo text-xl font-bold text-neutral-50 mb-3 tracking-widest uppercase"
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.25 }}
                >
                  {step.title}
                </motion.h3>

                {/* Description — fades in last */}
                <motion.p
                  className="font-inter text-neutral-400 text-sm leading-relaxed max-w-[250px]"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.25 }}
                >
                  {step.description}
                </motion.p>

                {/* Arrow indicator for mobile */}
                {index < steps.length - 1 && (
                  <motion.div
                    className="md:hidden mt-8 w-px h-12 bg-white/10 relative"
                    initial={{ scaleY: 0 }}
                    animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                    transition={{ duration: 0.4, delay: 0.9 + index * 0.25 }}
                    style={{ originY: 0 }}
                  >
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 border-b border-r border-white/20 rotate-45" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
