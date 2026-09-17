import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { CustomerStatus } from "@/lib/dummy-customers";
import { cn } from "@/lib/utils";

export interface CustomerStatusBadgeProps {
  status: CustomerStatus;
  className?: string;
}

export function CustomerStatusBadge({ status, className }: CustomerStatusBadgeProps) {
  switch (status) {
    case "Active":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-400",
            className
          )}
        >
          <CheckCircle2 className="h-3 w-3 shrink-0" />
          <span>Active</span>
        </span>
      );
    case "Churn Risk":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-400",
            className
          )}
        >
          <AlertTriangle className="h-3 w-3 shrink-0" />
          <span>Churn Risk</span>
        </span>
      );
    case "Inactive":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
            className
          )}
        >
          <span>Inactive</span>
        </span>
      );
  }
}

export default CustomerStatusBadge;
