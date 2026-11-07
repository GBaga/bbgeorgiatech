"use client";

import type { PointerEvent } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Clock, Gem, Landmark, Layers, ShieldCheck, CalendarX, Zap } from "lucide-react";

// Who we are, how we work and what we build with: one block that replaces the
// former Philosophy, Technology and Heritage sections on the home page.

const VALUE_ICONS = [Gem, Zap, Layers];

const TECH = [
  "Next.js",
  "React",
  "NestJS",
  "MongoDB",
  "PostgreSQL",
  "Sanity",
  "Cloudinary",
  "Cloudflare",
];

const BADGES = [
  { icon: ShieldCheck, n: 1 },
  { icon: Clock, n: 2 },
  { icon: Landmark, n: 3 },
  { icon: CalendarX, n: 4 },
];

// Feeds the pointer position to the card's spotlight (.tech-spotlight).
function trackPointer(e: PointerEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export function About() {
  const t = useTranslations("About");
  const values = t.raw("values") as { title: string; text: string }[];

  return (
    <section className="relative py-32 px-6 bg-surface border-t border-white/5 overflow-hidden">
      {/* Background brand text */}
      <div
        className="absolute inset-0 z-0 flex flex-col justify-center pointer-events-none select-none w-full px-4 overflow-hidden opacity-60"
        aria-hidden="true"
      >
        <div
          className="text-[11vw] xl:text-[14vw] font-logo leading-[0.85] tracking-tighter flex flex-col w-full"
          style={{ WebkitTextStroke: "2px rgba(92, 156, 255, 0.15)", color: "transparent" }}
        >
          <span className="self-start">BB</span>
          <span className="self-center">GEORGIA</span>
          <span className="self-end">TECH</span>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-mono text-sm tracking-widest uppercase mb-4 block">
            {t("eyebrow")} · {t("umbrella")}
          </span>
          <h2 className="font-logo text-3xl md:text-5xl text-neutral-50 mb-6 uppercase tracking-tighter">
            {t("title1")} <span className="text-primary">{t("title2")}</span>
          </h2>
          <p className="font-inter text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            {t("intro")}
          </p>
        </motion.div>

        {/* How we work */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {values.map((v, i) => {
            const Icon = VALUE_ICONS[i] ?? Gem;
            return (
              <motion.div
                key={v.title}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
                }}
                onPointerMove={trackPointer}
                className="group p-8 rounded-none lucien-card"
              >
                <div className="tech-spotlight opacity-0 group-hover:opacity-100" aria-hidden="true" />
                <div className="w-10 h-10 rounded-none bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-xl font-bold text-neutral-50 mb-3">{v.title}</h3>
                <p className="font-inter text-neutral-400 leading-relaxed">{v.text}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* What we build with */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest mr-2">{t("techLabel")}</span>
          {TECH.map((name) => (
            <span
              key={name}
              className="border border-white/10 bg-white/[0.02] px-3 py-1.5 font-mono text-xs text-neutral-300"
            >
              {name}
            </span>
          ))}
        </motion.div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 font-mono text-left">
          {BADGES.map(({ icon: Icon, n }) => (
            <div
              key={n}
              className="p-4 sm:p-5 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors relative overflow-hidden group"
            >
              <Icon className="w-5 h-5 text-primary mb-3 sm:mb-4 relative z-10" aria-hidden="true" />
              <div className="text-white text-xs sm:text-sm font-bold mb-1 relative z-10">{t(`badge${n}Title`)}</div>
              <div className="text-neutral-500 text-[10px] sm:text-xs uppercase tracking-widest relative z-10">{t(`badge${n}Val`)}</div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
