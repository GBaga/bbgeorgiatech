"use client";

import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

export function ContactProtocol() {
  return (
    <section className="relative py-24 px-6 bg-surface">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-neutral-50 mb-4">
            Initiate Protocol
          </h2>
          <p className="font-inter text-neutral-400">
            Secure a transmission channel. We deploy exclusively for sophisticated stakeholders.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6 lucien-card p-8 md:p-12 rounded-none"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="identifier" className="text-sm font-mono text-neutral-400 block">
                [01] IDENTIFIER (Name/Company)
              </label>
              <input
                type="text"
                id="identifier"
                className="w-full bg-surface border border-white/10 rounded-none px-4 py-3 text-neutral-50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-inter"
                placeholder="Enter identifier..."
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="transmission" className="text-sm font-mono text-neutral-400 block">
                [02] TRANSMISSION LINK (Email)
              </label>
              <input
                type="email"
                id="transmission"
                className="w-full bg-surface border border-white/10 rounded-none px-4 py-3 text-neutral-50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-inter"
                placeholder="Enter email..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="payload" className="text-sm font-mono text-neutral-400 block">
              [03] PAYLOAD (Project Details)
            </label>
            <textarea
              id="payload"
              rows={4}
              className="w-full bg-surface border border-white/10 rounded-none px-4 py-3 text-neutral-50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-inter resize-none"
              placeholder="Describe the operational parameters..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full group relative inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white transition-all duration-200 bg-primary border border-transparent rounded-none hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background-deep"
          >
            <span className="relative z-10 flex items-center gap-2">
              Transmit Data <Terminal className="w-4 h-4 transition-all group-hover:translate-x-1 group-hover:scale-110" />
            </span>
          </button>
        </motion.form>
      </div>
    </section>
  );
}
