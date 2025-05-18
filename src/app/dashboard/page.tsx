import { metrics } from "@/lib/dummy-state";
import MetricCard from "@/components/MetricCard";
import Chart from "@/components/Chart";
import TransactionTable from "@/components/TransactionTable";
import Reveal from "@/components/Reveal";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <Reveal>
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      </Reveal>

      <Reveal>
        <div className="grid sm:grid-cols-3 gap-6">
          {metrics.map((m, i) => (
            <MetricCard key={i} {...m} />
          ))}
        </div>
      </Reveal>

      <Reveal>
        <Chart />
      </Reveal>

      <Reveal>
        <TransactionTable />
      </Reveal>
    </div>
  );
}
