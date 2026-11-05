// Single source of truth for every number on /pricing. Text (names, feature
// lists, row labels) lives in messages/*.json under "Pricing"; change a price
// here and it updates in every language and in the page's JSON-LD.

export const CURRENCY = "USD";

export type PackageKey = "launch" | "business" | "pro";
export type CareKey = "care" | "carePlus" | "growth";

export const PACKAGES: { key: PackageKey; price: number; featured?: boolean }[] = [
  { key: "launch", price: 990 },
  { key: "business", price: 2490, featured: true },
  { key: "pro", price: 4990 },
];

// Yearly billing = 10 months (2 months free)
export const YEARLY_MONTHS = 10;

export const CARE_PLANS: { key: CareKey; monthly: number; featured?: boolean }[] = [
  { key: "care", monthly: 59 },
  { key: "carePlus", monthly: 149, featured: true },
  { key: "growth", monthly: 349 },
];

// A comparison cell: true = included, false = not included, a plain string is
// shown as is ("12", "2–3"), "@key" is looked up in Pricing.values.
export type Cell = boolean | string;

export const PACKAGE_ROWS: { key: string; cells: [Cell, Cell, Cell] }[] = [
  { key: "pages", cells: ["5", "12", "20+"] },
  { key: "languages", cells: ["1", "2–3", "5"] },
  { key: "revisions", cells: ["2", "3", "4"] },
  { key: "delivery", cells: ["@weeks2", "@weeks3to4", "@weeks5to8"] },
  { key: "responsive", cells: [true, true, true] },
  { key: "contact", cells: [true, true, true] },
  { key: "basicSeo", cells: [true, true, true] },
  { key: "gbp", cells: [true, true, true] },
  { key: "ssl", cells: [true, true, true] },
  { key: "legal", cells: [true, true, true] },
  { key: "cms", cells: [false, true, true] },
  { key: "booking", cells: ["@addon", true, true] },
  { key: "blog", cells: [false, true, true] },
  { key: "advSeo", cells: [false, true, true] },
  { key: "analytics", cells: [false, true, true] },
  { key: "animations", cells: ["@basic", "@light", "@interactive"] },
  { key: "shop", cells: [false, "@addon", true] },
  { key: "integrations", cells: [false, false, true] },
  { key: "audit", cells: [false, false, true] },
  { key: "support", cells: ["@days30", "@days60", "@days90priority"] },
  { key: "training", cells: ["@min30", "@hour1", "@hour1"] },
];

export const CARE_ROWS: { key: string; cells: [Cell, Cell, Cell] }[] = [
  { key: "hosting", cells: [true, true, true] },
  { key: "ssl", cells: [true, true, true] },
  { key: "backups", cells: [true, true, true] },
  { key: "updates", cells: [true, true, true] },
  { key: "uptime", cells: [true, true, true] },
  { key: "forms", cells: [true, true, true] },
  { key: "dns", cells: [true, true, true] },
  { key: "fixes", cells: [true, true, true] },
  { key: "edits", cells: [false, "@hours2", "@hours5"] },
  { key: "report", cells: [false, true, true] },
  { key: "gbp", cells: [false, true, true] },
  { key: "seoCheck", cells: [false, "@quarterly", "@monthly"] },
  { key: "content", cells: [false, false, true] },
  { key: "seoWork", cells: [false, false, true] },
  { key: "cro", cells: [false, false, true] },
  { key: "call", cells: [false, false, "@quarterly"] },
  { key: "response", cells: ["@bd2", "@bd1", "@sameDay"] },
];

export type AddonUnit = "flat" | "from" | "perPage" | "perSet" | "perProduct" | "perHour" | "percent" | "custom";

export const ADDON_GROUPS: { key: string; items: { key: string; price?: number; unit: AddonUnit }[] }[] = [
  {
    key: "content",
    items: [
      { key: "extraPage", price: 120, unit: "flat" },
      { key: "copywriting", price: 90, unit: "perPage" },
      { key: "translation", price: 40, unit: "perPage" },
      { key: "stock", price: 60, unit: "perSet" },
      { key: "products", price: 3, unit: "perProduct" },
    ],
  },
  {
    key: "brand",
    items: [
      { key: "logo", price: 350, unit: "from" },
      { key: "identity", price: 750, unit: "from" },
      { key: "social", price: 150, unit: "flat" },
      { key: "print", price: 90, unit: "flat" },
    ],
  },
  {
    key: "features",
    items: [
      { key: "language", price: 250, unit: "flat" },
      { key: "booking", price: 250, unit: "flat" },
      { key: "quoteForm", price: 200, unit: "flat" },
      { key: "payments", price: 350, unit: "flat" },
      { key: "shop", price: 1200, unit: "from" },
      { key: "newsletter", price: 150, unit: "flat" },
      { key: "portal", unit: "custom" },
    ],
  },
  {
    key: "marketing",
    items: [
      { key: "seoAudit", price: 190, unit: "flat" },
      { key: "localSeo", price: 290, unit: "flat" },
      { key: "tracking", price: 150, unit: "flat" },
      { key: "migration", price: 250, unit: "from" },
    ],
  },
  {
    key: "technical",
    items: [
      { key: "email", price: 90, unit: "flat" },
      { key: "rush", price: 25, unit: "percent" },
      { key: "hourly", price: 45, unit: "perHour" },
    ],
  },
];

export const pad2 = (n: number) => String(n).padStart(2, "0");

// Always "$2,490", in every language: it's the form international buyers
// expect, and a fixed format can't differ between the server's and the
// browser's Intl data (which would cause hydration mismatches).
export function formatUsd(amount: number) {
  return `$${amount.toLocaleString("en-US")}`;
}
