import { useState } from "react";
import { Upload, Search, BarChart3, FileDown } from "lucide-react";

const steps = [
  { icon: Upload, step: "01", title: "Upload Document", desc: "Upload your PDF, Word, or text file to the platform." },
  { icon: Search, step: "02", title: "Analysis & Comparison", desc: "Our engine tokenizes, preprocesses, and compares against the database." },
  { icon: BarChart3, step: "03", title: "Get Similarity Score", desc: "Receive a clear percentage showing how much content is original." },
  { icon: FileDown, step: "04", title: "Download Report", desc: "Get a detailed report with highlighted matches and sources." },
];

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="py-20">
      <div className="container">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
            How It <span className="text-accent">Works</span>
          </h2>
          <p className="text-muted-foreground">Click each step to explore how the process works.</p>
        </div>

        <div className="relative grid gap-8 md:grid-cols-4">
          {/* Connector line */}
          <div className="absolute left-0 right-0 top-14 hidden h-0.5 bg-gradient-to-r from-primary via-primary/50 to-accent md:block" />
          {steps.map((s, index) => {
            const isActive = activeStep === index;
            return (
              <button
                key={s.step}
                type="button"
                onClick={() => setActiveStep(index)}
                className={`relative rounded-xl p-3 text-center transition-all ${
                  isActive ? "bg-primary/5 ring-1 ring-primary/30" : "hover:bg-muted/40"
                }`}
                aria-pressed={isActive}
              >
                <div className="relative mx-auto mb-6 flex h-28 w-28 items-center justify-center">
                  <div className={`absolute inset-0 rounded-full ${isActive ? "bg-primary/15" : "bg-primary/5"}`} />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full gradient-hero">
                    <s.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                </div>
                <div className="mb-2 text-sm font-bold text-primary">STEP {s.step}</div>
                <h3 className="mb-2 font-heading text-lg font-bold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </button>
            );
          })}
        </div>

        <div
          key={steps[activeStep].step}
          className="mx-auto mt-8 max-w-3xl rounded-xl border border-border bg-card p-6 shadow-sm animate-fade-up"
        >
          <p className="mb-2 text-xs font-semibold tracking-wide text-primary">STEP {steps[activeStep].step}</p>
          <h4 className="mb-2 font-heading text-xl font-bold text-foreground">{steps[activeStep].title}</h4>
          <p className="text-sm text-muted-foreground">{steps[activeStep].desc}</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
