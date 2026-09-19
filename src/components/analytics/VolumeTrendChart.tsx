"use client";

import React, { useSyncExternalStore } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn, formatCurrency } from "@/lib/utils";
import type { AnalyticsTimeframe, VolumeTrendPoint } from "@/types";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: number;
    dataKey?: string | number;
    name?: string;
    payload?: VolumeTrendPoint;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const point = payload[0]?.payload;
  if (!point) return null;

  return (
    <div className="backdrop-blur-xs min-w-56 rounded-lg border border-slate-800 bg-slate-900/95 p-3.5 text-xs text-white shadow-2xl">
      <div className="mb-2 flex items-center justify-between border-b border-slate-800 pb-1.5">
        <span className="font-semibold text-slate-200">{label}</span>
        <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
          {point.count} txns
        </span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Gross Volume
          </span>
          <span className="font-mono font-medium text-emerald-400">
            {formatCurrency(point.gross)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            Net Settlement
          </span>
          <span className="font-mono font-medium text-blue-400">{formatCurrency(point.net)}</span>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-slate-800/80 pt-1 text-[11px]">
          <span className="text-slate-500">Processing Fees</span>
          <span className="font-mono text-slate-400">-{formatCurrency(point.fees)}</span>
        </div>
      </div>
    </div>
  );
}

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export interface VolumeTrendChartProps {
  data: VolumeTrendPoint[];
  timeframe: AnalyticsTimeframe;
  className?: string;
}

export function VolumeTrendChart({ data, timeframe, className }: VolumeTrendChartProps) {
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div
      className={cn(
        "shadow-xs flex flex-col rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800/80 dark:bg-[#111827]",
        className
      )}
    >
      {/* Header */}
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-slate-900 sm:text-base dark:text-white">
            Volume & Settlement Trajectory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Gross customer charges vs. deposited net funds ({timeframe})
          </p>
        </div>

        {/* Legend pills */}
        <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-medium text-slate-700 dark:text-slate-300">Gross</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full border border-dashed border-blue-500 bg-blue-500/30" />
            <span className="font-medium text-slate-700 dark:text-slate-300">Net</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full flex-1">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="grossGradient" x1="0" y1="0" x2="0" y2="1">
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
                dataKey="label"
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
                dataKey="gross"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#grossGradient)"
                name="Gross Volume"
              />
              <Area
                type="monotone"
                dataKey="net"
                stroke="#3b82f6"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fill="none"
                name="Net Settlement"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-slate-50/50 dark:bg-slate-900/20">
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        )}
      </div>
    </div>
  );
}

export default VolumeTrendChart;
