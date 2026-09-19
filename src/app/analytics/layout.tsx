import { ReactNode } from "react";

import Sidebar from "@/components/layouts/Sidebar";
import Topbar from "@/components/layouts/Topbar";

interface AnalyticsLayoutProps {
  children: ReactNode;
}

export default function AnalyticsLayout({ children }: AnalyticsLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Topbar */}
      <Topbar />

      {/* Main content */}
      <main className="md:pl-64">
        <div className="min-h-screen pb-16 pt-16">{children}</div>
      </main>
    </div>
  );
}
