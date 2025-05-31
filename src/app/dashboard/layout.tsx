import React from "react";

import Sidebar from "@/components/layouts/Sidebar";
import Topbar from "@/components/layouts/Topbar";

import type { BaseComponentProps } from "@/types";

/**
 * Dashboard layout component that provides the main structure for dashboard pages.
 *
 * Includes a responsive sidebar, top navigation bar, and main content area
 * with proper spacing and dark mode support.
 *
 * @example
 * ```tsx
 * // Used automatically by Next.js App Router for /dashboard routes
 * <DashboardLayout>
 *   <DashboardPage />
 * </DashboardLayout>
 * ```
 */
interface DashboardLayoutProps extends Pick<BaseComponentProps, "children"> {
  /** The page content to render within the dashboard layout */
  children: React.ReactNode;
}

/**
 * Dashboard layout component providing consistent navigation and structure.
 *
 * Features:
 * - Responsive sidebar navigation
 * - Top navigation bar
 * - Proper spacing for content
 * - Dark mode support
 * - Mobile-friendly design with collapsible sidebar
 */
function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Top Navigation Bar */}
      <Topbar />

      {/* Main Content Area */}
      <main className="md:pl-64">
        <div className="min-h-screen pt-16 pb-16">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
