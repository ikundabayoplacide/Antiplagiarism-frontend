import MarketingLayout from "@/components/MarketingLayout";
import PageHeader from "@/components/PageHeader";
import PlatformFunctionalitySection from "@/components/PlatformFunctionalitySection";

const Platform = () => (
  <MarketingLayout>
    <PageHeader
      title="Platform"
      highlight="Tools"
      description="Access your dashboard, upload documents, manage files, view reports, configure settings, and sign in to the full application."
    />
    <PlatformFunctionalitySection />
  </MarketingLayout>
);

export default Platform;
