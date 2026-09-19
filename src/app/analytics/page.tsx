"use client";

import { Download, RefreshCw } from "lucide-react";
import React, { useMemo, useState } from "react";

import AnalyticsKpiCards from "@/components/analytics/AnalyticsKpiCards";
import PaymentHealthCard from "@/components/analytics/PaymentHealthCard";
import PaymentMethodDistribution from "@/components/analytics/PaymentMethodDistribution";
import VolumeTrendChart from "@/components/analytics/VolumeTrendChart";
import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { getAnalyticsSnapshot } from "@/lib/analytics-data";
import { exportAnalyticsToCSV } from "@/lib/export";
import { cn } from "@/lib/utils";
import type { AnalyticsTimeframe } from "@/types";

const timeframeOptions: AnalyticsTimeframe[] = ["7D", "30D", "90D", "YTD"];

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<AnalyticsTimeframe>("30D");
  const [isExporting, setIsExporting] = useState(false);

  const snapshot = useMemo(() => getAnalyticsSnapshot(timeframe), [timeframe]);

  const handleExport = () => {
    setIsExporting(true);
    try {
      exportAnalyticsToCSV(snapshot);
    } finally {
      setTimeout(() => setIsExporting(false), 600);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      {/* Header Banner */}
      <Reveal>
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800/80">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Payment Analytics
            </h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
              Cross-network volume, net operating settlements, and failure diagnostics
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
            {/* Global Timeframe Selector Pills */}
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-800 dark:bg-slate-900">
              {timeframeOptions.map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setTimeframe(tf)}
                  className={cn(
                    "cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                    timeframe === tf
                      ? "shadow-xs bg-white text-slate-900 dark:bg-slate-800 dark:text-white"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  )}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Export Report CTA */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={isExporting}
              className="shadow-xs cursor-pointer gap-2 border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-[#111827] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              {isExporting ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              <span>Export Report</span>
            </Button>
          </div>
        </div>
      </Reveal>

      {/* Top 4 KPI Metrics */}
      <Reveal>
        <AnalyticsKpiCards kpis={snapshot.kpis} />
      </Reveal>

      {/* Middle Section: Volume Trend Chart (2-cols) & Payment Method Distribution (1-col) */}
      <Reveal>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <VolumeTrendChart
            data={snapshot.volumeTrend}
            timeframe={timeframe}
            className="lg:col-span-2"
          />
          <PaymentMethodDistribution data={snapshot.methodDistribution} className="lg:col-span-1" />
        </div>
      </Reveal>

      {/* Bottom Section: Payment Health & Decline Breakdown */}
      <Reveal>
        <PaymentHealthCard kpis={snapshot.kpis} declineReasons={snapshot.declineReasons} />
      </Reveal>
    </div>
  );
}
