import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBell, FaBars, FaMagnifyingGlass, FaRegCalendar } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getCurrentUser } from "@/lib/storage";
import { LECTURER_NOTIFICATIONS } from "@/data/lecturerData";
import LecturerSidebar from "./LecturerSidebar";

interface LecturerNavbarProps {
  title?: string;
  onSearchChange?: (searchVal: string) => void;
  searchValue?: string;
}

const LecturerNavbar = ({
  title = "Lecturer Dashboard - Anti-Plagiarism System",
  onSearchChange,
  searchValue = "",
}: LecturerNavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const user = getCurrentUser();

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentTime(new Date().toLocaleDateString("en-US", options));
  }, []);

  const initials = user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "L";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-8">
        {/* Mobile menu trigger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <FaBars className="h-5 w-5 text-foreground" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <LecturerSidebar onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Title area */}
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-heading text-lg font-bold text-foreground">{title}</h1>
          <div className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
            <FaRegCalendar className="h-3.5 w-3.5 text-blue-500" />
            <span>{currentTime}</span>
          </div>
        </div>

        {/* Live Search bar */}
        <div className="relative hidden max-w-xs flex-1 md:block">
          <FaMagnifyingGlass className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects, students, reports..."
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="h-9 bg-muted/40 pl-9 pr-4 rounded-xl focus-visible:ring-blue-500 border-border/80"
          />
        </div>

        {/* Notifications center */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl hover:bg-muted">
              <FaBell className="h-4.5 w-4.5 text-muted-foreground hover:text-foreground transition-colors" />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-destructive animate-pulse border-2 border-background" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-2 rounded-xl">
            <DropdownMenuLabel className="font-heading text-sm px-3 py-2">
              Notifications
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            <div className="max-h-64 overflow-y-auto space-y-1">
              {LECTURER_NOTIFICATIONS.map((n) => (
                <DropdownMenuItem
                  key={n.id}
                  className="flex flex-col items-start gap-1 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors focus:bg-muted"
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">{n.title}</span>
                    <span className="text-[10px] text-muted-foreground font-medium">{n.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User avatar menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2.5 px-2 rounded-xl hover:bg-muted transition-colors">
              <Avatar className="h-8 w-8 ring-2 ring-blue-500/10">
                <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-semibold text-foreground lg:inline">
                {user?.fullName ?? "Dr. Lecturer"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-xl p-2">
            <DropdownMenuLabel className="px-3 py-2">
              <p className="text-sm font-semibold text-foreground truncate">{user?.fullName ?? "Dr. Lecturer"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email ?? "lecturer@university.edu"}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
              <Link to="/lecturer/profile">Profile Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
              <Link to="/lecturer/projects">Student Projects</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
              <Link to="/lecturer/reports">Plagiarism Reports</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default LecturerNavbar;
