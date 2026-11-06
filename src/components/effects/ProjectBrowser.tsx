"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Lock } from "lucide-react";

// A real project in a browser frame. It tilts upright as it enters the
// viewport and the screenshot drifts slowly while you scroll past it.
export function ProjectBrowser({ url, image, name, accent }: { url: string; image: string; name: string; accent: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);
  const host = new URL(url).hostname.replace(/^www\./, "");

  return (
    <div ref={ref} style={{ perspective: 1200 }}>
      <motion.div
        initial={{ rotateX: 14, rotateY: -8, y: 30, opacity: 0 }}
        whileInView={{ rotateX: 0, rotateY: 0, y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative border border-white/10 bg-background-deep shadow-2xl shadow-black/50 overflow-hidden"
        style={{ transformOrigin: "50% 100%" }}
      >
        <div className="flex items-center gap-3 px-4 h-8 border-b border-white/10 bg-white/[0.03]">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="w-2 h-2 bg-white/20" />
            <span className="w-2 h-2 bg-white/20" />
            <span className="w-2 h-2" style={{ backgroundColor: accent }} />
          </div>
          <div className="flex-1 min-w-0 flex items-center justify-center">
            <div className="flex items-center gap-1.5 max-w-full px-3 py-0.5 border border-white/10 font-mono text-[11px] text-neutral-400">
              <Lock className="w-3 h-3 shrink-0" aria-hidden="true" />
              <span className="truncate">{host}</span>
            </div>
          </div>
          <div className="w-[42px]" aria-hidden="true" />
        </div>
        <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
          <motion.div className="absolute inset-0" style={{ scale, y }}>
            <Image src={image} alt={`${name} website preview`} fill sizes="(min-width: 1024px) 560px, 90vw" className="object-cover object-top" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
