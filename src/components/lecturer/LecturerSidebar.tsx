import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaChartPie,
  FaBookOpen,
  FaFileShield,
  FaTriangleExclamation,
  FaUserGraduate,
  FaDownload,
  FaCircleUser,
  FaArrowRightFromBracket,
} from "react-icons/fa6";
import type { IconType } from "react-icons";
import logo from "@/assets/logo.png";
import ThemeToggle from "@/components/ThemeToggle";
import { clearSession } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SidebarItem {
  icon: IconType;
  label: string;
  path: string;
}

const navItems: SidebarItem[] = [
  { icon: FaChartPie, label: "Dashboard", path: "/lecturer" },
  { icon: FaBookOpen, label: "Student Projects", path: "/lecturer/projects" },
  { icon: FaFileShield, label: "Plagiarism Reports", path: "/lecturer/reports" },
  { icon: FaTriangleExclamation, label: "High Similarity Alerts", path: "/lecturer/alerts" },
  { icon: FaUserGraduate, label: "My Students", path: "/lecturer/students" },
  { icon: FaDownload, label: "Downloads", path: "/lecturer/downloads" },
  { icon: FaCircleUser, label: "Profile", path: "/lecturer/profile" },
];

interface LecturerSidebarProps {
  onNavigate?: () => void;
}

const LecturerSidebar = ({ onNavigate }: LecturerSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    toast.success("Successfully logged out");
    onNavigate?.();
    navigate("/login");
  };

  const isActive = (path: string) => {
    if (path === "/lecturer") {
      return location.pathname === "/lecturer";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-full flex-col bg-card border-r border-border">
      {/* Brand logo & title */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-5 bg-muted/20">
        <img src={logo} alt="Logo" className="h-9 w-9 object-contain" />
        <div>
          <p className="font-heading text-sm font-bold leading-tight text-foreground">Anti-Plagiarism</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Lecturer Portal</p>
        </div>
      </div>

      {/* Nav list */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 transform hover:translate-x-1",
                active
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/10"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0 transition-transform duration-300", active ? "scale-110" : "")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Theme and Logout footer */}
      <div className="space-y-2 border-t border-border p-4 bg-muted/10">
        <div className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Interface Theme</span>
          <ThemeToggle />
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-destructive/10 hover:text-destructive hover:translate-x-1"
        >
          <FaArrowRightFromBracket className="h-4 w-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default LecturerSidebar;
