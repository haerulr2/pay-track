"use client";

import {
  ArrowLeftRight,
  BarChart3,
  Building2,
  ChevronsUpDown,
  Code2,
  FileText,
  Landmark,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Transactions", href: "/transactions", icon: ArrowLeftRight, badge: "12" },
  { title: "Invoices", href: "/invoices", icon: FileText },
  { title: "Customers", href: "/customers", icon: Users },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
];

const settingsNavItems: NavItem[] = [
  { title: "API Keys / Developers", href: "/developers", icon: Code2 },
  { title: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isRouteActive = (href: string) => {
    if (href === "#") return false;
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white md:flex dark:border-slate-800/80 dark:bg-[#0B0F17]">
      {/* Header: Organization Switcher */}
      <div className="border-b border-slate-200 px-3.5 py-3 dark:border-slate-800/80">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-between rounded-lg p-1.5 text-left transition-colors hover:bg-slate-100 focus:outline-none dark:hover:bg-slate-800/60"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                  <Building2 className="h-4.5 w-4.5" />
                </div>
                <div className="flex min-w-0 flex-col">
                  <div className="flex items-center gap-1">
                    <span className="truncate text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
                      Acme Corp
                    </span>
                    <ChevronsUpDown className="h-3 w-3 shrink-0 text-slate-400 dark:text-slate-500" />
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </span>
                    <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      Production
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Organization</DropdownMenuLabel>
            <DropdownMenuItem className="cursor-pointer font-medium">
              Acme Corp (Production)
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-slate-600 dark:text-slate-400">
              Acme Corp (Staging)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-xs text-slate-500">
              + Add Organization
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <div className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {/* Main Items */}
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const active = isRouteActive(item.href);
            return (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "flex h-9 items-center justify-between rounded-r-md px-3 text-sm transition-colors",
                  active
                    ? "border-l-2 border-emerald-500 bg-slate-100 font-semibold text-slate-900 dark:border-emerald-400 dark:bg-slate-800/60 dark:text-white"
                    : "border-l-2 border-transparent font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/30 dark:hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      active
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-slate-400 dark:text-slate-500"
                    )}
                  />
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
                      active
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Settings Group */}
        <div className="pt-2">
          <div className="px-3 pb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Settings
            </span>
          </div>
          <div className="space-y-1">
            {settingsNavItems.map((item) => {
              const active = isRouteActive(item.href);
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "flex h-9 items-center justify-between rounded-r-md px-3 text-sm transition-colors",
                    active
                      ? "border-l-2 border-emerald-500 bg-slate-100 font-semibold text-slate-900 dark:border-emerald-400 dark:bg-slate-800/60 dark:text-white"
                      : "border-l-2 border-transparent font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/30 dark:hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        active
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-400 dark:text-slate-500"
                      )}
                    />
                    <span>{item.title}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-auto space-y-3 border-t border-slate-200 p-4 dark:border-slate-800/80">
        {/* Available Balance widget */}
        <div className="rounded-lg border border-slate-200/90 bg-slate-50/90 p-3 dark:border-slate-800/90 dark:bg-slate-900/60">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Landmark className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium">Total Operating</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-base font-bold tabular-nums tracking-tight text-slate-900 dark:text-white">
              $128,420.50
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Available
            </span>
          </div>
        </div>

        {/* Environment pill */}
        <div className="flex items-center justify-between rounded-md border border-slate-200/90 bg-slate-50/60 px-3 py-1.5 text-xs dark:border-slate-800/90 dark:bg-slate-900/40">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-medium text-slate-700 dark:text-slate-300">Live Environment</span>
          </div>
          <span className="rounded bg-slate-200/70 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            PROD
          </span>
        </div>
      </div>
    </aside>
  );
}
