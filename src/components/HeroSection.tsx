"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const GridLight = () => {
  const [pathData, setPathData] = useState<{ d: string, w: number, h: number } | null>(null);

  useEffect(() => {
    generateAndSetPath();
  }, []);

  const generateAndSetPath = () => {
    const gridSize = 60;
    const w = window.innerWidth;
    const h = window.innerHeight;
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

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-24 pb-12 lucien-blueprint">
      <GridLight />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight text-neutral-50 leading-tight">
            Engineering Next-Gen <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Digital Experiences
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-neutral-400 font-inter max-w-2xl mx-auto"
        >
          High-tech, futuristic, precise, and professional. We build scalable
          digital ecosystems for sophisticated stakeholders.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <button className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white transition-all duration-200 bg-primary border border-transparent rounded-none hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background-deep overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              Initiate Protocol <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
