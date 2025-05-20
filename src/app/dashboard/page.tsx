'use client';

import { metrics } from "@/lib/dummy-state";
import MetricCard from "@/components/MetricCard";
import Chart from "@/components/Chart";
import TransactionTable from "@/components/TransactionTable";
import Reveal from "@/components/Reveal";
import ApiKeyCard from "@/components/ApiKeyCard";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-1 py-8 space-y-10">
      <div>
        <Reveal>
          <h1 className="text-2xl font-bold border-b border-gray-200 pb-2 mb-8">
            Today
          </h1>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-6">
          <Reveal className="col-span-2">
            <Chart />
          </Reveal>

          <Reveal>
            <ApiKeyCard publishableKey={"pk_test_1234567890"} secretKey={"sk_test_1234567890"} />
          </Reveal>
        </div>
      </div>

      <div>
        <Reveal>
          <h1 className="text-2xl font-bold border-b border-gray-200 pb-2 mb-8">
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
          <TransactionTable />
        </Reveal>
      </div>
    </div>
  );
}
