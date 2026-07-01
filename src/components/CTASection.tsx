import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => (
  <section className="py-20">
    <div className="container">
      <div className="relative overflow-hidden rounded-2xl gradient-hero p-12 text-center md:p-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
        <div className="relative">
          <h2 className="mb-4 font-heading text-3xl font-bold text-primary-foreground md:text-4xl">
            Ready to Protect Your Work?
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-primary-foreground/80">
            Join thousands of institutions using our system to maintain academic integrity.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="gap-2 px-8 text-base font-semibold">
              Create Free Account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default CTASection;
