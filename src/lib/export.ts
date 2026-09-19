import type { Customer } from "@/lib/dummy-customers";
import type { Invoice } from "@/lib/dummy-invoices";
import type { AnalyticsSnapshot, Transaction } from "@/types";

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

/**
 * Exports analytics summary and trends to a CSV report.
 */
export function exportAnalyticsToCSV(
  snapshot: AnalyticsSnapshot,
  filename: string = `analytics-report-${snapshot.timeframe.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`
): void {
  if (typeof window === "undefined") return;

  const lines: string[] = [
    `"PAY-TRACK ANALYTICS REPORT"`,
    `"Timeframe: ${snapshot.timeframe}"`,
    `"Generated At: ${new Date().toISOString()}"`,
    `""`,
    `"=== EXECUTIVE KPI SUMMARY ==="`,
    `"Metric","Value","Change vs Prior Period"`,
    `"Gross Processing Volume","$${snapshot.kpis.grossVolume.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}","+${snapshot.kpis.grossVolumeChange}%"`,
    `"Net Settlement Volume","$${snapshot.kpis.netSettlement.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}","+${snapshot.kpis.netSettlementChange}%"`,
    `"Authorization Success Rate","${snapshot.kpis.authorizationRate}%","+${snapshot.kpis.authorizationRateChange}%"`,
    `"Dispute & Refund Ratio","${snapshot.kpis.disputeRate}%","${snapshot.kpis.disputeRateChange}%"`,
    `""`,
    `"=== VOLUME & CASH FLOW TREND ==="`,
    `"Date","Label","Gross Volume","Net Settlement","Processing Fees","Transaction Count"`,
    ...snapshot.volumeTrend.map(
      (v) =>
        `${escapeCSV(v.date)},${escapeCSV(v.label)},${v.gross.toFixed(2)},${v.net.toFixed(2)},${v.fees.toFixed(2)},${v.count}`
    ),
    `""`,
    `"=== PAYMENT METHOD DISTRIBUTION ==="`,
    `"Payment Method","Category","Volume (USD)","Percentage Share","Transaction Count"`,
    ...snapshot.methodDistribution.map(
      (m) =>
        `${escapeCSV(m.name)},${escapeCSV(m.methodType)},${m.volume.toFixed(2)},${m.percentage.toFixed(1)}%,${m.count}`
    ),
    `""`,
    `"=== PAYMENT DECLINE BREAKDOWN ==="`,
    `"Decline Reason","Category","Failures Count","Percentage of Total Declines","Recommended Mitigation"`,
    ...snapshot.declineReasons.map(
      (d) =>
        `${escapeCSV(d.reason)},${escapeCSV(d.category)},${d.count},${d.percentage.toFixed(1)}%,${escapeCSV(d.suggestedAction)}`
    ),
  ];

  const csvContent = "\uFEFF" + lines.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");

  downloadLink.setAttribute("href", url);
  downloadLink.setAttribute("download", filename);
  downloadLink.style.visibility = "hidden";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}
