import { HeroSection } from "@/components/HeroSection";
import { TrustHighlights } from "@/components/TrustHighlights";
import { AboutSection } from "@/components/AboutSection";
import { ServicesSection } from "@/components/ServicesSection";
import { ProjectGallery } from "@/components/ProjectGallery";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { WorkProcess } from "@/components/WorkProcess";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FAQSection } from "@/components/FAQSection";
import { CTASection } from "@/components/CTASection";
import { ContactSection } from "@/components/ContactSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustHighlights />
      <AboutSection />
      <ServicesSection />
      <ProjectGallery />
      <WhyChooseUs />
      <WorkProcess />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <ContactSection />
    </>
  );
}
