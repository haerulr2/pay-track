import { transactions } from "@/lib/dummy-state";

export default function TransactionTable() {
  return (
    <div className="bg-white dark:bg-zinc-900 p-4">
      <h3 className="text-sm text-gray-500 mb-4 dark:text-gray-400">Recent Transactions</h3>
      <ul className="space-y-2 text-sm">
        {transactions.map((tx) => (
          <li key={tx.id} className="flex justify-between border-b border-gray-200 dark:border-zinc-800 pb-2">
            <span>{tx.name}</span>
            <span className="font-semibold">{tx.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
