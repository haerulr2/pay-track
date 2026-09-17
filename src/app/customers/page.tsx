"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  CreditCard,
  Download,
  Globe,
  Search,
  TrendingUp,
  UserCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";

import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Customer, CustomerStatus, dummyCustomers } from "@/lib/dummy-customers";
import { exportCustomersToCSV } from "@/lib/export";
import { formatCurrency } from "@/lib/utils";
import CustomerDetailSheet from "@/components/customers/CustomerDetailSheet";
import CustomerStatusBadge from "@/components/customers/CustomerStatusBadge";

type FilterTab = "All" | CustomerStatus;

export default function CustomersPage() {
  const [customers] = useState<Customer[]>(dummyCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<FilterTab>("All");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Status counts
  const statusCounts = useMemo(() => {
    const counts: Record<FilterTab, number> = {
      All: customers.length,
      Active: 0,
      "Churn Risk": 0,
      Inactive: 0,
    };
    customers.forEach((c) => {
      counts[c.status] = (counts[c.status] || 0) + 1;
    });
    return counts;
  }, [customers]);

  // Aggregate metrics
  const metrics = useMemo(() => {
    const totalLTV = customers.reduce((sum, c) => sum + c.lifetimeValue, 0);
    const avgLTV = customers.length > 0 ? totalLTV / customers.length : 0;
    const activeCount = customers.filter((c) => c.status === "Active").length;
    const activeRatio = customers.length > 0 ? (activeCount / customers.length) * 100 : 0;

    return { totalLTV, avgLTV, activeRatio };
  }, [customers]);

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesFilter = selectedFilter === "All" || c.status === selectedFilter;
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.id.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.defaultPaymentMethod.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [customers, selectedFilter, searchTerm]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(filteredCustomers.map((c) => c.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRowClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  const handleExportAll = () => {
    exportCustomersToCSV(filteredCustomers, `customers-${selectedFilter.toLowerCase()}.csv`);
  };

  const handleExportSelected = () => {
    const selected = customers.filter((c) => selectedRows.includes(c.id));
    exportCustomersToCSV(selected, `customers-selected-${selected.length}.csv`);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <Reveal>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
              Customer Directory
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Accounts overview, payment configurations, and customer lifetime engagement
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportAll}
              className="gap-2 border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#111827] dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Download className="h-3.5 w-3.5" />
              Export Directory CSV
            </Button>
          </div>
        </div>
      </Reveal>

      {/* KPI Cards Grid */}
      <Reveal>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="shadow-xs rounded-xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-[#111827]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Total Enterprise Accounts
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 font-mono text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              1,429
            </div>
            <p className="mt-1 text-xs text-slate-500">+18% new cohorts this quarter</p>
          </div>

          <div className="shadow-xs rounded-xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-[#111827]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Active Client Ratio
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                <UserCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 font-mono text-2xl font-semibold tracking-tight text-emerald-600 dark:text-emerald-400">
              {metrics.activeRatio.toFixed(1)}%
            </div>
            <p className="mt-1 text-xs text-slate-500">Accounts with live monthly billing</p>
          </div>

          <div className="shadow-xs rounded-xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-[#111827]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Average Lifetime Value (LTV)
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 font-mono text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              {formatCurrency(metrics.avgLTV)}
            </div>
            <p className="mt-1 text-xs text-slate-500">Per paying business client</p>
          </div>

          <div className="shadow-xs rounded-xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-[#111827]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Net Revenue Retention
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 font-mono text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              118.4%
            </div>
            <p className="mt-1 text-xs text-slate-500">Expansion vs churn rate</p>
          </div>
        </div>
      </Reveal>

      {/* Main Table Card */}
      <Reveal>
        <div className="shadow-xs overflow-hidden rounded-xl border border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-[#111827]">
          {/* Controls Bar */}
          <div className="flex flex-col gap-3 border-b border-slate-200/80 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800/80">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(["All", "Active", "Churn Risk", "Inactive"] as FilterTab[]).map((tab) => {
                const count = statusCounts[tab];
                const isActive = selectedFilter === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setSelectedFilter(tab)}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      isActive
                        ? "shadow-xs bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <span>{tab}</span>
                    <span
                      className={`py-0.2 rounded-full px-1.5 font-mono text-[10px] ${
                        isActive
                          ? "bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900"
                          : "bg-slate-200/70 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search customers or companies..."
                className="h-8.5 w-full rounded-lg border border-slate-200 bg-slate-50/60 pl-9 pr-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Bulk Selection Bar */}
          {selectedRows.length > 0 && (
            <div className="flex items-center justify-between bg-slate-900 px-4 py-2 text-xs text-white dark:bg-white dark:text-slate-900">
              <span className="font-medium">
                {selectedRows.length} {selectedRows.length === 1 ? "customer" : "customers"}{" "}
                selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportSelected}
                  className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2.5 py-1 font-medium hover:bg-white/20 dark:bg-slate-900/10 dark:hover:bg-slate-900/20"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export Selected
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRows([])}
                  className="text-white/70 hover:text-white dark:text-slate-900/70 dark:hover:text-slate-900"
                >
                  Deselect all
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/80 font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
                <tr>
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={
                        filteredCustomers.length > 0 &&
                        selectedRows.length === filteredCustomers.length
                      }
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900"
                    />
                  </th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Primary Payment Method</th>
                  <th className="px-4 py-3">Country</th>
                  <th className="px-4 py-3 text-right">Lifetime Value</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="w-12 px-4 py-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center text-slate-400 dark:text-slate-500"
                    >
                      No customers found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((cust) => {
                    const isSelected = selectedRows.includes(cust.id);
                    return (
                      <tr
                        key={cust.id}
                        onClick={() => handleRowClick(cust)}
                        className={`group cursor-pointer transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40 ${
                          isSelected ? "bg-slate-50/60 dark:bg-slate-800/30" : ""
                        }`}
                      >
                        <td className="px-4 py-3.5" onClick={(e) => handleSelectRow(cust.id, e)}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900"
                          />
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                              {cust.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-white">
                                {cust.name}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                {cust.company} • {cust.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                            <span>{cust.defaultPaymentMethod}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-1.5">
                            <Globe className="h-3.5 w-3.5 text-slate-400" />
                            <span>{cust.country}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono font-semibold text-slate-900 dark:text-white">
                          {formatCurrency(cust.lifetimeValue)}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <CustomerStatusBadge status={cust.status} />
                        </td>
                        <td className="px-4 py-3.5 text-right text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200">
                          <ArrowRight className="inline-block h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      {/* Customer Detail Sheet */}
      <CustomerDetailSheet
        customer={selectedCustomer}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
}
