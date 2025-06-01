import Sidebar from "@/components/layouts/Sidebar";
import Topbar from "@/components/layouts/Topbar";
import { ReactNode } from "react";

interface TransactionsLayoutProps {
  children: ReactNode;
}

export default function TransactionsLayout({ children }: TransactionsLayoutProps) {
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
