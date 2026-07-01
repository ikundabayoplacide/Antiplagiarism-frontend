import MarketingLayout from "@/components/MarketingLayout";
import PageHeader from "@/components/PageHeader";
import HowItWorksSection from "@/components/HowItWorksSection";

const HowItWorks = () => (
  <MarketingLayout>
    <PageHeader
      title="How It"
      highlight="Works"
      description="Follow the four-step workflow: upload, analyze, review your similarity score, and download a full plagiarism report."
    />
    <HowItWorksSection />
  </MarketingLayout>
);

export default HowItWorks;
