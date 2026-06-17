"use client";

import { motion } from "framer-motion";
import { Link2, ShieldCheck } from "lucide-react";

export function BrandHeritage() {
  return (
    <section className="relative py-32 px-6 bg-surface border-t border-white/5 overflow-hidden">
      {/* Background Brand Text */}
      <div className="absolute inset-0 z-0 flex flex-col justify-center pointer-events-none select-none w-full px-4 overflow-hidden opacity-60">
        <h2
          className="text-[11vw] xl:text-[14vw] font-logo leading-[0.85] tracking-tighter flex flex-col w-full"
          style={{
            WebkitTextStroke: "2px rgba(92, 156, 255, 0.15)",
            color: "transparent"
          }}
        >
          <span className="self-start">BB</span>
          <span className="self-center">GEORGIA</span>
          <span className="self-end">TECH</span>
        </h2>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-mono text-sm tracking-widest uppercase mb-4 block">
            Bagauri Bonds Georgia Umbrella
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-neutral-50 mb-6">
            The Human Core of High Tech
          </h2>
          <p className="font-inter text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            BBGeorgiaTech is the dedicated technology division of Bagauri Bonds Georgia. We inherit our parent company's deeply human pillars and translate them for the digital frontier.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Bonds */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-8 md:p-12 rounded-none lucien-card relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Link2 className="w-32 h-32 text-primary" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-none bg-primary/10 flex items-center justify-center text-primary">
                  <Link2 className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-neutral-50">Bonds</h3>
              </div>
              <p className="font-inter text-neutral-400 leading-relaxed">
                Technology is not about code—it's about connection. Inheriting our parent company's focus on human ties, we engineer the invisible digital threads that connect businesses to their users, creating seamless interactions across the digital landscape.
              </p>
            </div>
          </motion.div>

          {/* Bagauri */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-8 md:p-12 rounded-none lucien-card relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldCheck className="w-32 h-32 text-secondary" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-none bg-secondary/10 flex items-center justify-center text-secondary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-neutral-50">Bagauri</h3>
              </div>
              <p className="font-inter text-neutral-400 leading-relaxed">
                Roots matter, and digital experiences have architects. Bagauri represents the heritage and foundational integrity of our parent company. In a fast-moving digital world, BBGeorgiaTech builds on this legacy of craftsmanship, inviting you to engineer the next chapter of your digital history with us.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
