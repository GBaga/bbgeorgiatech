"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ShieldCheck, Clock, Landmark, FileX } from "lucide-react";

export function ParadoxOfScale() {
  const t = useTranslations("ParadoxOfScale");

  return (
    <section className="relative py-32 px-6 bg-[#04081c] overflow-hidden">
      {/* Lucien-Style ASCII Matrix Background */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        {/* Core Radial Glow */}
        <div className="absolute w-[80vw] max-w-[1200px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-70" />
        
        {/* ASCII Repeating Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-20 mix-blend-screen"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='24' viewBox='0 0 200 24' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='0' y='16' fill='%235c9cff' font-family='monospace' font-size='12' letter-spacing='4'%3E%2F%5C%2F%5C%2000%20%3D%3D%20%2F%2F%20%2B%2B%3C%2Ftext%3E%3C/svg%3E")`,
            backgroundSize: '200px 24px',
            backgroundRepeat: 'repeat',
            maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 70%)'
          }}
        />
      </div>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-neutral-50 mb-12">
            {t("title")}
          </h2>
          
          <blockquote className="relative p-8 md:p-12 mb-12">
            <div className="absolute top-0 left-0 text-6xl text-primary/20 font-heading">&ldquo;</div>
            <p className="font-heading text-2xl md:text-4xl text-neutral-200 font-light italic leading-snug relative z-10">
              {t("quote")}
            </p>
            <footer className="mt-6 text-primary font-mono text-sm tracking-widest uppercase">
              {t("author")}
            </footer>
          </blockquote>

          <div className="space-y-6 text-lg text-neutral-400 font-inter leading-relaxed max-w-3xl mx-auto">
            <p>
              {t("p1")}
            </p>
            <p>
              {t("p2")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 font-mono text-left">
            <div className="p-4 sm:p-5 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors relative overflow-hidden group">
              <ShieldCheck className="w-5 h-5 text-primary mb-3 sm:mb-4 relative z-10" />
              <div className="text-white text-xs sm:text-sm font-bold mb-1 relative z-10">{t("badge1Title")}</div>
              <div className="text-neutral-500 text-[10px] sm:text-xs uppercase tracking-widest relative z-10">{t("badge1Val")}</div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="p-4 sm:p-5 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors relative overflow-hidden group">
              <Clock className="w-5 h-5 text-primary mb-3 sm:mb-4 relative z-10" />
              <div className="text-white text-xs sm:text-sm font-bold mb-1 relative z-10">{t("badge2Title")}</div>
              <div className="text-neutral-500 text-[10px] sm:text-xs uppercase tracking-widest relative z-10">{t("badge2Val")}</div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="p-4 sm:p-5 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors relative overflow-hidden group">
              <Landmark className="w-5 h-5 text-primary mb-3 sm:mb-4 relative z-10" />
              <div className="text-white text-xs sm:text-sm font-bold mb-1 relative z-10">{t("badge3Title")}</div>
              <div className="text-neutral-500 text-[10px] sm:text-xs uppercase tracking-widest relative z-10">{t("badge3Val")}</div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="p-4 sm:p-5 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors relative overflow-hidden group">
              <FileX className="w-5 h-5 text-primary mb-3 sm:mb-4 relative z-10" />
              <div className="text-white text-xs sm:text-sm font-bold mb-1 relative z-10">{t("badge4Title")}</div>
              <div className="text-neutral-500 text-[10px] sm:text-xs uppercase tracking-widest relative z-10">{t("badge4Val")}</div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
