import { GridLight } from "../../../components/HeroSection";
import { NavigationBar } from "../../../components/NavigationBar";
import { Footer } from "../../../components/Footer";
import { useTranslations } from "next-intl";

export default function PrivacyPolicy() {
  const t = useTranslations("PrivacyPolicy");

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
            <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tighter text-neutral-50 mb-6 uppercase break-words sm:break-normal">
              {t("title")}
            </h1>
            <p className="font-mono text-sm text-neutral-500">{t("lastUpdated")} {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date()).toLowerCase()}</p>
          </div>

          <div className="space-y-8 font-inter text-neutral-300 leading-relaxed">
            <section>
              <h2 className="font-logo text-2xl font-bold text-white mb-4">[01] {t("h1")}</h2>
              <p className="mb-4">{t("p1")}</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>{t("li1Title")}</strong> {t("li1Desc")}</li>
                <li><strong>{t("li2Title")}</strong> {t("li2Desc")}</li>
              </ul>
            </section>
            
            <section>
              <h2 className="font-logo text-2xl font-bold text-white mb-4">[02] {t("h2")}</h2>
              <p>{t("p2")}</p>
            </section>

            <section>
              <h2 className="font-logo text-2xl font-bold text-white mb-4">[03] {t("h3")}</h2>
              <p>{t("p3")}</p>
            </section>
            
            <section>
              <h2 className="font-logo text-2xl font-bold text-white mb-4">[04] {t("h4")}</h2>
              <p className="mb-4">{t("p4a")}</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>{t("li3Title")}</strong> {t("li3Desc")}</li>
                <li><strong>{t("li4Title")}</strong> {t("li4Desc")}</li>
                <li><strong>{t("li5Title")}</strong> {t("li5Desc")}</li>
              </ul>
              <p className="mt-4 text-sm text-neutral-400">{t("p4b")}</p>
            </section>

            <section>
              <h2 className="font-logo text-2xl font-bold text-white mb-4">[05] {t("h5")}</h2>
              <p>{t("p5")}</p>
            </section>

            <section className="bg-white/5 border border-white/10 p-6 mt-12">
              <h2 className="font-mono text-lg font-bold text-primary mb-2 uppercase tracking-widest">[06] {t("h6")}</h2>
              <p>{t("p6")}</p>
              <a href="mailto:bbgeorgiatech@gmail.com" className="font-mono text-white hover:text-primary transition-colors block mt-2">bbgeorgiatech@gmail.com</a>
            </section>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
