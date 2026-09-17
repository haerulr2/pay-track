"use client";

import { Bell, ChevronRight, Plus, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

import ThemeToggle from "@/components/ThemeToggle";
import SearchDialog from "@/components/SearchDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Topbar() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  const getBreadcrumb = (path: string) => {
    if (path === "/dashboard" || path === "/") {
      return { section: "Finance", page: "Overview" };
    }
    if (path.startsWith("/transactions")) {
      return { section: "Finance", page: "Transactions" };
    }
    if (path.startsWith("/invoices")) {
      return { section: "Finance", page: "Invoices" };
    }
    if (path.startsWith("/customers")) {
      return { section: "Finance", page: "Customers" };
    }
    if (path.startsWith("/analytics")) {
      return { section: "Finance", page: "Analytics" };
    }
    const clean = path.replace(/^\//, "").split("/")[0] || "";
    const page = clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : "Overview";
    return { section: "Finance", page };
  };

  const breadcrumb = getBreadcrumb(pathname);

  return (
    <header className="fixed left-64 right-0 top-0 z-40 hidden h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md md:flex dark:border-slate-800 dark:bg-[#0B0F17]/80">
      <div className="flex h-full w-full items-center justify-between px-6">
        {/* Left / Center Context */}
        <div className="flex items-center gap-6">
          {/* Dynamic Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-medium">
            <span className="text-slate-500 dark:text-slate-400">{breadcrumb.section}</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" />
            <span className="font-semibold text-slate-900 dark:text-white">{breadcrumb.page}</span>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

          {/* Quick Search Trigger Button */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex h-9 w-64 cursor-pointer items-center gap-2.5 rounded-lg border border-slate-200/90 bg-slate-50/70 px-3 text-xs text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-100/80 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-900"
          >
            <Search className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            <span>Search transactions, pages...</span>
          </button>
        </div>

        {/* Right Side Toolbar */}
        <div className="flex items-center gap-3">
          {/* Live Indicator Badge */}
          <div className="hidden items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 sm:flex dark:text-emerald-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span>Live / Prod</span>
          </div>

          {/* "+ New Payment" Emerald CTA button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 text-xs font-medium text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 dark:focus:ring-offset-slate-900"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Payment</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="cursor-pointer">Create Payment</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Create Invoice</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Create Payment Link</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

          {/* Notification Bell with Unread Dot */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Notifications
                </p>
              </div>
              <DropdownMenuItem className="flex cursor-pointer flex-col items-start gap-1 p-3">
                <span className="text-xs font-medium text-slate-900 dark:text-slate-100">
                  Payout Completed
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  $18,420.00 transferred to Chase Bank
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex cursor-pointer flex-col items-start gap-1 p-3">
                <span className="text-xs font-medium text-slate-900 dark:text-slate-100">
                  Stripe Sync Active
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  All 12 pending transactions synced
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* ThemeToggle Component */}
          <ThemeToggle />

          {/* User Profile Dropdown / Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex cursor-pointer items-center gap-2 rounded-full p-0.5 outline-none ring-2 ring-transparent transition hover:ring-slate-300 focus-visible:ring-emerald-500 dark:hover:ring-slate-700"
                aria-label="User menu"
              >
                <div className="shadow-xs flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  AC
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center gap-2.5 border-b border-slate-100 p-2.5 dark:border-slate-800">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  AC
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    Alex Chen
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    alex@acme.com
                  </span>
                </div>
              </div>
              <DropdownMenuItem className="cursor-pointer">Profile Settings</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Team & Permissions</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">API Keys</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-rose-600 focus:text-rose-600 dark:text-rose-400 dark:focus:text-rose-400">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search Modal Dialog */}
      <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
