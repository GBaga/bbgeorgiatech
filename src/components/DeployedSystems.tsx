"use client";

import { motion } from "framer-motion";
import { Terminal, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function DeployedSystems() {
  const t = useTranslations("DeployedSystems");

  const systems = [
    {
      id: "SYS.TR",
      sector: "BBGeorgiaTravel",
      architecture: "Next.js, MongoDB, Cloudinary",
      metric: t("m3"),
      status: "ACTIVE",
      url: "https://bbgeorgiatravel.com/",
      image: "/bbgeorgiatravel.webp"
    },
    {
      id: "SYS.PG",
      sector: "POG League",
      architecture: "Next.js 16, Sanity.io, NextAuth",
      metric: t("m5"),
      status: "ACTIVE",
      url: "https://pog-football.vercel.app/",
      image: "/pog-football.webp"
    },
    {
      id: "SYS.KC",
      sector: "KC Legal",
      architecture: "Next.js, Tailwind v4",
      metric: t("m1"),
      status: "ACTIVE",
      url: "https://kc-legal.vercel.app/en",
      image: "/KC-legal.webp"
    },
    {
      id: "SYS.GZ",
      sector: "Giga's Remonti",
      architecture: "Next.js, Sanity.io",
      metric: t("m2"),
      status: "ACTIVE",
      url: "https://gigas-remonti.vercel.app/en",
      image: "/gigas-remonti.webp"
    },
    // Test change to trigger deployment
    {
      id: "SYS.VO",
      sector: "VoriginGeorgia",
      architecture: "NestJS, MongoDB Atlas",
      metric: t("m4"),
      status: "INACTIVE",
      image: "/vorigin-georgia.webp"
    }
  ];

  return (
    <section id="systems" className="py-32 relative bg-background border-t border-white/5 lucien-blueprint">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-mono tracking-[0.2em] text-primary uppercase">
              {"// Execution Log"}
            </h2>
          </div>
          <h3 className="text-4xl md:text-6xl font-heading font-bold text-neutral-50 tracking-tight uppercase">
            {t("title1")} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">{t("title2")}</span>
          </h3>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {systems.map((sys, idx) => (
            <motion.div
              key={sys.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="group border border-white/10 bg-background-deep hover:border-primary/50 transition-colors duration-500 overflow-hidden relative"
            >
              {/* Image Placeholder */}
              <div className="aspect-video bg-white/5 relative border-b border-white/10 overflow-hidden flex items-center justify-center">
                {sys.image ? (
                  <Image src={sys.image} alt={`${sys.sector} website preview`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105 transform" />
                ) : (
                  <div className="font-mono text-neutral-600 text-sm tracking-widest uppercase text-center px-4">
                    [ AWAITING_VISUAL_ASSET ]
                  </div>
                )}
                {/* Overlay Accent */}
                <div className="absolute inset-0 bg-gradient-to-t from-background-deep to-transparent opacity-50 pointer-events-none" />
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="font-mono text-xs text-primary tracking-widest mb-2">{sys.id}</div>
                    <h4 className="font-logo text-2xl font-bold text-neutral-50">{sys.sector}</h4>
                  </div>
                  {sys.url && (
                    <a href={sys.url} target="_blank" rel="noopener noreferrer" className="p-3 border border-white/10 bg-white/5 hover:bg-primary/10 hover:border-primary/50 text-neutral-400 hover:text-primary transition-all duration-300" aria-label={`Visit ${sys.sector} website`}>
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
                
                <p className="font-inter text-neutral-400 text-sm leading-relaxed mb-6">
                  {sys.metric}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-white/10 pt-6 gap-4">
                  <div className="font-mono text-xs text-neutral-500 tracking-wider">
                    {sys.architecture}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 ${sys.status === 'ACTIVE' ? 'bg-primary shadow-[0_0_8px_rgba(92,156,255,0.8)]' : 'bg-neutral-600'}`} />
                    <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
                      {sys.status}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Hover effect lines */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
