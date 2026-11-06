"use client";

import { useState, useEffect, useRef, type PointerEvent } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X, Terminal, ChevronDown, ChevronRight } from "lucide-react";
import { Link, usePathname } from "../i18n/routing";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { READY_VERTICALS } from "../data/verticals";
import { MONTHLY, formatUsd } from "../data/pricing";
import { CONTACT_HREF, INDUSTRIES_AFTER, NAV_LINKS, type NavKey } from "../data/navigation";

const BrandIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-neutral-50 transition-colors group flex-shrink-0">
    <path d="M 10 4 L 4 4 L 4 28 L 10 28" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" fill="none" className="group-hover:stroke-primary transition-colors duration-300" />
    <path d="M 22 4 L 28 4 L 28 28 L 22 28" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" fill="none" className="group-hover:stroke-primary transition-colors duration-300" />
    <path d="M 12 10 L 20 10 M 16 10 L 16 22" stroke="#5c9cff" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" fill="none" className="group-hover:stroke-white transition-colors duration-300" />
    <rect x="10" y="8" width="4" height="4" fill="#5c9cff" className="group-hover:fill-white group-hover:scale-[1.5] transition-all duration-300" style={{ transformOrigin: '12px 10px' }} />
    <rect x="18" y="8" width="4" height="4" fill="#5c9cff" className="group-hover:fill-white group-hover:scale-[1.5] transition-all duration-300" style={{ transformOrigin: '20px 10px' }} />
    <rect x="14" y="8" width="4" height="4" fill="#5c9cff" className="group-hover:fill-white group-hover:scale-[1.5] transition-all duration-300" style={{ transformOrigin: '16px 10px' }} />
  </svg>
);

// Everything the "you are here" indicator can point at: the shared page links
// plus the industries dropdown.
type ActiveKey = NavKey | "industries";

// Home-page section id -> the nav item it belongs to. Sections without a nav
// item (hero, process, faq…) clear the indicator.
const SECTION_TO_NAV: Record<string, ActiveKey | null> = {
  hero: null,
  competencies: "competencies",
  industries: "industries",
  process: null,
  systems: "systems",
  why: "pricing",
  pricing: "pricing",
  paradox: null,
  "tech-stack": null,
  faq: null,
  heritage: "heritage",
  contact: null,
};

// Which nav item is "where you are": the page on inner pages, the section
// crossing the middle of the viewport on the home page.
function useActiveNav(): ActiveKey | null {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [section, setSection] = useState<ActiveKey | null>(null);

  useEffect(() => {
    if (!isHome) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setSection(SECTION_TO_NAV[e.target.id] ?? null);
        }
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    for (const id of Object.keys(SECTION_TO_NAV)) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [isHome]);

  if (pathname.startsWith("/pricing")) return "pricing";
  if (pathname.startsWith("/for/")) return "industries";
  return isHome ? section : null;
}

// The square brackets that slide to the active item.
function ActiveBrackets() {
  return (
    <motion.span
      layoutId="nav-active"
      aria-hidden="true"
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      className="pointer-events-none absolute -inset-x-3 inset-y-0 flex items-center justify-between text-primary"
    >
      <motion.span layout>[</motion.span>
      <motion.span layout>]</motion.span>
    </motion.span>
  );
}

function HoverBrackets() {
  return (
    <>
      <span aria-hidden="true" className="opacity-0 group-hover:opacity-100 text-primary transition-opacity absolute -left-3">[</span>
      <span aria-hidden="true" className="opacity-0 group-hover:opacity-100 text-primary transition-opacity absolute -right-3">]</span>
    </>
  );
}

function trackPointer(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

// Desktop "Industries" dropdown: the 8 industry pages plus one featured offer.
// Opens on hover (mouse) or click/Enter; closes on leave, Escape or outside click.
function IndustriesMenu({ active, open, setOpen }: { active: boolean; open: boolean; setOpen: (v: boolean) => void }) {
  const tv = useTranslations("Verticals");
  const th = useTranslations("Home");
  const tp = useTranslations("Pricing");
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: globalThis.PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        rootRef.current?.querySelector("button")?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const enter = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const leave = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    closeTimer.current = window.setTimeout(() => setOpen(false), 160);
  };

  return (
    <div ref={rootRef} className="relative" onPointerEnter={enter} onPointerLeave={leave}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="nav-industries"
        onClick={() => setOpen(!open)}
        className={`relative group flex items-center gap-1.5 text-sm font-mono transition-colors hover:text-white ${active || open ? "text-white" : "text-neutral-400"}`}
      >
        {active ? <ActiveBrackets /> : <HoverBrackets />}
        {tv("ui.industries")}
        <ChevronDown className={`w-3.5 h-3.5 text-primary transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <div className="absolute left-1/2 top-full -translate-x-1/2 pt-6">
            <motion.div
              id="nav-industries"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-[min(44rem,calc(100vw-3rem))] overflow-hidden border border-white/10 bg-background-deep/95 backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]"
            >
              <div className="absolute inset-0 pointer-events-none lucien-blueprint opacity-30" aria-hidden="true" />
              <div className="relative grid grid-cols-[1fr_14.5rem]">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-1.5 bg-primary" aria-hidden="true" />
                    <div className="font-mono text-xs tracking-[0.2em] text-primary uppercase">{th("who.eyebrow")}</div>
                  </div>
                  <ul className="grid grid-cols-2 gap-1">
                    {READY_VERTICALS.map((v, i) => (
                      <motion.li
                        key={v.slug}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.03 * i, duration: 0.25 }}
                      >
                        <Link
                          href={`/for/${v.slug}`}
                          onClick={() => setOpen(false)}
                          onPointerMove={trackPointer}
                          style={{ ["--accent" as string]: v.accent }}
                          className="group relative flex items-start gap-3 overflow-hidden px-3 py-2.5 font-inter text-sm leading-snug text-neutral-300 transition-colors hover:bg-white/[0.03] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary"
                        >
                          <div className="accent-spotlight" aria-hidden="true" />
                          <span
                            className="relative mt-[0.45em] w-1.5 h-1.5 shrink-0 transition-transform duration-300 group-hover:scale-150"
                            style={{ backgroundColor: v.accent }}
                            aria-hidden="true"
                          />
                          <span className="relative">{tv(`${v.key}.name`)}</span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/pricing#easy-start"
                  onClick={() => setOpen(false)}
                  className="group relative flex flex-col justify-between border-l border-white/10 bg-gradient-to-b from-primary/15 to-transparent p-6 transition-colors hover:from-primary/25"
                >
                  <div>
                    <span className="inline-block border border-primary/50 bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
                      {th("pricing.popular")}
                    </span>
                    <div className="mt-4 font-heading text-sm font-semibold text-neutral-200">{tp("easy.monthly.name")}</div>
                    <div className="mt-2 flex items-baseline gap-1.5 font-logo text-3xl tracking-tighter text-neutral-50">
                      {formatUsd(MONTHLY.monthly)}
                      <span className="font-mono text-xs tracking-normal text-neutral-500 whitespace-nowrap">{tp("easy.monthly.per")}</span>
                    </div>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary group-hover:text-white transition-colors">
                    {tp("ui.getStarted")}
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function NavigationBar() {
  const t = useTranslations("Navigation");
  const tv = useTranslations("Verticals");

  const navLinks = NAV_LINKS.map((l) => ({ ...l, label: t(l.key) }));
  // The industries dropdown sits right after INDUSTRIES_AFTER (see data/navigation).
  const industriesAfter = navLinks.findIndex((l) => l.key === INDUSTRIES_AFTER);

  const active = useActiveNav();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const [mobileIndustriesOpen, setMobileIndustriesOpen] = useState(false);

  // Hide while scrolling down, come back on the slightest scroll up.
  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 50);
      if (y > 400 && y > lastY + 6) setIsHidden(true);
      else if (y < lastY - 6 || y <= 400) setIsHidden(false);
      lastY = y;
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reading progress along the bottom edge of the bar.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  const hidden = isHidden && !industriesOpen;

  const closeMobile = () => {
    setIsMobileMenuOpen(false);
    setMobileIndustriesOpen(false);
  };

  const desktopLink = (link: (typeof navLinks)[number]) => {
    const isActive = active === link.key;
    return (
      <Link
        key={link.key}
        href={link.href}
        aria-current={isActive ? (link.href.startsWith("/#") ? "location" : "page") : undefined}
        className={`text-sm font-mono hover:text-white transition-colors relative group ${isActive ? "text-white" : "text-neutral-400"}`}
      >
        {isActive ? <ActiveBrackets /> : <HoverBrackets />}
        {link.label}
      </Link>
    );
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: hidden ? "-100%" : 0 }}
        transition={{ duration: hidden ? 0.3 : 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,padding,backdrop-filter] duration-300 border-b ${
          isScrolled ? "bg-background-deep/90 backdrop-blur-xl border-white/10 py-4" : "bg-transparent border-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-4 cursor-pointer group">
            <BrandIcon />
            <div className="font-heading font-bold text-xl text-neutral-50 tracking-tight hidden sm:block">
              BBGeorgia<span className="text-primary transition-colors group-hover:text-white">Tech</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-11">
            {navLinks.slice(0, industriesAfter + 1).map(desktopLink)}
            <IndustriesMenu active={active === "industries"} open={industriesOpen} setOpen={setIndustriesOpen} />
            {navLinks.slice(industriesAfter + 1).map(desktopLink)}
          </nav>

          {/* Execution Button & Language */}
          <div className="hidden lg:flex items-center">
            <Link
              href={CONTACT_HREF}
              className="flex items-center gap-2 px-6 py-2 border-2 border-primary/50 text-primary hover:bg-primary hover:text-white font-mono text-sm uppercase tracking-wider transition-all"
            >
              <Terminal className="w-4 h-4" />
              <span>{t("initiateProtocol")}</span>
            </Link>
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden text-neutral-50 p-2" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open navigation menu">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Reading progress */}
        <motion.div
          aria-hidden="true"
          style={{ scaleX: progress }}
          className={`absolute bottom-[-1px] left-0 right-0 h-px origin-left bg-primary transition-opacity duration-300 ${isScrolled ? "opacity-100" : "opacity-0"}`}
        />
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background-deep/95 backdrop-blur-xl lg:hidden flex flex-col"
          >
            <div className={`flex-none transition-all duration-300 border-b border-white/10 ${isScrolled ? "py-4" : "py-6"}`}>
              <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-4 cursor-pointer group" onClick={closeMobile}>
                  <BrandIcon />
                  <div className="font-heading font-bold text-xl text-neutral-50 tracking-tight hidden sm:block">
                    BBGeorgia<span className="text-primary transition-colors group-hover:text-white">Tech</span>
                  </div>
                </Link>
                <button className="text-neutral-50 p-2" onClick={closeMobile} aria-label="Close navigation menu">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex flex-col flex-1 px-6 pt-16 pb-6 overflow-y-auto">
              <nav className="flex flex-col gap-8">
                {navLinks.map((link, i) => (
                  <div key={link.key} className="flex flex-col gap-8">
                    <Link
                      href={link.href}
                      onClick={closeMobile}
                      aria-current={active === link.key ? "page" : undefined}
                      className={`text-2xl font-mono hover:text-primary transition-colors flex items-center gap-4 group ${active === link.key ? "text-white" : "text-neutral-400"}`}
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-center gap-4"
                      >
                        <span className={`text-primary transition-opacity ${active === link.key ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>/</span>
                        {link.label}
                      </motion.div>
                    </Link>

                    {i === industriesAfter && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (i + 0.5) * 0.08 }}
                      >
                        <button
                          type="button"
                          aria-expanded={mobileIndustriesOpen}
                          aria-controls="mobile-industries"
                          onClick={() => setMobileIndustriesOpen((o) => !o)}
                          className={`w-full text-2xl font-mono hover:text-primary transition-colors flex items-center gap-4 group ${active === "industries" ? "text-white" : "text-neutral-400"}`}
                        >
                          <span className={`text-primary transition-opacity ${active === "industries" ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>/</span>
                          {tv("ui.industries")}
                          <ChevronDown className={`ml-auto w-5 h-5 text-primary transition-transform duration-300 ${mobileIndustriesOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                        </button>
                        <AnimatePresence initial={false}>
                          {mobileIndustriesOpen && (
                            <motion.div
                              id="mobile-industries"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              <ul className="mt-5 ml-2 grid gap-4 border-l border-white/10 pl-6 sm:grid-cols-2">
                                {READY_VERTICALS.map((v) => (
                                  <li key={v.slug}>
                                    <Link
                                      href={`/for/${v.slug}`}
                                      onClick={closeMobile}
                                      className="flex items-start gap-3 font-inter text-base leading-snug text-neutral-300 hover:text-white transition-colors"
                                    >
                                      <span className="mt-[0.5em] w-1.5 h-1.5 shrink-0" style={{ backgroundColor: v.accent }} aria-hidden="true" />
                                      {tv(`${v.key}.name`)}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </div>
                ))}

                <Link
                  href={CONTACT_HREF}
                  onClick={closeMobile}
                  className="mt-8 flex items-center justify-center gap-2 w-full py-4 border-2 border-primary text-primary hover:bg-primary hover:text-white font-mono text-lg uppercase tracking-wider transition-all"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navLinks.length + 1) * 0.08 }}
                    className="flex items-center gap-2"
                  >
                    <Terminal className="w-5 h-5" />
                    <span>{t("initiateProtocol")}</span>
                  </motion.div>
                </Link>

                {/* Mobile Language Switcher */}
                <div className="mt-4 flex justify-center pb-8 border-t border-white/5 pt-8">
                  <LanguageSwitcher />
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
