"use client";

import React, { useState, useSyncExternalStore } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cashFlowSeries } from "@/lib/dummy-state";
import { cn, formatCurrency } from "@/lib/utils";
import type { CashFlowTimeframe } from "@/types";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: number;
    dataKey?: string | number;
    name?: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const inflowEntry = payload.find((p) => p.dataKey === "inflow");
  const netEntry = payload.find((p) => p.dataKey === "net");
  const inflow = typeof inflowEntry?.value === "number" ? inflowEntry.value : 0;
  const net = typeof netEntry?.value === "number" ? netEntry.value : 0;

  return (
    <div className="backdrop-blur-xs rounded-lg border border-slate-800 bg-slate-900/95 p-3 text-xs text-white shadow-xl">
      <p className="mb-1.5 font-semibold text-slate-300">{label}</p>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Inflow
          </span>
          <span className="font-mono font-medium text-emerald-400">{formatCurrency(inflow)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            Net Volume
          </span>
          <span className="font-mono font-medium text-blue-400">{formatCurrency(net)}</span>
        </div>
      </div>
    </div>
  );
}

const timeframes: CashFlowTimeframe[] = ["7D", "30D", "90D", "YTD"];

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export interface ChartProps {
  className?: string;
}

export default function Chart({ className }: ChartProps) {
  const [timeframe, setTimeframe] = useState<CashFlowTimeframe>("7D");
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const currentData = (cashFlowSeries && cashFlowSeries[timeframe]) || [];

  return (
    <div
      className={cn(
        "shadow-xs rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800/80 dark:bg-[#111827]",
        className
      )}
    >
      {/* Header with Title and Timeframe Selector */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-slate-900 sm:text-base dark:text-white">
            Cash Flow & Inflow Volume
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Net inbound charges vs. operating settlements
          </p>
        </div>

        {/* Timeframe pill selector buttons */}
        <div className="inline-flex self-start rounded-lg border border-slate-200 bg-slate-100 p-0.5 sm:self-auto dark:border-slate-800 dark:bg-slate-900">
          {timeframes.map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={cn(
                "cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-all",
                timeframe === tf
                  ? "shadow-xs bg-white text-slate-900 dark:bg-slate-800 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              )}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-70 w-full">
        {mounted ? (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={currentData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-slate-200 dark:stroke-slate-800/60"
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickFormatter={(val: number) => "$" + (val >= 1000 ? val / 1000 + "k" : val)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="inflow"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#emeraldGradient)"
                name="Inflow"
              />
              <Area
                type="monotone"
                dataKey="net"
                stroke="#3b82f6"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                fill="none"
                name="Net Volume"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-slate-50/50 dark:bg-slate-900/20">
            <div className="h-4 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        )}
      </div>

      {/* Legend / Indicators */}
      <div className="mt-4 flex items-center justify-center gap-6 border-t border-slate-100 pt-3 text-xs text-slate-600 dark:border-slate-800/60 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="font-medium">Inflow</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full border border-dashed border-blue-500 bg-blue-500/20" />
          <span className="font-medium">Net Margin</span>
        </div>
      </div>
    </div>
  );
}

export { Chart };
