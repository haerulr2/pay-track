import { ReactNode } from "react";

import Sidebar from "@/components/layouts/Sidebar";
import Topbar from "@/components/layouts/Topbar";

interface DevelopersLayoutProps {
  children: ReactNode;
}

export default function DevelopersLayout({ children }: DevelopersLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <Sidebar />
      <Topbar />
      <main className="md:pl-64">
        <div className="min-h-screen pb-16 pt-16">{children}</div>
      </main>
    </div>
  );
}
