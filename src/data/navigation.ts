// The site's main pages, shared by the header and the footer so the two can't
// drift apart. Labels come from messages/*.json under "Navigation" (same key).
// Order follows the home-page sections.

export type NavKey = "competencies" | "systems" | "pricing" | "heritage";

export const NAV_LINKS: { key: NavKey; href: string }[] = [
  { key: "competencies", href: "/#competencies" },
  { key: "systems", href: "/#systems" },
  { key: "pricing", href: "/pricing" },
  { key: "heritage", href: "/#heritage" },
];

// The header's "Industries" dropdown sits right after this item.
export const INDUSTRIES_AFTER: NavKey = "competencies";

export const CONTACT_HREF = "/#contact";

export const LEGAL_LINKS: { key: "terms" | "privacy" | "cookie"; href: string }[] = [
  { key: "terms", href: "/terms-and-conditions" },
  { key: "privacy", href: "/privacy-policy" },
  { key: "cookie", href: "/cookie-policy" },
];
