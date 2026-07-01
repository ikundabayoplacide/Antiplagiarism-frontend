import MarketingLayout from "@/components/MarketingLayout";
import PageHeader from "@/components/PageHeader";
import AboutSection from "@/components/AboutSection";

const About = () => (
  <MarketingLayout>
    <PageHeader
      title="About"
      highlight="Us"
      description="Our mission is to help institutions protect academic integrity with secure, accurate, and easy-to-use plagiarism detection."
    />
    <AboutSection />
  </MarketingLayout>
);

export default About;
