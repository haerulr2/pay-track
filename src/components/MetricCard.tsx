export default function MetricCard({ title, value, change }: { title: string, value: string, change: string }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow hover:shadow-md transition">
      <h3 className="text-sm text-gray-500 dark:text-gray-400">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      <p className={`text-sm ${change.includes('+') ? 'text-green-500' : 'text-red-500'}`}>
        {change}
      </p>
    </div>
  );
}
