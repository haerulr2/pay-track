'use client';

import { metrics, transactions } from "@/lib/dummy-state";
import MetricCard from "@/components/MetricCard";
import Chart from "@/components/Chart";
import Reveal from "@/components/Reveal";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-1 py-8 space-y-12">
      <div>
        <Reveal>
          <h1 className="text-2xl font-bold border-b border-gray-200 dark:border-zinc-500 pb-2 mb-8">
            Today
          </h1>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-6">
          <Reveal className="col-span-2">
            <Chart />
          </Reveal>

          <Reveal>
            {/* <ApiKeyCard publishableKey={"pk_test_1234567890"} secretKey={"sk_test_1234567890"} /> */}
            <div className="flex flex-col h-full bg-white dark:bg-zinc-900 space-y-5">
              <div className="flex-1 border-b border-gray-200 dark:border-zinc-500 pl-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">USD balance</span>
                  <a href="/test/balance/overview?currency=usd" className="text-sm font-medium text-blue-500 hover:underline">
                    View
                  </a>
                </div>
                <div className="mb-1">
                  <span className="text-xl">$5.63</span>
                </div>
                <span className="text-xs text-gray-500">Estimated future payouts</span>
              </div>

              <div className="flex-1 pl-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">Payouts</span>
                  <a href="/test/balance/overview" className="text-sm font-medium text-blue-500 hover:underline">
                    View
                  </a>
                </div>
                <span className="text-xl text-gray-500">$0.00</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <div>
        <Reveal>
          <h1 className="text-2xl font-bold border-b border-gray-200 dark:border-zinc-500 pb-2 mb-8">
            Dashboard Overview
          </h1>
        </Reveal>

        <Reveal>
          <div className="grid sm:grid-cols-3 gap-5 mb-5">
            {metrics.map((m, i) => (
              <MetricCard key={i} {...m} />
            ))}
          </div>
        </Reveal>

        <Reveal className="mb-5">
          <Chart />
        </Reveal>

        <Reveal>
          <div className="bg-white dark:bg-zinc-900 p-4">
            <h3 className="text-sm text-gray-500 mb-4 dark:text-gray-400">Recent Transactions</h3>
            <ul className="space-y-2 text-sm">
              {transactions.map((tx) => (
                <li key={tx.id} className="flex justify-between border-b border-gray-200 dark:border-zinc-500 pb-2">
                  <span>{tx.name}</span>
                  <span className="font-semibold">{tx.amount}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
