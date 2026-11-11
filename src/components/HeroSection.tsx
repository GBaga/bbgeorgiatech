"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "../i18n/routing";
import { priceParams } from "../data/pricing";
import { HeroCircuit, HeroCircuitStrip } from "./effects/HeroCircuit";

export const GridLight = () => {
  const [pathData, setPathData] = useState<{ d: string, w: number, h: number } | null>(null);

  const generateAndSetPath = () => {
    const gridSize = 60;
    const w = document.documentElement.clientWidth;
    const h = document.documentElement.clientHeight;
    const cols = Math.floor(w / gridSize);
    const rows = Math.floor(h / gridSize);

    // Start well within the screen to avoid edge cutoffs
    let currX = Math.floor(Math.random() * (cols - 2)) + 1;
    let currY = Math.floor(Math.random() * (rows - 2)) + 1;

    let d = `M ${currX * gridSize} ${currY * gridSize}`;
    let currentDir = Math.random() > 0.5 ? 'H' : 'V';

    // Generate 4-6 segments
    const segments = Math.floor(Math.random() * 3) + 4;
    for (let i = 0; i < segments; i++) {
      const steps = Math.floor(Math.random() * 4) + 2; // 2 to 5 blocks
      if (currentDir === 'H') {
        const dir = Math.random() > 0.5 ? 1 : -1;
        currX += steps * dir;
        if (currX < 0) currX = 0;
        if (currX > cols) currX = cols;
        d += ` L ${currX * gridSize} ${currY * gridSize}`;
        currentDir = 'V';
      } else {
        const dir = Math.random() > 0.5 ? 1 : -1;
        currY += steps * dir;
        if (currY < 0) currY = 0;
        if (currY > rows) currY = rows;
        d += ` L ${currX * gridSize} ${currY * gridSize}`;
        currentDir = 'H';
      }
    }
    setPathData({ d, w, h });
  };

  useEffect(() => {
    // Reads document.documentElement dimensions, so it can only run after
    // mount — there is no way to compute this during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    generateAndSetPath();
  }, []);

  if (!pathData) return null;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <svg width={pathData.w} height={pathData.h} className="absolute top-0 left-0">
        <motion.path
          key={pathData.d}
          d={pathData.d}
          stroke="var(--base--primary, #5c9cff)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0.05, pathOffset: 0, opacity: 0 }}
          animate={{
            pathOffset: 1,
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: 15,
            ease: "linear",
          }}
          style={{
            filter: "drop-shadow(0 0 4px rgba(92, 156, 255, 0.4))"
          }}
          onAnimationComplete={generateAndSetPath}
        />
      </svg>
    </div>
  );
};

// The headline reveal is plain CSS (see .hero-line in globals.css), not
// Framer Motion: it starts on the first paint instead of waiting for
// hydration, so the headline (the page's LCP element) shows up right away.
const delay = (s: number) => ({ ["--d" as string]: `${s}s` });

export function HeroSection() {
  const t = useTranslations("Hero");
  const locale = useLocale();
  const sectionRef = useRef<HTMLElement>(null);

  // Pause the circuit's repeating pulse while the hero is off screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => {
      el.toggleAttribute("data-offscreen", !entry.isIntersecting);
    });
    io.observe(el);

    // The phone strip sits below the first screen, so its beam waits until
    // the strip is actually in view (see .hc-strip:not([data-run])).
    const strip = el.querySelector(".hc-strip");
    const stripIo = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      entry.target.setAttribute("data-run", "");
      stripIo.disconnect();
    }, { threshold: 0.6 });
    if (strip) stripIo.observe(strip);

    return () => {
      io.disconnect();
      stripIo.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="hc-host relative min-h-screen flex items-center overflow-hidden px-6 pt-32 pb-12 lucien-blueprint">
      {/* Businesses switching on along the grid (lg+); phones get the strip below */}
      <HeroCircuit />

      <div className="relative z-10 max-w-7xl mx-auto w-full">

        {/* Narrower at lg so the circuit fits beside the copy */}
        <div className="max-w-3xl lg:max-w-2xl xl:max-w-3xl space-y-12">
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-bold tracking-tighter text-neutral-50 leading-[1.1] uppercase break-words sm:break-normal">
            <span className="hero-line"><span style={delay(0)}>{t("title1")}</span></span>
            <span className="hero-line"><span style={delay(0.08)}>{t("title2")}</span></span>
            <span className="hero-line">
              <span style={delay(0.16)} className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                {t("title3")}
              </span>
            </span>
          </h1>

          <div
            style={delay(0.3)}
            className="hero-fade font-mono text-sm md:text-base text-neutral-400 space-y-4 border-l-2 border-primary/50 pl-6 py-2 bg-background-deep/30 backdrop-blur-sm"
          >
            <div className="flex items-start tracking-wider">
              <span className="text-primary mr-3">{">"}</span>
              <p><span className="text-neutral-600 mr-2">{t("stackLabel")}</span> {t("stackValue")}</p>
            </div>
            <div className="flex items-start tracking-wider">
              <span className="text-primary mr-3">{">"}</span>
              <p><span className="text-neutral-600 mr-2">{t("deploymentLabel")}</span> {t("deploymentValue")}</p>
            </div>
            <div className="flex items-start tracking-wider">
              <span className="text-primary mr-3">{">"}</span>
              <p><span className="text-neutral-600 mr-2">{t("targetLabel")}</span> {t("targetValue")}</p>
            </div>
            <div className="flex items-start tracking-wider pt-2">
              <span className="text-primary mr-3">{">"}</span>
              <span className="w-2 h-4 bg-primary animate-pulse" />
            </div>
          </div>

          <div style={delay(0.4)} className="hero-fade flex flex-col pt-4 gap-2">
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact" className="hc-ping group relative inline-flex items-center justify-center px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-mono text-background-deep transition-all duration-300 bg-primary border border-primary hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(92,156,255,0.4)] focus:outline-none uppercase tracking-wider sm:tracking-widest overflow-hidden w-full sm:w-auto font-bold">
                <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                  {t("getAQuote")} <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-2" />
                </span>
                <div className="absolute inset-0 h-full w-0 bg-white/20 transition-all duration-300 ease-out group-hover:w-full" />
              </a>
              <a href="#systems" className="group relative inline-flex items-center justify-center px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-mono text-primary transition-all duration-300 bg-background-deep border border-primary/50 hover:bg-primary/10 hover:border-primary hover:shadow-[0_0_20px_rgba(92,156,255,0.2)] focus:outline-none uppercase tracking-wider sm:tracking-widest overflow-hidden w-full sm:w-auto">
                <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                  {t("initializeDeployment")}
                </span>
                <div className="absolute inset-0 h-full w-0 bg-primary/10 transition-all duration-300 ease-out group-hover:w-full" />
              </a>
            </div>
            {/* Entry price on the first screen, linking to /pricing */}
            <Link
              href="/pricing"
              className="group/price mt-2 sm:ml-1 inline-flex w-fit flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              <span className="w-1.5 h-1.5 bg-primary animate-pulse" aria-hidden="true" />
              <span>{t("pricingNote", priceParams(locale))}</span>
              <span className="inline-flex items-center gap-1 text-primary">
                <span className="relative">
                  {t("seePricing")}
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 group-hover/price:scale-x-100" />
                </span>
                <ChevronRight className="w-3 h-3 transition-transform duration-300 group-hover/price:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          </div>

          <HeroCircuitStrip />
        </div>
      </div>
    </section>
  );
}
