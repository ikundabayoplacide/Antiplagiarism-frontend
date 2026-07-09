import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Shield, BookOpen, Phone, Info, LogOut, LayoutGrid } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";
import ThemeToggle from "@/components/ThemeToggle";
import { clearSession, getCurrentUser, isLoggedIn } from "@/lib/storage";

const navLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Features", href: "/features", icon: Shield },
  { label: "How It Works", href: "/how-it-works", icon: BookOpen },
  { label: "Platform", href: "/platform", icon: LayoutGrid },
  { label: "About", href: "/about", icon: Info },
  { label: "Contact", href: "/contact", icon: Phone },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(() => isLoggedIn());
  const currentUser = loggedIn ? getCurrentUser() : null;
  const dashboardPath =
    currentUser?.role === "admin"
      ? "/admin"
      : currentUser?.role === "lecturer"
      ? "/lecturer"
      : "/dashboard";

  const handleLogout = () => {
    clearSession();
    setLoggedIn(false);
    setMobileOpen(false);
    navigate("/");
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Anti-Plagiarism System" className="h-12 w-12 object-contain" />
          <span className="font-heading text-lg font-bold text-foreground">
            Anti-Plagiarism <span className="text-accent">System</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent ${
                isActive(link.href) ? "text-accent font-semibold" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {loggedIn ? (
            <>
              <Link to={dashboardPath}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-accent/30 text-accent hover:bg-accent/10 hover:text-accent"
                >
                  Dashboard
                </Button>
              </Link>
              <Button variant="destructive" size="sm" className="gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Log Out
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Get Started
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button className="rounded-lg p-2 hover:bg-muted" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background p-4 md:hidden animate-fade-in">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent ${
                  isActive(link.href) ? "bg-accent/10 text-accent font-semibold" : "text-muted-foreground"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
              {loggedIn ? (
                <>
                  <Link to={dashboardPath} onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full border-accent/30 text-accent hover:bg-accent/10">Dashboard</Button>
                  </Link>
                  <Button variant="destructive" className="w-full gap-2" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </Button>
                </>
              ) : (
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Get Started</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
