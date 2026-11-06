"use client";

import { useState, useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "../i18n/routing";
import { priceParams } from "../data/pricing";

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

// Growth-chart quote: the axis line and the curve stay exactly as they were.
// A glowing arrow sweeps from the origin along the axis and reveals the
// author behind it, then a second arrow climbs the curve and reveals the
// quote. The curve's arrowhead stays at the top, pointing up.
const CURVE = "M 10 260 Q 230 260 230 10";
const ORIGIN_X = 10;
const AXIS_END_X = 250;
const AXIS_Y = 260;
const AXIS_TRAIL = 48; // px of glowing tail behind the axis arrow
const CURVE_TRAIL = 0.18; // fraction of the curve the tail covers
const VIEW_W = 250; // viewBox width; the rendered width sets the scale
const GRID = 60; // must match .lucien-blueprint background-size
const SWEEP_EASE = [0.65, 0, 0.35, 1] as const;
const ARROW_GLOW = { filter: "drop-shadow(0 0 4px rgba(92, 156, 255, 0.8))" };

// Position + heading of the arrow at progress p along the curve.
function curveArrowTransform(el: SVGPathElement | null, p: number) {
  if (!el) return `translate(${ORIGIN_X} ${AXIS_Y})`;
  const len = el.getTotalLength();
  const at = Math.min(len, Math.max(1, len * p));
  const a = el.getPointAtLength(at - 1);
  const b = el.getPointAtLength(at);
  const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
  return `translate(${b.x} ${b.y}) rotate(${angle})`;
}

function ArrowHead() {
  return <path d="M -6 -4.5 L 0 0 L -6 4.5" fill="none" stroke="#5c9cff" strokeWidth="0.5" strokeLinecap="square" />;
}

function GrowthQuote({ quote, author }: { quote: string; author: string }) {
  const reduceMotion = useReducedMotion();
  const curveRef = useRef<SVGPathElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Snap the chart origin onto a node of the hero's background grid. The
  // box sits in a centred container, so its offset depends on viewport
  // width — measure and nudge the SVG (at most half a cell) on every resize.
  // The scales (×1 / ×1.5 / ×1.75) make the axis exactly 4 / 6 / 7 cells long,
  // so once the origin is on a node the axis end lands on one too.
  useEffect(() => {
    const box = boxRef.current;
    const svg = svgRef.current;
    const section = box?.closest("section");
    if (!box || !svg || !section) return;

    const align = () => {
      const b = box.getBoundingClientRect();
      if (!b.width) return; // hidden below lg
      const s = section.getBoundingClientRect();
      const k = b.width / VIEW_W;
      const ox = b.left - s.left + ORIGIN_X * k;
      const oy = b.top - s.top + AXIS_Y * k;
      // Grid lines are 1px wide starting at each multiple of GRID; +0.5 centres
      // our 1px lines on them.
      const dx = Math.round(ox / GRID) * GRID + 0.5 - ox;
      const dy = Math.round(oy / GRID) * GRID + 0.5 - oy;
      svg.style.transform = `translate(${dx}px, ${dy}px)`;
    };

    align();
    const ro = new ResizeObserver(align);
    ro.observe(section);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);
  const axisP = useMotionValue(0);
  const curveP = useMotionValue(0);

  useEffect(() => {
    if (reduceMotion) {
      axisP.set(1);
      curveP.set(1);
      return;
    }
    // Starts once the lines have mostly faded in (parent fades at 1s \u2192 3s).
    const axis = animate(axisP, 1, { duration: 0.8, delay: 1.6, ease: SWEEP_EASE });
    const curve = animate(curveP, 1, { duration: 0.9, delay: 2.6, ease: SWEEP_EASE });
    return () => {
      axis.stop();
      curve.stop();
    };
  }, [reduceMotion, axisP, curveP]);

  // Axis sweep
  const axisX = useTransform(axisP, (p) => ORIGIN_X + p * (AXIS_END_X - ORIGIN_X));
  const axisTrailX = useTransform(axisX, (x) => Math.max(ORIGIN_X, x - AXIS_TRAIL));
  const axisTrailW = useTransform(axisX, (x) => Math.min(AXIS_TRAIL, x - ORIGIN_X));
  const axisFx = useTransform(axisP, [0, 0.04, 0.85, 1], [0, 1, 1, 0]);

  // Arrowhead position + heading are written straight to the SVG `transform`
  // attribute. Passing a MotionValue as `transform` makes Framer treat it as a
  // CSS transform, which leaves the heads stuck at the SVG origin.
  const axisHeadRef = useRef<SVGGElement>(null);
  const curveHeadRef = useRef<SVGGElement>(null);
  useMotionValueEvent(axisX, "change", (x) => {
    axisHeadRef.current?.setAttribute("transform", `translate(${x} ${AXIS_Y})`);
  });
  useMotionValueEvent(curveP, "change", (p) => {
    curveHeadRef.current?.setAttribute("transform", curveArrowTransform(curveRef.current, p));
  });

  // Curve sweep
  const curveHeadOpacity = useTransform(curveP, [0, 0.04], [0, 1]);
  const curveTrailOpacity = useTransform(curveP, [0, 0.04, 0.85, 1], [0, 1, 1, 0]);
  const curveTrailLen = useTransform(curveP, (p) => Math.min(p, CURVE_TRAIL));
  const curveTrailOffset = useTransform(curveP, (p) => Math.max(0, p - CURVE_TRAIL));

  return (
    // Scaled as a whole via the viewBox: ×1 (lg), ×1.5 (xl), ×1.75 (2xl).
    <div ref={boxRef} className="w-[250px] xl:w-[375px] 2xl:w-[437.5px]">
    <svg ref={svgRef} viewBox="0 0 250 300" className="block w-full h-auto overflow-visible">
      <defs>
        <path id="curvePath" d={CURVE} fill="transparent" />
        <linearGradient id="axisTrailGrad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#5c9cff" stopOpacity="0" />
          <stop offset="1" stopColor="#5c9cff" />
        </linearGradient>
        {/* Author is visible only left of the axis arrow */}
        <mask id="authorReveal" maskUnits="userSpaceOnUse" x="-20" y="-20" width="300" height="340">
          <motion.rect x="0" y="262" height="30" width={axisX} fill="white" />
        </mask>
        {/* Quote is visible only along the part of the curve already swept */}
        <mask id="quoteReveal" maskUnits="userSpaceOnUse" x="-20" y="-20" width="300" height="340">
          <motion.path d={CURVE} fill="none" stroke="white" strokeWidth="34" style={{ pathLength: curveP }} />
        </mask>
      </defs>

      {/* The structural blueprint lines (unchanged) */}
      <path ref={curveRef} d={CURVE} fill="transparent" stroke="currentColor" className="text-primary/[0.14]" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <line x1={ORIGIN_X} y1={AXIS_Y} x2={AXIS_END_X} y2={AXIS_Y} stroke="currentColor" className="text-primary/[0.21]" strokeWidth="1" vectorEffect="non-scaling-stroke" />

      {/* The Text */}
      <text mask="url(#quoteReveal)" className="font-quote font-light text-xs fill-neutral-300 opacity-90 tracking-[0.2em] uppercase">
        <textPath href="#curvePath" startOffset="5%">
          {quote}
        </textPath>
      </text>

      {/* The X-Axis Author */}
      <text mask="url(#authorReveal)" x="10" y="280" className="font-mono text-[10px] fill-primary opacity-90 tracking-[0.2em] uppercase">
        {author}
      </text>

      {/* Axis arrow: glowing tail + head, fades out at the end of the axis */}
      <motion.g style={{ opacity: axisFx, ...ARROW_GLOW }} aria-hidden="true">
        <motion.rect x={axisTrailX} y={AXIS_Y - 1} width={axisTrailW} height="2" fill="url(#axisTrailGrad)" />
        <g ref={axisHeadRef} transform={`translate(${ORIGIN_X} ${AXIS_Y})`}>
          <ArrowHead />
        </g>
      </motion.g>

      {/* Curve arrow: tail fades, head stays at the top pointing up */}
      <motion.path
        d={CURVE}
        fill="none"
        stroke="#5c9cff"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        aria-hidden="true"
        style={{ pathLength: curveTrailLen, pathOffset: curveTrailOffset, opacity: curveTrailOpacity, ...ARROW_GLOW }}
      />
      <motion.g style={{ opacity: curveHeadOpacity, ...ARROW_GLOW }} aria-hidden="true">
        <g ref={curveHeadRef} transform={`translate(${ORIGIN_X} ${AXIS_Y})`}>
          <ArrowHead />
        </g>
      </motion.g>
    </svg>
    </div>
  );
}

export function HeroSection() {
  const t = useTranslations("Hero");

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden px-6 pt-32 pb-12 lucien-blueprint">
      <GridLight />

      <div className="relative z-10 max-w-7xl mx-auto w-full">

        <div className="max-w-3xl space-y-12">
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
              <a href="#contact" className="group relative inline-flex items-center justify-center px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-mono text-background-deep transition-all duration-300 bg-primary border border-primary hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(92,156,255,0.4)] focus:outline-none uppercase tracking-wider sm:tracking-widest overflow-hidden w-full sm:w-auto font-bold">
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
              <span>{t("pricingNote", priceParams())}</span>
              <span className="inline-flex items-center gap-1 text-primary">
                <span className="relative">
                  {t("seePricing")}
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 group-hover/price:scale-x-100" />
                </span>
                <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover/price:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>

        {/* Exponential Curve Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
          className="hidden lg:block absolute right-6 xl:right-12 top-1/2 -translate-y-1/2 pointer-events-none"
        >
          <GrowthQuote quote={t("lessIsMore")} author={t("quoteAuthor")} />
        </motion.div>

      </div>
    </section>
  );
}
