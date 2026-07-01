import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="border-t border-border bg-muted/50">
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
            <span className="font-heading font-bold text-foreground">Anti-Plagiarism</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Ensuring academic integrity with advanced plagiarism detection technology.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-heading font-semibold text-foreground">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/features" className="hover:text-primary">Features</Link></li>
            <li><Link to="/how-it-works" className="hover:text-primary">How It Works</Link></li>
            <li><Link to="/platform" className="hover:text-primary">Platform</Link></li>
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/login" className="hover:text-primary">Log In</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-heading font-semibold text-foreground">Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-primary">Help Center</a></li>
            <li><Link to="/contact" className="hover:text-primary">Contact Us</Link></li>
            <li><a href="#" className="hover:text-primary">API Docs</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-heading font-semibold text-foreground">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Anti-Plagiarism System. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
