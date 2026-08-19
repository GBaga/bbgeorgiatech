import { NavigationBar } from "@/components/NavigationBar";
import { HeroSection } from "@/components/HeroSection";
import { CoreCompetencies } from "@/components/CoreCompetencies";
import { TechStack } from "@/components/TechStack";
import { DeployedSystems } from "@/components/DeployedSystems";
import { ProcessSection } from "@/components/ProcessSection";
import { ParadoxOfScale } from "@/components/ParadoxOfScale";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FAQSection } from "@/components/FAQSection";
import { BrandHeritage } from "@/components/BrandHeritage";
import { ContactProtocol } from "@/components/ContactProtocol";
import { Footer } from "@/components/Footer";

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
