import type { Metadata } from "next";
import { GridLight } from "../../../components/HeroSection";
import { NavigationBar } from "../../../components/NavigationBar";
import { Footer } from "../../../components/Footer";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { buildAlternates } from "../../../lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Terms" });

  return {
    title: `${t("title")} | BBGeorgiaTech`,
    description: t("metaDescription"),
    alternates: buildAlternates(locale, "/terms-and-conditions"),
  };
}

export default function TermsAndConditions() {
  const t = useTranslations("Terms");

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
              <p className="mb-4">{t("p2a")}</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>{t("li1")}</li>
                <li>{t("li2")}</li>
                <li>{t("li3")}</li>
                <li>{t("li4")}</li>
              </ul>
              <p className="mt-4">{t("p2b")}</p>
            </section>

            <section>
              <h2 className="font-logo text-2xl font-bold text-white mb-4">[03] {t("h3")}</h2>
              <p>{t("p3")}</p>
            </section>
            
            <section>
              <h2 className="font-logo text-2xl font-bold text-white mb-4">[04] {t("h4")}</h2>
              <p>{t("p4")}</p>
            </section>

            <section>
              <h2 className="font-logo text-2xl font-bold text-white mb-4">[05] {t("h5")}</h2>
              <p>{t("p5")}</p>
            </section>

            <section className="bg-white/5 border border-white/10 p-6 mt-12">
              <h2 className="font-mono text-lg font-bold text-primary mb-2 uppercase tracking-widest">[06] {t("h6")}</h2>
              <p>{t("p6")}</p>
            </section>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
