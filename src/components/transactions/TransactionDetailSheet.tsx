"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
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
import { exportTransactionsToCSV } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { useScrollLock } from "@/hooks/useScrollLock";

export interface TransactionDetailSheetProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTransaction?: (transaction: Transaction) => void;
}

const emptySubscribe = () => () => {};

export function TransactionDetailSheet({
  transaction,
  isOpen,
  onClose,
  onUpdateTransaction,
}: TransactionDetailSheetProps) {
  const [copied, setCopied] = useState(false);
  const [isRefunding, setIsRefunding] = useState(false);
  const [refundReason, setRefundReason] = useState("Customer Request");
  const [refundSuccess, setRefundSuccess] = useState<string | null>(null);
  const [showApiLog, setShowApiLog] = useState(false);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Lock body/html scroll when open to avoid double scrollbars and layout shifts
  useScrollLock(isOpen);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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

  const handleConfirmRefund = () => {
    if (!transaction) return;
    const now = new Date();
    const refundedDate = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const updatedTx: Transaction = {
      ...transaction,
      status: "Refunded",
      refundedDate,
      timeline: transaction.timeline.map((step) =>
        step.step.includes("Settled")
          ? { ...step, timestamp: `Refunded: ${refundedDate}`, done: true }
          : step
      ),
    };

    onUpdateTransaction?.(updatedTx);
    setIsRefunding(false);
    setRefundSuccess(
      `Refund of ${formatCurrency(transaction.netAmount, transaction.currency)} has been issued successfully.`
    );
    setTimeout(() => setRefundSuccess(null), 4000);
  };

  if (!mounted) {
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
    if (!transaction) return null;
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
    return transaction?.timeline?.find((t) => t.step.toLowerCase().includes(key.toLowerCase()));
  };

  const createdStep = findTimelineStep("Created") || {
    step: "Created",
    timestamp: transaction?.date || "",
    done: true,
  };

  const authorizedStep = findTimelineStep("Authorized") || {
    step: "Authorized",
    timestamp: transaction?.status === "Failed" ? "Authorization failed" : transaction?.date || "",
    done: transaction?.status !== "Failed",
  };

  const capturedStep = findTimelineStep("Captured") || {
    step: "Captured",
    timestamp:
      transaction?.status === "Succeeded" || transaction?.status === "Refunded"
        ? transaction?.date || ""
        : "Awaiting capture",
    done: transaction?.status === "Succeeded" || transaction?.status === "Refunded",
  };

  const settledStep = findTimelineStep("Settled") || {
    step: "Settled / Paid Out",
    timestamp:
      transaction?.status === "Succeeded"
        ? transaction?.date || ""
        : transaction?.status === "Refunded"
          ? transaction?.refundedDate || "Refunded to source"
          : "Pending settlement batch",
    done: transaction?.status === "Succeeded" || transaction?.status === "Refunded",
  };

  const timelineSteps = [
    { title: "Created", ...createdStep },
    { title: "Authorized", ...authorizedStep },
    { title: "Captured", ...capturedStep },
    { title: "Settled / Paid Out", ...settledStep },
  ];

  return createPortal(
    <AnimatePresence>
      {isOpen && transaction && (
        <motion.div
          key="transaction-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="z-100 fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        />
      )}

      {isOpen && transaction && (
        <motion.div
          key="transaction-drawer"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="z-100 fixed inset-y-0 right-0 flex h-full w-full max-w-lg flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#111827]"
          role="dialog"
          aria-modal="true"
          aria-label={`Transaction ${transaction.id} details`}
        >
          {/* Pinned Header Bar */}
          <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-base font-semibold tracking-tight text-slate-900 dark:text-white">
                {transaction.id}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                title="Copy Transaction ID"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
              {getStatusBadge(transaction.status)}
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

          {/* Scrollable Content Area */}
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
            {/* Action feedback message */}
            {refundSuccess && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                <Check className="h-4 w-4 shrink-0" />
                <span>{refundSuccess}</span>
              </div>
            )}

            {/* API Log JSON Viewer Modal/Collapsible */}
            {showApiLog && (
              <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 font-mono text-xs text-slate-100 dark:border-slate-800">
                <div className="mb-2 flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-semibold text-emerald-400">
                    GET /v1/charges/{transaction.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowApiLog(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <pre className="max-h-48 overflow-y-auto text-[11px] leading-relaxed text-slate-300">
                  {JSON.stringify(
                    {
                      id: transaction.id,
                      object: "charge",
                      amount: transaction.grossAmount * 100,
                      amount_captured: transaction.grossAmount * 100,
                      amount_refunded:
                        transaction.status === "Refunded" ? transaction.grossAmount * 100 : 0,
                      currency: transaction.currency.toLowerCase(),
                      customer: transaction.customer,
                      customer_email: transaction.customerEmail,
                      status: transaction.status.toLowerCase(),
                      payment_method: transaction.paymentMethod,
                      created: transaction.date,
                      refunded: transaction.status === "Refunded",
                      refunded_at: transaction.refundedDate || null,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            )}

            {/* Amount Hero Card */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-5 dark:border-slate-800/80 dark:bg-[#0B0F17]/50">
              <div className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Net Settlement Amount
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-3xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-white">
                  {transaction.status === "Refunded" ? "-" : "+"}
                  {formatCurrency(transaction.netAmount, transaction.currency)}
                </span>
                <span className="text-xs font-medium text-slate-400">{transaction.currency}</span>
              </div>
              <p className="mt-2.5 border-t border-slate-200/60 pt-2.5 text-xs text-slate-500 dark:border-slate-800/60 dark:text-slate-400">
                {transaction.description}
              </p>
            </div>

            {/* Financial Breakdown Table */}
            <div className="space-y-3 rounded-xl border border-slate-200/80 bg-slate-50/40 p-4 dark:border-slate-800/80 dark:bg-[#161f30]/40">
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

            {/* Processing Flow Timeline */}
            <div className="rounded-xl border border-slate-200/80 p-4 dark:border-slate-800/80">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Processing Flow
              </h3>
              <div className="relative space-y-4 pl-6 before:absolute before:bottom-2 before:left-2.5 before:top-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {timelineSteps.map((step, idx) => (
                  <div key={idx} className="relative flex flex-col gap-0.5">
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
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Metadata & Method
              </h3>

              <div className="grid grid-cols-1 gap-2.5 text-xs">
                {/* Customer */}
                <div className="flex items-start gap-2.5 rounded-lg border border-slate-200/80 bg-slate-50/40 p-3 dark:border-slate-800/60 dark:bg-slate-900/40">
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
                <div className="flex items-center gap-2.5 rounded-lg border border-slate-200/80 bg-slate-50/40 p-3 dark:border-slate-800/60 dark:bg-slate-900/40">
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
                <div className="flex items-center gap-2.5 rounded-lg border border-slate-200/80 bg-slate-50/40 p-3 dark:border-slate-800/60 dark:bg-slate-900/40">
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
                  <div className="flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50/60 p-3 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-400">
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
                  <div className="flex items-start gap-2.5 rounded-lg border border-purple-200 bg-purple-50/60 p-3 text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/20 dark:text-purple-400">
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
          </div>

          {/* Pinned Bottom Actions */}
          <div className="flex shrink-0 flex-col gap-2.5 border-t border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-[#111827]">
            {isRefunding ? (
              <div className="rounded-lg border border-rose-200 bg-rose-50/60 p-3.5 dark:border-rose-900/50 dark:bg-rose-950/20">
                <div className="mb-1 text-xs font-semibold text-rose-800 dark:text-rose-300">
                  Confirm Full Refund
                </div>
                <p className="mb-2.5 text-[11px] text-rose-600 dark:text-rose-400">
                  Are you sure you want to refund{" "}
                  {formatCurrency(transaction.netAmount, transaction.currency)}? This action cannot
                  be reversed.
                </p>
                <div className="mb-3">
                  <label className="mb-1 block text-[10px] font-semibold uppercase text-rose-800 dark:text-rose-300">
                    Reason for Refund
                  </label>
                  <select
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    className="w-full rounded border border-rose-200 bg-white px-2 py-1 text-xs text-slate-800 focus:outline-none dark:border-rose-800 dark:bg-slate-900 dark:text-slate-100"
                  >
                    <option value="Customer Request">Customer Request</option>
                    <option value="Duplicate Charge">Duplicate Charge</option>
                    <option value="Fraudulent Activity">Fraudulent Activity</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setIsRefunding(false)}
                    className="h-8 flex-1 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleConfirmRefund}
                    className="h-8 flex-1 bg-rose-600 text-xs font-semibold text-white hover:bg-rose-700"
                  >
                    Confirm Refund
                  </Button>
                </div>
              </div>
            ) : (
              transaction.status === "Succeeded" && (
                <Button
                  variant="outline"
                  onClick={() => setIsRefunding(true)}
                  className="w-full justify-center border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900/60 dark:text-rose-400 dark:hover:bg-rose-950/40"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Issue Refund
                </Button>
              )
            )}

            <Button
              variant="outline"
              className="w-full justify-center"
              onClick={() =>
                exportTransactionsToCSV([transaction], `receipt-${transaction.id}.csv`)
              }
            >
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </Button>

            <Button
              variant="ghost"
              onClick={() => setShowApiLog((prev) => !prev)}
              className="w-full justify-center text-slate-600 dark:text-slate-400"
            >
              <FileCode className="mr-2 h-4 w-4" />
              {showApiLog ? "Hide API Log" : "View API Log"}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default TransactionDetailSheet;
