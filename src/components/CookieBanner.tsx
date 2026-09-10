"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "../i18n/routing";
import { useConsent, setConsent } from "../lib/consent";

export function CookieBanner() {
  const t = useTranslations("CookieBanner");
  const consent = useConsent();
  const isVisible = consent === null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="fixed bottom-0 left-0 right-0 z-[100] bg-background-deep border-t border-primary/30 p-4 md:p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary animate-pulse" />
                <h3 className="font-mono text-sm tracking-widest text-primary uppercase">{t("title")}</h3>
              </div>
              <p className="font-inter text-sm text-neutral-400">
                {t("descStart")}<Link href="/cookie-policy" className="text-white hover:text-primary underline underline-offset-4 transition-colors">{t("linkText")}</Link>{t("descEnd")}
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0 w-full md:w-auto">
              <button
                onClick={() => setConsent("denied")}
                className="flex-1 md:flex-none px-6 py-3 border border-white/10 text-neutral-400 hover:text-white hover:border-white/30 font-mono text-sm uppercase tracking-wider transition-colors cursor-pointer"
              >
                {t("rejectBtn")}
              </button>
              <button
                onClick={() => setConsent("granted")}
                className="flex-1 md:flex-none px-6 py-3 bg-primary text-white font-mono text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors cursor-pointer"
              >
                {t("acceptBtn")}
              </button>
              <button
                onClick={() => setConsent("denied")}
                className="p-3 text-neutral-500 hover:text-white transition-colors border border-transparent hover:border-white/10 cursor-pointer"
                aria-label="Dismiss cookie banner"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
