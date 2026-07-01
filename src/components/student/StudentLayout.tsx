import { ReactNode } from "react";
import StudentSidebar from "./StudentSidebar";
import StudentNavbar from "./StudentNavbar";

interface StudentLayoutProps {
  children: ReactNode;
  title?: string;
}

const StudentLayout = ({ children, title }: StudentLayoutProps) => (
  <div className="min-h-screen bg-muted/30">
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-border bg-card shadow-sm lg:block">
      <StudentSidebar />
    </aside>

    <div className="lg:pl-64">
      <StudentNavbar title={title} />
      <main className="p-4 md:p-6 lg:p-8">{children}</main>
    </div>
  </div>
);

export default StudentLayout;
