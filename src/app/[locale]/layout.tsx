import type { Metadata } from "next";
import { Manrope, IBM_Plex_Sans, IBM_Plex_Mono, Michroma, Noto_Sans_Georgian } from "next/font/google";
import "../globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { MotionConfig } from "framer-motion";
import { CookieBanner } from "../../components/CookieBanner";
import { AnalyticsGate } from "../../components/AnalyticsGate";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { buildAlternates } from '../../lib/seo';
import { CARE_PLANS, CURRENCY, MONTHLY, PACKAGES, START, formatUsd } from '../../data/pricing';

const fontLogo = Michroma({
  variable: "--font-logo",
  weight: ["400"],
  subsets: ["latin"],
});

const fontHeading = Manrope({
  variable: "--font-heading",
  subsets: ["latin"],
});

const fontBody = IBM_Plex_Sans({
  variable: "--font-body",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

const fontMono = IBM_Plex_Mono({
  variable: "--font-mono",
  // 300 is used by the hero chart quote
  weight: ["300", "400", "500"],
  subsets: ["latin"],
});

// Georgian glyphs for the hero chart quote only (Plex Mono has none). It must
// stay AFTER Plex Mono in the --font-quote stack: Google's CSS also ships this
// font's Latin faces (`subsets` only controls preloading), so putting it first
// would switch the English/French quote to Noto. Not preloaded: unicode-range
// means the Georgian file is fetched only when Georgian text renders.
const fontGeorgian = Noto_Sans_Georgian({
  variable: "--font-georgian",
  weight: ["300"],
  subsets: ["georgian"],
  preload: false,
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    metadataBase: new URL('https://bbgeorgiatech.com'),
    title: t('title'),
    description: t('description'),
    keywords: t('keywords').split(', '),
    alternates: buildAlternates(locale, ''),
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      type: "website",
      locale: locale,
      alternateLocale: ["en", "fr", "ka"].filter(l => l !== locale),
    },
    twitter: {
      card: "summary_large_image",
      title: t('ogTitle'),
      description: t('ogDescription'),
    }
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
        "image": "https://bbgeorgiatech.com/icon.svg",
        "description": "Fixed-price website design, development and maintenance for small businesses worldwide",
        "areaServed": "Worldwide",
        "knowsAbout": ["Website Design", "Web Development", "E-Commerce", "Website Maintenance", "SEO", "Multilingual Websites", "Small Business Websites"],
        "priceRange": `${formatUsd(START.price)}+`,
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
            {
              "@type": "Offer",
              "name": "Website package: Start",
              "itemOffered": { "@type": "Service", "name": "One-page Website" },
              "priceSpecification": { "@type": "PriceSpecification", "minPrice": START.price, "priceCurrency": CURRENCY },
            },
            {
              "@type": "Offer",
              "name": "Launch Monthly",
              "itemOffered": { "@type": "Service", "name": "Website Design & Development with Maintenance" },
              "priceSpecification": {
                "@type": "UnitPriceSpecification",
                "price": MONTHLY.monthly,
                "priceCurrency": CURRENCY,
                "unitCode": "MON",
                "billingDuration": MONTHLY.months,
              },
            },
            ...PACKAGES.map((p) => ({
              "@type": "Offer",
              "name": `Website package: ${p.key[0].toUpperCase()}${p.key.slice(1)}`,
              "itemOffered": { "@type": "Service", "name": "Website Design & Development" },
              "priceSpecification": { "@type": "PriceSpecification", "minPrice": p.price, "priceCurrency": CURRENCY },
            })),
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
      className={`${fontLogo.variable} ${fontHeading.variable} ${fontBody.variable} ${fontMono.variable} ${fontGeorgian.variable} h-full antialiased dark`}
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
