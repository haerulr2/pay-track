"use client";

import React, { useSyncExternalStore } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { cn, formatCurrency } from "@/lib/utils";
import type { PaymentMethodShare } from "@/types";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: number;
    name?: string;
    payload?: PaymentMethodShare;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0]?.payload;
  if (!item) return null;

  return (
    <div className="backdrop-blur-xs min-w-44 rounded-lg border border-slate-800 bg-slate-900/95 p-3 text-xs text-white shadow-xl">
      <div className="flex items-center gap-2 font-medium text-slate-200">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
        <span>{item.name}</span>
      </div>
      <div className="mt-1.5 flex items-baseline justify-between gap-3">
        <span className="font-mono font-bold text-white">{formatCurrency(item.volume)}</span>
        <span className="font-mono text-xs text-emerald-400">{item.percentage}%</span>
      </div>
      <p className="mt-1 text-[11px] text-slate-400">{item.count.toLocaleString()} transactions</p>
    </div>
  );
}

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export interface PaymentMethodDistributionProps {
  data: PaymentMethodShare[];
  className?: string;
}

export function PaymentMethodDistribution({ data, className }: PaymentMethodDistributionProps) {
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const totalVolume = data.reduce((acc, curr) => acc + curr.volume, 0);

  return (
    <div
      className={cn(
        "shadow-xs flex flex-col rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800/80 dark:bg-[#111827]",
        className
      )}
    >
      {/* Header */}
      <div>
        <h2 className="text-sm font-semibold tracking-tight text-slate-900 sm:text-base dark:text-white">
          Payment Method Share
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Inflow distribution across payment rails
        </p>
      </div>

      {/* Donut Chart */}
      <div className="relative my-2 flex h-52 w-full items-center justify-center">
        {mounted ? (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={82}
                  paddingAngle={3}
                  dataKey="volume"
                  nameKey="name"
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[11px] uppercase tracking-wider text-slate-400">Total Vol</span>
              <span className="font-mono text-sm font-bold text-slate-900 sm:text-base dark:text-white">
                {totalVolume >= 1000000
                  ? `$${(totalVolume / 1000000).toFixed(1)}M`
                  : `$${(totalVolume / 1000).toFixed(0)}k`}
              </span>
            </div>
          </>
        ) : (
          <div className="h-32 w-32 animate-pulse rounded-full border-4 border-slate-200 dark:border-slate-800" />
        )}
      </div>

      {/* Method List / Legend */}
      <div className="mt-auto space-y-2.5 border-t border-slate-100 pt-3 dark:border-slate-800/60">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-slate-500 dark:text-slate-400">
                {formatCurrency(item.volume)}
              </span>
              <span className="w-10 text-right font-mono font-semibold text-slate-900 dark:text-white">
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PaymentMethodDistribution;
