"use client";

import { useState } from "react";
import { transactions, Transaction } from "@/lib/dummy-transactions";
import { ChevronDown, Download, Filter } from "lucide-react";

export default function TransactionsTable() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Handle checkbox selection
  const handleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Handle select all rows
  const handleSelectAll = () => {
    if (selectedRows.length === transactions.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(transactions.map(tx => tx.id));
    }
  };

  const getPaymentIcon = (icon: string) => {
    switch(icon) {
      case 'visa':
        return (
          <div className="flex items-center justify-center w-8 h-5 bg-blue-700 text-white rounded">
            <span className="text-xs font-bold">VISA</span>
          </div>
        );
      case 'mastercard':
        return (
          <div className="flex items-center justify-center w-8 h-5 bg-orange-600 text-white rounded">
            <span className="text-xs font-bold">MC</span>
          </div>
        );
      case 'amex':
        return (
          <div className="flex items-center justify-center w-8 h-5 bg-blue-500 text-white rounded">
            <span className="text-xs font-bold">AMEX</span>
          </div>
        );
      case 'stripe':
        return (
          <div className="flex items-center justify-center w-8 h-5 bg-gray-100 text-gray-600 rounded">
            <span className="text-xs">S</span>
          </div>
        );
      case 'amazon':
        return (
          <div className="flex items-center justify-center w-8 h-5 bg-gray-800 text-white rounded">
            <span className="text-xs">A</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-8 h-5 bg-gray-200 text-gray-600 rounded">
            <span className="text-xs">P</span>
          </div>
        );
    }
  };

  const getStatusBadge = (status: Transaction['status']) => {
    switch(status) {
      case 'Succeeded':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">
            <span className="mr-1 w-1.5 h-1.5 rounded-full bg-green-600"></span>
            Succeeded
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800">
            <span className="mr-1 w-1.5 h-1.5 rounded-full bg-red-600"></span>
            Failed
          </span>
        );
      case 'Disputed':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded bg-orange-100 text-orange-800">
            <span className="mr-1 w-1.5 h-1.5 rounded-full bg-orange-600"></span>
            Disputed
          </span>
        );
      case 'Refunded':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded bg-purple-100 text-purple-800">
            <span className="mr-1 w-1.5 h-1.5 rounded-full bg-purple-600"></span>
            Refunded
          </span>
        );
      case 'Uncaptured':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
            <span className="mr-1 w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Uncaptured
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-none">
      {/* Filters */}
      <div className="px-4 py-2 flex flex-wrap gap-2 border-b dark:border-zinc-800">
        <button className="px-3 py-1.5 text-sm rounded-md border dark:border-zinc-700 flex items-center gap-1">
          <span>Date and time</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        <button className="px-3 py-1.5 text-sm rounded-md border dark:border-zinc-700 flex items-center gap-1">
          <span>Amount</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        <button className="px-3 py-1.5 text-sm rounded-md border dark:border-zinc-700 flex items-center gap-1">
          <span>Currency</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        <button className="px-3 py-1.5 text-sm rounded-md border dark:border-zinc-700 flex items-center gap-1">
          <span>Status</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        <button className="px-3 py-1.5 text-sm rounded-md border dark:border-zinc-700 flex items-center gap-1">
          <span>Payment method</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        <button className="px-3 py-1.5 text-sm rounded-md border dark:border-zinc-700 flex items-center gap-1">
          <span>More filters</span>
          <Filter className="w-4 h-4" />
        </button>
        
        <div className="flex-grow"></div>
        
        <button className="px-3 py-1.5 text-sm rounded-md border dark:border-zinc-700 flex items-center gap-1 ml-auto">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
        <button className="px-3 py-1.5 text-sm rounded-md border dark:border-zinc-700 flex items-center gap-1">
          <span>Edit columns</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="text-xs text-left text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <tr className="border-b dark:border-zinc-800">
              <th className="pl-6 py-3">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={selectedRows.length === transactions.length && transactions.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="text-xs">Amount</th>
              <th className="text-xs">Payment method</th>
              <th className="text-xs">Description</th>
              <th className="text-xs">Customer</th>
              <th className="text-xs">Date</th>
              <th className="text-xs">Refunded date</th>
              <th className="text-xs">Decline reason</th>
              <th className="text-xs text-right pr-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-zinc-800 text-sm">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                <td className="pl-6 py-3">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedRows.includes(tx.id)}
                    onChange={() => handleSelectRow(tx.id)}
                  />
                </td>
                <td className=" font-medium">
                  {tx.amount} {tx.currency}
                </td>
                <td className="">
                  <div className="flex items-center space-x-2">
                    {getPaymentIcon(tx.paymentIcon)}
                    <span>{tx.paymentMethod}</span>
                  </div>
                </td>
                <td className=" text-gray-600 dark:text-gray-400">
                  {tx.description}
                </td>
                <td className=" text-gray-600 dark:text-gray-400">
                  {tx.customer}
                </td>
                <td className=" text-gray-600 dark:text-gray-400">
                  {tx.date}
                </td>
                <td className=" text-gray-600 dark:text-gray-400">
                  {tx.refundedDate || "—"}
                </td>
                <td className=" text-gray-600 dark:text-gray-400">
                  {tx.declineReason || "—"}
                </td>
                <td className=" text-right pr-6">
                  {getStatusBadge(tx.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with results count */}
      <div className="px-6 py-3 border-t dark:border-zinc-800 text-xs text-gray-500 dark:text-gray-400">
        {transactions.length} results
      </div>
    </div>
  );
}
