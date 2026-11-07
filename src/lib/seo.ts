import { routing } from "../i18n/routing";

// One place to build canonical + hreflang alternates for a given path, so
// every route's own `generateMetadata` self-canonicalizes correctly instead
// of inheriting the root layout's (which only makes sense for "/").
export function buildAlternates(locale: string, path: string) {
  return {
    canonical: `/${locale}${path}`,
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, `/${l}${path}`])),
      "x-default": `/${routing.defaultLocale}${path}`,
    },
  };
}

// A page that sets its own `openGraph` replaces the parent's entirely, which
// drops the locale share image from [locale]/opengraph-image.tsx. Pages pass
// this to keep it.
export function ogImages(locale: string) {
  return [{ url: `/${locale}/opengraph-image`, width: 1200, height: 630, alt: "BBGeorgiaTech" }];
}

// Open Graph wants language_TERRITORY ("ka_GE"), not the bare route locale.
const OG_LOCALES: Record<string, string> = { en: "en_US", fr: "fr_FR", ka: "ka_GE" };
export const ogLocale = (locale: string) => OG_LOCALES[locale] ?? locale;

// Open Graph + Twitter tags for a page, from its own title and description.
// Without this, a page that only sets `title` shares the home page's
// og:title / twitter:title, and one that sets `openGraph` loses the image.
export function socialMeta(locale: string, title: string, description: string) {
  const images = ogImages(locale);
  return {
    openGraph: {
      title,
      description,
      type: "website" as const,
      locale: ogLocale(locale),
      alternateLocale: routing.locales.filter((l) => l !== locale).map(ogLocale),
      images,
    },
    twitter: { card: "summary_large_image" as const, title, description, images },
  };
}
