import MarketingLayout from "@/components/MarketingLayout";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import PlatformFunctionalitySection from "@/components/PlatformFunctionalitySection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import CTASection from "@/components/CTASection";

const Index = () => (
  <MarketingLayout>
    <HeroSection />
    <FeaturesSection />
    <HowItWorksSection />
    <PlatformFunctionalitySection />
    <AboutSection />
    <ContactSection />
    <CTASection />
  </MarketingLayout>
);

export default Index;
