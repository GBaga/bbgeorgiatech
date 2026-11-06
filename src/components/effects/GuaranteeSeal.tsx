"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

// A round seal with a slowly turning ring of text that "stamps" itself onto
// the guarantee card when it scrolls into view.
export function GuaranteeSeal({ text, className = "" }: { text: string; className?: string }) {
  const ring = `${text} · `;
  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
      initial={{ opacity: 0, scale: 1.5, rotate: -18 }}
      whileInView={{ opacity: 1, scale: 1, rotate: -8 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 320, damping: 16, delay: 0.3 }}
    >
      <div className="relative h-28 w-28 md:h-32 md:w-32">
        <svg viewBox="0 0 120 120" className="seal-spin absolute inset-0 h-full w-full">
          <defs>
            <path id="seal-ring" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
          </defs>
          <circle cx="60" cy="60" r="58" fill="none" stroke="#5c9cff" strokeOpacity="0.5" />
          <circle cx="60" cy="60" r="34" fill="none" stroke="#5c9cff" strokeOpacity="0.35" strokeDasharray="2 3" />
          <text className="font-mono uppercase" fontSize="8.5" letterSpacing="2" fill="#5c9cff">
            <textPath href="#seal-ring" textLength="285">{ring}</textPath>
          </text>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-primary">
          <ShieldCheck className="w-9 h-9" strokeWidth={1.5} />
        </div>
      </div>
    </motion.div>
  );
}
