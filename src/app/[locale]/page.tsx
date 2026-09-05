import { NavigationBar } from "@/components/NavigationBar";
import { HeroSection } from "@/components/HeroSection";
import dynamic from "next/dynamic";

const CoreCompetencies = dynamic(() => import("@/components/CoreCompetencies").then(m => m.CoreCompetencies));
const TechStack = dynamic(() => import("@/components/TechStack").then(m => m.TechStack));
const ProcessSection = dynamic(() => import("@/components/ProcessSection").then(m => m.ProcessSection));
const DeployedSystems = dynamic(() => import("@/components/DeployedSystems").then(m => m.DeployedSystems));
const ParadoxOfScale = dynamic(() => import("@/components/ParadoxOfScale").then(m => m.ParadoxOfScale));
const TestimonialsSection = dynamic(() => import("@/components/TestimonialsSection").then(m => m.TestimonialsSection));
const FAQSection = dynamic(() => import("@/components/FAQSection").then(m => m.FAQSection));
const BrandHeritage = dynamic(() => import("@/components/BrandHeritage").then(m => m.BrandHeritage));
const ContactProtocol = dynamic(() => import("@/components/ContactProtocol").then(m => m.ContactProtocol));
const Footer = dynamic(() => import("@/components/Footer").then(m => m.Footer));

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen overflow-x-hidden">
      <NavigationBar />

      <div id="hero"><HeroSection /></div>
      <div id="competencies"><CoreCompetencies /></div>
      <div id="tech-stack"><TechStack /></div>
      <div id="process"><ProcessSection /></div>
      <div id="systems"><DeployedSystems /></div>
      <div id="paradox"><ParadoxOfScale /></div>
      {/* <div id="testimonials"><TestimonialsSection /></div> */}
      <div id="faq"><FAQSection /></div>
      <div id="heritage"><BrandHeritage /></div>
      <div id="contact"><ContactProtocol /></div>

      <Footer />
    </main>
  );
}
