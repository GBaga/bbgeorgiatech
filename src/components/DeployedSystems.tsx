"use client";

import { motion } from "framer-motion";
import { Terminal, ExternalLink } from "lucide-react";

const systems = [
  {
    id: "SYS.KC",
    sector: "KC Legal",
    architecture: "Next.js, Tailwind v4",
    metric: "Engineered secure digital presence for high-trust premium client conversion.",
    status: "ACTIVE",
    url: "https://kc-legal.vercel.app/en"
  },
  {
    id: "SYS.GZ",
    sector: "Giza Remonti",
    architecture: "Next.js, Sanity.io",
    metric: "Implemented high-fidelity motion architecture with headless CMS content modeling.",
    status: "ACTIVE",
    url: "https://giza-remonti.vercel.app/"
  },
  {
    id: "SYS.TR",
    sector: "BBGeorgiaTravel",
    architecture: "Next.js, MongoDB, Cloudinary",
    metric: "Deployed scalable global routing with NoSQL data mapping and dynamic edge assets.",
    status: "ACTIVE",
    url: "https://bbgeorgiatravel.com/"
  },
  {
    id: "SYS.VO",
    sector: "VoriginGeorgia",
    architecture: "NestJS, MongoDB Atlas",
    metric: "Architected robust backend microservices for complex NoSQL data routing.",
    status: "INACTIVE",
  }
];

export function DeployedSystems() {
  return (
    <section id="systems" className="py-32 relative bg-background border-t border-white/5 lucien-blueprint">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-mono tracking-[0.2em] text-primary uppercase">
              // Execution Log
            </h2>
          </div>
          <h3 className="text-4xl md:text-6xl font-heading font-bold text-neutral-50 tracking-tight uppercase">
            Deployed <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Systems</span>
          </h3>
        </div>

        {/* The Ledger */}
        <div className="w-full overflow-x-auto border border-white/10 bg-background-deep/50 backdrop-blur-sm scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-white/10 text-xs font-mono text-neutral-500 tracking-wider">
                <th className="py-6 px-6 font-normal whitespace-nowrap">[ PROTOCOL_ID ]</th>
                <th className="py-6 px-6 font-normal whitespace-nowrap">[ ECOSYSTEM ]</th>
                <th className="py-6 px-6 font-normal whitespace-nowrap">[ ARCHITECTURE ]</th>
                <th className="py-6 px-6 font-normal whitespace-nowrap">[ METRIC ]</th>
                <th className="py-6 px-6 font-normal whitespace-nowrap">[ STATUS ]</th>
              </tr>
            </thead>
            <tbody>
              {systems.map((sys, idx) => (
                <motion.tr 
                  key={sys.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group cursor-crosshair"
                >
                  <td className="py-6 px-6 font-mono text-primary group-hover:text-white transition-colors">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity mr-2 text-primary">{`>`}</span>
                    {sys.id}
                  </td>
                  <td className="py-6 px-6 font-heading text-lg text-neutral-50">
                    {sys.url ? (
                      <a 
                        href={sys.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        {sys.sector}
                        <ExternalLink className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </a>
                    ) : (
                      <span>{sys.sector}</span>
                    )}
                  </td>
                  <td className="py-6 px-6 font-mono text-sm text-neutral-400">
                    {sys.architecture}
                  </td>
                  <td className="py-6 px-6 font-sans text-sm text-neutral-300">
                    {sys.metric}
                  </td>
                  <td className="py-6 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-none ${sys.status === 'ACTIVE' ? 'bg-primary shadow-[0_0_8px_rgba(92,156,255,0.8)]' : 'bg-neutral-600'}`} />
                      <span className="font-mono text-xs tracking-widest text-neutral-500">
                        {sys.status}
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
}
