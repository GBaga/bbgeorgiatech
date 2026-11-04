"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, Lock } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

type Project = {
  key: string;
  name: string;
  category: string;
  headline: string;
  description: string;
  stack: string[];
  url?: string;
  image: string;
  accent: string;
};

function hostOf(url?: string) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

const pad = (n: number) => String(n).padStart(2, "0");

function BrowserFrame({ project, priority }: { project: Project; priority?: boolean }) {
  const host = hostOf(project.url);
  return (
    <div className="relative border border-white/10 bg-background-deep shadow-2xl shadow-black/50 overflow-hidden">
      <div className="flex items-center gap-3 px-4 h-8 border-b border-white/10 bg-white/[0.03]">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="w-2 h-2 bg-white/20" />
          <span className="w-2 h-2 bg-white/20" />
          <span className="w-2 h-2" style={{ backgroundColor: project.accent }} />
        </div>
        <div className="flex-1 min-w-0 flex items-center justify-center">
          <div className="flex items-center gap-1.5 max-w-full px-3 py-0.5 border border-white/10 font-mono text-[11px] text-neutral-400">
            <Lock className="w-3 h-3 shrink-0" aria-hidden="true" />
            <span className="truncate">{host ?? "internal.api"}</span>
          </div>
        </div>
        <div className="w-[42px]" aria-hidden="true" />
      </div>
      <div className="relative aspect-[16/10] bg-white/5">
        <Image
          src={project.image}
          alt={`${project.name} website preview`}
          fill
          sizes="(min-width: 1024px) 560px, 90vw"
          priority={priority}
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}

function StackCard({
  project,
  index,
  total,
  progress,
  visitLabel,
  pausedLabel,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
  visitLabel: string;
  pausedLabel: string;
}) {
  const reduceMotion = useReducedMotion();
  // Once the next card starts sliding over this one, shrink and dim it a bit
  // so the pile reads as a deck. Cards further back end up smaller.
  const depth = total - 1 - index;
  const range = [index / total, 1];
  const scale = useTransform(progress, range, [1, 1 - depth * 0.04]);
  const dim = useTransform(progress, range, [0, Math.min(depth * 0.15, 0.45)]);

  return (
    <div
      className="sticky top-[calc(5.5rem_+_var(--i)*0.75rem)] md:top-[calc(7rem_+_var(--i)*1.25rem)] [&:not(:last-child)]:mb-[12vh]"
      style={{ ["--i" as string]: index }}
    >
      <motion.article
        style={reduceMotion ? undefined : { scale }}
        className="relative origin-top overflow-hidden border border-white/10 bg-gradient-to-b from-surface-bright to-surface p-5 sm:p-8 lg:p-10 shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.6)]"
      >
        {/* Accent light in the corner */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-1/3 -right-1/4 h-[120%] w-[80%] opacity-20 blur-3xl"
          style={{ background: `radial-gradient(closest-side, ${project.accent}, transparent)` }}
        />
        {/* Accent bar on the left edge, same motif as the services list */}
        <div aria-hidden="true" className="pointer-events-none absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: project.accent }} />

        <div className="relative grid gap-6 lg:gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center">
          <div className="order-2 lg:order-1 flex flex-col">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 shrink-0 flex items-center justify-center border border-white/10 bg-background-deep" aria-hidden="true">
                <div className="w-1.5 h-1.5" style={{ backgroundColor: project.accent }} />
              </div>
              <span className="font-mono text-sm text-primary">{pad(index + 1)}</span>
              <div className="h-px flex-1 bg-white/10" aria-hidden="true" />
              {!project.url && (
                <span className="border border-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-500">
                  {pausedLabel}
                </span>
              )}
            </div>

            <div className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">{project.category}</div>
            <h3 className="mt-2 font-logo text-2xl md:text-3xl uppercase tracking-tighter text-neutral-50">{project.name}</h3>
            <div className="mt-3 font-heading text-lg md:text-xl font-semibold" style={{ color: project.accent }}>
              {project.headline}
            </div>
            <p className="mt-4 text-sm md:text-base text-neutral-400 leading-relaxed line-clamp-3 md:line-clamp-none">
              {project.description}
            </p>

            <ul className="mt-5 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <li key={s} className="border border-white/10 bg-background-deep/60 px-2.5 py-1 font-mono text-[11px] text-neutral-400">
                  {s}
                </li>
              ))}
            </ul>

            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${visitLabel}: ${project.name}`}
                className="group/link mt-7 inline-flex w-fit items-center gap-2 border-2 border-primary/50 px-5 py-2.5 font-mono text-sm uppercase tracking-wider text-primary transition-all hover:bg-primary hover:text-white"
              >
                {visitLabel}
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </a>
            )}
          </div>

          <div className="order-1 lg:order-2">
            <BrowserFrame project={project} priority={index === 0} />
          </div>
        </div>

        {/* Darkens the card as it sinks into the stack */}
        {!reduceMotion && depth > 0 && (
          <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#050820]" style={{ opacity: dim }} />
        )}
      </motion.article>
    </div>
  );
}

export function DeployedSystems() {
  const t = useTranslations("DeployedSystems");
  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ["start start", "end end"] });

  const projects: Project[] = [
    {
      key: "kc",
      name: "KC Legal",
      category: t("c1"),
      headline: t("h1"),
      description: t("m1"),
      stack: ["Next.js", "Tailwind v4"],
      url: "https://www.kclegal.ge/ka",
      image: "/KC-legal.webp",
      accent: "#c9a45c",
    },
    {
      key: "giga",
      name: "Giga's Remonti",
      category: t("c2"),
      headline: t("h2"),
      description: t("m2"),
      stack: ["Next.js", "Sanity.io"],
      url: "https://gigas-remonti.vercel.app/en",
      image: "/gigas-remonti.webp",
      accent: "#f59e0b",
    },
    {
      key: "travel",
      name: "BBGeorgiaTravel",
      category: t("c3"),
      headline: t("h3"),
      description: t("m3"),
      stack: ["Next.js", "MongoDB", "Cloudinary"],
      url: "https://bbgeorgiatravel.com/",
      image: "/bbgeorgiatravel.webp",
      accent: "#2dd4bf",
    },
    {
      key: "pog",
      name: "POG League",
      category: t("c4"),
      headline: t("h4"),
      description: t("m5"),
      stack: ["Next.js 16", "Sanity.io", "NextAuth"],
      url: "https://pog-football.vercel.app/",
      image: "/pog-football.webp",
      accent: "#22c55e",
    },
    {
      key: "vorigin",
      name: "VoriginGeorgia",
      category: t("c5"),
      headline: t("h5"),
      description: t("m4"),
      stack: ["NestJS", "MongoDB Atlas", "AWS S3"],
      image: "/vorigin-georgia.webp",
      accent: "#8b5cf6",
    },
  ];

  return (
    // overflow-x-clip (not hidden): hidden would make this a scroll container
    // and break the sticky stacking below.
    <section id="systems" className="py-24 md:py-32 relative bg-background border-t border-white/5 lucien-blueprint overflow-x-clip">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px]"
        style={{ background: "radial-gradient(40% 60% at 15% 0%, rgba(92,156,255,0.12), transparent)" }}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="mb-14 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-1.5 bg-primary" aria-hidden="true" />
              <div className="font-mono text-xs tracking-[0.2em] text-primary uppercase">{t("eyebrow")}</div>
            </div>
            <h2 className="font-logo text-4xl md:text-6xl text-primary uppercase tracking-tighter">
              {t("title2")}
            </h2>
            <p className="mt-4 max-w-xl text-neutral-400 leading-relaxed">{t("subtitle")}</p>
          </div>
          <div className="font-mono text-sm text-neutral-500" aria-hidden="true">
            <span className="text-neutral-50">{pad(projects.length)}</span> {t("projectsLabel")}
          </div>
        </div>

        {/* Sticky stacking cards */}
        <div ref={stackRef} className="relative">
          {projects.map((p, idx) => (
            <StackCard
              key={p.key}
              project={p}
              index={idx}
              total={projects.length}
              progress={scrollYProgress}
              visitLabel={t("visit")}
              pausedLabel={t("paused")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
