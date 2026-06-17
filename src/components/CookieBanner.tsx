"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("bb_cookie_consent");
    if (!consent) {
      // Small delay for dramatic effect
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("bb_cookie_consent", "true");
    setIsVisible(false);
  };

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
                <h3 className="font-mono text-sm tracking-widest text-primary uppercase">Sys_Compliance: GDPR</h3>
              </div>
              <p className="font-inter text-sm text-neutral-400">
                We utilize minimal tracking arrays (Vercel Core Vitals, GA4) to optimize infrastructure performance. 
                No intrusive profiling. Review our <a href="/cookie-policy" className="text-white hover:text-primary underline underline-offset-4 transition-colors">Cookie Policy</a>.
              </p>
            </div>
            
            <div className="flex items-center gap-4 shrink-0 w-full md:w-auto">
              <button 
                onClick={acceptCookies}
                className="flex-1 md:flex-none px-6 py-3 bg-primary text-white font-mono text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors"
              >
                [ Accept Core ]
              </button>
              <button 
                onClick={() => setIsVisible(false)}
                className="p-3 text-neutral-500 hover:text-white transition-colors border border-transparent hover:border-white/10"
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
