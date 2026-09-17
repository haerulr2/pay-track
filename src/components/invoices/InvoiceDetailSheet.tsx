"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Download, Send, X, Building2, Calendar, Mail, User } from "lucide-react";
import { Invoice, InvoiceStatus } from "@/lib/dummy-invoices";
import { exportInvoicesToCSV } from "@/lib/export";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";
import { useScrollLock } from "@/hooks/useScrollLock";

export interface InvoiceDetailSheetProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (invoiceId: string, newStatus: InvoiceStatus) => void;
}

const emptySubscribe = () => () => {};

export function InvoiceDetailSheet({
  invoice,
  isOpen,
  onClose,
  onStatusChange,
}: InvoiceDetailSheetProps) {
  const [copied, setCopied] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Lock body/html scroll when open to avoid double scrollbars and layout shifts
  useScrollLock(isOpen);

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
    if (!invoice) return;
    exportInvoicesToCSV([invoice], `invoice-${invoice.id}.csv`);
  };

  const handleSendReminder = () => {
    if (!invoice) return;
    setActionSuccess("Reminder sent to " + invoice.customerEmail);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const handleMarkPaid = () => {
    if (!invoice) return;
    if (onStatusChange) {
      onStatusChange(invoice.id, "Paid");
    }
    setActionSuccess("Invoice marked as Paid");
    setTimeout(() => setActionSuccess(null), 3500);
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && invoice && (
        <motion.div
          key="invoice-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="z-100 fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        />
      )}

      {isOpen && invoice && (
        <motion.div
          key="invoice-drawer"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="z-100 fixed inset-y-0 right-0 flex h-full w-full max-w-lg flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#111827]"
          role="dialog"
          aria-modal="true"
          aria-label={`Invoice ${invoice.id} details`}
        >
          {/* Pinned Header Bar */}
          <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="font-mono text-base font-semibold tracking-tight text-slate-900 dark:text-white">
                {invoice.id}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(invoice.id)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                title="Copy Invoice ID"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
              <InvoiceStatusBadge status={invoice.status} />
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

          {/* Scrollable Content Body */}
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
            {/* Action feedback message */}
            {actionSuccess && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                <Check className="h-4 w-4 shrink-0" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {/* Amount Hero Box */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-5 dark:border-slate-800/80 dark:bg-[#0B0F17]/50">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Total Invoiced
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  {formatCurrency(invoice.total)}
                </span>
                <span className="text-xs font-medium text-slate-400">{invoice.currency}</span>
              </div>
              {invoice.memo && (
                <p className="mt-2.5 border-t border-slate-200/60 pt-2.5 text-xs text-slate-500 dark:border-slate-800/60 dark:text-slate-400">
                  {invoice.memo}
                </p>
              )}
            </div>

            {/* Recipient & Dates Grid */}
            <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200/80 p-4 text-xs dark:border-slate-800/80">
              <div className="space-y-1.5">
                <span className="flex items-center gap-1.5 font-medium text-slate-400 dark:text-slate-500">
                  <Building2 className="h-3.5 w-3.5" />
                  Company
                </span>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {invoice.customerCompany}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="flex items-center gap-1.5 font-medium text-slate-400 dark:text-slate-500">
                  <User className="h-3.5 w-3.5" />
                  Contact
                </span>
                <p className="font-semibold text-slate-900 dark:text-white">{invoice.customer}</p>
              </div>

              <div className="space-y-1.5">
                <span className="flex items-center gap-1.5 font-medium text-slate-400 dark:text-slate-500">
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </span>
                <p className="font-mono text-slate-700 dark:text-slate-300">
                  {invoice.customerEmail}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="flex items-center gap-1.5 font-medium text-slate-400 dark:text-slate-500">
                  <Calendar className="h-3.5 w-3.5" />
                  Due Date
                </span>
                <p
                  className={`font-mono font-medium ${
                    invoice.status === "Past Due"
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  {invoice.dueDate}
                </p>
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Line Items ({invoice.items.length})
              </h4>
              <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50/80 font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                    <tr>
                      <th className="px-3 py-2">Item</th>
                      <th className="px-3 py-2 text-right">Qty</th>
                      <th className="px-3 py-2 text-right">Price</th>
                      <th className="px-3 py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {invoice.items.map((item) => (
                      <tr key={item.id} className="text-slate-700 dark:text-slate-300">
                        <td className="px-3 py-2.5 font-medium text-slate-900 dark:text-white">
                          {item.description}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-slate-500">
                          {item.quantity}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-slate-500">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono font-medium text-slate-900 dark:text-white">
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Invoice Totals */}
            <div className="space-y-2 rounded-lg bg-slate-50/80 p-3.5 text-xs dark:bg-slate-900/40">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-mono">{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tax (Estimated)</span>
                <span className="font-mono">{formatCurrency(invoice.tax)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/80 pt-2 font-semibold text-slate-900 dark:border-slate-800 dark:text-white">
                <span>Total</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(invoice.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Pinned Bottom Actions */}
          <div className="flex shrink-0 flex-col gap-2.5 border-t border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-[#111827]">
            {invoice.status !== "Paid" && (
              <Button
                onClick={handleMarkPaid}
                className="w-full justify-center bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                <Check className="mr-2 h-4 w-4" />
                Mark as Paid
              </Button>
            )}

            {invoice.status === "Open" || invoice.status === "Past Due" ? (
              <Button
                variant="outline"
                onClick={handleSendReminder}
                className="w-full justify-center"
              >
                <Send className="mr-2 h-4 w-4" />
                Send Payment Reminder
              </Button>
            ) : null}

            <Button variant="outline" onClick={handleDownload} className="w-full justify-center">
              <Download className="mr-2 h-4 w-4" />
              Download Invoice CSV
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default InvoiceDetailSheet;
