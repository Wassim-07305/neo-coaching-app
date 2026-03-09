import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { StatsSection } from "@/components/landing/stats-section";
import { ServicesSection } from "@/components/landing/services-section";
import { ParcoursSection } from "@/components/landing/parcours-section";
import { ExpertsPreview } from "@/components/landing/experts-preview";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FaqSection } from "@/components/landing/faq-section";
import { NewsletterSection } from "@/components/landing/newsletter-section";
import { BlogSection } from "@/components/landing/blog-section";
import { CtaSection } from "@/components/landing/cta-section";
import { StickyCta } from "@/components/landing/sticky-cta";
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
        <div id="tarifs">
          <PricingSection />
        </div>
        <div id="faq">
          <FaqSection />
        </div>
        <BlogSection />
        <NewsletterSection />
        <CtaSection />
      </main>
      <StickyCta />
      <Footer />
    </>
  );
}
