import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { NavigationBar } from "../../../../components/NavigationBar";
import { Footer } from "../../../../components/Footer";
import { GridLight } from "../../../../components/HeroSection";
import { TypeBadge } from "../../../../components/marketing/TypeBadge";
import { Reveal } from "../../../../components/marketing/Reveal";
import { SectionHeader } from "../../../../components/marketing/SectionHeader";
import { FaqList } from "../../../../components/marketing/FaqList";
import { HeroBlueprint } from "../../../../components/effects/HeroBlueprint";
import { TrustStrip } from "../../../../components/effects/TrustStrip";
import { PointerGlow } from "../../../../components/effects/PointerGlow";
import { DrawLine } from "../../../../components/effects/DrawLine";
import { SearchTyping } from "../../../../components/effects/SearchTyping";
import { ProjectBrowser } from "../../../../components/effects/ProjectBrowser";
import { PricePattern } from "../../../../components/marketing/CountUp";
import { Link } from "../../../../i18n/routing";
import { buildAlternates } from "../../../../lib/seo";
import { CURRENCY, PACKAGES, formatUsd, pad2 } from "../../../../data/pricing";
import { PROJECTS, READY_VERTICALS, getVertical } from "../../../../data/verticals";

const BASE_URL = "https://bbgeorgiatech.com";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const v = getVertical(slug);
  if (!v) return {};
  const t = await getTranslations({ locale, namespace: "Verticals" });
  const pkg = PACKAGES.find((p) => p.key === v.recommended) ?? PACKAGES[0];
  const title = t(`${v.key}.meta.title`);
  const description = t(`${v.key}.meta.description`, { price: formatUsd(pkg.price) });

  return {
    title,
    description,
    alternates: buildAlternates(locale, `/for/${slug}`),
    openGraph: { title, description, type: "website", locale },
  };
}

export default async function VerticalPage({ params }: Props) {
  const { locale, slug } = await params;
  const v = getVertical(slug);
  if (!v) notFound();

  const t = await getTranslations({ locale, namespace: "Verticals" });
  const tp = await getTranslations({ locale, namespace: "Pricing" });
  const tProjects = await getTranslations({ locale, namespace: "DeployedSystems" });

  const k = v.key;
  const accent = v.accent;
  const pkg = PACKAGES.find((p) => p.key === v.recommended) ?? PACKAGES[0];
  const pkgName = tp(`packages.${pkg.key}.name`);
  const spokenName = t("ui.packageName", { name: pkgName });
  const project = v.project ? PROJECTS[v.project] : undefined;
  const problems = t.raw(`${k}.problems`) as { title: string; text: string }[];
  const faqs = t.raw(`${k}.faq`) as { q: string; a: string }[];
  const types = t.raw(`${k}.types`) as string[];
  const others = READY_VERTICALS.filter((o) => o.slug !== v.slug);
  const Icon = v.icon;

  const pageUrl = `${BASE_URL}/${locale}/for/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: t(`${k}.meta.title`).split(" | ")[0],
        serviceType: "Website Design & Development",
        description: t(`${k}.hero.subtitle`),
        provider: { "@id": `${BASE_URL}/#organization` },
        areaServed: "Worldwide",
        audience: { "@type": "BusinessAudience", audienceType: t(`${k}.name`) },
        url: pageUrl,
        offers: {
          "@type": "Offer",
          name: tp(`packages.${pkg.key}.name`),
          url: `${BASE_URL}/${locale}/pricing`,
          priceSpecification: { "@type": "PriceSpecification", minPrice: pkg.price, priceCurrency: CURRENCY },
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
          { "@type": "ListItem", position: 2, name: t(`${k}.name`), item: pageUrl },
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
        <HeroBlueprint color={accent} />
        {/* The industry's colour, breathing slowly behind the hero */}
        <div
          aria-hidden="true"
          className="breathe pointer-events-none absolute -top-40 right-0 h-[560px] w-[70%] blur-3xl"
          style={{ background: `radial-gradient(closest-side, ${accent}, transparent)`, ["--breathe-min" as string]: 0.14, ["--breathe-max" as string]: 0.26 }}
        />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="hero-fade flex items-center gap-4 mb-8">
            <div className="w-12 h-12 shrink-0 flex items-center justify-center border border-white/10 bg-background-deep" style={{ color: accent }}>
              <Icon className="icon-draw w-6 h-6" aria-hidden="true" />
            </div>
            <div className="font-mono text-xs md:text-sm tracking-[0.2em] uppercase">
              <span className="text-neutral-500">{t("ui.industries")} / </span>
              <span className="text-primary">{t(`${k}.name`)}</span>
            </div>
          </div>
          {/* Smaller on phones: long Georgian/French words must fit 375px */}
          <h1 className="font-logo text-[1.75rem] sm:text-4xl md:text-6xl lg:text-7xl text-neutral-50 uppercase tracking-tighter leading-[1.05] break-words">
            <span className="hero-line"><span>{t(`${k}.hero.title1`)}</span></span>
            <span className="hero-line text-primary"><span style={{ ["--d" as string]: "0.08s" }}>{t(`${k}.hero.title2`)}</span></span>
          </h1>
          <p className="hero-fade mt-8 max-w-2xl text-lg text-neutral-400 leading-relaxed" style={{ ["--d" as string]: "0.25s" }}>
            {t(`${k}.hero.subtitle`)}
          </p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {types.map((type, ti) => (
              <li
                key={type}
                className="hero-fade flex items-center gap-2 border border-white/10 bg-background-deep/70 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-neutral-300"
                style={{ ["--d" as string]: `${0.32 + ti * 0.06}s` }}
              >
                <span className="w-1.5 h-1.5" style={{ backgroundColor: accent }} aria-hidden="true" />
                {type}
              </li>
            ))}
          </ul>
          <div className="hero-fade mt-10 flex flex-wrap gap-4" style={{ ["--d" as string]: "0.4s" }}>
            <Link
              href="/#contact"
              className="group/cta inline-flex items-center gap-2 border-2 border-primary bg-primary px-6 py-3 font-mono text-sm uppercase tracking-wider text-white transition-all hover:bg-primary/80"
            >
              {t("ui.consultation")}
              <ArrowRight className="w-4 h-4 transition-transform group-hover/cta:translate-x-0.5" aria-hidden="true" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 border-2 border-primary/50 px-6 py-3 font-mono text-sm uppercase tracking-wider text-primary transition-all hover:bg-primary hover:text-white"
            >
              {t("ui.seePricing")}
            </Link>
          </div>
          <div className="mt-10">
            <TrustStrip items={tp.raw("trust") as string[]} start={0.55 + types.length * 0.06} />
          </div>
        </div>
      </section>

      {/* Problems */}
      <section className="relative py-24 px-6 bg-surface border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <SectionHeader eyebrow={t("ui.problemsEyebrow")} title1={t("ui.problemsTitle1")} title2={t("ui.problemsTitle2")} />
          <Reveal>
            <SearchTyping phrases={t.raw(`${k}.searches`) as string[]} label={t("ui.searchLabel")} />
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {problems.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08} className="h-full">
                <div className="relative h-full border border-white/10 bg-background-deep p-6 md:p-8">
                  <div aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: accent }} />
                  <div className="flex items-center gap-4 mb-6">
                    <span className="font-mono text-sm text-primary">{pad2(i + 1)}</span>
                    <DrawLine delay={0.2 + i * 0.1} />
                  </div>
                  <h3 className="font-logo text-lg uppercase tracking-tighter text-neutral-50 leading-snug">{p.title}</h3>
                  <p className="mt-4 text-neutral-400 leading-relaxed">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What the site does */}
      <section className="relative py-24 px-6 bg-background-deep border-t border-white/5 lucien-blueprint">
        <div className="relative z-10 max-w-6xl mx-auto">
          <SectionHeader eyebrow={t("ui.featuresEyebrow")} title1={t(`${k}.featuresTitle1`)} title2={t(`${k}.featuresTitle2`)} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {v.features.map((f, i) => (
              <Reveal key={f.key} delay={(i % 3) * 0.08} className="h-full">
                <div className="group relative isolate overflow-hidden lucien-card h-full p-6 md:p-8" style={{ ["--accent" as string]: accent }}>
                  <PointerGlow />
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 ease-out group-hover:w-full"
                    style={{ backgroundColor: accent }}
                  />
                  <div className="w-12 h-12 flex items-center justify-center border border-white/10 bg-background-deep text-neutral-400 transition-all duration-300 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-background-deep">
                    <f.icon className="w-6 h-6 transition-transform duration-500 group-hover:scale-110" aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 font-heading text-lg font-semibold text-neutral-50">{t(`${k}.features.${f.key}.title`)}</h3>
                  <p className="mt-2 text-sm text-neutral-400 leading-relaxed">{t(`${k}.features.${f.key}.text`)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Real project */}
      {project && (
        <section className="relative py-24 px-6 bg-surface border-t border-white/5 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <SectionHeader eyebrow={t("ui.projectEyebrow")} title1={t("ui.projectTitle1")} title2={t("ui.projectTitle2")} />
            <Reveal>
              <article className="relative overflow-hidden border border-white/10 bg-gradient-to-b from-surface-bright to-surface p-5 sm:p-8 lg:p-10">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-1/3 -right-1/4 h-[120%] w-[80%] opacity-20 blur-3xl"
                  style={{ background: `radial-gradient(closest-side, ${project.accent}, transparent)` }}
                />
                <div aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: project.accent }} />
                <div className="relative grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-center">
                  <div className="order-2 lg:order-1">
                    <div className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">{tProjects(`c${project.msg}`)}</div>
                    <h3 className="mt-2 font-logo text-2xl md:text-3xl uppercase tracking-tighter text-neutral-50">{project.name}</h3>
                    <div className="mt-3 font-heading text-lg md:text-xl font-semibold" style={{ color: project.accent }}>
                      {tProjects(`h${project.msg}`)}
                    </div>
                    <p className="mt-4 text-sm md:text-base text-neutral-400 leading-relaxed">{tProjects(`m${project.msg}`)}</p>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${t("ui.visit")}: ${project.name}`}
                      className="group/link mt-7 inline-flex w-fit items-center gap-2 border-2 border-primary/50 px-5 py-2.5 font-mono text-sm uppercase tracking-wider text-primary transition-all hover:bg-primary hover:text-white"
                    >
                      {t("ui.visit")}
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" aria-hidden="true" />
                    </a>
                  </div>
                  <div className="order-1 lg:order-2">
                    <ProjectBrowser url={project.url} image={project.image} name={project.name} accent={project.accent} />
                  </div>
                </div>
              </article>
            </Reveal>
          </div>
        </section>
      )}

      {/* Recommended package */}
      <section className="relative py-24 px-6 bg-background-deep border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div
              className="relative overflow-hidden border border-transparent border-orbit bg-gradient-to-b from-surface-bright to-surface p-6 md:p-10 shadow-[0_0_60px_-16px_rgba(92,156,255,0.5)]"
              style={{ ["--orbit" as string]: accent }}
            >
              <div aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-1.5 bg-primary" aria-hidden="true" />
                    <div className="font-mono text-xs tracking-[0.2em] text-primary uppercase">{t("ui.recommendEyebrow")}</div>
                  </div>
                  <h2 className="font-logo text-3xl md:text-4xl text-neutral-50 uppercase tracking-tighter">
                    {/* Visually "Business [package]". Where the language puts the word
                        first ("forfait Business"), assistive tech gets the natural
                        order and the visual version is hidden from it. */}
                    {spokenName === `${pkgName} ${t("ui.packageBadge")}` ? (
                      <>
                        <span className="text-primary">{pkgName}</span>
                        <TypeBadge>{t("ui.packageBadge")}</TypeBadge>
                      </>
                    ) : (
                      <>
                        <span className="sr-only">{spokenName}</span>
                        <span aria-hidden="true">
                          <span className="text-primary">{pkgName}</span>
                          <TypeBadge>{t("ui.packageBadge")}</TypeBadge>
                        </span>
                      </>
                    )}
                  </h2>
                  <p className="mt-4 max-w-2xl text-neutral-400 leading-relaxed">{t(`${k}.recommend`)}</p>
                </div>
                <div className="lg:text-right">
                  <div className="font-logo text-4xl tracking-tighter text-neutral-50 tabular-nums">
                    <PricePattern pattern={tp("ui.from", { price: "§" })} value={pkg.price} />
                  </div>
                  <div className="mt-2 font-mono text-[11px] uppercase tracking-wider text-neutral-500">
                    {t("ui.oneTime")} · {tp(`packages.${pkg.key}.weeks`)}
                  </div>
                  <Link
                    href="/pricing"
                    className="group/cta mt-6 inline-flex items-center gap-2 border-2 border-primary/50 px-6 py-3 font-mono text-sm uppercase tracking-wider text-primary transition-all hover:bg-primary hover:text-white"
                  >
                    {t("ui.seePricing")}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/cta:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-24 px-6 bg-surface border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <SectionHeader eyebrow="FAQ" title1={t("ui.faqTitle1")} title2={t("ui.faqTitle2")} align="center" />
          <FaqList items={faqs} />
        </div>
      </section>

      {/* Other industries (only those with a finished page) */}
      {others.length > 0 && (
        <section className="relative py-24 px-6 bg-background-deep border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <SectionHeader eyebrow={t("ui.industries")} title1={t("ui.otherTitle1")} title2={t("ui.otherTitle2")} />
            <div className="grid gap-px bg-white/10 border border-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  href={`/for/${o.slug}`}
                  style={{ ["--accent" as string]: o.accent }}
                  className="group relative isolate overflow-hidden flex items-center gap-4 bg-background-deep p-5 transition-colors hover:bg-surface"
                >
                  <PointerGlow />
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 ease-out group-hover:w-full"
                    style={{ backgroundColor: o.accent }}
                  />
                  <span
                    className="w-10 h-10 shrink-0 flex items-center justify-center border border-white/10 text-[var(--accent)] transition-all duration-300 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-background-deep"
                  >
                    <o.icon className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <span className="text-sm text-neutral-300 group-hover:text-white transition-colors">{t(`${o.key}.name`)}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="relative py-24 md:py-32 px-6 lucien-blueprint border-t border-white/5 overflow-hidden">
        <div
          aria-hidden="true"
          className="breathe pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(50% 70% at 50% 100%, ${accent}, transparent)`, ["--breathe-min" as string]: 0.1, ["--breathe-max" as string]: 0.2 }}
        />
        <Reveal className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
          <h2 className="font-logo text-3xl md:text-5xl text-neutral-50 uppercase tracking-tighter">
            {t(`${k}.final.title1`)} <span className="text-primary">{t(`${k}.final.title2`)}</span>
          </h2>
          <p className="mt-6 text-lg text-neutral-400 leading-relaxed">{t("ui.finalText")}</p>
          <Link
            href="/#contact"
            className="cta-halo group/cta relative mt-10 inline-flex items-center gap-2 border-2 border-primary bg-primary px-8 py-4 font-mono text-sm uppercase tracking-wider text-white transition-all hover:bg-primary/80"
          >
            {t("ui.consultation")}
            <ArrowRight className="w-4 h-4 transition-transform group-hover/cta:translate-x-0.5" aria-hidden="true" />
          </Link>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
