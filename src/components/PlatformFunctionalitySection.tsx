import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Upload,
  FolderOpen,
  FileText,
  Settings,
  Users,
  LogIn,
  UserPlus,
  ArrowRight,
} from "lucide-react";

const platformItems = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    desc: "Overview of total scans, original vs flagged documents, recent activity, and quick upload.",
    path: "/dashboard",
    cta: "Open Dashboard",
  },
  {
    icon: Upload,
    title: "Upload Document",
    desc: "Upload PDF, Word, or text files. Run plagiarism analysis and view similarity scores with matched passages.",
    path: "/dashboard/upload",
    cta: "Upload & Scan",
  },
  {
    icon: FolderOpen,
    title: "My Documents",
    desc: "Search, view, and manage all previously uploaded documents and their scan results.",
    path: "/dashboard/documents",
    cta: "View Documents",
  },
  {
    icon: FileText,
    title: "Reports",
    desc: "Download detailed plagiarism reports with similarity scores, dates, and evidence summaries.",
    path: "/dashboard/reports",
    cta: "View Reports",
  },
  {
    icon: Settings,
    title: "Settings",
    desc: "Update profile, notification preferences, and account security options.",
    path: "/dashboard/settings",
    cta: "Manage Settings",
  },
  {
    icon: Users,
    title: "Manage Users",
    desc: "Admins can view accounts, assign roles (student, lecturer, admin), and manage access.",
    path: "/dashboard/users",
    cta: "Manage Users",
  },
];

const authItems = [
  {
    icon: LogIn,
    title: "Log In",
    desc: "Sign in to access your dashboard, documents, and reports.",
    path: "/login",
    cta: "Sign In",
  },
  {
    icon: UserPlus,
    title: "Register",
    desc: "Create a free account with role selection for students, lecturers, or admins.",
    path: "/register",
    cta: "Create Account",
  },
];

const PlatformFunctionalitySection = () => (
  <section id="platform" className="bg-muted/30 py-20">
    <div className="container">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <h2 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
          Platform <span className="text-accent">Functionality</span>
        </h2>
        <p className="text-muted-foreground">
          Everything available inside the system after you sign in — dashboard tools, document workflow, and account management.
        </p>
      </div>

      <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {platformItems.map((item) => (
          <div
            key={item.title}
            className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            style={{ boxShadow: "var(--card-shadow)" }}
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <item.icon className="h-5 w-5" />
            </div>
            <h3 className="mb-2 font-heading font-semibold text-foreground">{item.title}</h3>
            <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            <Link to={item.path}>
              <Button variant="outline" size="sm" className="w-full gap-2 border-accent/30 text-accent hover:bg-accent/10">
                {item.cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-3xl">
        <h3 className="mb-6 text-center font-heading text-xl font-bold text-foreground">Account Access</h3>
        <div className="grid gap-6 sm:grid-cols-2">
          {authItems.map((item) => (
            <div
              key={item.title}
              className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-heading font-semibold text-foreground">{item.title}</h3>
              <p className="mb-4 flex-1 text-sm text-muted-foreground">{item.desc}</p>
              <Link to={item.path}>
                <Button size="sm" className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                  {item.cta}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default PlatformFunctionalitySection;
