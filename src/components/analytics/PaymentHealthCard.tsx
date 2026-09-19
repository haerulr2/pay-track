import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";
import type { AnalyticsKpi, DeclineReason } from "@/types";

export interface PaymentHealthCardProps {
  kpis: AnalyticsKpi;
  declineReasons: DeclineReason[];
  className?: string;
}

export function PaymentHealthCard({ kpis, declineReasons, className }: PaymentHealthCardProps) {
  const declinedRate = Math.max(0, +(100 - kpis.authorizationRate - kpis.disputeRate).toFixed(2));

  const getCategoryBadge = (category: DeclineReason["category"]) => {
    switch (category) {
      case "customer":
        return (
          <span className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-400">
            Customer Side
          </span>
        );
      case "card_issuer":
        return (
          <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-400">
            Issuing Bank
          </span>
        );
      case "fraud":
        return (
          <span className="inline-flex items-center rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-400">
            Risk & Fraud
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            Network / System
          </span>
        );
    }
  };

  return (
    <div
      className={cn(
        "shadow-xs rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800/80 dark:bg-[#111827]",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-slate-900 sm:text-base dark:text-white">
            Payment Health & Authorization Funnel
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Card network acceptance rates and top merchant decline vectors
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          <span>Gateway Status: Optimal (99.98% uptime)</span>
        </div>
      </div>

      {/* Segmented Funnel Meter */}
      <div className="mt-5 rounded-lg border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800/60 dark:bg-slate-900/30">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Approved ({kpis.authorizationRate}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Soft/Hard Declines ({declinedRate}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-violet-500" />
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Chargeback & Dispute ({kpis.disputeRate}%)
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            style={{ width: `${kpis.authorizationRate}%` }}
            className="h-full bg-emerald-500 transition-all duration-500"
            title={`Approved: ${kpis.authorizationRate}%`}
          />
          <div
            style={{ width: `${declinedRate}%` }}
            className="h-full bg-amber-500 transition-all duration-500"
            title={`Declined: ${declinedRate}%`}
          />
          <div
            style={{ width: `${kpis.disputeRate}%` }}
            className="h-full bg-violet-500 transition-all duration-500"
            title={`Disputed: ${kpis.disputeRate}%`}
          />
        </div>
      </div>

      {/* Decline Reasons Table */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Top Decline Reasons & Mitigations
          </h3>
          <span className="text-xs text-slate-400">Ranked by frequency</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <th className="pb-2.5 font-medium">Decline Reason</th>
                <th className="pb-2.5 font-medium">Origin Category</th>
                <th className="pb-2.5 text-right font-medium">Failures Count</th>
                <th className="pb-2.5 text-right font-medium">% Share</th>
                <th className="pb-2.5 pl-6 font-medium">Recommended Mitigation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {declineReasons.map((item) => (
                <tr
                  key={item.reason}
                  className="transition hover:bg-slate-50/50 dark:hover:bg-slate-900/30"
                >
                  <td className="py-3 font-medium text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                      <span>{item.reason}</span>
                    </div>
                  </td>
                  <td className="py-3">{getCategoryBadge(item.category)}</td>
                  <td className="py-3 text-right font-mono text-slate-600 dark:text-slate-300">
                    {item.count}
                  </td>
                  <td className="py-3 text-right font-mono font-semibold text-slate-900 dark:text-white">
                    {item.percentage}%
                  </td>
                  <td className="py-3 pl-6 text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Info className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                      <span>{item.suggestedAction}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PaymentHealthCard;
