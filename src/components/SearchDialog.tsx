"use client";

import { Transaction, transactions } from "@/lib/dummy-transactions";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeftRight,
  ArrowRight,
  CreditCard,
  FileText,
  History,
  LayoutDashboard,
  Moon,
  Search,
  Sun,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import * as React from "react";
import { createPortal } from "react-dom";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const emptySubscribe = () => () => {};

export default function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const handleClose = React.useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const filteredTransactions: Transaction[] = query.trim()
    ? transactions
        .filter((tx) => {
          const q = query.toLowerCase();
          return (
            tx.id.toLowerCase().includes(q) ||
            tx.customer.toLowerCase().includes(q) ||
            tx.customerEmail.toLowerCase().includes(q) ||
            tx.description.toLowerCase().includes(q) ||
            tx.amount.includes(q)
          );
        })
        .slice(0, 5)
    : [];

  const navigationItems = [
    { title: "Dashboard Overview", href: "/dashboard", icon: LayoutDashboard },
    { title: "Transactions Ledger", href: "/transactions", icon: ArrowLeftRight },
    { title: "Invoices & Billing", href: "/invoices", icon: FileText },
    { title: "Customer Directory", href: "/customers", icon: Users },
  ].filter((item) => !query.trim() || item.title.toLowerCase().includes(query.toLowerCase()));

  const handleNavigate = (href: string) => {
    router.push(href);
    handleClose();
  };

  const handleToggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    handleClose();
  };
  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="z-100 fixed inset-0 flex items-start justify-center p-4 pt-20 sm:pt-28">
      {/* Full-screen Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Dialog Window */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-[#111827]">
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-slate-200 px-3.5 py-3 dark:border-slate-800">
          <Search className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search transactions, pages, or actions..."
            className="flex-1 bg-transparent px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-slate-500"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleClose}
              className="rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Results Body */}
        <div className="max-h-96 space-y-4 overflow-y-auto p-3 text-xs">
          {/* Navigation Pages */}
          {navigationItems.length > 0 && (
            <div>
              <p className="px-2 pb-1.5 font-semibold text-slate-400 dark:text-slate-500">
                NAVIGATION
              </p>
              <div className="space-y-0.5">
                {navigationItems.map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => handleNavigate(item.href)}
                    className="flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-left text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60"
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Transactions Matches */}
          {filteredTransactions.length > 0 && (
            <div>
              <p className="px-2 pb-1.5 font-semibold text-slate-400 dark:text-slate-500">
                TRANSACTIONS
              </p>
              <div className="space-y-0.5">
                {filteredTransactions.map((tx) => (
                  <button
                    key={tx.id}
                    type="button"
                    onClick={() => handleNavigate("/transactions")}
                    className="flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-left text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <CreditCard className="h-4 w-4 shrink-0 text-emerald-500" />
                      <div className="min-w-0 truncate">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {tx.id}
                        </span>
                        <span className="ml-2 text-slate-500">({tx.customer})</span>
                      </div>
                    </div>
                    <span className="shrink-0 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(tx.netAmount)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <p className="px-2 pb-1.5 font-semibold text-slate-400 dark:text-slate-500">
              QUICK ACTIONS
            </p>
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={handleToggleTheme}
                className="flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-left text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60"
              >
                <div className="flex items-center gap-2.5">
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Moon className="h-4 w-4 text-slate-500" />
                  )}
                  <span>Toggle {theme === "dark" ? "Light" : "Dark"} Mode</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleNavigate("/transactions")}
                className="flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-left text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60"
              >
                <div className="flex items-center gap-2.5">
                  <History className="h-4 w-4 text-slate-400" />
                  <span>View All Transactions Ledger</span>
                </div>
              </button>
            </div>
          </div>

          {/* No results notice */}
          {query.trim() && navigationItems.length === 0 && filteredTransactions.length === 0 && (
            <div className="py-8 text-center text-slate-400 dark:text-slate-500">
              No matching transactions or pages found for &quot;{query}&quot;
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
