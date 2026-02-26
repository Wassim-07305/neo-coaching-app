import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { StatsSection } from "@/components/landing/stats-section";
import { ServicesSection } from "@/components/landing/services-section";
import { ParcoursSection } from "@/components/landing/parcours-section";
import { ExpertsPreview } from "@/components/landing/experts-preview";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <div id="services">
          <ServicesSection />
        </div>
        <ParcoursSection />
        <ExpertsPreview />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
