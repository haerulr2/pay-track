"use client";

import { useMemo } from "react";
import { ArrowUpRight, Clock, CheckCircle2, AlertTriangle, Plus, FileText } from "lucide-react";
import TransactionsTable from "@/components/transactions/TransactionsTable";
import { transactions } from "@/lib/dummy-transactions";
import { Button } from "@/components/ui/button";

export default function TransactionsPage() {
  // Real-time metric computations from transaction ledger
  const metrics = useMemo(() => {
    let totalVolume = 0;
    let settledCount = 0;
    let pendingVolume = 0;
    let disputedCount = 0;

    transactions.forEach((tx) => {
      totalVolume += tx.grossAmount;
      if (tx.status === "Succeeded") {
        settledCount += 1;
      }
      if (tx.status === "Pending") {
        pendingVolume += tx.grossAmount;
      }
      if (tx.status === "Disputed" || tx.status === "Failed") {
        disputedCount += 1;
      }
    });

    const disputedRate = ((disputedCount / transactions.length) * 100).toFixed(2);

    return {
      totalVolume,
      settledCount,
      totalCount: transactions.length,
      pendingVolume,
      disputedRate,
    };
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Pro Fintech Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Transactions Ledger
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Real-time record of all card charges, wire settlements, ACH transfers, and refunds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 border-slate-200 text-xs text-slate-700 dark:border-slate-700 dark:text-slate-300"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Statements</span>
          </Button>

          <Button
            size="sm"
            className="h-9 gap-1.5 bg-slate-900 text-xs font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Charge</span>
          </Button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Volume */}
        <div className="shadow-xs rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#111827]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Total Inflow Volume
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              {formatCurrency(metrics.totalVolume)}
            </span>
          </div>
          <p className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            +14.2% from last cycle
          </p>
        </div>

        {/* Settled Count */}
        <div className="shadow-xs rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#111827]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Settled Transactions
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              {metrics.settledCount}
            </span>
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
              / {metrics.totalCount} recorded
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">99.4% settlement health</p>
        </div>

        {/* Pending Volume */}
        <div className="shadow-xs rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#111827]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Pending Volume
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              {formatCurrency(metrics.pendingVolume)}
            </span>
          </div>
          <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
            Clearing in next automatic batch
          </p>
        </div>

        {/* Disputed Rate */}
        <div className="shadow-xs rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#111827]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Disputed / Flagged Rate
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              {metrics.disputedRate}%
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Threshold safety limit: 0.90%
          </p>
        </div>
      </div>

      {/* Primary Table Ledger */}
      <section aria-label="Transactions Data Ledger">
        <TransactionsTable />
      </section>
    </div>
  );
}
