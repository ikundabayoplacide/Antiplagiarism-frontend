import { Link } from "react-router-dom";
import { Upload, FolderOpen, Search, FileText, History, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const actions = [
  { icon: Upload, label: "Upload Document", desc: "Submit a new research file", path: "/dashboard/upload", color: "text-primary", bg: "bg-primary/10" },
  { icon: FolderOpen, label: "My Documents", desc: "View uploaded files", path: "/dashboard/documents", color: "text-accent", bg: "bg-accent/10" },
  { icon: Search, label: "Plagiarism Results", desc: "Check similarity scores", path: "/dashboard/results", color: "text-amber-600", bg: "bg-amber-50" },
  { icon: FileText, label: "Download Reports", desc: "Get PDF/text reports", path: "/dashboard/reports", color: "text-violet-600", bg: "bg-violet-50" },
  { icon: History, label: "Submission History", desc: "Track past submissions", path: "/dashboard/history", color: "text-blue-600", bg: "bg-blue-50" },
  { icon: User, label: "Profile", desc: "Manage your account", path: "/dashboard/settings", color: "text-rose-600", bg: "bg-rose-50" },
];

const QuickActions = () => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {actions.map((action) => (
      <Link key={action.path} to={action.path}>
        <Card className="h-full border-border/60 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
          <CardContent className="flex items-start gap-4 p-5">
            <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", action.bg)}>
              <action.icon className={cn("h-5 w-5", action.color)} />
            </div>
            <div>
              <p className="font-medium text-foreground">{action.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{action.desc}</p>
            </div>
          </CardContent>
        </Card>
      </Link>
    ))}
  </div>
);

export default QuickActions;
