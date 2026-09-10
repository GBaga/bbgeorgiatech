import type { Metadata } from "next";
import { Manrope, IBM_Plex_Sans, IBM_Plex_Mono, Michroma } from "next/font/google";
import "../globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { MotionConfig } from "framer-motion";
import { CookieBanner } from "../../components/CookieBanner";
import { AnalyticsGate } from "../../components/AnalyticsGate";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';

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
  weight: ["400", "500"],
  subsets: ["latin"],
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
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'fr': '/fr',
        'ka': '/ka',
        'x-default': '/en',
      },
    },
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
        "description": "Website Design, Development & Maintenance",
        "areaServed": ["Georgia", "Europe", "Global"],
        "knowsAbout": ["Website Design", "Web Development", "E-Commerce", "Website Maintenance", "SEO"],
        "priceRange": "$$",
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
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Website Design & Development" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "E-Commerce Solutions" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Maintenance & Support" } },
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
      className={`${fontLogo.variable} ${fontHeading.variable} ${fontBody.variable} ${fontMono.variable} h-full antialiased dark`}
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
