import { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => (
  <div className="min-h-screen bg-muted/30">
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-border bg-card shadow-sm lg:block">
      <AdminSidebar />
    </aside>

    <div className="lg:pl-64">
      <AdminNavbar title={title} />
      <main className="p-4 md:p-6 lg:p-8">{children}</main>
    </div>
  </div>
);

export default AdminLayout;
