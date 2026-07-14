import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  FolderOpen,
  Search,
  FileText,
  History,
  User,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import logo from "@/assets/logo.png";
import ThemeToggle from "@/components/ThemeToggle";
import { clearSession } from "@/lib/storage";
import { cn } from "@/lib/utils";

const navItems: { icon: LucideIcon; label: string; path: string }[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Upload, label: "Upload Document", path: "/dashboard/upload" },
  { icon: FolderOpen, label: "My Documents", path: "/dashboard/documents" },
  { icon: Search, label: "Plagiarism Results", path: "/dashboard/results" },
  { icon: History, label: "History", path: "/dashboard/history" },
  { icon: User, label: "Profile", path: "/dashboard/settings" },
];

interface StudentSidebarProps {
  onNavigate?: () => void;
}

const StudentSidebar = ({ onNavigate }: StudentSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    onNavigate?.();
    navigate("/login");
  };

  const isActive = (path: string) =>
    path === "/dashboard" ? location.pathname === "/dashboard" : location.pathname.startsWith(path);

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex h-16 items-center gap-3 border-b border-border px-5">
        <img src={logo} alt="Logo" className="h-9 w-9 object-contain" />
        <div>
          <p className="font-heading text-sm font-bold leading-tight text-foreground">Anti-Plagiarism</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Student Portal</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              isActive(item.path)
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="space-y-2 border-t border-border p-4">
        <div className="flex items-center justify-between rounded-lg px-3 py-2">
          <span className="text-sm font-medium text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default StudentSidebar;
