import { AlertCircle, Scale, ShieldCheck, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";

import { cn, formatCurrency } from "@/lib/utils";
import type { AnalyticsKpi } from "@/types";

export interface AnalyticsKpiCardsProps {
  kpis: AnalyticsKpi;
  className?: string;
}

export function AnalyticsKpiCards({ kpis, className }: AnalyticsKpiCardsProps) {
  const isGrossPositive = kpis.grossVolumeChange >= 0;
  const isNetPositive = kpis.netSettlementChange >= 0;
  const isAuthPositive = kpis.authorizationRateChange >= 0;
  const isDisputePositive = kpis.disputeRateChange <= 0; // lower dispute is positive

  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {/* Gross Processing Volume */}
      <div className="shadow-xs rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 dark:border-slate-800/80 dark:bg-[#111827] dark:hover:border-slate-700">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Gross Volume
          </h3>
          <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 font-mono text-2xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-white">
          {formatCurrency(kpis.grossVolume)}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
              isGrossPositive
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-400"
                : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800/50 dark:bg-rose-950/40 dark:text-rose-400"
            )}
          >
            {isGrossPositive ? (
              <TrendingUp className="h-3 w-3 shrink-0" />
            ) : (
              <TrendingDown className="h-3 w-3 shrink-0" />
            )}
            <span>
              {isGrossPositive ? `+${kpis.grossVolumeChange}%` : `${kpis.grossVolumeChange}%`}
            </span>
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">vs prior period</span>
        </div>
      </div>

      {/* Net Settlement Volume */}
      <div className="shadow-xs rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 dark:border-slate-800/80 dark:bg-[#111827] dark:hover:border-slate-700">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Net Settlement
          </h3>
          <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            <Scale className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 font-mono text-2xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-white">
          {formatCurrency(kpis.netSettlement)}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
              isNetPositive
                ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/50 dark:bg-blue-950/40 dark:text-blue-400"
                : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800/50 dark:bg-rose-950/40 dark:text-rose-400"
            )}
          >
            {isNetPositive ? (
              <TrendingUp className="h-3 w-3 shrink-0" />
            ) : (
              <TrendingDown className="h-3 w-3 shrink-0" />
            )}
            <span>
              {isNetPositive ? `+${kpis.netSettlementChange}%` : `${kpis.netSettlementChange}%`}
            </span>
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">post-gateway fees</span>
        </div>
      </div>

      {/* Authorization Success Rate */}
      <div className="shadow-xs rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 dark:border-slate-800/80 dark:bg-[#111827] dark:hover:border-slate-700">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Auth Success Rate
          </h3>
          <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-mono text-2xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-white">
            {kpis.authorizationRate}%
          </span>
          <span className="rounded-md border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-400">
            Target 95%+
          </span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
              isAuthPositive
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-400"
                : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800/50 dark:bg-rose-950/40 dark:text-rose-400"
            )}
          >
            {isAuthPositive ? (
              <TrendingUp className="h-3 w-3 shrink-0" />
            ) : (
              <TrendingDown className="h-3 w-3 shrink-0" />
            )}
            <span>
              {isAuthPositive
                ? `+${kpis.authorizationRateChange}%`
                : `${kpis.authorizationRateChange}%`}
            </span>
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">gateway health</span>
        </div>
      </div>

      {/* Dispute & Refund Ratio */}
      <div className="shadow-xs rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 dark:border-slate-800/80 dark:bg-[#111827] dark:hover:border-slate-700">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Dispute Ratio
          </h3>
          <div className="rounded-lg bg-violet-50 p-2 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400">
            <AlertCircle className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-mono text-2xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-white">
            {kpis.disputeRate}%
          </span>
          <span className="rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            Threshold &lt; 0.9%
          </span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
              isDisputePositive
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-400"
                : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800/50 dark:bg-rose-950/40 dark:text-rose-400"
            )}
          >
            {isDisputePositive ? (
              <TrendingDown className="h-3 w-3 shrink-0" />
            ) : (
              <TrendingUp className="h-3 w-3 shrink-0" />
            )}
            <span>
              {kpis.disputeRateChange > 0
                ? `+${kpis.disputeRateChange}%`
                : `${kpis.disputeRateChange}%`}
            </span>
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">Visa / MC safe</span>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsKpiCards;
