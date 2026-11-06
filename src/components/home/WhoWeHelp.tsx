"use client";

import type { PointerEvent } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "../../i18n/routing";
import { SectionHeader } from "../marketing/SectionHeader";
import { READY_VERTICALS } from "../../data/verticals";
import { SearchTyping } from "../effects/SearchTyping";

const pad = (n: number) => String(n).padStart(2, "0");

function trackPointer(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

// Home: "Who we help". An endless ticker of business types, then one tile
// per industry page. Each tile carries its industry colour: a spotlight that
// follows the pointer, an icon box that fills, a bar that grows.
export function WhoWeHelp() {
  const t = useTranslations("Home.who");
  const tv = useTranslations("Verticals");

  // One real search per industry, typed in turn: every visitor sees their own.
  const searches = READY_VERTICALS.map((v) => (tv.raw(`${v.key}.searches`) as string[])[0]);
  const types = READY_VERTICALS.flatMap((v) => (tv.raw(`${v.key}.types`) as string[]).map((type) => ({ type, accent: v.accent })));

  return (
    <section className="relative py-24 md:py-32 bg-background-deep border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none lucien-blueprint opacity-40" aria-hidden="true" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeader eyebrow={t("eyebrow")} title1={t("title1")} title2={t("title2")} subtitle={t("subtitle")} />
          <div className="hidden md:block mb-16 font-mono text-sm text-neutral-500" aria-hidden="true">
            <span className="text-neutral-50">{pad(READY_VERTICALS.length)}</span> / {pad(types.length)}
          </div>
        </div>
      </div>

      {/* Ticker of every business type we build for */}
      <div className="marquee relative z-10 mb-12 md:mb-16 border-y border-white/5 bg-surface/40 py-4" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0">
              {types.map(({ type, accent }, ti) => (
                <li key={`${copy}-${ti}`} className="flex items-center gap-3 px-6 font-mono text-sm uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                  <span className="w-1.5 h-1.5" style={{ backgroundColor: accent }} />
                  {type}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <SearchTyping phrases={searches} label={tv("ui.searchLabel")} />
        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          className="grid gap-px bg-white/10 border border-white/10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {READY_VERTICALS.map((v, i) => (
            <motion.li
              key={v.slug}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
              }}
              className="bg-background-deep"
            >
              <Link
                href={`/for/${v.slug}`}
                onPointerMove={trackPointer}
                style={{ ["--accent" as string]: v.accent }}
                className="group relative flex h-full min-h-[11rem] flex-col justify-between overflow-hidden p-6 transition-colors duration-300 hover:bg-surface focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary"
              >
                <div className="accent-spotlight" aria-hidden="true" />
                {/* Bar grows along the bottom edge on hover */}
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 ease-out group-hover:w-full"
                  style={{ backgroundColor: v.accent }}
                />

                <div className="relative flex items-start justify-between">
                  <span
                    className="flex h-11 w-11 items-center justify-center border border-white/10 bg-surface text-neutral-400 transition-all duration-300 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-background-deep"
                  >
                    <v.icon className="w-5 h-5 transition-transform duration-500 group-hover:scale-110" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-xs text-neutral-600 transition-colors group-hover:text-neutral-300">{pad(i + 1)}</span>
                </div>

                <div className="relative mt-8 flex items-end justify-between gap-3">
                  <span className="font-heading text-base font-semibold leading-snug text-neutral-200 transition-colors group-hover:text-white">
                    {tv(`${v.key}.name`)}
                  </span>
                  <span className="sr-only">{t("explore")}</span>
                  <ArrowUpRight
                    className="w-4 h-4 shrink-0 text-neutral-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
