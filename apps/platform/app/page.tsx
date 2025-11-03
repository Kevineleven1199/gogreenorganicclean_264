import { NavBar } from "@/src/components/NavBar";
import { HeroSection } from "@/src/components/HeroSection";
import { AboutSection } from "@/src/components/AboutSection";
import { PillarsSection } from "@/src/components/PillarsSection";
import { ServicesSection } from "@/src/components/ServicesSection";
import { HowItWorks } from "@/src/components/HowItWorks";
import { ServiceAreasSection } from "@/src/components/ServiceAreasSection";
import { PromoBanner } from "@/src/components/PromoBanner";
import { QuickServicesRow } from "@/src/components/QuickServicesRow";
import { Footer } from "@/src/components/Footer";

const HomePage = () => (
  <main className="bg-surface">
    <NavBar />
    <HeroSection />
    <AboutSection />
    <PillarsSection />
    <ServicesSection />
    <HowItWorks />
    <ServiceAreasSection />
    <PromoBanner />
    <QuickServicesRow />
    <Footer />
  </main>
);

export default HomePage;
