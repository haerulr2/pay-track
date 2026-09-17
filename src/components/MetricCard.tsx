import React from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";

export interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  subtitle?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export default function MetricCard({
  title,
  value,
  change,
  subtitle,
  isPositive,
  icon,
  className,
}: MetricCardProps) {
  const positive = isPositive !== undefined ? isPositive : change.includes("+");

  return (
    <div
      className={cn(
        "shadow-xs rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 dark:border-slate-800/80 dark:bg-[#111827] dark:hover:border-slate-700",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </h3>
        {icon && <div className="text-slate-400 dark:text-slate-500">{icon}</div>}
      </div>

      {/* Metric Value */}
      <div className="mt-2 font-mono text-2xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-white">
        {value}
      </div>

      {/* Footer / Trend badge & subtitle */}
      <div className="mt-3 flex items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
            positive
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-400"
              : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800/50 dark:bg-rose-950/40 dark:text-rose-400"
          )}
        >
          {positive ? (
            <TrendingUp className="h-3 w-3 shrink-0" />
          ) : (
            <TrendingDown className="h-3 w-3 shrink-0" />
          )}
          <span>{change}</span>
        </span>
        {subtitle && (
          <span className="truncate text-xs text-slate-500 dark:text-slate-400">{subtitle}</span>
        )}
      </div>
    </div>
  );
}

export { MetricCard };
