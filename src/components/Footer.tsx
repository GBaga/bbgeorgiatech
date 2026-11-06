import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "../i18n/routing";
import { READY_VERTICALS } from "../data/verticals";
import { CONTACT_HREF, LEGAL_LINKS, NAV_LINKS } from "../data/navigation";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

function ColumnLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-1.5 h-1.5 bg-primary" aria-hidden="true" />
      <div className="font-mono text-xs tracking-[0.2em] text-primary uppercase">{children}</div>
    </div>
  );
}

export function Footer() {
  const t = useTranslations("Footer");
  const tv = useTranslations("Verticals");

  const tn = useTranslations("Navigation");

  // Same pages, labels and order as the header, plus contact.
  const links = [
    ...NAV_LINKS.map((l) => ({ label: tn(l.key), href: l.href })),
    { label: tn("contact"), href: CONTACT_HREF },
  ];

  return (
    <footer className="relative pt-32 pb-8 px-6 bg-background-deep overflow-hidden border-t border-white/5">
      {/* Raw Technical Brutalist Texture */}
      <div className="absolute inset-0 z-0 pointer-events-none lucien-blueprint opacity-20" />

      <div className="relative z-10 max-w-[1400px] mx-auto">
        {/* One row: site pages, industry pages, socials. */}
        <div className="grid gap-12 md:grid-cols-[auto_1fr_auto] md:gap-16 lg:gap-24 mb-16 px-4">
          <div>
            <ColumnLabel>{t("pages")}</ColumnLabel>
            <nav aria-label={t("pages")} className="flex flex-col gap-3">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="group flex items-center gap-2 font-mono text-sm text-neutral-400 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-3 h-3 shrink-0 text-primary group-hover:translate-x-1 transition-all" aria-hidden="true" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <ColumnLabel>{tv("ui.industries")}</ColumnLabel>
            <nav aria-label={tv("ui.industries")} className="grid grid-cols-2 gap-x-8 gap-y-3 lg:max-w-xl">
              {READY_VERTICALS.map((v) => (
                <Link
                  key={v.slug}
                  href={`/for/${v.slug}`}
                  className="group flex items-start gap-2 font-inter text-sm leading-snug text-neutral-500 hover:text-white transition-colors"
                >
                  <span
                    className="mt-[0.45em] w-1 h-1 shrink-0 transition-transform group-hover:scale-150"
                    style={{ backgroundColor: v.accent }}
                    aria-hidden="true"
                  />
                  {tv(`${v.key}.name`)}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-6 md:items-start">
            <a href="https://github.com/GBaga" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors group" aria-label="GitHub">
              <GithubIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
            <a href="https://www.linkedin.com/in/goga-bagauri" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors group" aria-label="LinkedIn">
              <LinkedinIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>

        {/* Legal links and copyright */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 px-4 pt-6 border-t border-white/5">
          <nav aria-label={t("legal")} className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.key} href={l.href} className="font-mono text-xs text-neutral-500 hover:text-white transition-colors">
                {t(l.key)}
              </Link>
            ))}
          </nav>
          <div className="font-mono text-xs text-neutral-500">
            © {new Date().getFullYear()} BBGeorgiaTech. {t("allRightsReserved")}
          </div>
        </div>

        {/* Massive Brand Name */}
        <div className="w-full select-none pointer-events-none overflow-hidden mt-12">
          <h2 className="flex justify-between w-full font-logo text-[6.5vw] xl:text-[95px] text-neutral-50 leading-none tracking-tighter opacity-95">
            {"BBGEORGIATECH".split("").map((char, index) => (
              <span key={index}>{char}</span>
            ))}
          </h2>
        </div>
      </div>
    </footer>
  );
}
