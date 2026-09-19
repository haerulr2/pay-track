"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

export interface ToastMethods {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

export interface ToastContextType extends ToastMethods {
  dismiss: (id: string) => void;
  toast: ToastMethods;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const success = useCallback(
    (message: string) => {
      addToast("success", message);
    },
    [addToast]
  );

  const error = useCallback(
    (message: string) => {
      addToast("error", message);
    },
    [addToast]
  );

  const info = useCallback(
    (message: string) => {
      addToast("info", message);
    },
    [addToast]
  );

  const contextValue = useMemo<ToastContextType>(() => {
    const methods: ToastMethods = { success, error, info };
    return {
      ...methods,
      dismiss,
      toast: methods,
    };
  }, [success, error, info, dismiss]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-xl border p-3.5 shadow-lg transition-all",
              toast.type === "success" &&
                "border-emerald-200 bg-white text-emerald-900 dark:border-emerald-800/40 dark:bg-slate-900 dark:text-emerald-300",
              toast.type === "error" &&
                "border-rose-200 bg-white text-rose-900 dark:border-rose-800/40 dark:bg-slate-900 dark:text-rose-300",
              toast.type === "info" &&
                "border-blue-200 bg-white text-blue-900 dark:border-blue-800/40 dark:bg-slate-900 dark:text-blue-300"
            )}
          >
            {toast.type === "success" && (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            )}
            {toast.type === "error" && (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            )}
            {toast.type === "info" && (
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
            )}
            <div className="flex-1">
              <p className="text-xs font-medium leading-relaxed">{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="-mr-1 -mt-1 rounded-md p-1 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
