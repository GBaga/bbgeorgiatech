import en from "../../../messages/en.json";
import { ADDONS, CARE_PLANS, CUSTOM_FROM, HOURLY, MONTHS, PACKAGES, formatUsd, localPrice } from "../../data/pricing";
import { PROJECTS, READY_VERTICALS } from "../../data/verticals";

// /llms.txt — a plain-Markdown summary for AI assistants. Generated from the
// same data and English copy as the pricing and industry pages, so prices and
// industries can never drift out of sync with the site. Built once, static.
export const dynamic = "force-static";

const BASE = "https://bbgeorgiatech.com/en";

export function GET() {
  const p = en.Pricing;
  const v = en.Verticals as unknown as Record<string, { name: string; hero: { subtitle: string } }>;

  const lines = [
    "# BBGeorgiaTech",
    "",
    "> Fixed-price websites for small businesses worldwide: design, development, texts, SEO and ongoing care. Two packages, paid once or monthly. All prices in USD; businesses registered in Georgia pay 50% of one-time prices.",
    "",
    "## About",
    "",
    "BBGeorgiaTech is a web studio founded by Goga Bagauri. We build fast, multilingual, custom-designed websites with Next.js for small and service businesses in any country. Sites are available in English, French and Georgian.",
    "",
    "## Pricing",
    "",
    `Full details: [Pricing](${BASE}/pricing)`,
    "",
    "### Website packages",
    "",
    ...PACKAGES.map((pkg) => {
      const m = p.packages[pkg.key];
      return `- **${m.name}** — from ${formatUsd(pkg.price)} one-time, or ${formatUsd(pkg.monthly)} / month for ${MONTHS} months with the Care plan included (the site is the client's after the last payment). ${m.weeks}. ${m.tagline} Includes: ${m.features.join("; ")}.`;
    }),
    `- **Custom projects** (online shops, client portals, integrations) — quoted individually, from ${formatUsd(CUSTOM_FROM)}.`,
    "",
    "### Local price for Georgia",
    "",
    `${p.local.text} For example, Launch is ${formatUsd(localPrice(PACKAGES[0].price))} and Business ${formatUsd(localPrice(PACKAGES[1].price))}; paid monthly ${PACKAGES.map((pkg) => `${p.packages[pkg.key].name} ${formatUsd(pkg.localMonthly)}`).join(", ")} per month.`,
    "",
    "### Monthly care plans",
    "",
    ...CARE_PLANS.map((c) => {
      const m = p.care.plans[c.key];
      return `- **${m.name}** — ${formatUsd(c.monthly)} / month. ${m.tagline}`;
    }),
    "",
    ...p.care.terms.map((t) => `- ${t}`),
    "",
    "### Add-ons",
    "",
    ...ADDONS.map((a) => `- ${p.addons.items[a.key as keyof typeof p.addons.items]}: ${a.unit === "from" ? "from " : ""}${formatUsd(a.price)}${a.unit === "perPage" ? " / page" : ""}`),
    "",
    "### Payment & guarantee",
    "",
    `- ${p.process.payText.replace("{months}", String(MONTHS))}`,
    `- ${p.guarantee.g1Title}: ${p.guarantee.g1Text}`,
    `- ${p.guarantee.g2Title}: ${p.guarantee.g2Text}`,
    `- Work outside the packages: ${formatUsd(HOURLY)} / hour.`,
    "",
    "## Industries",
    "",
    ...READY_VERTICALS.map((vert) => `- [${v[vert.key].name}](${BASE}/for/${vert.slug}): ${v[vert.key].hero.subtitle}`),
    "",
    "## Portfolio",
    "",
    ...Object.values(PROJECTS).map((proj) => `- [${proj.name}](${proj.url})`),
    "- [POG League](https://pog-football.vercel.app/)",
    "",
    "## Contact",
    "",
    `- [Contact form / free consultation](${BASE}#contact) — fixed quote within 24 hours`,
    "- Email: bbgeorgiatech@gmail.com",
    "",
    "## Legal",
    "",
    `- [Privacy Policy](${BASE}/privacy-policy)`,
    `- [Terms & Conditions](${BASE}/terms-and-conditions)`,
    `- [Cookie Policy](${BASE}/cookie-policy)`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
