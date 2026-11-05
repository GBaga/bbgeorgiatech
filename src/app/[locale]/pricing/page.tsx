import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Check, CalendarClock, RotateCcw } from "lucide-react";
import { NavigationBar } from "../../../components/NavigationBar";
import { Footer } from "../../../components/Footer";
import { GridLight } from "../../../components/HeroSection";
import { Reveal } from "../../../components/marketing/Reveal";
import { SectionHeader } from "../../../components/marketing/SectionHeader";
import { FaqList } from "../../../components/marketing/FaqList";
import { CompareTable, type ResolvedCell } from "../../../components/pricing/CompareTable";
import { CarePlans } from "../../../components/pricing/CarePlans";
import { Link } from "../../../i18n/routing";
import { buildAlternates } from "../../../lib/seo";
import {
  ADDON_GROUPS,
  CARE_PLANS,
  CARE_ROWS,
  CURRENCY,
  PACKAGES,
  PACKAGE_ROWS,
  formatUsd,
  pad2,
  type AddonUnit,
  type Cell,
} from "../../../data/pricing";

const BASE_URL = "https://bbgeorgiatech.com";
const HOURLY = ADDON_GROUPS.flatMap((g) => g.items).find((i) => i.key === "hourly")?.price ?? 45;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pricing" });
  const title = t("meta.title");
  const description = t("meta.description", {
    launch: formatUsd(PACKAGES[0].price),
    care: formatUsd(CARE_PLANS[0].monthly),
  });

  return {
    title,
    description,
    alternates: buildAlternates(locale, "/pricing"),
    openGraph: { title, description, type: "website", locale },
  };
}

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pricing" });

  const resolve = (cell: Cell): ResolvedCell =>
    typeof cell === "string" && cell.startsWith("@") ? t(`values.${cell.slice(1)}`) : cell;

  const addonPrice = (price: number | undefined, unit: AddonUnit) => {
    if (unit === "custom" || price === undefined) return t("addons.units.custom");
    if (unit === "percent") return `+${price}%`;
    if (unit === "from") return t("addons.units.from", { price: formatUsd(price) });
    if (unit === "flat") return formatUsd(price);
    return `${formatUsd(price)} ${t(`addons.units.${unit}`)}`;
  };

  const tableLabels = { feature: t("ui.feature"), included: t("ui.included"), notIncluded: t("ui.notIncluded") };
  const packageColumns = PACKAGES.map((p) => ({ name: t(`packages.${p.key}.name`), featured: p.featured }));
  const careColumns = CARE_PLANS.map((p) => ({ name: t(`care.plans.${p.key}.name`), featured: p.featured }));

  const faqs = (t.raw("faq.items") as { q: string; a: string }[]).map((f) => ({
    q: f.q,
    a: f.a.replace("{rate}", `${formatUsd(HOURLY)} ${t("addons.units.perHour")}`),
  }));
  const steps = t.raw("process.steps") as { title: string; text: string }[];

  const pageUrl = `${BASE_URL}/${locale}/pricing`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: "Website Design & Development",
        serviceType: "Website Design & Development",
        provider: { "@id": `${BASE_URL}/#organization` },
        areaServed: "Worldwide",
        url: pageUrl,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: t("packages.title2"),
          itemListElement: [
            ...PACKAGES.map((p) => ({
              "@type": "Offer",
              name: t(`packages.${p.key}.name`),
              description: t(`packages.${p.key}.tagline`),
              priceSpecification: { "@type": "PriceSpecification", minPrice: p.price, priceCurrency: CURRENCY },
            })),
            ...CARE_PLANS.map((p) => ({
              "@type": "Offer",
              name: t(`care.plans.${p.key}.name`),
              description: t(`care.plans.${p.key}.tagline`),
              priceSpecification: {
                "@type": "UnitPriceSpecification",
                price: p.monthly,
                priceCurrency: CURRENCY,
                unitCode: "MON",
              },
            })),
          ],
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "BBGeorgiaTech", item: `${BASE_URL}/${locale}` },
          { "@type": "ListItem", position: 2, name: t("hero.eyebrow"), item: pageUrl },
        ],
      },
    ],
  };

  return (
    <main className="flex flex-col min-h-screen overflow-x-clip bg-background-deep">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <NavigationBar />

      {/* Hero */}
      <section className="relative pt-40 pb-20 md:pb-28 px-6 lucien-blueprint overflow-hidden">
        <GridLight />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[480px]"
          style={{ background: "radial-gradient(40% 60% at 15% 0%, rgba(92,156,255,0.14), transparent)" }}
        />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="hero-fade flex items-center gap-3 mb-6">
            <div className="w-2 h-2 bg-primary" aria-hidden="true" />
            <div className="font-mono text-sm tracking-widest text-primary uppercase">{t("hero.eyebrow")}</div>
          </div>
          <h1 className="font-logo text-5xl md:text-7xl lg:text-[88px] text-neutral-50 uppercase tracking-tighter leading-[0.95]">
            <span className="hero-line"><span>{t("hero.title1")}</span></span>
            <span className="hero-line text-primary"><span style={{ ["--d" as string]: "0.08s" }}>{t("hero.title2")}</span></span>
          </h1>
          <p className="hero-fade mt-8 max-w-2xl text-lg text-neutral-400 leading-relaxed" style={{ ["--d" as string]: "0.25s" }}>
            {t("hero.subtitle")}
          </p>
          <ul className="hero-fade mt-8 flex flex-wrap gap-3" style={{ ["--d" as string]: "0.35s" }}>
            {(t.raw("hero.badges") as string[]).map((b) => (
              <li key={b} className="flex items-center gap-2 border border-white/10 bg-background-deep/70 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-neutral-300">
                <span className="w-1.5 h-1.5 bg-primary" aria-hidden="true" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="relative py-24 px-6 bg-background-deep border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow={t("packages.eyebrow")}
            title1={t("packages.title1")}
            title2={t("packages.title2")}
            subtitle={t("packages.subtitle")}
          />
          <div className="grid gap-4 lg:grid-cols-3 lg:items-stretch">
            {PACKAGES.map((p, i) => (
              <Reveal key={p.key} delay={i * 0.08} className="h-full">
                <article
                  className={`relative h-full flex flex-col overflow-hidden border p-6 md:p-8 bg-gradient-to-b from-surface-bright to-surface ${
                    p.featured ? "border-primary/60 shadow-[0_0_60px_-16px_rgba(92,156,255,0.55)]" : "border-white/10"
                  }`}
                >
                  {p.featured && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-1/3 -right-1/4 h-[80%] w-[80%] opacity-25 blur-3xl"
                      style={{ background: "radial-gradient(closest-side, #5c9cff, transparent)" }}
                    />
                  )}
                  <div aria-hidden="true" className={`absolute left-0 top-0 bottom-0 w-1 ${p.featured ? "bg-primary" : "bg-white/10"}`} />

                  <div className="relative flex items-center gap-4">
                    <span className="font-mono text-sm text-primary">{pad2(i + 1)}</span>
                    <div className="h-px flex-1 bg-white/10" aria-hidden="true" />
                    {p.featured && (
                      <span className="border border-primary/50 bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
                        {t("ui.popular")}
                      </span>
                    )}
                  </div>

                  <h3 className="relative mt-6 font-logo text-2xl md:text-3xl uppercase tracking-tighter text-neutral-50">
                    {t(`packages.${p.key}.name`)}
                  </h3>
                  <p className="relative mt-2 text-sm text-neutral-400 leading-relaxed min-h-[2.75rem]">{t(`packages.${p.key}.tagline`)}</p>

                  <div className="relative mt-6 font-logo text-4xl md:text-[2.6rem] tracking-tighter text-neutral-50 tabular-nums">
                    {t("ui.from", { price: formatUsd(p.price) })}
                  </div>
                  <div className="relative mt-2 flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-neutral-500">
                    <span>{t("ui.oneTime")}</span>
                    <span className="w-1 h-1 bg-white/20" aria-hidden="true" />
                    <span>{t(`packages.${p.key}.weeks`)}</span>
                  </div>

                  <ul className="relative mt-8 space-y-3 flex-1">
                    {(t.raw(`packages.${p.key}.features`) as string[]).map((f, fi) => (
                      <li key={f} className={`flex gap-3 text-sm leading-relaxed ${fi === 0 && i > 0 ? "text-neutral-50 font-medium" : "text-neutral-300"}`}>
                        <span className="mt-0.5 inline-flex w-5 h-5 shrink-0 items-center justify-center border border-primary/40 bg-primary/5 text-primary">
                          <Check className="w-3 h-3" aria-hidden="true" />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/#contact"
                    className={`group/cta relative mt-8 inline-flex justify-center items-center gap-2 border-2 px-5 py-3 font-mono text-sm uppercase tracking-wider transition-all ${
                      p.featured
                        ? "border-primary bg-primary text-white hover:bg-primary/80"
                        : "border-primary/50 text-primary hover:bg-primary hover:text-white"
                    }`}
                  >
                    {t("ui.getStarted")}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/cta:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Full comparison */}
      <section className="relative py-24 px-6 bg-surface border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <SectionHeader eyebrow={t("compare.eyebrow")} title1={t("compare.title1")} title2={t("compare.title2")} />
          <Reveal>
            <CompareTable
              columns={packageColumns}
              rows={PACKAGE_ROWS.map((r) => ({ label: t(`compare.rows.${r.key}`), cells: r.cells.map(resolve) }))}
              labels={tableLabels}
            />
          </Reveal>
        </div>
      </section>

      {/* Care plans */}
      <section id="care" className="relative py-24 px-6 bg-background-deep border-t border-white/5 lucien-blueprint">
        <div className="relative z-10 max-w-6xl mx-auto">
          <SectionHeader
            eyebrow={t("care.eyebrow")}
            title1={t("care.title1")}
            title2={t("care.title2")}
            subtitle={t("care.subtitle")}
          />
          <CarePlans />
          <Reveal className="mt-10">
            <CompareTable
              columns={careColumns}
              rows={CARE_ROWS.map((r) => ({ label: t(`care.rows.${r.key}`), cells: r.cells.map(resolve) }))}
              labels={tableLabels}
            />
          </Reveal>
          <Reveal className="mt-8">
            <ul className="grid gap-3 sm:grid-cols-2">
              {(t.raw("care.terms") as string[]).map((term) => (
                <li key={term} className="flex gap-3 text-sm text-neutral-400 leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 shrink-0 bg-primary" aria-hidden="true" />
                  {term}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Add-ons */}
      <section id="add-ons" className="relative py-24 px-6 bg-surface border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow={t("addons.eyebrow")}
            title1={t("addons.title1")}
            title2={t("addons.title2")}
            subtitle={t("addons.subtitle")}
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ADDON_GROUPS.map((g, gi) => (
              <Reveal key={g.key} delay={gi * 0.06} className={g.key === "features" ? "lg:row-span-2" : ""}>
                <div className="lucien-card h-full p-6 md:p-7">
                  <div className="flex items-center gap-4 mb-5">
                    <span className="font-mono text-sm text-primary">{pad2(gi + 1)}</span>
                    <h3 className="font-logo text-base uppercase tracking-tighter text-neutral-50">{t(`addons.groups.${g.key}`)}</h3>
                  </div>
                  <ul className="divide-y divide-white/5">
                    {g.items.map((item) => (
                      <li key={item.key} className="flex items-baseline justify-between gap-4 py-3">
                        <span className="text-sm text-neutral-300 leading-snug">{t(`addons.items.${item.key}`)}</span>
                        <span className="shrink-0 font-mono text-xs text-primary whitespace-nowrap">{addonPrice(item.price, item.unit)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section id="guarantee" className="relative py-24 px-6 bg-background-deep border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <SectionHeader eyebrow={t("guarantee.eyebrow")} title1={t("guarantee.title1")} title2={t("guarantee.title2")} />
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { icon: CalendarClock, title: t("guarantee.g1Title"), text: t("guarantee.g1Text") },
              { icon: RotateCcw, title: t("guarantee.g2Title"), text: t("guarantee.g2Text") },
            ].map((g, i) => (
              <Reveal key={g.title} delay={i * 0.08} className="h-full">
                <div className="relative h-full border border-white/10 bg-gradient-to-b from-surface-bright to-surface p-6 md:p-8">
                  <div aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                  <div className="w-12 h-12 flex items-center justify-center border border-primary/40 bg-primary/5 text-primary">
                    <g.icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 font-logo text-xl uppercase tracking-tighter text-neutral-50">{g.title}</h3>
                  <p className="mt-3 text-neutral-400 leading-relaxed">{g.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-6">
            <Link
              href="/terms-and-conditions#projects"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary hover:text-white transition-colors"
            >
              {t("guarantee.termsLink")}
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Process & payment */}
      <section className="relative py-24 px-6 bg-surface border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <SectionHeader eyebrow={t("process.eyebrow")} title1={t("process.title1")} title2={t("process.title2")} />
          <ol className="grid gap-px bg-white/10 border border-white/10 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="bg-background-deep">
                <Reveal delay={i * 0.08} className="h-full p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="font-mono text-sm text-primary">{pad2(i + 1)}</span>
                    <div className="h-px flex-1 bg-white/10" aria-hidden="true" />
                  </div>
                  <h3 className="font-logo text-base uppercase tracking-tighter text-neutral-50">{s.title}</h3>
                  <p className="mt-3 text-sm text-neutral-400 leading-relaxed">{s.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Reveal className="h-full">
              <div className="lucien-card h-full p-6 md:p-8">
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{t("process.payTitle")}</div>
                <p className="mt-3 text-neutral-300 leading-relaxed">{t("process.payText")}</p>
              </div>
            </Reveal>
            <Reveal delay={0.08} className="h-full">
              <div className="lucien-card h-full p-6 md:p-8">
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{t("process.provideTitle")}</div>
                <ul className="mt-3 space-y-2">
                  {(t.raw("process.provide") as string[]).map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-neutral-300 leading-relaxed">
                      <span className="mt-2 w-1.5 h-1.5 shrink-0 bg-primary" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-24 px-6 bg-background-deep border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <SectionHeader eyebrow="FAQ" title1={t("faq.title1")} title2={t("faq.title2")} align="center" />
          <FaqList items={faqs} />
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 md:py-32 px-6 lucien-blueprint border-t border-white/5 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(50% 70% at 50% 100%, rgba(92,156,255,0.16), transparent)" }}
        />
        <Reveal className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
          <h2 className="font-logo text-3xl md:text-5xl text-neutral-50 uppercase tracking-tighter">
            {t("final.title1")} <span className="text-primary">{t("final.title2")}</span>
          </h2>
          <p className="mt-6 text-lg text-neutral-400 leading-relaxed">{t("final.text")}</p>
          <Link
            href="/#contact"
            className="group/cta mt-10 inline-flex items-center gap-2 border-2 border-primary bg-primary px-8 py-4 font-mono text-sm uppercase tracking-wider text-white transition-all hover:bg-primary/80"
          >
            {t("final.button")}
            <ArrowRight className="w-4 h-4 transition-transform group-hover/cta:translate-x-0.5" aria-hidden="true" />
          </Link>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
