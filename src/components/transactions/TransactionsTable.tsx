"use client";

import { Transaction, transactions } from "@/lib/dummy-transactions";
import { ChevronDown, Download, Filter } from "lucide-react";
import { useState } from "react";

export default function TransactionsTable() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Handle checkbox selection
  const handleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Handle select all rows
  const handleSelectAll = () => {
    if (selectedRows.length === transactions.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(transactions.map((tx) => tx.id));
    }
  };

  const getPaymentIcon = (icon: string) => {
    switch (icon) {
      case "visa":
        return (
          <div className="flex h-5 w-8 items-center justify-center rounded bg-blue-700 text-white">
            <span className="text-xs font-bold">VISA</span>
          </div>
        );
      case "mastercard":
        return (
          <div className="flex h-5 w-8 items-center justify-center rounded bg-orange-600 text-white">
            <span className="text-xs font-bold">MC</span>
          </div>
        );
      case "amex":
        return (
          <div className="flex h-5 w-8 items-center justify-center rounded bg-blue-500 text-white">
            <span className="text-xs font-bold">AMEX</span>
          </div>
        );
      case "stripe":
        return (
          <div className="flex h-5 w-8 items-center justify-center rounded bg-gray-100 text-gray-600">
            <span className="text-xs">S</span>
          </div>
        );
      case "amazon":
        return (
          <div className="flex h-5 w-8 items-center justify-center rounded bg-gray-800 text-white">
            <span className="text-xs">A</span>
          </div>
        );
      default:
        return (
          <div className="flex h-5 w-8 items-center justify-center rounded bg-gray-200 text-gray-600">
            <span className="text-xs">P</span>
          </div>
        );
    }
  };

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "Succeeded":
        return (
          <span className="inline-flex items-center rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-green-600"></span>
            Succeeded
          </span>
        );
      case "Failed":
        return (
          <span className="inline-flex items-center rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-red-600"></span>
            Failed
          </span>
        );
      case "Disputed":
        return (
          <span className="inline-flex items-center rounded bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-800">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-orange-600"></span>
            Disputed
          </span>
        );
      case "Refunded":
        return (
          <span className="inline-flex items-center rounded bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-800">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-purple-600"></span>
            Refunded
          </span>
        );
      case "Uncaptured":
        return (
          <span className="inline-flex items-center rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-blue-600"></span>
            Uncaptured
          </span>
        );
    }
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-none dark:bg-zinc-900">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 border-b px-1 py-2 dark:border-zinc-800">
        <button className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm dark:border-zinc-700">
          <span>Date and time</span>
          <ChevronDown className="h-4 w-4" />
        </button>
        <button className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm dark:border-zinc-700">
          <span>Amount</span>
          <ChevronDown className="h-4 w-4" />
        </button>
        <button className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm dark:border-zinc-700">
          <span>Currency</span>
          <ChevronDown className="h-4 w-4" />
        </button>
        <button className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm dark:border-zinc-700">
          <span>Status</span>
          <ChevronDown className="h-4 w-4" />
        </button>
        <button className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm dark:border-zinc-700">
          <span>Payment method</span>
          <ChevronDown className="h-4 w-4" />
        </button>
        <button className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm dark:border-zinc-700">
          <span>More filters</span>
          <Filter className="h-4 w-4" />
        </button>

        <div className="flex-grow"></div>

        <button className="ml-auto flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm dark:border-zinc-700">
          <Download className="h-4 w-4" />
          <span>Export</span>
        </button>
        <button className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm dark:border-zinc-700">
          <span>Edit columns</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="text-left text-sm tracking-wider text-gray-500 dark:text-gray-400">
            <tr className="border-b dark:border-zinc-800">
              <th className="px-1 py-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={selectedRows.length === transactions.length && transactions.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th colSpan={3}>Amount</th>
              <th>Payment method</th>
              <th>Description</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Refunded date</th>
              <th>Decline reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-xs dark:divide-zinc-800">
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                onClick={() => {}}
              >
                <td className="px-1 py-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedRows.includes(tx.id)}
                    onChange={() => handleSelectRow(tx.id)}
                  />
                </td>
                <td className=" pr-2 text-right font-medium">{"$ " + tx.amount}</td>
                <td className="text-gray-600 dark:text-gray-400">{tx.currency}</td>
                <td className=" text-gray-600 dark:text-gray-400">{getStatusBadge(tx.status)}</td>
                <td className="">
                  <div className="flex items-center space-x-2">
                    {getPaymentIcon(tx.paymentIcon)}
                    <span>{tx.paymentMethod}</span>
                  </div>
                </td>
                <td className=" text-gray-600 dark:text-gray-400">{tx.description}</td>
                <td className=" text-gray-600 dark:text-gray-400">{tx.customer}</td>
                <td className=" text-gray-600 dark:text-gray-400">{tx.date}</td>
                <td className=" text-gray-600 dark:text-gray-400">{tx.refundedDate || "—"}</td>
                <td className=" text-gray-600 dark:text-gray-400">{tx.declineReason || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with results count */}
      <div className="border-t px-6 py-3 text-xs text-gray-500 dark:border-zinc-800 dark:text-gray-400">
        {transactions.length} results
      </div>
    </div>
  );
}
