import { Shield, Globe, Award, Users } from "lucide-react";

const AboutSection = () => (
  <section id="about" className="py-20 bg-accent/5">
    <div className="container">
      <div className="mx-auto max-w-3xl text-center mb-14">
        <h2 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
          About <span className="text-accent">Our Mission</span>
        </h2>
        <p className="text-muted-foreground">
          We are committed to upholding academic integrity worldwide by providing institutions
          with powerful, accurate, and easy-to-use plagiarism detection tools.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Shield, title: "Trusted Security", desc: "Enterprise-grade encryption for all documents" },
          { icon: Globe, title: "Global Reach", desc: "Used by 500+ institutions across 40 countries" },
          { icon: Award, title: "Award Winning", desc: "Recognized for excellence in EdTech innovation" },
          { icon: Users, title: "Community Driven", desc: "Built with feedback from educators worldwide" },
        ].map((item) => (
          <div key={item.title} className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
              <item.icon className="h-7 w-7 text-accent" />
            </div>
            <h3 className="mb-2 font-heading font-semibold text-foreground">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;
