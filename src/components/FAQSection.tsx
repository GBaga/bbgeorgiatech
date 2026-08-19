"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export function FAQSection() {
  const t = useTranslations("FAQSection");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
  ];

  return (
    <section className="relative py-24 px-6 bg-background overflow-hidden border-t border-white/5">
      <div className="max-w-4xl mx-auto relative z-10">
        
        <div className="flex flex-col items-center mb-16">
          <HelpCircle className="w-8 h-8 text-primary mb-4 opacity-80" />
          <h2 className="font-logo text-3xl md:text-5xl font-bold text-neutral-50 uppercase tracking-tighter text-center">
            {t("title1")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">{t("title2")}</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`border transition-colors duration-300 ${isOpen ? 'border-primary/50 bg-white/[0.02]' : 'border-white/10 bg-background-deep hover:border-white/20'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 md:p-8 focus:outline-none"
                >
                  <div className="flex items-center gap-4 text-left">
                    <span className="font-mono text-sm text-primary opacity-60 shrink-0">
                      Q{index + 1}
                    </span>
                    <span className={`font-logo text-lg md:text-xl font-bold transition-colors ${isOpen ? 'text-primary' : 'text-neutral-200'}`}>
                      {faq.q}
                    </span>
                  </div>
                  <div className={`shrink-0 ml-4 p-2 border transition-colors ${isOpen ? 'border-primary text-primary bg-primary/10' : 'border-white/10 text-neutral-500'}`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
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

      </div>
    </section>
  );
}
