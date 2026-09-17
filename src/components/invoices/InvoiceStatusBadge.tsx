import { AlertCircle, CheckCircle2, Clock, FileText } from "lucide-react";
import { InvoiceStatus } from "@/lib/dummy-invoices";
import { cn } from "@/lib/utils";

export interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

export function InvoiceStatusBadge({ status, className }: InvoiceStatusBadgeProps) {
  switch (status) {
    case "Paid":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-400",
            className
          )}
        >
          <CheckCircle2 className="h-3 w-3 shrink-0" />
          <span>Paid</span>
        </span>
      );
    case "Open":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:border-blue-500/30 dark:bg-blue-950/40 dark:text-blue-400",
            className
          )}
        >
          <Clock className="h-3 w-3 shrink-0" />
          <span>Open</span>
        </span>
      );
    case "Past Due":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:border-rose-500/30 dark:bg-rose-950/40 dark:text-rose-400",
            className
          )}
        >
          <AlertCircle className="h-3 w-3 shrink-0" />
          <span>Past Due</span>
        </span>
      );
    case "Draft":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
            className
          )}
        >
          <FileText className="h-3 w-3 shrink-0" />
          <span>Draft</span>
        </span>
      );
  }
}

export default InvoiceStatusBadge;
