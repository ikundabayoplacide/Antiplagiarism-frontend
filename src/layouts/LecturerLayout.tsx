import { ReactNode, useState } from "react";
import { Outlet } from "react-router-dom";
import LecturerSidebar from "@/components/lecturer/LecturerSidebar";
import LecturerNavbar from "@/components/lecturer/LecturerNavbar";

interface LecturerLayoutProps {
  children?: ReactNode;
  title?: string;
}

const LecturerLayout = ({ children, title }: LecturerLayoutProps) => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="min-h-screen bg-muted/20 flex">
      {/* Sidebar - Desktop */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-border bg-card shadow-sm lg:block">
        <LecturerSidebar />
      </aside>

      {/* Main content viewport */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <LecturerNavbar
          title={title}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fade-in overflow-y-auto">
          {children || <Outlet context={{ searchValue, setSearchValue }} />}
        </main>
      </div>
    </div>
  );
};

export default LecturerLayout;
