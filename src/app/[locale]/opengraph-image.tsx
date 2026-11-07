import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { routing } from "../../i18n/routing";
import { START, formatUsd } from "../../data/pricing";

// Share image for every page of a locale. Pages that set their own
// `openGraph` keep it via ogImages() in lib/seo.ts. Prerendered at build for
// each locale, but with OpenNext's default (dummy) cache the route can also
// run inside the Cloudflare Worker, so fonts are fetched, not read from disk.
export const alt = "BBGeorgiaTech: fixed-price websites for small businesses";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Manrope covers Latin (en/fr); Noto Sans Georgian covers Georgian. Satori
// picks the font per glyph, so mixed text renders correctly. These are the
// "latin" and "georgian" WOFF subsets Google Fonts serves (Satori can't read
// WOFF2). If a fetch fails the image still renders, with the default font.
const GSTATIC = "https://fonts.gstatic.com/s";
const FONTS = [
  { name: "Manrope", weight: 700, url: `${GSTATIC}/manrope/v23/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk4aE9_C-b8.woff` },
  { name: "Manrope", weight: 500, url: `${GSTATIC}/manrope/v23/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk7PFN_C-b8.woff` },
  { name: "Noto Sans Georgian", weight: 700, url: `${GSTATIC}/notosansgeorgian/v49/PlIaFke5O6RzLfvNNVSitxkr76PRHBC4Ytyq-Gof7PUs4S7zWn-8YDB09HFNdpsAy2jmdZK60A.woff` },
  { name: "Noto Sans Georgian", weight: 500, url: `${GSTATIC}/notosansgeorgian/v49/PlIaFke5O6RzLfvNNVSitxkr76PRHBC4Ytyq-Gof7PUs4S7zWn-8YDB09HFNdpvVzGjmdZK60A.woff` },
] as const;

async function loadFonts() {
  const loaded = await Promise.all(
    FONTS.map(async (f) => {
      try {
        const res = await fetch(f.url);
        if (!res.ok) return null;
        return { name: f.name, weight: f.weight, style: "normal" as const, data: await res.arrayBuffer() };
      } catch {
        return null;
      }
    })
  );
  return loaded.filter((f) => f !== null);
}

const NAVY = "#080d2c";
const BLUE = "#5c9cff";

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const fonts = await loadFonts();
  const price = formatUsd(START.price);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: `radial-gradient(circle at 85% 15%, rgba(92,156,255,0.28), transparent 55%), ${NAVY}`,
          color: "white",
          fontFamily: "Manrope, Noto Sans Georgian",
        }}
      >
        {/* Logo mark (same shape as icon.svg) + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="56" height="56" viewBox="0 0 32 32">
            <rect x="4" y="6" width="6" height="6" fill={BLUE} />
            <rect x="13" y="6" width="6" height="6" fill={BLUE} />
            <rect x="22" y="6" width="6" height="6" fill={BLUE} />
            <rect x="13" y="15" width="6" height="11" fill={BLUE} />
          </svg>
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: 4 }}>BBGEORGIATECH</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ width: 96, height: 6, background: BLUE }} />
          <div style={{ fontSize: locale === "ka" ? 60 : 72, fontWeight: 700, lineHeight: 1.15, maxWidth: 1000 }}>
            {t("ogTagline")}
          </div>
          <div style={{ fontSize: locale === "ka" ? 28 : 32, fontWeight: 500, color: "#b8c4e6" }}>{t("ogFacts", { price })}</div>
        </div>

        <div style={{ display: "flex", fontSize: 26, fontWeight: 500, color: BLUE }}>bbgeorgiatech.com</div>
      </div>
    ),
    {
      ...size,
      fonts,
    }
  );
}
