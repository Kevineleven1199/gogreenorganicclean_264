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
import { getSession } from "@/src/lib/auth/session";

const HomePage = async () => {
  const session = await getSession();
  const navSession = session ? { name: session.name, role: session.role } : null;

  return (
    <main className="bg-surface">
      <NavBar session={navSession} />
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
};

export default HomePage;
