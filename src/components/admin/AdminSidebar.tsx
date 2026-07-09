import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HiOutlineDocumentDuplicate,
  HiOutlineDocumentReport,
  HiOutlineLogout,
  HiOutlineSearchCircle,
  HiOutlineUsers,
  HiOutlineViewGrid,
  HiOutlineCog,
  HiOutlineAcademicCap,
  HiOutlineUserGroup,
} from "react-icons/hi";
import type { IconType } from "react-icons";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";
import { clearSession } from "@/lib/storage";

const navItems: { icon: IconType; label: string; path: string }[] = [
  { icon: HiOutlineViewGrid, label: "Dashboard", path: "/admin" },
  { icon: HiOutlineUsers, label: "Users Management", path: "/admin/users" },
  { icon: HiOutlineAcademicCap, label: "Students", path: "/admin/students" },
  { icon: HiOutlineUserGroup, label: "Lecturers", path: "/admin/lecturers" },
  { icon: HiOutlineDocumentDuplicate, label: "Documents", path: "/admin/documents" },
  { icon: HiOutlineDocumentReport, label: "Plagiarism Reports", path: "/admin/reports" },
  { icon: HiOutlineSearchCircle, label: "Similarity Results", path: "/admin/similarity" },
  { icon: HiOutlineCog, label: "Settings", path: "/admin/settings" },
];

interface AdminSidebarProps {
  onNavigate?: () => void;
}

const AdminSidebar = ({ onNavigate }: AdminSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    onNavigate?.();
    navigate("/login");
  };

  const isActive = (path: string) =>
    path === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(path);

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex h-16 items-center gap-3 border-b border-border px-5">
        <img src={logo} alt="Logo" className="h-9 w-9 object-contain" />
        <div>
          <p className="font-heading text-sm font-bold leading-tight text-foreground">Anti-Plagiarism</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Admin Panel</p>
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
            <item.icon className="h-5 w-5 shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <HiOutlineLogout className="h-5 w-5 shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
