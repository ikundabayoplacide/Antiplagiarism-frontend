import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, X, GraduationCap, ShieldAlert, BookOpen, Key } from "lucide-react";
import { loginUser } from "@/lib/storage";
import { toast } from "sonner";

const DemoWidget = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user already dismissed the widget in this session
    const dismissed = sessionStorage.getItem("aps_demo_widget_dismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
      return;
    }

    // Auto-open after 2 seconds to catch attention smoothly
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setIsDismissed(true);
    sessionStorage.setItem("aps_demo_widget_dismissed", "true");
  };

  const handleDemoLogin = (email: string, roleName: string, redirectPath: string) => {
    const password = roleName === "student" ? "demo1234" : roleName === "lecturer" ? "lecturer1234" : "admin1234";
    const result = loginUser(email, password);
    if (result.ok) {
      toast.success(`Signed in successfully as ${roleName}!`);
      navigate(redirectPath);
    } else {
      toast.error("Failed to sign in. Please try again.");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Card */}
      {isOpen && (
        <div className="mb-4 w-[360px] rounded-2xl border border-primary/20 bg-background/95 p-5 shadow-2xl backdrop-blur-md animate-fade-up transition-all duration-300">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-4.5 w-4.5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-bold text-foreground">Explore System Demo</h3>
                <p className="text-[11px] text-muted-foreground">Log in with a single click to see the platform</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 space-y-2.5">
            {/* Student Demo Option */}
            <button
              onClick={() => handleDemoLogin("demo@university.edu", "student", "/dashboard")}
              className="group flex w-full items-center justify-between rounded-xl border border-border bg-card p-3 text-left transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 transition-colors group-hover:bg-blue-500/20">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">Student Portal</div>
                  <div className="text-[10px] text-muted-foreground">Upload & check assignment plagiarism</div>
                </div>
              </div>
              <ChevronRightIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
            </button>

            {/* Lecturer Demo Option */}
            <button
              onClick={() => handleDemoLogin("lecturer@university.edu", "lecturer", "/lecturer")}
              className="group flex w-full items-center justify-between rounded-xl border border-border bg-card p-3 text-left transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 transition-colors group-hover:bg-emerald-500/20">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">Lecturer Portal</div>
                  <div className="text-[10px] text-muted-foreground">Manage classes, students & detailed similarity reports</div>
                </div>
              </div>
              <ChevronRightIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
            </button>

            {/* Admin Demo Option */}
            <button
              onClick={() => handleDemoLogin("admin@university.edu", "admin", "/admin")}
              className="group flex w-full items-center justify-between rounded-xl border border-border bg-card p-3 text-left transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 transition-colors group-hover:bg-amber-500/20">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">Admin Portal</div>
                  <div className="text-[10px] text-muted-foreground">Manage user accounts & global statistics</div>
                </div>
              </div>
              <ChevronRightIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground border-t border-border pt-3">
            <Key className="h-3 w-3" />
            <span>No registration required to try the features</span>
          </div>
        </div>
      )}

      {/* Floating Button Bubble */}
      {(!isOpen || isDismissed) && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300 animate-float cursor-pointer group"
          title="Try Demo Account"
        >
          <Sparkles className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-accent"></span>
          </span>
          {/* Tooltip on hover */}
          <span className="absolute right-16 scale-0 rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-all group-hover:scale-100 whitespace-nowrap shadow-md">
            ✨ Try Demo Portal
          </span>
        </button>
      )}
    </div>
  );
};

// Simple inline SVG replacement for Lucide ChevronRight to prevent icon import resolution speed issues
const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default DemoWidget;
