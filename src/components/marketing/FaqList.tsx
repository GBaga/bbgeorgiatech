"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

// Same accordion as the home page FAQ, but fed with plain props so any page
// (pricing, industry pages) can reuse it.
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {items.map((faq, index) => {
        const isOpen = openIndex === index;
        const id = `faq-panel-${index}`;
        return (
          <motion.div
            key={faq.q}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className={`border transition-colors duration-300 ${isOpen ? "border-primary/50 bg-white/[0.02]" : "border-white/10 bg-background-deep hover:border-white/20"}`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              aria-controls={id}
              className="w-full flex items-center justify-between p-6 md:p-8 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              <div className="flex items-center gap-4 text-left">
                <span className="font-mono text-sm text-primary opacity-60 shrink-0">Q{index + 1}</span>
                <span className={`font-logo text-base md:text-lg transition-colors ${isOpen ? "text-primary" : "text-neutral-200"}`}>
                  {faq.q}
                </span>
              </div>
              <div className={`shrink-0 ml-4 p-2 border transition-colors ${isOpen ? "border-primary text-primary bg-primary/10" : "border-white/10 text-neutral-500"}`}>
                {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={id}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-6 md:p-8 pt-0 font-inter text-neutral-400 leading-relaxed border-t border-white/5 mt-2">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
