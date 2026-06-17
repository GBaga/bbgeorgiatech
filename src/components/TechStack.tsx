"use client";

import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

const technologies = [
  { name: "Next.js & React 19", code: "Front-End Edge Engine" },
  { name: "NestJS & Node", code: "Enterprise Backend Logic" },
  { name: "MongoDB Atlas", code: "Distributed NoSQL Data" },
  { name: "Neon (PostgreSQL)", code: "Serverless SQL Architecture" },
  { name: "Vercel & Cloudflare", code: "Global Edge Infrastructure" },
  { name: "Sanity.io & Cloudinary", code: "Decoupled Content Pipelines" },
];

export function TechStack() {
  return (
    <section className="relative py-24 px-6 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:w-1/3"
          >
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-neutral-50 mb-6">
              The Engine
            </h2>
            <p className="font-inter text-neutral-400 leading-relaxed mb-8">
              We operate exclusively on a modern, Headless Ecosystem. We don't build generic websites; we engineer highly distributed, decoupled applications ready for Enterprise scale.
            </p>
            <div className="flex items-center gap-3 text-primary font-mono text-sm">
              <Terminal className="w-5 h-5" />
              <span>System architecture validated</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {technologies.map((tech, i) => (
              <div
                key={tech.name}
                className="group p-6 rounded-none lucien-card"
              >
                <h3 className="font-heading font-semibold text-neutral-50 mb-2">{tech.name}</h3>
                <div className="font-mono text-xs text-neutral-500 bg-black/40 p-3 rounded-none group-hover:text-secondary transition-colors">
                  {tech.code}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
