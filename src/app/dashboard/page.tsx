"use client";

import {
  ArrowDownRight,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Download,
  Landmark,
  Scale,
  Send,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import React from "react";

import Chart from "@/components/Chart";
import MetricCard from "@/components/MetricCard";
import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { metrics, transactions } from "@/lib/dummy-state";
import { exportTransactionsToCSV } from "@/lib/export";
import { formatCurrency } from "@/lib/utils";
import type { Transaction } from "@/types";

export default function DashboardPage() {
  const recentTransactions = transactions.slice(0, 5);

  const kpiIcons = [
    <Wallet key="wallet" className="h-4 w-4" />,
    <TrendingUp key="trending" className="h-4 w-4" />,
    <ArrowDownRight key="outflow" className="h-4 w-4" />,
    <Scale key="scale" className="h-4 w-4" />,
  ];

  const handleExportStatement = () => {
    exportTransactionsToCSV(transactions, `statement-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const getMethodBadge = (tx: Transaction) => {
    const isCard =
      tx.methodType === "card" ||
      tx.paymentIcon === "visa" ||
      tx.paymentIcon === "mastercard" ||
      tx.paymentIcon === "amex";

    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
        {isCard ? (
          <CreditCard className="h-3 w-3 text-slate-500 dark:text-slate-400" />
        ) : (
          <Landmark className="h-3 w-3 text-slate-500 dark:text-slate-400" />
        )}
        <span className="font-mono text-[11px]">{tx.paymentMethod}</span>
      </span>
    );
  };

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "Succeeded":
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Succeeded
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:border-amber-800/50 dark:bg-amber-950/40 dark:text-amber-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
            Pending
          </span>
        );
      case "Failed":
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700 dark:border-rose-800/50 dark:bg-rose-950/40 dark:text-rose-400">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Failed
          </span>
        );
      case "Refunded":
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
            Refunded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
            {status}
          </span>
        );
    }
  };

  const formatNetAmount = (tx: Transaction) => {
    if (tx.status === "Failed") {
      return (
        <span className="font-mono text-xs tabular-nums text-slate-400 dark:text-slate-500">
          $0.00
        </span>
      );
    }
    if (tx.status === "Refunded") {
      return (
        <span className="font-mono text-xs font-medium tabular-nums text-rose-600 dark:text-rose-400">
          -{formatCurrency(tx.netAmount)}
        </span>
      );
    }
    return (
      <span className="font-mono text-xs font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
        +{formatCurrency(tx.netAmount)}
      </span>
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      {/* Section 1: Dashboard Top Banner */}
      <Reveal>
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800/80">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Financial Operations
            </h1>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Primary Account (USD)
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Real-time synchronization active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportStatement}
              className="shadow-xs cursor-pointer gap-2 border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-[#111827] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <Download className="h-3.5 w-3.5" />
              Export Statement
            </Button>
            <Button
              size="sm"
              className="shadow-xs cursor-pointer gap-2 bg-emerald-600 text-xs font-medium text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              <Send className="h-3.5 w-3.5" />
              Send Transfer
            </Button>
          </div>
        </div>
      </Reveal>

      {/* Section 2: 4 KPI Cards Grid */}
      <Reveal>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, idx) => (
            <MetricCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              change={metric.change}
              subtitle={metric.subtitle}
              isPositive={metric.isPositive}
              icon={kpiIcons[idx % kpiIcons.length]}
            />
          ))}
        </div>
      </Reveal>

      {/* Section 3: 2-Column Analytics & Runway Section */}
      <Reveal>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column: Chart */}
          <div className="lg:col-span-2">
            <Chart />
          </div>

          {/* Right Column: Stacked Financial Panels */}
          <div className="flex flex-col gap-4">
            {/* Panel A: Next Automated Payout */}
            <div className="shadow-xs flex flex-1 flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800/80 dark:bg-[#111827]">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                      <Landmark className="h-3.5 w-3.5" />
                    </div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Next Automated Payout
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Auto-clearing
                  </span>
                </div>

                <div className="mt-4">
                  <div className="font-mono text-2xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-white">
                    $42,850.00
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Destination:{" "}
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Chase Business Checking •••• 4291
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Scheduled</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Tomorrow, Sep 18 at 09:00 EST
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Batch status</span>
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      Processing Batch #BCH-892
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-full w-4/5 rounded-full bg-emerald-500 transition-all" />
                  </div>
                </div>
              </div>
            </div>

            {/* Panel B: Cash Runway & Reserves */}
            <div className="shadow-xs flex flex-1 flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800/80 dark:bg-[#111827]">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
                      <ShieldCheck className="h-3.5 w-3.5" />
                    </div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Cash Runway & Reserves
                    </h3>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
                    Safe / High Liquidity
                  </span>
                </div>

                <div className="mt-4">
                  <div className="font-mono text-2xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-white">
                    14.2 Months
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Burn Rate:{" "}
                    <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                      ~$24,500 / month
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Capital cushion</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    Above 12mo Target
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-full w-[82%] rounded-full bg-emerald-500 transition-all" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                  <span>0 mo</span>
                  <span>Target: 12 mo</span>
                  <span>24+ mo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Section 4: Recent Operations Ledger */}
      <Reveal>
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Recent Operations
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Latest inbound charges and processed settlements
              </p>
            </div>
            <Link
              href="/transactions"
              className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              View all transactions <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="shadow-xs overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800/80 dark:bg-[#111827]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 dark:border-slate-800/80 dark:bg-slate-900/50 dark:text-slate-400">
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider">
                      Net Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {recentTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate font-medium text-slate-900 dark:text-white">
                            {tx.customer || tx.name}
                          </span>
                          <span className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                            {tx.customerEmail || tx.description}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">{getMethodBadge(tx)}</td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-slate-500 dark:text-slate-400">
                        {tx.date}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">{getStatusBadge(tx.status)}</td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-right">
                        {formatNetAmount(tx)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
