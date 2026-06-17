"use client";

import { motion } from "framer-motion";
import { Database, Server, Globe } from "lucide-react";

const services = [
  {
    title: "Decoupled Architecture",
    description: "We architect complex headless ecosystems. By separating front-end performance (Next.js) from backend logic, we build secure, infinitely scalable infrastructure.",
    icon: Server,
  },
  {
    title: "Global Edge Delivery",
    description: "We deploy on the Edge. Utilizing Vercel and Cloudflare, your digital products load instantly worldwide, completely immune to localized server failures.",
    icon: Globe,
  },
  {
    title: "Data & Asset Pipelines",
    description: "From serverless Postgres (Neon) to NoSQL scale (MongoDB Atlas) and dynamic asset optimization (Cloudinary), we build systems ready for enterprise data loads.",
    icon: Database,
  },
];

export function CoreCompetencies() {
  return (
    <section className="relative py-24 px-6 bg-background-deep overflow-hidden">
      {/* Background blueprint texture */}
      <div className="absolute inset-0 z-0 pointer-events-none lucien-blueprint opacity-10" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row border border-white/10 bg-surface/50 backdrop-blur-sm">
          
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="block lg:hidden border-b border-white/10 bg-surface p-8">
            <div className="w-10 h-10 flex items-center justify-center border border-white/10 mb-6 bg-background-deep text-primary">
              <div className="w-1.5 h-1.5 bg-primary" />
            </div>
            <h2 className="font-logo text-4xl font-bold text-neutral-50 mb-2 uppercase tracking-tighter">
              Core <span className="text-primary">Competencies</span>
            </h2>
            <p className="font-inter text-neutral-400 text-sm">
              Precision engineering for the digital frontier.
            </p>
          </div>

          {/* Sticky Left Vertical Pillar (Desktop Only) */}
          <div className="hidden lg:block w-24 xl:w-32 2xl:w-40 border-r border-white/10 bg-surface shrink-0">
            <div className="sticky top-0 h-screen flex flex-col items-center justify-between py-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="w-12 h-12 flex items-center justify-center border border-white/10 bg-background-deep text-primary shrink-0 mb-8"
              >
                <div className="w-2 h-2 bg-primary" />
              </motion.div>
              
              <motion.h2 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.08, delayChildren: 0.2 }
                  }
                }}
                className="font-logo text-[min(4vh,80px)] font-bold uppercase tracking-tighter whitespace-nowrap opacity-90 shrink-0 flex items-center" 
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                <span className="text-neutral-50 flex">
                  {"Core".split("").map((char, i) => (
                    <motion.span
                      key={`core-${i}`}
                      variants={{
                        hidden: { opacity: 0, filter: "blur(8px)", y: -20 },
                        visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { type: "spring", stiffness: 200 } }
                      }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
                <span className="mx-4 text-primary flex">
                  {"Competencies".split("").map((char, i) => (
                    <motion.span
                      key={`comp-${i}`}
                      variants={{
                        hidden: { opacity: 0, filter: "blur(8px)", y: -20 },
                        visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { type: "spring", stiffness: 200 } }
                      }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              </motion.h2>

              <div className="w-px flex-1 bg-white/10 mt-8 opacity-50" />
            </div>
          </div>

          {/* Scrolling Right Content Section */}
          <div className="w-full lg:flex-1 flex flex-col">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative p-8 md:p-16 bg-background-deep hover:bg-surface transition-colors duration-500 overflow-hidden ${
                  index !== services.length - 1 ? 'border-b border-white/10' : ''
                }`}
              >
                {/* Accent Line on hover */}
                <div className="absolute top-0 left-0 w-1 h-0 bg-primary group-hover:h-full transition-all duration-500 ease-out" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-6 mb-8">
                      <span className="font-mono text-sm text-primary">0{index + 1}</span>
                      <div className="h-px flex-1 bg-white/5" />
                    </div>
                    
                    <h3 className="font-logo text-2xl md:text-3xl font-bold text-neutral-50 tracking-tight mb-4 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    
                    <p className="font-inter text-xl text-neutral-400 leading-relaxed max-w-2xl">
                      {service.description}
                    </p>
                  </div>
                  
                  <div className="shrink-0">
                    <div className="w-16 h-16 border border-white/10 flex items-center justify-center bg-surface group-hover:border-primary group-hover:bg-primary/5 text-neutral-400 group-hover:text-primary transition-all duration-300">
                      <service.icon className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
