import {
  Upload, FileText, Settings2, Scissors, BarChart3, Calculator,
  Database, Percent, Highlighter, FileDown, Lock, Users, HardDrive, Zap, MonitorSmartphone
} from "lucide-react";

const features = [
  { icon: Upload, title: "Document Upload", desc: "Upload PDFs, Word docs, and text files for instant analysis." },
  { icon: FileText, title: "Text Extraction", desc: "Automatically reads and extracts content from all document formats." },
  { icon: Settings2, title: "Text Preprocessing", desc: "Cleans and normalizes text for more accurate comparison." },
  { icon: Scissors, title: "Tokenization", desc: "Splits text into meaningful words and sentence fragments." },
  { icon: BarChart3, title: "N-gram Analysis", desc: "Detects patterns using multi-word sequence comparison." },
  { icon: Calculator, title: "Cosine Similarity", desc: "Mathematical similarity scoring between documents." },
  { icon: Database, title: "Database Comparison", desc: "Compares against a growing library of stored documents." },
  { icon: Percent, title: "Similarity Scores", desc: "Clear percentage-based results for every scan." },
  { icon: Highlighter, title: "Match Highlighting", desc: "Pinpoints exactly which passages match other documents." },
  { icon: FileDown, title: "Report Generation", desc: "Download detailed plagiarism reports with evidence." },
  { icon: Lock, title: "User Authentication", desc: "Secure login system protecting all user data." },
  { icon: Users, title: "Role Management", desc: "Admin, lecturer, and student roles with different permissions." },
  { icon: HardDrive, title: "Document Storage", desc: "Securely stores documents for future reference and comparison." },
  { icon: Zap, title: "Fast Processing", desc: "Results in seconds, not minutes — optimized for speed." },
  { icon: MonitorSmartphone, title: "Friendly Interface", desc: "Clean, intuitive design that anyone can use." },
];

const FeaturesSection = () => (
  <section id="features" className="bg-muted/30 py-20">
    <div className="container">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <h2 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
          Everything You Need to <span className="text-primary">Fight Plagiarism</span>
        </h2>
        <p className="text-muted-foreground">
          A comprehensive suite of tools designed for academic institutions, educators, and students.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            style={{ boxShadow: "var(--card-shadow)" }}
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mb-2 font-heading font-semibold text-foreground">{f.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
