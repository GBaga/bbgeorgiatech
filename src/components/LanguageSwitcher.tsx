"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '../i18n/routing';

const LOCALES = [
  { code: "en", label: "en" },
  { code: "ka", label: "ge" },
  { code: "fr", label: "fr" },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (nextLocale: string) => {
    router.replace({ pathname }, { locale: nextLocale });
  };

  return (
    <div className="flex items-center gap-6 font-mono text-sm uppercase tracking-widest bg-background-deep/50 px-6 py-2 border-l border-white/10">
      {LOCALES.map((l) => {
        const isActive = locale === l.code;
        return (
          <button
            key={l.code}
            onClick={() => handleLocaleChange(l.code)}
            className={`relative group cursor-pointer transition-colors duration-300 ${isActive ? "text-primary font-bold" : "text-neutral-500 hover:text-white"
              }`}
          >
            <span
              className={`absolute -left-3 transition-opacity duration-300 ${isActive ? "opacity-100 text-primary" : "opacity-0 group-hover:opacity-100 text-primary"
                }`}
            >
              [
            </span>
            {l.label}
            <span
              className={`absolute -right-3 transition-opacity duration-300 ${isActive ? "opacity-100 text-primary" : "opacity-0 group-hover:opacity-100 text-primary"
                }`}
            >
              ]
            </span>
          </button>
        );
      })}
    </div>
  );
}
