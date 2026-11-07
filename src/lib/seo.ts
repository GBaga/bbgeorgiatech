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
