"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  Calendar,
  Check,
  Copy,
  CreditCard,
  Download,
  Globe,
  Mail,
  Phone,
  Send,
  User,
  X,
} from "lucide-react";

import { Customer, CustomerStatus } from "@/lib/dummy-customers";
import { exportCustomersToCSV } from "@/lib/export";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CustomerStatusBadge } from "./CustomerStatusBadge";

export interface CustomerDetailSheetProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

const emptySubscribe = () => () => {};

export function CustomerDetailSheet({ customer, isOpen, onClose }: CustomerDetailSheetProps) {
  const [copied, setCopied] = useState(false);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted) {
    return null;
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!customer) return;
    exportCustomersToCSV([customer], `customer-${customer.id}.csv`);
  };

  const aov =
    customer && customer.totalOrders > 0 ? customer.lifetimeValue / customer.totalOrders : 0;

  return createPortal(
    <AnimatePresence>
      {isOpen && customer && (
        <motion.div
          key="customer-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="z-100 fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        />
      )}

      {isOpen && customer && (
        <motion.div
          key="customer-drawer"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="z-100 fixed inset-y-0 right-0 flex w-full max-w-lg flex-col overflow-y-auto border-l border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-[#111827]"
          role="dialog"
          aria-modal="true"
          aria-label={`Customer ${customer.name} details`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="font-mono text-base font-semibold tracking-tight text-slate-900 dark:text-white">
                {customer.id}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(customer.id)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                title="Copy Customer ID"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
              <CustomerStatusBadge status={customer.status} />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Close panel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Customer Profile Header */}
          <div className="my-6 rounded-xl border border-slate-200/80 bg-slate-50/60 p-5 dark:border-slate-800/80 dark:bg-[#0B0F17]/50">
            <div className="flex items-center gap-3">
              <div className="shadow-xs flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 font-bold text-white dark:bg-white dark:text-slate-900">
                {customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {customer.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{customer.company}</p>
              </div>
            </div>

            <div className="mt-5 border-t border-slate-200/60 pt-4 dark:border-slate-800/60">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Customer Lifetime Value (LTV)
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-3xl font-semibold tracking-tight text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(customer.lifetimeValue)}
                </span>
                <span className="text-xs font-medium text-slate-400">{customer.currency}</span>
              </div>
            </div>
          </div>

          {/* Contact & Organization Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Contact & Company Details
            </h4>
            <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200/80 p-4 text-xs dark:border-slate-800/80">
              <div className="space-y-1.5">
                <span className="flex items-center gap-1.5 font-medium text-slate-400 dark:text-slate-500">
                  <Building2 className="h-3.5 w-3.5" />
                  Organization
                </span>
                <p className="font-semibold text-slate-900 dark:text-white">{customer.company}</p>
              </div>

              <div className="space-y-1.5">
                <span className="flex items-center gap-1.5 font-medium text-slate-400 dark:text-slate-500">
                  <Globe className="h-3.5 w-3.5" />
                  Country
                </span>
                <p className="font-medium text-slate-900 dark:text-white">{customer.country}</p>
              </div>

              <div className="space-y-1.5">
                <span className="flex items-center gap-1.5 font-medium text-slate-400 dark:text-slate-500">
                  <Mail className="h-3.5 w-3.5" />
                  Billing Email
                </span>
                <p className="font-mono text-slate-700 dark:text-slate-300">{customer.email}</p>
              </div>

              <div className="space-y-1.5">
                <span className="flex items-center gap-1.5 font-medium text-slate-400 dark:text-slate-500">
                  <Phone className="h-3.5 w-3.5" />
                  Direct Phone
                </span>
                <p className="font-mono text-slate-700 dark:text-slate-300">{customer.phone}</p>
              </div>
            </div>
          </div>

          {/* Financial & Billing Profile */}
          <div className="mt-6 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Payment & Activity Profile
            </h4>
            <div className="space-y-3 rounded-xl border border-slate-200/80 p-4 text-xs dark:border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-500">
                  <CreditCard className="h-4 w-4 text-slate-400" />
                  Primary Method
                </span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {customer.defaultPaymentMethod}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-2 dark:border-slate-800/60">
                <span className="text-slate-500">Completed Orders</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  {customer.totalOrders} Transactions
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-2 dark:border-slate-800/60">
                <span className="text-slate-500">Average Order Value</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(aov)}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-2 dark:border-slate-800/60">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="h-3.5 w-3.5" />
                  Customer Since
                </span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {customer.joinedDate}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-2 dark:border-slate-800/60">
                <span className="text-slate-500">Last Activity</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {customer.lastActivity}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-auto flex flex-col gap-2.5 border-t border-slate-200 pt-6 dark:border-slate-800">
            <a
              href={`mailto:${customer.email}`}
              className="shadow-xs flex w-full items-center justify-center rounded-lg bg-slate-900 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              <Send className="mr-2 h-3.5 w-3.5" />
              Contact Customer
            </a>

            <Button variant="outline" onClick={handleDownload} className="w-full justify-center">
              <Download className="mr-2 h-4 w-4" />
              Export Customer CSV
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default CustomerDetailSheet;
