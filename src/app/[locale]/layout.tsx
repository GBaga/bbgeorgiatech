import type { Metadata } from "next";
import { Manrope, IBM_Plex_Mono, Michroma, Noto_Sans_Georgian } from "next/font/google";
import "../globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { MotionConfig } from "framer-motion";
import { CookieBanner } from "../../components/CookieBanner";
import { AnalyticsGate } from "../../components/AnalyticsGate";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { buildAlternates, socialMeta } from '../../lib/seo';
import { CARE_PLANS, CURRENCY, MONTHS, PACKAGES, formatUsd, localPrice, packageByKey, packagePrices, usesLocalPrices } from '../../data/pricing';

// Variables are --nf-* so they don't collide with Tailwind's --font-* theme
// tokens in globals.css, which build the full stacks from them.
const fontLogo = Michroma({
  variable: "--nf-logo",
  weight: ["400"],
  subsets: ["latin"],
});

// Headings and body text (variable font, every weight in one file)
const fontHeading = Manrope({
  variable: "--nf-heading",
  subsets: ["latin"],
});

const fontMono = IBM_Plex_Mono({
  variable: "--nf-mono",
  // 300: hero chart quote, 700: bold mono labels and buttons
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});

// Georgian glyphs for every stack (none of the fonts above has them).
// Variable font, so all weights come in one file. Not preloaded:
// unicode-range means it's fetched only when Georgian text renders, so the
// English and French pages never download it.
const fontGeorgian = Noto_Sans_Georgian({
  variable: "--nf-georgian",
  subsets: ["georgian"],
  preload: false,
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  // Georgian pages quote the local price (see data/pricing.ts)
  const price = formatUsd(packagePrices(packageByKey('launch'), usesLocalPrices(locale)).price);

  return {
    metadataBase: new URL('https://bbgeorgiatech.com'),
    title: t('title'),
    description: t('description', { price }),
    alternates: buildAlternates(locale, ''),
    ...socialMeta(locale, t('ogTitle'), t('ogDescription', { price })),
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const resolvedParams = await params;
  const messages = await getMessages();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": "https://bbgeorgiatech.com/#organization",
        "name": "BBGeorgiaTech",
        "url": "https://bbgeorgiatech.com",
        "image": "https://bbgeorgiatech.com/logo.png",
        // Google needs a raster logo (min 112 × 112); an SVG is ignored
        "logo": "https://bbgeorgiatech.com/logo.png",
        "description": "Fixed-price website design, development and maintenance for small businesses worldwide",
        "areaServed": "Worldwide",
        "knowsAbout": ["Website Design", "Web Development", "E-Commerce", "Website Maintenance", "SEO", "Multilingual Websites", "Small Business Websites"],
        "priceRange": `${formatUsd(PACKAGES[0].price)}+`,
        "currenciesAccepted": CURRENCY,
        "email": "bbgeorgiatech@gmail.com",
        "sameAs": [
          "https://github.com/GBaga",
          "https://www.linkedin.com/in/goga-bagauri",
        ],
        "founder": {
          "@type": "Person",
          "name": "Goga Bagauri",
        },
        "parentOrganization": {
          "@type": "Organization",
          "name": "Bagauri Bonds Georgia",
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Services",
          "url": `https://bbgeorgiatech.com/${resolvedParams.locale}/pricing`,
          // Same numbers as /pricing (src/data/pricing.ts)
          "itemListElement": [
            ...PACKAGES.flatMap((p) => {
              const name = `Website package: ${p.key[0].toUpperCase()}${p.key.slice(1)}`;
              return [
                {
                  "@type": "Offer",
                  "name": name,
                  "itemOffered": { "@type": "Service", "name": "Website Design & Development" },
                  "priceSpecification": { "@type": "PriceSpecification", "minPrice": p.price, "priceCurrency": CURRENCY },
                },
                {
                  "@type": "Offer",
                  "name": `${name}, paid monthly`,
                  "itemOffered": { "@type": "Service", "name": "Website Design & Development with Maintenance" },
                  "priceSpecification": {
                    "@type": "UnitPriceSpecification",
                    "price": p.monthly,
                    "priceCurrency": CURRENCY,
                    "unitCode": "MON",
                    "billingDuration": MONTHS,
                  },
                },
                {
                  "@type": "Offer",
                  "name": `${name}, local price for businesses registered in Georgia`,
                  "eligibleRegion": { "@type": "Country", "name": "GE" },
                  "itemOffered": { "@type": "Service", "name": "Website Design & Development" },
                  "priceSpecification": { "@type": "PriceSpecification", "minPrice": localPrice(p.price), "priceCurrency": CURRENCY },
                },
              ];
            }),
            {
              "@type": "Offer",
              "name": "Website care plans",
              "itemOffered": { "@type": "Service", "name": "Maintenance & Support" },
              "priceSpecification": {
                "@type": "UnitPriceSpecification",
                "minPrice": CARE_PLANS[0].monthly,
                "priceCurrency": CURRENCY,
                "unitCode": "MON",
              },
            },
          ],
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://bbgeorgiatech.com/#website",
        "url": "https://bbgeorgiatech.com",
        "name": "BBGeorgiaTech",
        "publisher": { "@id": "https://bbgeorgiatech.com/#organization" },
        "inLanguage": ["en", "fr", "ka"],
      },
    ],
  };

  return (
    <html
      lang={resolvedParams.locale}
      data-scroll-behavior="smooth"
      className={`${fontLogo.variable} ${fontHeading.variable} ${fontMono.variable} ${fontGeorgian.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background-deep text-neutral-50 font-inter" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <MotionConfig reducedMotion="user">
            {children}
            <CookieBanner />
          </MotionConfig>
          {process.env.NODE_ENV === "production" && (
            <>
              <Analytics />
              <SpeedInsights />
            </>
          )}
          {process.env.NEXT_PUBLIC_GA_ID && (
            <AnalyticsGate gaId={process.env.NEXT_PUBLIC_GA_ID} />
          )}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
