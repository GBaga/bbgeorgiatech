import type { Metadata } from "next";
import { Manrope, IBM_Plex_Sans, IBM_Plex_Mono, Michroma } from "next/font/google";
import "./globals.css";

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
  title: "BBGeorgiaTech | Engineering Next-Gen Digital Experiences",
  description: "High-tech, futuristic, precise, and professional. We build scalable digital ecosystems for sophisticated stakeholders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontLogo.variable} ${fontHeading.variable} ${fontBody.variable} ${fontMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background-deep text-neutral-50 font-inter">{children}</body>
    </html>
  );
}
