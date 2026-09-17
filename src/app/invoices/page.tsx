"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Plus,
  Receipt,
  Search,
  X,
} from "lucide-react";

import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { dummyInvoices, Invoice, InvoiceStatus } from "@/lib/dummy-invoices";
import { exportInvoicesToCSV } from "@/lib/export";
import { formatCurrency } from "@/lib/utils";
import InvoiceDetailSheet from "@/components/invoices/InvoiceDetailSheet";
import CreateInvoiceDialog from "@/components/invoices/CreateInvoiceDialog";
import InvoiceStatusBadge from "@/components/invoices/InvoiceStatusBadge";

type FilterTab = "All" | InvoiceStatus;

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(dummyInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<FilterTab>("All");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Status counts
  const statusCounts = useMemo(() => {
    const counts: Record<FilterTab, number> = {
      All: invoices.length,
      Paid: 0,
      Open: 0,
      "Past Due": 0,
      Draft: 0,
    };
    invoices.forEach((inv) => {
      counts[inv.status] = (counts[inv.status] || 0) + 1;
    });
    return counts;
  }, [invoices]);

  // Aggregate metrics
  const metrics = useMemo(() => {
    const outstanding = invoices
      .filter((inv) => inv.status === "Open")
      .reduce((sum, inv) => sum + inv.total, 0);

    const paidThisMonth = invoices
      .filter((inv) => inv.status === "Paid")
      .reduce((sum, inv) => sum + inv.total, 0);

    const pastDue = invoices
      .filter((inv) => inv.status === "Past Due")
      .reduce((sum, inv) => sum + inv.total, 0);

    return { outstanding, paidThisMonth, pastDue };
  }, [invoices]);

  // Filtered list
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesFilter = selectedFilter === "All" || inv.status === selectedFilter;
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        inv.id.toLowerCase().includes(q) ||
        inv.customer.toLowerCase().includes(q) ||
        inv.customerCompany.toLowerCase().includes(q) ||
        inv.customerEmail.toLowerCase().includes(q) ||
        inv.total.toString().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [invoices, selectedFilter, searchTerm]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(filteredInvoices.map((inv) => inv.id));
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

  const handleRowClick = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setIsDetailOpen(true);
  };

  const handleStatusChange = (invoiceId: string, newStatus: InvoiceStatus) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoiceId ? { ...inv, status: newStatus } : inv))
    );
    if (selectedInvoice && selectedInvoice.id === invoiceId) {
      setSelectedInvoice((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleCreateInvoice = (newInvoice: Invoice) => {
    setInvoices((prev) => [newInvoice, ...prev]);
  };

  const handleExportAll = () => {
    exportInvoicesToCSV(filteredInvoices, `invoices-${selectedFilter.toLowerCase()}.csv`);
  };

  const handleExportSelected = () => {
    const selected = invoices.filter((inv) => selectedRows.includes(inv.id));
    exportInvoicesToCSV(selected, `invoices-selected-${selected.length}.csv`);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <Reveal>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
              Invoices & Billing
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Manage accounts receivable, issue client invoices, and track payment schedules
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
              Export CSV
            </Button>
            <Button
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className="gap-2 bg-emerald-600 text-xs font-medium text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              <Plus className="h-3.5 w-3.5" />
              Create Invoice
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
                Outstanding Balance
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 font-mono text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              {formatCurrency(metrics.outstanding)}
            </div>
            <p className="mt-1 text-xs text-slate-500">Awaiting customer payment</p>
          </div>

          <div className="shadow-xs rounded-xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-[#111827]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Collected This Month
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 font-mono text-2xl font-semibold tracking-tight text-emerald-600 dark:text-emerald-400">
              {formatCurrency(metrics.paidThisMonth)}
            </div>
            <p className="mt-1 text-xs text-slate-500">Successfully settled</p>
          </div>

          <div className="shadow-xs rounded-xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-[#111827]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Past Due Amount
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                <AlertCircle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 font-mono text-2xl font-semibold tracking-tight text-rose-600 dark:text-rose-400">
              {formatCurrency(metrics.pastDue)}
            </div>
            <p className="mt-1 text-xs text-slate-500">Requires follow-up</p>
          </div>

          <div className="shadow-xs rounded-xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-[#111827]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Average Days to Pay
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                <Receipt className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 font-mono text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              14.2 Days
            </div>
            <p className="mt-1 text-xs text-slate-500">B2B payment turnaround</p>
          </div>
        </div>
      </Reveal>

      {/* Main Table Card */}
      <Reveal>
        <div className="shadow-xs overflow-hidden rounded-xl border border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-[#111827]">
          {/* Controls Bar: Filter Pills + Search Input */}
          <div className="flex flex-col gap-3 border-b border-slate-200/80 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800/80">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(["All", "Paid", "Open", "Past Due", "Draft"] as FilterTab[]).map((tab) => {
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
                placeholder="Search invoices or clients..."
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
                {selectedRows.length} {selectedRows.length === 1 ? "invoice" : "invoices"} selected
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

          {/* Invoices Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/80 font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
                <tr>
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={
                        filteredInvoices.length > 0 &&
                        selectedRows.length === filteredInvoices.length
                      }
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900"
                    />
                  </th>
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Customer / Company</th>
                  <th className="px-4 py-3">Issue Date</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="w-12 px-4 py-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-12 text-center text-slate-400 dark:text-slate-500"
                    >
                      No invoices found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => {
                    const isSelected = selectedRows.includes(inv.id);
                    return (
                      <tr
                        key={inv.id}
                        onClick={() => handleRowClick(inv)}
                        className={`group cursor-pointer transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40 ${
                          isSelected ? "bg-slate-50/60 dark:bg-slate-800/30" : ""
                        }`}
                      >
                        <td className="px-4 py-3.5" onClick={(e) => handleSelectRow(inv.id, e)}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900"
                          />
                        </td>
                        <td className="px-4 py-3.5 font-mono font-medium text-slate-900 dark:text-white">
                          {inv.id}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {inv.customerCompany}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {inv.customer} • {inv.customerEmail}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-slate-500">{inv.issueDate}</td>
                        <td className="px-4 py-3.5 font-mono text-slate-500">{inv.dueDate}</td>
                        <td className="px-4 py-3.5 text-right font-mono font-semibold text-slate-900 dark:text-white">
                          {formatCurrency(inv.total)}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <InvoiceStatusBadge status={inv.status} />
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

      {/* Invoice Detail Sheet */}
      <InvoiceDetailSheet
        invoice={selectedInvoice}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onStatusChange={handleStatusChange}
      />

      {/* Create Invoice Dialog */}
      <CreateInvoiceDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateInvoice}
      />
    </div>
  );
}
