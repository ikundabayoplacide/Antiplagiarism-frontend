import MarketingLayout from "@/components/MarketingLayout";
import PageHeader from "@/components/PageHeader";
import ContactSection from "@/components/ContactSection";

const Contact = () => (
  <MarketingLayout>
    <PageHeader
      title="Contact"
      highlight="Us"
      description="Reach our support team for demos, institutional plans, technical help, or partnership inquiries."
    />
    <ContactSection />
  </MarketingLayout>
);

export default Contact;
