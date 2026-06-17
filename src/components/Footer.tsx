import { ArrowRight } from "lucide-react";

export function Footer() {
  const links = [
    { label: "About", href: "#heritage" },
    { label: "Contact", href: "#contact" },
    { label: "Terms and Conditions", href: "#" },
    { label: "Privacy Policy", href: "#" },
  ];

  return (
    <footer className="relative pt-32 pb-8 px-6 bg-background-deep overflow-hidden border-t border-white/5">
      {/* Raw Technical Brutalist Texture */}
      <div className="absolute inset-0 z-0 pointer-events-none lucien-blueprint opacity-20" />

      <div className="relative z-10 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-20 px-4">
          <nav className="flex flex-col md:flex-row gap-6 md:gap-12">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="group flex items-center gap-2 font-mono text-sm text-neutral-200 hover:text-white transition-colors"
              >
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                {link.label}
              </a>
            ))}
          </nav>

          <div className="font-mono text-sm text-neutral-400">
            © {new Date().getFullYear()} BBGeorgiaTech, Inc. All rights reserved.
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
