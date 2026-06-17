import type { Metadata } from "next";
import { Manrope, IBM_Plex_Sans, IBM_Plex_Mono, Michroma } from "next/font/google";
import "../globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { CookieBanner } from "../../components/CookieBanner";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

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

export const metadata: Metadata = {
  title: "BBGeorgiaTech | Enterprise Full-Stack Architecture",
  description: "Elite engineering firm specializing in Headless Next.js Ecosystems, Decoupled Data Pipelines, and Global Edge Infrastructure.",
  keywords: ["Enterprise Architecture", "Next.js", "NestJS", "Headless CMS", "Software Engineering Georgia", "Tech Agency France", "B2B Infrastructure"],
  openGraph: {
    title: "BBGeorgiaTech | Enterprise Full-Stack Architecture",
    description: "Decoupled. Scalable. Global. We build secure infrastructure for high-trust B2B operations.",
    type: "website",
    locale: "en_US",
    alternateLocale: ["fr_FR", "ka_GE"],
  },
  twitter: {
    card: "summary_large_image",
    title: "BBGeorgiaTech | Enterprise Architecture",
    description: "Decoupled. Scalable. Global.",
  }
};

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
    "description": "Enterprise Full-Stack Architecture",
    "areaServed": ["Georgia", "France", "Global"],
    "knowsAbout": ["Software Architecture", "Next.js", "NestJS", "Cloud Infrastructure"],
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
          <Analytics />
          <SpeedInsights />
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID as string} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
