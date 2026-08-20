"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Terminal } from "lucide-react";
import { Link } from "../i18n/routing";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";

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

export function NavigationBar() {
  const t = useTranslations("Navigation");
  
  const navLinks = [
    { label: t("competencies"), href: "/#competencies" },
    { label: t("theEngine"), href: "/#tech-stack" },
    { label: t("systems"), href: "/#systems" },
    { label: t("heritage"), href: "/#heritage" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
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
          <nav className="hidden lg:flex items-center gap-8 xl:gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-mono text-neutral-400 hover:text-white transition-colors relative group"
              >
                <span className="opacity-0 group-hover:opacity-100 text-primary transition-opacity absolute -left-3">[</span>
                {link.label}
                <span className="opacity-0 group-hover:opacity-100 text-primary transition-opacity absolute -right-3">]</span>
              </Link>
            ))}
          </nav>

          {/* Execution Button & Language */}
          <div className="hidden lg:flex items-center">
            <Link
              href="/#contact"
              className="flex items-center gap-2 px-6 py-2 border-2 border-primary/50 text-primary hover:bg-primary hover:text-white font-mono text-sm uppercase tracking-wider transition-all"
            >
              <Terminal className="w-4 h-4" />
              <span>{t("initiateProtocol")}</span>
            </Link>
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden text-neutral-50 p-2" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background-deep/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex items-center justify-between mb-16 border-b border-white/10 pb-6">
                <Link href="/" className="flex items-center gap-4 cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>
                  <BrandIcon />
                </Link>
                <button className="text-neutral-50 p-2 border border-white/10 hover:bg-white/5 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex flex-col gap-8">
                {navLinks.map((link, i) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-mono text-neutral-400 hover:text-primary transition-colors flex items-center gap-4 group"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">/</span>
                      {link.label}
                    </motion.div>
                  </Link>
                ))}
                
                <Link
                  href="/#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-8 flex items-center justify-center gap-2 w-full py-4 border-2 border-primary text-primary hover:bg-primary hover:text-white font-mono text-lg uppercase tracking-wider transition-all"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
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
