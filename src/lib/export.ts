import type { Customer } from "@/lib/dummy-customers";
import type { Invoice } from "@/lib/dummy-invoices";
import type { Transaction } from "@/types";

/**
 * Escapes a cell value for standard CSV formatting (RFC 4180).
 */
function escapeCSV(val: string | number | undefined | null): string {
  if (val === null || val === undefined) return '""';
  const stringVal = String(val);
  return `"${stringVal.replace(/"/g, '""')}"`;
}

/**
 * Exports a list of transactions to a CSV file and triggers a browser download.
 */
export function exportTransactionsToCSV(
  transactions: Transaction[],
  filename: string = `transactions-${new Date().toISOString().slice(0, 10)}.csv`
): void {
  if (typeof window === "undefined") return;

  const headers = [
    "Transaction ID",
    "Date",
    "Customer",
    "Customer Email",
    "Description",
    "Gross Amount",
    "Fee",
    "Net Amount",
    "Currency",
    "Status",
    "Payment Method",
    "Method Type",
  ];

  const rows = transactions.map((t) => [
    escapeCSV(t.id),
    escapeCSV(t.date),
    escapeCSV(t.customer),
    escapeCSV(t.customerEmail),
    escapeCSV(t.description),
    t.grossAmount.toFixed(2),
    t.fee.toFixed(2),
    t.netAmount.toFixed(2),
    escapeCSV(t.currency),
    escapeCSV(t.status),
    escapeCSV(t.paymentMethod),
    escapeCSV(t.methodType),
  ]);

  // UTF-8 BOM (\uFEFF) ensures Excel and Numbers render special characters and formatting correctly
  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports invoices to a formatted CSV file.
 */
export function exportInvoicesToCSV(
  invoices: Invoice[],
  filename: string = `invoices-${new Date().toISOString().slice(0, 10)}.csv`
): void {
  if (typeof window === "undefined") return;

  const headers = [
    "Invoice ID",
    "Customer",
    "Company",
    "Email",
    "Status",
    "Issue Date",
    "Due Date",
    "Paid Date",
    "Subtotal",
    "Tax",
    "Total",
    "Currency",
    "Memo",
  ];

  const rows = invoices.map((inv) => [
    escapeCSV(inv.id),
    escapeCSV(inv.customer),
    escapeCSV(inv.customerCompany),
    escapeCSV(inv.customerEmail),
    escapeCSV(inv.status),
    escapeCSV(inv.issueDate),
    escapeCSV(inv.dueDate),
    escapeCSV(inv.paidDate || "N/A"),
    inv.subtotal.toFixed(2),
    inv.tax.toFixed(2),
    inv.total.toFixed(2),
    escapeCSV(inv.currency),
    escapeCSV(inv.memo || ""),
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports customers to a formatted CSV file.
 */
export function exportCustomersToCSV(
  customers: Customer[],
  filename: string = `customers-${new Date().toISOString().slice(0, 10)}.csv`
): void {
  if (typeof window === "undefined") return;

  const headers = [
    "Customer ID",
    "Name",
    "Company",
    "Email",
    "Phone",
    "Status",
    "Lifetime Value",
    "Total Orders",
    "Country",
    "Currency",
    "Default Payment Method",
    "Joined Date",
    "Last Activity",
  ];

  const rows = customers.map((c) => [
    escapeCSV(c.id),
    escapeCSV(c.name),
    escapeCSV(c.company),
    escapeCSV(c.email),
    escapeCSV(c.phone),
    escapeCSV(c.status),
    c.lifetimeValue.toFixed(2),
    c.totalOrders,
    escapeCSV(c.country),
    escapeCSV(c.currency),
    escapeCSV(c.defaultPaymentMethod),
    escapeCSV(c.joinedDate),
    escapeCSV(c.lastActivity),
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
