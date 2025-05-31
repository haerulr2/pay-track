import { ReactNode } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import Topbar from "@/components/layouts/Topbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Topbar */}
      <Topbar />

      {/* Main content */}
      <main className="md:pl-64">
        <div className="min-h-screen pt-16 pb-16">
          {children}
        </div>
      </main>
    </div>
  );
} 