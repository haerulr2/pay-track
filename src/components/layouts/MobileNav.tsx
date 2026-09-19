"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

import {
  ArrowLeftRight,
  BarChart3,
  Building2,
  Code2,
  CreditCard,
  FileText,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react";

import SearchDialog from "@/components/SearchDialog";
import ThemeToggle from "@/components/ThemeToggle";
import { CreateChargeDialog } from "@/components/transactions/CreateChargeDialog";
import { useScrollLock } from "@/hooks/useScrollLock";
import { cn } from "@/lib/utils";
import type { BaseComponentProps } from "@/types";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const navItems: NavItem[] = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Transactions", href: "/transactions", icon: ArrowLeftRight, badge: "12" },
  { title: "Invoices", href: "/invoices", icon: FileText },
  { title: "Customers", href: "/customers", icon: Users },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "API Keys", href: "/developers", icon: Code2 },
  { title: "Settings", href: "/settings", icon: Settings },
];

interface MobileNavProps extends BaseComponentProps {}

/**
 * Responsive mobile navigation header with slide-out drawer.
 *
 * Visible only on mobile screens (< md breakpoint). Includes PayTrack branding,
 * search dialog trigger, theme toggle, quick payment CTA, and slide-out navigation drawer.
 */
function MobileNav({ className }: MobileNavProps) {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isChargeOpen, setIsChargeOpen] = useState(false);

  // Lock background scroll when drawer is open
  useScrollLock(isDrawerOpen);

  // Check whether route is active
  const isRouteActive = useCallback(
    (href: string) => {
      if (href === "#") return false;
      if (href === "/dashboard") {
        return pathname === "/dashboard" || pathname === "/";
      }
      return pathname.startsWith(href);
    },
    [pathname]
  );

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDrawerOpen(false);
      }
    };

    if (isDrawerOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDrawerOpen]);

  // Close drawer automatically on route change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsDrawerOpen(false);
  }

  return (
    <>
      {/* Fixed Mobile Top Header */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md md:hidden dark:border-slate-800 dark:bg-[#0B0F17]/80",
          className
        )}
      >
        {/* Left: Hamburger menu button + PayTrack logo & name */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-bold tracking-tight text-slate-900 transition-opacity hover:opacity-90 dark:text-white"
          >
            <div className="shadow-xs flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <CreditCard className="h-4 w-4" />
            </div>
            <span className="text-base font-bold tracking-tight">PayTrack</span>
          </Link>
        </div>

        {/* Right: Search button, ThemeToggle, and + Pay CTA */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setIsChargeOpen(true)}
            className="shadow-xs inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg bg-emerald-600 px-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 dark:focus:ring-offset-slate-900"
            aria-label="+ Pay"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              <span className="sr-only">+ </span>Pay
            </span>
          </button>
        </div>
      </header>

      {/* Slide-out Drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 transition-all duration-300 md:hidden",
          isDrawerOpen ? "visible" : "pointer-events-none invisible delay-300"
        )}
      >
        {/* Backdrop overlay with click-to-close */}
        <div
          className={cn(
            "backdrop-blur-xs fixed inset-0 bg-black/60 transition-opacity duration-300 ease-in-out",
            isDrawerOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={handleCloseDrawer}
          aria-hidden="true"
        />

        {/* Drawer Panel */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:border-slate-800 dark:bg-[#0B0F17]",
            isDrawerOpen ? "translate-x-0" : "-translate-x-full"
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation drawer"
        >
          {/* Drawer Header: Organization and Close Button */}
          <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
                  Acme Corp
                </span>
                <div className="flex items-center gap-1.5">
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

            <button
              type="button"
              onClick={handleCloseDrawer}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {navItems.map((item) => {
              const active = isRouteActive(item.href);
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={handleCloseDrawer}
                  className={cn(
                    "flex h-10 items-center justify-between rounded-md px-3 text-sm transition-colors",
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
          </nav>

          {/* Drawer Footer */}
          <div className="mt-auto border-t border-slate-200 p-4 dark:border-slate-800">
            <div className="flex items-center justify-between rounded-md border border-slate-200/90 bg-slate-50/60 px-3 py-2 text-xs dark:border-slate-800/90 dark:bg-slate-900/40">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Live Environment
                </span>
              </div>
              <span className="rounded bg-slate-200/70 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                PROD
              </span>
            </div>
          </div>
        </aside>
      </div>

      {/* Embedded Search Dialog */}
      <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Embedded Create Charge Dialog */}
      <CreateChargeDialog
        isOpen={isChargeOpen}
        onClose={() => setIsChargeOpen(false)}
        onCreate={() => {
          setIsChargeOpen(false);
        }}
      />
    </>
  );
}

export default MobileNav;
