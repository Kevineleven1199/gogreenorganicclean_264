import { NavBar } from "@/src/components/NavBar";
import { HeroSection } from "@/src/components/HeroSection";
import { AboutSection } from "@/src/components/AboutSection";
import { PillarsSection } from "@/src/components/PillarsSection";
import { ServicesSection } from "@/src/components/ServicesSection";
import { HowItWorks } from "@/src/components/HowItWorks";
import { ServiceAreasSection } from "@/src/components/ServiceAreasSection";
import { StatsSection } from "@/src/components/StatsSection";
import { TestimonialsSection } from "@/src/components/TestimonialsSection";
import { CredentialsSection } from "@/src/components/CredentialsSection";
import { FAQSection } from "@/src/components/FAQSection";
import { QuoteSection } from "@/src/components/QuoteSection";
import { Footer } from "@/src/components/Footer";

const HomePage = () => (
  <main className="bg-surface">
    <NavBar />
    <HeroSection />
    <StatsSection />
    <PillarsSection />
    <ServicesSection />
    <HowItWorks />
    <CredentialsSection />
    <TestimonialsSection />
    <AboutSection />
    <ServiceAreasSection />
    <FAQSection />
    <QuoteSection />
    <Footer />
  </main>
);

export default HomePage;
