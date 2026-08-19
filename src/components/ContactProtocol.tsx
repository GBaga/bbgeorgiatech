"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Terminal, Lock, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { transmitPayloadAction } from "../actions/transmit-payload";
import { useTranslations } from "next-intl";

export function ContactProtocol() {
  const t = useTranslations("ContactProtocol");
  const [status, setStatus] = useState<"idle" | "transmitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("transmitting");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const result = await transmitPayloadAction(formData);

    if (result.error) {
      setStatus("error");
      setErrorMessage(result.error);
    } else {
      setStatus("success");
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setStatus("idle"), 10000);
    }
  }
  return (
    <section className="relative py-32 px-6 bg-background-deep overflow-hidden border-t border-white/5">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 pointer-events-none lucien-blueprint opacity-30" />
      
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24">
        
        {/* Left side: Context & Status */}
        <div className="flex-1 space-y-12 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-primary animate-pulse" />
              <h3 className="font-mono text-sm tracking-widest text-primary uppercase">Sys_Protocol 04</h3>
            </div>
            <h2 className="font-logo text-5xl md:text-7xl lg:text-[80px] font-bold text-neutral-50 mb-8 tracking-tighter uppercase leading-[0.9]">
              {t("title1")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-neutral-500 to-neutral-800">{t("title2")}</span>
            </h2>
            <p className="font-mono text-neutral-400 text-sm md:text-base leading-relaxed border-l-2 border-primary/50 pl-6 py-2 bg-gradient-to-r from-primary/5 to-transparent">
              {t("desc")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-6 font-mono text-[10px] sm:text-xs text-neutral-500 tracking-widest uppercase"
          >
            <div className="p-4 sm:p-6 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
              <ShieldCheck className="w-5 h-5 text-primary mb-4" />
              <div className="text-white mb-2">{t("encryptTitle")}</div>
              <div className="text-neutral-600">RSA-4096 / TLS 1.3</div>
            </div>
            <div className="p-4 sm:p-6 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
              <Lock className="w-5 h-5 text-primary mb-4" />
              <div className="text-white mb-2">{t("privacyTitle")}</div>
              <div className="text-neutral-600">{t("privacyVal")}</div>
            </div>
          </motion.div>
        </div>

        {/* Right side: The Brutalist Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex-1 w-full flex items-center"
        >
          <div className="w-full border border-white/10 bg-background-deep relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            {/* Terminal Top Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.02]">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-3 h-3 bg-primary/20 border border-primary/50" />
              </div>
              <div className="font-mono text-[10px] text-primary tracking-[0.2em]">
                SECURE_TERMINAL_V1.0
              </div>
            </div>

            <form
              className="p-6 sm:p-10 space-y-8"
              onSubmit={handleSubmit}
            >
              <div className="space-y-8">
                <div className="group relative">
                  <label htmlFor="identifier" className="absolute -top-3 left-4 bg-background-deep px-2 text-[10px] font-mono text-neutral-400 group-focus-within:text-primary transition-colors tracking-widest z-10">
                    [01] YOUR_NAME
                  </label>
                  <input
                    type="text"
                    id="identifier"
                    name="identifier"
                    required
                    className="w-full bg-transparent border border-white/10 px-5 py-5 text-neutral-50 focus:outline-none focus:border-primary transition-colors font-mono text-sm placeholder:text-neutral-600"
                    placeholder={t("placeholder1")}
                  />
                  <div className="absolute top-0 left-0 w-[2px] h-0 bg-primary transition-all duration-300 group-focus-within:h-full" />
                </div>
                
                <div className="group relative">
                  <label htmlFor="transmission" className="absolute -top-3 left-4 bg-background-deep px-2 text-[10px] font-mono text-neutral-400 group-focus-within:text-primary transition-colors tracking-widest z-10">
                    [02] YOUR_EMAIL
                  </label>
                  <input
                    type="email"
                    id="transmission"
                    name="transmission"
                    required
                    className="w-full bg-transparent border border-white/10 px-5 py-5 text-neutral-50 focus:outline-none focus:border-primary transition-colors font-mono text-sm placeholder:text-neutral-600"
                    placeholder={t("placeholder2")}
                  />
                  <div className="absolute top-0 left-0 w-[2px] h-0 bg-primary transition-all duration-300 group-focus-within:h-full" />
                </div>

                <div className="group relative">
                  <label htmlFor="payload" className="absolute -top-3 left-4 bg-background-deep px-2 text-[10px] font-mono text-neutral-400 group-focus-within:text-primary transition-colors tracking-widest z-10">
                    [03] YOUR_PROJECT
                  </label>
                  <textarea
                    id="payload"
                    name="payload"
                    required
                    rows={5}
                    className="w-full bg-transparent border border-white/10 px-5 py-5 text-neutral-50 focus:outline-none focus:border-primary transition-colors font-mono text-sm resize-none placeholder:text-neutral-600 leading-relaxed"
                    placeholder={t("placeholder3")}
                  ></textarea>
                  <div className="absolute top-0 left-0 w-[2px] h-0 bg-primary transition-all duration-300 group-focus-within:h-full" />
                </div>
              </div>

              {status === "error" && errorMessage && (
                <div className="p-4 border border-red-500/20 bg-red-500/5 text-red-400 font-mono text-xs flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{t("errorPrefix")} {errorMessage}</p>
                </div>
              )}

              {status === "success" && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border border-primary/20 bg-primary/5 text-primary font-mono text-xs flex items-start gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-2">
                    <p>{t("success1")}</p>
                    <div className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-bold tracking-wider uppercase text-[10px] flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{t("success2")}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={status === "transmitting" || status === "success"}
                className="group relative w-full flex items-center justify-between px-8 py-5 bg-white/[0.02] border border-white/10 hover:border-primary transition-all duration-500 overflow-hidden cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-white/10"
              >
                <div className="absolute inset-0 w-0 bg-primary transition-all duration-500 ease-out group-hover:w-full z-0 group-disabled:w-0" />
                <span className="relative z-10 font-mono text-sm text-neutral-400 group-hover:text-background-deep group-disabled:group-hover:text-neutral-400 font-bold tracking-[0.2em] transition-colors duration-500">
                  {status === "idle" && t("btnIdle")}
                  {status === "transmitting" && t("btnTx")}
                  {status === "success" && t("btnSuccess")}
                  {status === "error" && t("btnError")}
                </span>
                
                {status === "idle" && <ArrowRight className="relative z-10 w-5 h-5 text-primary group-hover:text-background-deep group-disabled:group-hover:text-primary group-hover:translate-x-2 transition-all duration-500" />}
                {status === "transmitting" && <div className="relative z-10 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin group-hover:border-background-deep group-hover:border-t-transparent" />}
                {status === "success" && <CheckCircle2 className="relative z-10 w-5 h-5 text-green-500" />}
                {status === "error" && <AlertCircle className="relative z-10 w-5 h-5 text-red-500" />}
              </button>
            </form>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
