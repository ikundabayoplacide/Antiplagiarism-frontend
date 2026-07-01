import MarketingLayout from "@/components/MarketingLayout";
import PageHeader from "@/components/PageHeader";
import FeaturesSection from "@/components/FeaturesSection";

const Features = () => (
  <MarketingLayout>
    <PageHeader
      title="System"
      highlight="Features"
      description="Explore every capability of our plagiarism detection engine — from document upload to detailed reports and role-based access."
    />
    <FeaturesSection />
  </MarketingLayout>
);

export default Features;
