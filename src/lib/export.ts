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
