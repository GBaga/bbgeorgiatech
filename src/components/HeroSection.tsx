"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

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

const typingContainer = {
  hidden: { opacity: 1 },
  visible: (customDelay: number) => ({
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: customDelay }
  })
};

const typingChar = {
  hidden: { display: "none", opacity: 0 },
  visible: { display: "inline", opacity: 1 }
};

export function HeroSection() {
  const t = useTranslations("Hero");

  const title1 = t("title1");
  const title2 = t("title2");
  const title3 = t("title3");

  const delay1 = 0.5; // Start after blueprint initializes
  const delay2 = delay1 + title1.length * 0.05 + 0.2;
  const delay3 = delay2 + title2.length * 0.05 + 0.2;
  
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden px-6 pt-32 pb-12 lucien-blueprint">
      <GridLight />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        
        <div className="max-w-3xl space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-bold tracking-tighter text-neutral-50 leading-[1.1] uppercase break-words sm:break-normal">
              <motion.span custom={delay1} variants={typingContainer} initial="hidden" animate="visible">
                {title1.split("").map((char, i) => <motion.span key={i} variants={typingChar}>{char === " " ? "\u00A0" : char}</motion.span>)}
              </motion.span>
              <br />
              <motion.span custom={delay2} variants={typingContainer} initial="hidden" animate="visible">
                {title2.split("").map((char, i) => <motion.span key={i} variants={typingChar}>{char === " " ? "\u00A0" : char}</motion.span>)}
              </motion.span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                <motion.span custom={delay3} variants={typingContainer} initial="hidden" animate="visible">
                  {title3.split("").map((char, i) => <motion.span key={i} variants={typingChar}>{char === " " ? "\u00A0" : char}</motion.span>)}
                </motion.span>
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="font-mono text-sm md:text-base text-neutral-400 space-y-4 border-l-2 border-primary/50 pl-6 py-2 bg-background-deep/30 backdrop-blur-sm"
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col pt-4 gap-2"
          >
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
            <p className="font-mono text-xs text-neutral-500 mt-2 sm:ml-1">
              {t("pricingNote")}
            </p>
          </motion.div>
        </div>

        {/* Exponential Curve Quote */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3, delay: delay3 + 1.5 }}
          className="hidden lg:block absolute right-6 xl:right-12 top-1/2 -translate-y-1/2 pointer-events-none"
        >
          <svg width="250" height="300" viewBox="0 0 250 300" className="overflow-visible opacity-70">
            <defs>
              <path id="curvePath" d="M 10 260 Q 230 260 230 10" fill="transparent" />
            </defs>
            
            {/* The structural blueprint lines */}
            <path
              d="M 10 260 Q 230 260 230 10"
              fill="transparent"
              stroke="currentColor"
              className="text-primary/20"
              strokeWidth="1"
            />
            
            <line
              x1="10"
              y1="260"
              x2="250"
              y2="260"
              stroke="currentColor"
              className="text-primary/30"
              strokeWidth="1"
            />

            {/* The Text */}
            <text className="font-mono text-xs fill-neutral-300 tracking-[0.2em] uppercase">
              <textPath href="#curvePath" startOffset="5%">
                {t("lessIsMore")}
              </textPath>
            </text>

            {/* The X-Axis Author */}
            <text x="10" y="280" className="font-mono text-[10px] fill-primary tracking-[0.2em] uppercase">
              {t("quoteAuthor")}
            </text>
          </svg>
        </motion.div>

      </div>
    </section>
  );
}
