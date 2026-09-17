"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Copy,
  Download,
  FileCode,
  RotateCcw,
  X,
  CreditCard,
  Building2,
  Wallet,
  AlertTriangle,
  Calendar,
  User,
  Mail,
} from "lucide-react";
import { Transaction, TransactionStatus } from "@/types";
import { Button } from "@/components/ui/button";

export interface TransactionDetailSheetProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionDetailSheet({
  transaction,
  isOpen,
  onClose,
}: TransactionDetailSheetProps) {
  const [copied, setCopied] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleCopyId = async () => {
    if (!transaction?.id) return;
    try {
      await navigator.clipboard.writeText(transaction.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  if (!isOpen || !transaction) {
    return null;
  }

  const formatCurrency = (val: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case "Succeeded":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Succeeded
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
            Pending
          </span>
        );
      case "Failed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-400">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Failed
          </span>
        );
      case "Refunded":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Refunded
          </span>
        );
      case "Disputed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-700 dark:border-orange-800/60 dark:bg-orange-950/40 dark:text-orange-400">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            Disputed
          </span>
        );
      case "Uncaptured":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:border-blue-800/60 dark:bg-blue-950/40 dark:text-blue-400">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Uncaptured
          </span>
        );
    }
  };

  const getMethodIcon = () => {
    switch (transaction.methodType) {
      case "wire":
        return <Building2 className="h-4 w-4 text-slate-600 dark:text-slate-400" />;
      case "ach":
        return <Building2 className="h-4 w-4 text-slate-600 dark:text-slate-400" />;
      case "wallet":
        return <Wallet className="h-4 w-4 text-slate-600 dark:text-slate-400" />;
      case "card":
      default:
        return <CreditCard className="h-4 w-4 text-slate-600 dark:text-slate-400" />;
    }
  };

  // 4 steps: Created, Authorized, Captured, Settled / Paid Out
  const findTimelineStep = (key: string) => {
    return transaction.timeline?.find((t) => t.step.toLowerCase().includes(key.toLowerCase()));
  };

  const createdStep = findTimelineStep("Created") || {
    step: "Created",
    timestamp: transaction.date,
    done: true,
  };

  const authorizedStep = findTimelineStep("Authorized") || {
    step: "Authorized",
    timestamp: transaction.status === "Failed" ? "Authorization failed" : transaction.date,
    done: transaction.status !== "Failed",
  };

  const capturedStep = findTimelineStep("Captured") || {
    step: "Captured",
    timestamp:
      transaction.status === "Succeeded" || transaction.status === "Refunded"
        ? transaction.date
        : "Awaiting capture",
    done: transaction.status === "Succeeded" || transaction.status === "Refunded",
  };

  const settledStep = findTimelineStep("Settled") || {
    step: "Settled / Paid Out",
    timestamp:
      transaction.status === "Succeeded"
        ? transaction.date
        : transaction.status === "Refunded"
          ? transaction.refundedDate || "Refunded to source"
          : "Pending settlement batch",
    done: transaction.status === "Succeeded" || transaction.status === "Refunded",
  };

  const timelineSteps = [
    { title: "Created", ...createdStep },
    { title: "Authorized", ...authorizedStep },
    { title: "Captured", ...capturedStep },
    { title: "Settled / Paid Out", ...settledStep },
  ];

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="backdrop-blur-xs fixed inset-0 z-50 bg-black/40 transition-opacity"
        aria-hidden="true"
      />

      {/* Sheet container */}
      <motion.div
        key="sheet"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto border-l border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-[#111827]"
        role="dialog"
        aria-modal="true"
        aria-label={`Transaction ${transaction.id} details`}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold text-slate-900 dark:text-white">
              {transaction.id}
            </span>
            <button
              type="button"
              onClick={handleCopyId}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-700"
              title="Copy Transaction ID"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Close drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Main Amount Display */}
        <div className="border-b border-slate-100 py-6 dark:border-slate-800/80">
          <div className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Net Settlement Amount
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
              {transaction.status === "Refunded" ? "-" : "+"}
              {formatCurrency(transaction.netAmount, transaction.currency)}
            </span>
            {getStatusBadge(transaction.status)}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {transaction.description}
          </p>
        </div>

        {/* Financial Breakdown Table (Card inside sheet) */}
        <div className="py-5">
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-[#161f30]">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Financial Breakdown
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300">Gross Inflow</span>
              <span className="font-mono font-medium tabular-nums text-slate-900 dark:text-slate-100">
                {formatCurrency(transaction.grossAmount, transaction.currency)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300">Processing Fee</span>
              <span className="font-mono font-medium tabular-nums text-rose-600 dark:text-rose-400">
                -{formatCurrency(transaction.fee, transaction.currency)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-2.5 text-sm dark:border-slate-700/80">
              <span className="font-semibold text-slate-900 dark:text-white">Net Payout</span>
              <span className="font-mono text-base font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                {formatCurrency(transaction.netAmount, transaction.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Processing Flow Timeline */}
        <div className="border-t border-slate-100 py-4 dark:border-slate-800/80">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Processing Flow
          </h3>
          <div className="relative space-y-4 pl-6 before:absolute before:bottom-2 before:left-2.5 before:top-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {timelineSteps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col gap-0.5">
                {/* Dot or Check */}
                <div
                  className={`absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-white dark:ring-[#111827] ${
                    step.done
                      ? "bg-emerald-500 text-white dark:bg-emerald-600"
                      : "border-2 border-slate-300 bg-white text-transparent dark:border-slate-600 dark:bg-slate-900"
                  }`}
                >
                  {step.done ? (
                    <Check className="stroke-3 h-3 w-3" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                  )}
                </div>
                <div className="text-xs font-medium text-slate-900 dark:text-slate-200">
                  {step.title}
                </div>
                <div className="font-mono text-xs text-slate-500 dark:text-slate-400">
                  {step.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer & Method Metadata */}
        <div className="space-y-3 border-t border-slate-100 py-4 dark:border-slate-800/80">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Metadata & Method
          </h3>

          <div className="grid grid-cols-1 gap-2.5 text-xs">
            {/* Customer */}
            <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50/40 p-2.5 dark:border-slate-800/60 dark:bg-slate-900/40">
              <User className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold text-slate-900 dark:text-slate-100">
                  {transaction.customer}
                </div>
                <div className="mt-0.5 flex items-center gap-1 truncate text-slate-500 dark:text-slate-400">
                  <Mail className="h-3 w-3" />
                  <span>{transaction.customerEmail}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="flex items-center gap-2.5 rounded-lg border border-slate-100 bg-slate-50/40 p-2.5 dark:border-slate-800/60 dark:bg-slate-900/40">
              {getMethodIcon()}
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-slate-900 dark:text-slate-100">
                  {transaction.paymentMethod}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Method: {transaction.methodType}
                </div>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2.5 rounded-lg border border-slate-100 bg-slate-50/40 p-2.5 dark:border-slate-800/60 dark:bg-slate-900/40">
              <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
              <div className="min-w-0 flex-1">
                <div className="font-mono text-xs font-medium text-slate-900 dark:text-slate-100">
                  {transaction.date}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Authorized Timestamp
                </div>
              </div>
            </div>

            {/* If Failed: Decline Reason */}
            {transaction.declineReason && (
              <div className="flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50/60 p-2.5 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-400">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-rose-800 dark:text-rose-300">
                    Decline Reason
                  </div>
                  <div className="mt-0.5">{transaction.declineReason}</div>
                </div>
              </div>
            )}

            {/* If Refunded: Refunded Date */}
            {transaction.refundedDate && (
              <div className="flex items-start gap-2.5 rounded-lg border border-purple-200 bg-purple-50/60 p-2.5 text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/20 dark:text-purple-400">
                <RotateCcw className="mt-0.5 h-4 w-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-purple-800 dark:text-purple-300">
                    Refund Processed
                  </div>
                  <div className="mt-0.5 font-mono">{transaction.refundedDate}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto flex flex-col gap-2.5 border-t border-slate-200 pt-6 dark:border-slate-800">
          <Button
            variant="outline"
            className="w-full justify-center border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900/60 dark:text-rose-400 dark:hover:bg-rose-950/40"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Issue Refund
          </Button>

          <Button variant="outline" className="w-full justify-center">
            <Download className="mr-2 h-4 w-4" />
            Download Receipt
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-center text-slate-600 dark:text-slate-400"
          >
            <FileCode className="mr-2 h-4 w-4" />
            View API Log
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default TransactionDetailSheet;
