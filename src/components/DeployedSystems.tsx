"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";

// How long each project stays on screen before the showcase advances.
const AUTOPLAY_MS = 1000;
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

function BrowserFrame({ project, sizes, priority }: { project: Project; sizes: string; priority?: boolean }) {
  const host = hostOf(project.url);
  return (
    <div className="relative rounded-xl border border-white/10 bg-[#0d1335] shadow-2xl shadow-black/40 overflow-hidden">
      <div className="flex items-center gap-3 px-4 h-9 border-b border-white/10 bg-white/[0.03]">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        </div>
        <div className="flex-1 min-w-0 flex items-center justify-center">
          <div className="flex items-center gap-1.5 max-w-full px-3 py-0.5 rounded-md bg-white/5 font-mono text-[11px] text-neutral-400 truncate">
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
          sizes={sizes}
          priority={priority}
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}

function VisitLink({ project, label }: { project: Project; label: string }) {
  if (!project.url) return null;
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group/link inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-neutral-50 transition-colors hover:border-primary/60 hover:bg-primary/10"
      aria-label={`${label}: ${project.name}`}
    >
      {label}
      <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
    </a>
  );
}

function StackChips({ stack }: { stack: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {stack.map((s) => (
        <li key={s} className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] text-neutral-400">
          {s}
        </li>
      ))}
    </ul>
  );
}

export function DeployedSystems() {
  const t = useTranslations("DeployedSystems");
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Autoplay: advances only while the showcase is on screen, pauses while the
  // visitor hovers or focuses it, and stops for good once they pick a project
  // themselves. Disabled entirely for reduced-motion users.
  const showcaseRef = useRef<HTMLDivElement>(null);
  const inView = useInView(showcaseRef, { amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const autoplay = !reduceMotion && !stopped;
  const running = autoplay && inView && !hovering && !focused;

  const choose = (idx: number) => {
    setStopped(true);
    setActive(idx);
  };

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

  const current = projects[active];
  const pad = (n: number) => String(n).padStart(2, "0");

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    let next = idx;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (idx + 1) % projects.length;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (idx - 1 + projects.length) % projects.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = projects.length - 1;
    else return;
    e.preventDefault();
    choose(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="systems" className="py-24 md:py-32 relative bg-background border-t border-white/5 lucien-blueprint overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="font-mono text-xs tracking-[0.2em] text-primary uppercase mb-4">{t("eyebrow")}</div>
            <h2 className="text-4xl md:text-6xl font-heading font-bold text-neutral-50 tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">{t("title2")}</span>
            </h2>
            <p className="mt-4 max-w-xl text-neutral-400 leading-relaxed">{t("subtitle")}</p>
          </div>
          <div className="font-mono text-sm text-neutral-500" aria-hidden="true">
            <span className="text-neutral-50">{pad(projects.length)}</span> {t("projectsLabel")}
          </div>
        </div>

        {/* Desktop: interactive showcase */}
        <div
          ref={showcaseRef}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
          }}
          className="hidden lg:grid grid-cols-12 gap-12 items-start"
        >
          <div role="tablist" aria-orientation="vertical" aria-label={t("title2")} className="col-span-5 flex flex-col">
            {projects.map((p, idx) => {
              const selected = idx === active;
              return (
                <button
                  key={p.key}
                  ref={(el) => { tabRefs.current[idx] = el; }}
                  role="tab"
                  id={`project-tab-${p.key}`}
                  aria-selected={selected}
                  aria-controls="project-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => choose(idx)}
                  onMouseEnter={() => setActive(idx)}
                  onKeyDown={(e) => onTabKey(e, idx)}
                  className="group relative text-left py-6 pl-8 pr-4 border-b border-white/10 first:border-t focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  {selected && (
                    <motion.span
                      layoutId="project-indicator"
                      className="absolute left-0 top-0 bottom-0 w-[2px] overflow-hidden"
                      style={{ backgroundColor: autoplay ? `${p.accent}33` : p.accent }}
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    >
                      {autoplay && (
                        <span
                          key={active}
                          aria-hidden="true"
                          className="project-progress absolute inset-0 origin-top"
                          style={{
                            backgroundColor: p.accent,
                            animationDuration: `${AUTOPLAY_MS}ms`,
                            animationPlayState: running ? "running" : "paused",
                          }}
                          onAnimationEnd={() => setActive((a) => (a + 1) % projects.length)}
                        />
                      )}
                    </motion.span>
                  )}
                  <div className="flex items-baseline gap-5">
                    <span className={`font-mono text-xs transition-colors ${selected ? "text-neutral-50" : "text-neutral-600"}`}>
                      {pad(idx + 1)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div
                        className={`font-heading text-2xl xl:text-3xl font-bold tracking-tight transition-all duration-300 ${
                          selected ? "text-neutral-50 translate-x-1" : "text-neutral-500 group-hover:text-neutral-300"
                        }`}
                      >
                        {p.name}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-sm text-neutral-500">
                        <span>{p.category}</span>
                        {!p.url && (
                          <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider">
                            {t("paused")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div
            id="project-panel"
            role="tabpanel"
            aria-labelledby={`project-tab-${current.key}`}
            className="col-span-7 sticky top-28"
          >
            <div className="relative">
              {/* Accent glow shifts per project */}
              <div
                aria-hidden="true"
                className="absolute -inset-10 rounded-[3rem] blur-3xl opacity-30 transition-[background] duration-700"
                style={{ background: `radial-gradient(60% 60% at 50% 40%, ${current.accent}, transparent 70%)` }}
              />
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.key}
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.99 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  <BrowserFrame project={current} sizes="(min-width: 1280px) 720px, 58vw" priority={active === 0} />

                  <div className="mt-8 grid grid-cols-[1fr_auto] gap-6 items-start">
                    <div>
                      <div className="font-heading text-2xl font-bold" style={{ color: current.accent }}>
                        {current.headline}
                      </div>
                      <p className="mt-3 text-neutral-400 leading-relaxed">{current.description}</p>
                      <div className="mt-5">
                        <StackChips stack={current.stack} />
                      </div>
                    </div>
                    <VisitLink project={current} label={t("visit")} />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile / tablet: swipeable cards */}
        <ul className="lg:hidden -mx-4 sm:-mx-6 px-4 sm:px-6 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {projects.map((p, idx) => (
            <li key={p.key} className="snap-start shrink-0 w-[85%] sm:w-[60%]">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                className="h-full flex flex-col rounded-2xl border border-white/10 bg-background-deep/80 p-3"
              >
                <BrowserFrame project={p} sizes="(min-width: 640px) 60vw, 85vw" priority={idx === 0} />
                <div className="flex-1 flex flex-col px-2 pt-5 pb-2">
                  <div className="flex items-center justify-between gap-3 font-mono text-xs text-neutral-500">
                    <span>{pad(idx + 1)} / {pad(projects.length)}</span>
                    {!p.url && (
                      <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider">{t("paused")}</span>
                    )}
                  </div>
                  <h3 className="mt-2 font-heading text-2xl font-bold text-neutral-50">{p.name}</h3>
                  <div className="text-sm text-neutral-500">{p.category}</div>
                  <div className="mt-4 font-heading text-lg font-semibold" style={{ color: p.accent }}>{p.headline}</div>
                  <p className="mt-2 text-sm text-neutral-400 leading-relaxed">{p.description}</p>
                  <div className="mt-5"><StackChips stack={p.stack} /></div>
                  {p.url && <div className="mt-auto pt-6"><VisitLink project={p} label={t("visit")} /></div>}
                </div>
              </motion.article>
            </li>
          ))}
        </ul>
        <p className="lg:hidden mt-2 font-mono text-[11px] text-neutral-600 text-center" aria-hidden="true">{t("swipeHint")}</p>
      </div>
    </section>
  );
}
