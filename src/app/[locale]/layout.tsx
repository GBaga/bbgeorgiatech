import type { Metadata } from "next";
import { Manrope, IBM_Plex_Sans, IBM_Plex_Mono, Michroma } from "next/font/google";
import "../globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { CookieBanner } from "../../components/CookieBanner";
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
    "@type": "ProfessionalService",
    "name": "BBGeorgiaTech",
    "url": "https://bbgeorgiatech.com",
    "image": "https://bbgeorgiatech.com/icon.svg",
    "description": "Website Design, Development & Maintenance",
    "areaServed": ["Georgia", "Europe", "Global"],
    "knowsAbout": ["Website Design", "Web Development", "E-Commerce", "Website Maintenance", "SEO"],
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
          {children}
          <CookieBanner />
          {process.env.NODE_ENV === "production" && (
            <>
              <Analytics />
              <SpeedInsights />
            </>
          )}
          {process.env.NEXT_PUBLIC_GA_ID && (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
          )}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
