// Single source of truth for every number on the site. Text (names, feature
// lists, row labels) lives in messages/*.json under "Pricing"; change a price
// here and it updates in every language, the JSON-LD and /llms.txt.

export const CURRENCY = "USD";

export type PackageKey = "launch" | "business";
export type CareKey = "care" | "carePlus";

// Monthly payment plans run this many months; after the last payment the
// site belongs to the client. Cancel any time with 30 days' notice.
export const MONTHS = 12;

// Two packages, each payable once or monthly. A monthly plan includes the
// Care plan, and its total is a little above "price + 12 months of Care"
// (paying over time costs slightly more, never less):
//   launch:   (990 + 12 × 59) / 12 = 141.50 → 149  · local (495 + 708) / 12 = 100.25 → 109
//   business: (2,490 + 708) / 12 = 266.50 → 279    · local (1,245 + 708) / 12 = 162.75 → 169
export const PACKAGES: { key: PackageKey; price: number; monthly: number; localMonthly: number; featured?: boolean }[] = [
  { key: "launch", price: 990, monthly: 149, localMonthly: 109 },
  { key: "business", price: 2490, monthly: 279, localMonthly: 169, featured: true },
];

// Shops, portals and integrations: quoted individually, never a card.
export const CUSTOM_FROM = 4990;

// Local price: businesses registered in Georgia pay this share of one-time
// project prices (packages and add-ons). Care plans cost the same for
// everyone. Prices stay in USD everywhere.
export const LOCAL_SHARE = 0.5;

// The Georgian version of the site shows local prices as the main price,
// always with a note saying who they are for.
export const LOCAL_PRICE_LOCALE = "ka";
export const usesLocalPrices = (locale: string) => locale === LOCAL_PRICE_LOCALE;
export const localPrice = (price: number) => Math.round(price * LOCAL_SHARE);

// What a visitor of this locale sees for a package.
export function packagePrices(p: (typeof PACKAGES)[number], local: boolean) {
  return { price: local ? localPrice(p.price) : p.price, monthly: local ? p.localMonthly : p.monthly };
}

export const packageByKey = (key: PackageKey) => PACKAGES.find((p) => p.key === key)!;

// Yearly billing = 10 months (2 months free)
export const YEARLY_MONTHS = 10;

export const CARE_PLANS: { key: CareKey; monthly: number; featured?: boolean }[] = [
  { key: "care", monthly: 59 },
  { key: "carePlus", monthly: 149, featured: true },
];

// A comparison cell: true = included, false = not included, a plain string is
// shown as is ("12", "2–3"), "@key" is looked up in Pricing.values.
export type Cell = boolean | string;

export const PACKAGE_ROWS: { key: string; cells: [Cell, Cell] }[] = [
  { key: "pages", cells: ["5", "12"] },
  { key: "languages", cells: ["1", "2–3"] },
  { key: "copy", cells: [true, true] },
  { key: "delivery", cells: ["@weeks2to3", "@weeks3to4"] },
  { key: "revisions", cells: ["2", "3"] },
  { key: "contact", cells: [true, true] },
  { key: "seo", cells: ["@basic", "@advanced"] },
  { key: "gbp", cells: [true, true] },
  { key: "cms", cells: [false, true] },
  { key: "booking", cells: ["@addon", true] },
  { key: "analytics", cells: [false, true] },
  { key: "support", cells: ["@days30", "@days60"] },
];

export const CARE_ROWS: { key: string; cells: [Cell, Cell] }[] = [
  { key: "hosting", cells: [true, true] },
  { key: "ssl", cells: [true, true] },
  { key: "backups", cells: [true, true] },
  { key: "updates", cells: [true, true] },
  { key: "uptime", cells: [true, true] },
  { key: "forms", cells: [true, true] },
  { key: "dns", cells: [true, true] },
  { key: "fixes", cells: [true, true] },
  { key: "edits", cells: [false, "@hours2"] },
  { key: "report", cells: [false, true] },
  { key: "gbp", cells: [false, true] },
  { key: "seoCheck", cells: [false, "@quarterly"] },
  { key: "response", cells: ["@bd2", "@bd1"] },
];

export type AddonUnit = "flat" | "from" | "perPage";

// The add-ons shown on /pricing. Anything else is quoted individually.
export const ADDONS: { key: string; price: number; unit: AddonUnit }[] = [
  { key: "extraPage", price: 120, unit: "flat" },
  { key: "language", price: 250, unit: "flat" },
  { key: "translation", price: 40, unit: "perPage" },
  { key: "booking", price: 250, unit: "flat" },
  { key: "payments", price: 350, unit: "flat" },
  { key: "shop", price: 1200, unit: "from" },
  { key: "logo", price: 350, unit: "from" },
  { key: "localSeo", price: 290, unit: "flat" },
];

// Small work outside packages and plans
export const HOURLY = 45;

export const pad2 = (n: number) => String(n).padStart(2, "0");

// Always "$2,490", in every language: it's the form international buyers
// expect, and a fixed format can't differ between the server's and the
// browser's Intl data (which would cause hydration mismatches).
export function formatUsd(amount: number) {
  return `$${amount.toLocaleString("en-US")}`;
}

// Values for {launch} {business} {monthly} {businessMonthly} {care} {months}
// in copy outside /pricing (hero note, home FAQ, nav), as this locale sees
// them, so no old price can linger in a message file.
export function priceParams(locale: string) {
  const local = usesLocalPrices(locale);
  const launch = packagePrices(packageByKey("launch"), local);
  const business = packagePrices(packageByKey("business"), local);
  return {
    launch: formatUsd(launch.price),
    business: formatUsd(business.price),
    monthly: formatUsd(launch.monthly),
    businessMonthly: formatUsd(business.monthly),
    care: formatUsd(CARE_PLANS[0].monthly),
    months: MONTHS,
  };
}

const addonPriceOf = (key: string) => ADDONS.find((a) => a.key === key)?.price ?? 0;

// Home "Services": the lowest real price behind each service, derived from the
// packages and add-ons above so the section can never show a stale price.
export function servicePrices(locale: string) {
  const local = usesLocalPrices(locale);
  const project = (n: number) => (local ? localPrice(n) : n);
  return {
    website: project(packageByKey("launch").price),
    shop: project(packageByKey("business").price + addonPriceOf("shop")),
    google: project(addonPriceOf("localSeo")),
    care: CARE_PLANS[0].monthly,
  };
}

// Local SEO add-on: the fixed listings every client gets. Brand names, so not
// translated; 3 more are picked per industry (see Pricing.addons.localSeoInfo).
export const LOCAL_SEO_LISTINGS = [
  "Apple Business Connect (Apple Maps)",
  "Bing Places",
  "Waze",
  "Facebook",
  "Instagram",
  "LinkedIn",
  "Foursquare",
];
