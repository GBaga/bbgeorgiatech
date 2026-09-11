import type { Metadata } from "next";
import { GridLight } from "../../../components/HeroSection";
import { NavigationBar } from "../../../components/NavigationBar";
import { Footer } from "../../../components/Footer";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { buildAlternates } from "../../../lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CookiePolicy" });

  return {
    title: `${t("title")} | BBGeorgiaTech`,
    description: t("metaDescription"),
    alternates: buildAlternates(locale, "/cookie-policy"),
  };
}

export default function CookiePolicy() {
  const t = useTranslations("CookiePolicy");

  return (
    <main className="min-h-screen bg-background-deep relative">
      <NavigationBar />
      
      <section className="relative pt-40 pb-24 px-6 lucien-blueprint min-h-screen">
        <GridLight />
        
        <div className="relative z-10 max-w-4xl mx-auto w-full space-y-12 bg-background-deep/80 backdrop-blur-md p-8 md:p-12 border border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-primary" />
              <h3 className="font-mono text-sm tracking-widest text-primary uppercase">Sys_Compliance</h3>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tighter text-neutral-50 mb-6 uppercase">
              {t("title")}
            </h1>
            <p className="font-mono text-sm text-neutral-500">{t("lastUpdated")} {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date()).toLowerCase()}</p>
          </div>

          <div className="space-y-8 font-inter text-neutral-300 leading-relaxed">
            <section>
              <h2 className="font-logo text-2xl font-bold text-white mb-4">[01] {t("h1")}</h2>
              <p>{t("p1")}</p>
            </section>
            
            <section>
              <h2 className="font-logo text-2xl font-bold text-white mb-4">[02] {t("h2")}</h2>
              <p className="mb-4">{t("p2")}</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>{t("li1Title")}</strong> {t("li1Desc")}</li>
                <li><strong>{t("li2Title")}</strong> {t("li2Desc")}</li>
              </ul>
            </section>
            
            <section>
              <h2 className="font-logo text-2xl font-bold text-white mb-4">[03] {t("h3")}</h2>
              <p className="mb-4">{t("p3")}</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>{t("li3Title")}</strong> {t("li3Desc")}</li>
                <li><strong>{t("li4Title")}</strong> {t("li4Desc")}</li>
              </ul>
            </section>

            <section className="bg-white/5 border border-white/10 p-6 mt-12">
              <h2 className="font-mono text-lg font-bold text-primary mb-2 uppercase tracking-widest">[04] {t("h4")}</h2>
              <p className="mb-4">{t("p4")}</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>{t("li5Title")}</strong> {t("li5Desc")}</li>
                <li><strong>{t("li6Title")}</strong> {t("li6Desc")} <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Analytics Opt-out Browser Add-on</a>.</li>
                <li><strong>{t("li7Title")}</strong> {t("li7Desc")}</li>
              </ul>
            </section>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
