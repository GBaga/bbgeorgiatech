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
