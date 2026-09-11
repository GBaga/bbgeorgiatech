"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useTranslations } from "next-intl";

export function TestimonialsSection() {
  const t = useTranslations("TestimonialsSection");

  const testimonials = [
    {
      quote: t("t1Quote"),
      author: t("t1Author"),
      role: t("t1Role"),
    },
    {
      quote: t("t2Quote"),
      author: t("t2Author"),
      role: t("t2Role"),
    },
  ];

  return (
    <section className="relative py-24 px-6 bg-background-deep overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 z-0 pointer-events-none lucien-blueprint opacity-5" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="flex flex-col items-center mb-16 md:mb-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-1.5 bg-primary/20" />
            <div className="w-1.5 h-1.5 bg-primary/50" />
            <div className="w-1.5 h-1.5 bg-primary" />
          </div>
          <h2 className="font-logo text-3xl md:text-5xl font-bold text-neutral-50 uppercase tracking-tighter text-center">
            {t("title1")} <span className="text-primary">{t("title2")}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="relative p-8 md:p-12 border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group"
            >
              <Quote className="w-12 h-12 text-primary opacity-20 absolute top-8 left-8" />
              
              <div className="relative z-10">
                <p className="font-inter text-lg md:text-xl text-neutral-300 leading-relaxed mb-8 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                
                <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                  <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                    <span className="font-mono text-primary text-sm">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-logo font-bold text-neutral-50 text-lg">
                      {testimonial.author}
                    </h4>
                    <p className="font-mono text-xs text-neutral-500 uppercase tracking-wider">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Accent corners */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
