"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TIME_CONSTANTS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useState } from "react";

import type { BaseComponentProps } from "@/types";

interface ApiKeyCardProps extends BaseComponentProps {
  publishableKey: string;
  secretKey: string;
}

export default function ApiKeyCard({ publishableKey, secretKey, className }: ApiKeyCardProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = async (text: string, keyType: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(keyType);
      setTimeout(() => setCopiedKey(null), TIME_CONSTANTS.DEBOUNCE_DELAY * 6);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  const maskKey = (key: string): string => `${key.slice(0, 12)}...${key.slice(-4)}`;

  const handleKeyClick = (key: string, keyType: string) => {
    void copyToClipboard(key, keyType);
  };

  return (
    <Card
      className={cn(
        "border border-slate-200 bg-slate-50/60 shadow-none dark:border-slate-800 dark:bg-[#111827]",
        className
      )}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
          Standard API Keys
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Publishable key
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Client-side tokens & checkout elements
                </p>
              </div>
              <code
                className="relative flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs text-slate-800 transition-colors hover:border-emerald-500/50 hover:bg-emerald-50/30 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-500/40 dark:hover:bg-emerald-950/20"
                onClick={() => handleKeyClick(publishableKey, "publishable")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleKeyClick(publishableKey, "publishable");
                  }
                }}
                aria-label="Click to copy publishable key"
                title={copiedKey === "publishable" ? "Copied!" : "Click to copy"}
              >
                <span>{maskKey(publishableKey)}</span>
                {copiedKey === "publishable" ? (
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                    Copied!
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400">Click to copy</span>
                )}
              </code>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Secret key
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Server-side authorization for charges & payouts
                </p>
              </div>
              <code
                className="relative flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs text-slate-800 transition-colors hover:border-emerald-500/50 hover:bg-emerald-50/30 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-500/40 dark:hover:bg-emerald-950/20"
                onClick={() => handleKeyClick(secretKey, "secret")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleKeyClick(secretKey, "secret");
                  }
                }}
                aria-label="Click to copy secret key"
                title={copiedKey === "secret" ? "Copied!" : "Click to copy"}
              >
                <span>{maskKey(secretKey)}</span>
                {copiedKey === "secret" ? (
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                    Copied!
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400">Click to copy</span>
                )}
              </code>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { ApiKeyCard };
