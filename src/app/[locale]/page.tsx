import { NavigationBar } from "@/components/NavigationBar";
import { HeroSection } from "@/components/HeroSection";
import { getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";
import { priceParams } from "@/data/pricing";
import { ChapterRail } from "@/components/effects/ChapterRail";

const CoreCompetencies = dynamic(() => import("@/components/CoreCompetencies").then(m => m.CoreCompetencies));
const TechStack = dynamic(() => import("@/components/TechStack").then(m => m.TechStack));
const ProcessSection = dynamic(() => import("@/components/ProcessSection").then(m => m.ProcessSection));
const DeployedSystems = dynamic(() => import("@/components/DeployedSystems").then(m => m.DeployedSystems));
const ParadoxOfScale = dynamic(() => import("@/components/ParadoxOfScale").then(m => m.ParadoxOfScale));
const TestimonialsSection = dynamic(() => import("@/components/TestimonialsSection").then(m => m.TestimonialsSection));
const FAQSection = dynamic(() => import("@/components/FAQSection").then(m => m.FAQSection));
const BrandHeritage = dynamic(() => import("@/components/BrandHeritage").then(m => m.BrandHeritage));
const WhoWeHelp = dynamic(() => import("@/components/home/WhoWeHelp").then(m => m.WhoWeHelp));
const WhyTeaser = dynamic(() => import("@/components/home/WhyTeaser").then(m => m.WhyTeaser));
const PricingTeaser = dynamic(() => import("@/components/home/PricingTeaser").then(m => m.PricingTeaser));
const ContactProtocol = dynamic(() => import("@/components/ContactProtocol").then(m => m.ContactProtocol));
const Footer = dynamic(() => import("@/components/Footer").then(m => m.Footer));

export default async function Home() {
  const t = await getTranslations("FAQSection");
  const tn = await getTranslations("Navigation");
  const tv = await getTranslations("Verticals");
  const tproc = await getTranslations("ProcessSection");
  const thome = await getTranslations("Home");

  // Side index of the page (wide screens), in section order.
  const chapters = [
    { id: "competencies", label: tn("competencies") },
    { id: "industries", label: tv("ui.industries") },
    { id: "process", label: `${tproc("title1")} ${tproc("title2")}` },
    { id: "systems", label: tn("systems") },
    { id: "why", label: thome("why.eyebrow") },
    { id: "pricing", label: tn("pricing") },
    { id: "faq", label: "FAQ" },
    { id: "heritage", label: tn("heritage") },
    { id: "contact", label: tn("contact") },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [1, 2, 3, 4, 5].map((n) => ({
      "@type": "Question",
      "name": t(`q${n}`),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": t(`a${n}`, priceParams()),
      },
    })),
  };

  return (
    <main className="flex flex-col min-h-screen overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <NavigationBar />
      <ChapterRail items={chapters} hideOn={["competencies"]} neutral={["paradox", "tech-stack"]} />

      <div id="hero"><HeroSection /></div>
      <div id="competencies"><CoreCompetencies /></div>
      <div id="industries"><WhoWeHelp /></div>
      <div id="process"><ProcessSection /></div>
      <div id="systems"><DeployedSystems /></div>
      <div id="why"><WhyTeaser /></div>
      <div id="pricing"><PricingTeaser /></div>
      <div id="paradox"><ParadoxOfScale /></div>
      {/* Tech details matter less to small-business buyers, so they come later */}
      <div id="tech-stack"><TechStack /></div>
      {/* <div id="testimonials"><TestimonialsSection /></div> */}
      <div id="faq"><FAQSection /></div>
      <div id="heritage"><BrandHeritage /></div>
      <div id="contact"><ContactProtocol /></div>

      <Footer />
    </main>
  );
}
