import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, FileSearch, CheckCircle } from "lucide-react";

const HeroSection = () => (
  <section className="relative overflow-hidden">
    {/* Hero background photo */}
    <div className="pointer-events-none absolute inset-0 -z-10">
      <img
        src="/hero-background.png"
        alt=""
        aria-hidden
        className="h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-background/85 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/90" />
    </div>

    <div className="container py-20 md:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-6 font-heading text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl">
          Protect Academic{" "}
          <span className="gradient-text">Integrity</span>{" "}
          with Confidence
        </h1>

        <p className="mb-8 text-lg text-muted-foreground md:text-xl">
          Advanced plagiarism detection powered by N-gram analysis and cosine similarity.
          Upload documents, get instant results with highlighted matches.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link to="/login">
            <Button size="lg" className="gap-2 px-8 text-base">
              Start Checking Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/how-it-works">
            <Button variant="outline" size="lg" className="px-8 text-base">
              See How It Works
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8">
          {[
            { value: "99.2%", label: "Accuracy Rate" },
            { value: "< 30s", label: "Average Scan Time" },
            { value: "10M+", label: "Documents Scanned" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-heading text-3xl font-bold text-primary">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
