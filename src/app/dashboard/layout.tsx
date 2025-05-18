import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="md:pl-64">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
} 