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
  title: "BBGeorgiaTech | Website Design, Development & Maintenance",
  description: "Custom website design, development, and ongoing maintenance. Fast, modern websites for businesses in Georgia, France, and globally. Get a free quote today.",
  keywords: ["Website Design Georgia", "Web Development France", "B2B Website", "Next.js Development", "Web Agency", "Custom Websites", "Bagauri Bonds"],
  openGraph: {
    title: "BBGeorgiaTech | Custom Website Design & Development",
    description: "Fast, modern websites designed to grow your business. Proudly part of the Bagauri Bonds Georgia group.",
    type: "website",
    locale: "en_US",
    alternateLocale: ["fr_FR", "ka_GE"],
  },
  twitter: {
    card: "summary_large_image",
    title: "BBGeorgiaTech | Custom Websites",
    description: "Fast, modern websites designed to grow your business.",
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
    "description": "Website Design, Development & Maintenance",
    "areaServed": ["Georgia", "France", "Global"],
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
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID as string} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
