"use client";



import Chart from "@/components/Chart";
import MetricCard from "@/components/MetricCard";
import Reveal from "@/components/Reveal";

import { metrics, transactions } from "@/lib/dummy-state";

/**
 * Dashboard page component displaying payment tracking overview and metrics.
 *
 * Features:
 * - Real-time metrics display
 * - Interactive charts
 * - Recent transactions list
 * - Balance and payout information
 * - Responsive grid layout with animations
 *
 * @example
 * ```tsx
 * // Rendered automatically at /dashboard route
 * <DashboardPage />
 * ```
 */
function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-12 px-1 py-8">
      {/* Today's Overview Section */}
      <section>
        <Reveal>
          <h1 className="mb-8 border-b border-gray-200 pb-2 text-2xl font-bold dark:border-zinc-500">
            Today
          </h1>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-3">
          {/* Chart Section */}
          <Reveal className="col-span-2">
            <Chart />
          </Reveal>

          {/* Balance and Payout Information */}
          <Reveal>
            <div className="flex h-full flex-col space-y-5 bg-white dark:bg-zinc-900">
              {/* USD Balance */}
              <div className="flex-1 border-b border-gray-200 pl-4 dark:border-zinc-500">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium">USD balance</span>
                  <a
                    href="/test/balance/overview?currency=usd"
                    className="text-sm font-medium text-blue-500 hover:underline"
                    aria-label="View USD balance details"
                  >
                    View
                  </a>
                </div>
                <div className="mb-1">
                  <span className="text-xl">$5.63</span>
                </div>
                <span className="text-xs text-gray-500">Estimated future payouts</span>
              </div>

              {/* Payouts */}
              <div className="flex-1 pl-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium">Payouts</span>
                  <a
                    href="/test/balance/overview"
                    className="text-sm font-medium text-blue-500 hover:underline"
                    aria-label="View payout details"
                  >
                    View
                  </a>
                </div>
                <span className="text-xl text-gray-500">$0.00</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Dashboard Overview Section */}
      <section>
        <Reveal>
          <h1 className="mb-8 border-b border-gray-200 pb-2 text-2xl font-bold dark:border-zinc-500">
            Dashboard Overview
          </h1>
        </Reveal>

        {/* Metrics Grid */}
        <Reveal>
          <div className="mb-5 grid gap-5 sm:grid-cols-3">
            {metrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>
        </Reveal>

        {/* Overview Chart */}
        <Reveal className="mb-5">
          <Chart />
        </Reveal>

        {/* Recent Transactions */}
        <Reveal>
          <div className="bg-white p-4 dark:bg-zinc-900">
            <h3 className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Recent Transactions
            </h3>
            <ul className="space-y-2 text-sm">
              {transactions.map((transaction) => (
                <li
                  key={transaction.id}
                  className="flex justify-between border-b border-gray-200 pb-2 dark:border-zinc-500"
                >
                  <span>{transaction.name}</span>
                  <span className="font-semibold">{transaction.amount}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

export default DashboardPage;
