"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Download,
  X,
  CreditCard,
  Building2,
  Wallet,
  CheckSquare,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Transaction, TransactionStatus } from "@/types";
import { transactions as dummyTransactions } from "@/lib/dummy-transactions";
import { exportTransactionsToCSV } from "@/lib/export";
import { TransactionDetailSheet } from "./TransactionDetailSheet";
import { Button } from "@/components/ui/button";

type FilterStatus = "All" | "Succeeded" | "Pending" | "Failed" | "Refunded";

export default function TransactionsTable() {
  const [transactionsList] = useState<Transaction[]>(dummyTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("All");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Status counts
  const statusCounts = useMemo(() => {
    const counts: Record<FilterStatus, number> = {
      All: transactionsList.length,
      Succeeded: 0,
      Pending: 0,
      Failed: 0,
      Refunded: 0,
    };

    transactionsList.forEach((tx) => {
      if (tx.status === "Succeeded") counts.Succeeded += 1;
      if (tx.status === "Pending") counts.Pending += 1;
      if (tx.status === "Failed") counts.Failed += 1;
      if (tx.status === "Refunded") counts.Refunded += 1;
    });

    return counts;
  }, [transactionsList]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactionsList.filter((tx) => {
      // Status filter
      if (selectedStatus !== "All" && tx.status !== selectedStatus) {
        return false;
      }

      // Search query filter
      if (searchTerm.trim() !== "") {
        const query = searchTerm.toLowerCase();
        const matchesId = tx.id.toLowerCase().includes(query);
        const matchesCustomer = tx.customer.toLowerCase().includes(query);
        const matchesEmail = tx.customerEmail.toLowerCase().includes(query);
        const matchesDesc = tx.description.toLowerCase().includes(query);
        const matchesMethod = tx.paymentMethod.toLowerCase().includes(query);

        if (!matchesId && !matchesCustomer && !matchesEmail && !matchesDesc && !matchesMethod) {
          return false;
        }
      }

      return true;
    });
  }, [transactionsList, selectedStatus, searchTerm]);

  // Handle row selection
  const handleSelectRow = (id: string, e?: React.MouseEvent | React.ChangeEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // Handle select all filtered
  const handleSelectAll = () => {
    if (selectedRows.length === filteredTransactions.length && filteredTransactions.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredTransactions.map((tx) => tx.id));
    }
  };

  const handleRowClick = (tx: Transaction) => {
    setSelectedTransaction(tx);
    setIsSheetOpen(true);
  };

  const handleExportAll = () => {
    exportTransactionsToCSV(
      filteredTransactions,
      `transactions-${selectedStatus.toLowerCase()}.csv`
    );
  };

  const handleExportSelected = () => {
    const selected = transactionsList.filter((tx) => selectedRows.includes(tx.id));
    exportTransactionsToCSV(selected, `transactions-selected-${selected.length}.csv`);
  };

  // Payment brand badge
  const renderPaymentBadge = (tx: Transaction) => {
    switch (tx.paymentIcon) {
      case "visa":
        return (
          <div className="flex items-center gap-1.5">
            <span className="flex h-5 items-center justify-center rounded bg-[#1A1F71] px-1.5 text-[10px] font-bold tracking-wider text-white">
              VISA
            </span>
            <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
              {tx.paymentMethod.replace("Visa ", "")}
            </span>
          </div>
        );
      case "mastercard":
        return (
          <div className="flex items-center gap-1.5">
            <span className="flex h-5 items-center justify-center rounded bg-[#EB001B] px-1.5 text-[10px] font-bold tracking-wider text-white">
              MC
            </span>
            <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
              {tx.paymentMethod.replace("Mastercard ", "")}
            </span>
          </div>
        );
      case "amex":
        return (
          <div className="flex items-center gap-1.5">
            <span className="flex h-5 items-center justify-center rounded bg-[#006FCF] px-1.5 text-[10px] font-bold tracking-wider text-white">
              AMEX
            </span>
            <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
              {tx.paymentMethod.replace("Amex ", "")}
            </span>
          </div>
        );
      case "wire":
        return (
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <Building2 className="h-4 w-4 text-slate-500" />
            <span className="text-xs font-medium">{tx.paymentMethod}</span>
          </div>
        );
      case "ach":
        return (
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <Building2 className="h-4 w-4 text-slate-500" />
            <span className="text-xs font-medium">{tx.paymentMethod}</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            {tx.methodType === "wallet" ? (
              <Wallet className="h-4 w-4 text-slate-500" />
            ) : (
              <CreditCard className="h-4 w-4 text-slate-500" />
            )}
            <span className="text-xs font-medium">{tx.paymentMethod}</span>
          </div>
        );
    }
  };

  // Status Badge
  const renderStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case "Succeeded":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Succeeded
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
            Pending
          </span>
        );
      case "Failed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-400">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Failed
          </span>
        );
      case "Refunded":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Refunded
          </span>
        );
      case "Disputed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700 dark:border-orange-800/60 dark:bg-orange-950/40 dark:text-orange-400">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            Disputed
          </span>
        );
      case "Uncaptured":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:border-blue-800/60 dark:bg-blue-950/40 dark:text-blue-400">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Uncaptured
          </span>
        );
    }
  };

  const statusPills: FilterStatus[] = ["All", "Succeeded", "Pending", "Failed", "Refunded"];

  return (
    <div className="space-y-4">
      {/* Unified Filter Bar at top */}
      <div className="shadow-xs flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800 dark:bg-[#111827]">
        {/* Search Input */}
        <div className="min-w-70 relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, customer, email, or note..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="focus:outline-hidden h-9 w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-9 pr-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-600"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {statusPills.map((status) => {
            const count = statusCounts[status];
            const isActive = selectedStatus === status;

            return (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  isActive
                    ? "shadow-xs bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/70 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                <span>{status}</span>
                <span
                  className={`py-0.2 rounded-full px-1.5 font-mono text-[10px] tabular-nums ${
                    isActive
                      ? "bg-slate-700 text-slate-100 dark:bg-slate-300 dark:text-slate-900"
                      : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportAll}
            className="h-8 gap-1.5 border-slate-200 text-xs font-medium text-slate-700 dark:border-slate-700 dark:text-slate-300"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Bulk selection floating/sticky bar */}
      {selectedRows.length > 0 && (
        <div className="sticky top-2 z-20 flex items-center justify-between rounded-xl border border-slate-900/10 bg-slate-900 px-4 py-2.5 text-white shadow-lg transition-all dark:border-slate-700 dark:bg-slate-100 dark:text-slate-900">
          <div className="flex items-center gap-2 text-xs font-medium">
            <CheckSquare className="h-4 w-4" />
            <span>
              {selectedRows.length} transaction{selectedRows.length > 1 ? "s" : ""} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportSelected}
              className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2.5 py-1 text-xs font-medium text-white hover:bg-white/20 dark:bg-slate-900/10 dark:text-slate-900 dark:hover:bg-slate-900/20"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Selected</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRows([])}
              className="inline-flex items-center gap-1 rounded-md bg-transparent px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white dark:text-slate-600 dark:hover:text-slate-900"
            >
              <X className="h-3.5 w-3.5" />
              <span>Clear Selection</span>
            </button>
          </div>
        </div>
      )}

      {/* Pro Data Table */}
      <div className="shadow-xs overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#111827]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            {/* Header */}
            <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
              <tr>
                <th className="w-10 px-3 py-3 text-center">
                  <input
                    type="checkbox"
                    aria-label="Select all transactions"
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 dark:border-slate-700 dark:text-slate-100"
                    checked={
                      selectedRows.length === filteredTransactions.length &&
                      filteredTransactions.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Customer / Email</th>
                <th className="px-4 py-3 font-semibold">Method</th>
                <th className="px-4 py-3 font-semibold">Date & Time</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Filter className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                      <p className="text-sm font-medium">No transactions found</p>
                      <p className="text-xs text-slate-400">
                        Try adjusting your search query or status filter.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isSelected = selectedRows.includes(tx.id);
                  const isRefunded = tx.status === "Refunded";

                  return (
                    <tr
                      key={tx.id}
                      onClick={() => handleRowClick(tx)}
                      className={`group cursor-pointer transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40 ${
                        isSelected ? "bg-slate-50/60 dark:bg-slate-800/30" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-3 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          aria-label={`Select transaction ${tx.id}`}
                          className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 dark:border-slate-700 dark:text-slate-100"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(tx.id, e)}
                        />
                      </td>

                      {/* Amount: Tabular numbers with clear prefix */}
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={`font-mono text-xs font-semibold tabular-nums ${
                            isRefunded
                              ? "text-rose-600 dark:text-rose-400"
                              : "text-emerald-600 dark:text-emerald-400"
                          }`}
                        >
                          {isRefunded ? "-" : "+"}
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: tx.currency,
                          }).format(tx.netAmount)}
                        </span>
                        <div className="font-mono text-[10px] text-slate-400">
                          Gross: ${tx.amount}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-4 py-3">
                        {renderStatusBadge(tx.status)}
                      </td>

                      {/* Customer / Email */}
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {tx.customer}
                        </div>
                        <div className="max-w-45 truncate text-[11px] text-slate-500 dark:text-slate-400">
                          {tx.customerEmail}
                        </div>
                      </td>

                      {/* Method */}
                      <td className="whitespace-nowrap px-4 py-3">{renderPaymentBadge(tx)}</td>

                      {/* Date & Time */}
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        {tx.date}
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <span className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-500 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-white">
                          <span>Details</span>
                          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info strip */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
          <div>
            Showing{" "}
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {filteredTransactions.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {transactionsList.length}
            </span>{" "}
            transactions
          </div>
          <div className="font-mono text-[11px]">Updated just now</div>
        </div>
      </div>

      {/* Slide-over Detail Drawer */}
      <TransactionDetailSheet
        transaction={selectedTransaction}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </div>
  );
}
