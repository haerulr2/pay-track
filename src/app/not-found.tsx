import Link from "next/link";
import React from "react";

import { ArrowLeft, FileQuestion, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Custom 404 Not Found page for PayTrack.
 *
 * Provides a fintech-grade empty state with navigation actions
 * when a requested route, customer resource, or API endpoint is not found.
 */
export default function NotFound() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8 dark:bg-[#0B0F17]">
      {/* Subtle background ambient glows for fintech aesthetic */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/5"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-slate-200/50 blur-3xl dark:bg-slate-800/20"
        aria-hidden="true"
      />

      {/* Centered card container */}
      <div className="shadow-xs backdrop-blur-xs mx-auto flex w-full max-w-lg flex-col items-center rounded-2xl border border-slate-200/80 bg-white/90 p-8 text-center sm:p-10 dark:border-slate-800/80 dark:bg-[#111827]/80 dark:shadow-2xl">
        {/* Emerald-themed Icon Container */}
        <div className="shadow-xs mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400">
          <FileQuestion className="h-8 w-8" aria-hidden="true" />
        </div>

        {/* Badge in red/rose pill styling */}
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" aria-hidden="true" />
          <span>HTTP_404_PAGE_NOT_FOUND</span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          Resource or Endpoint Not Found
        </h1>

        {/* Description */}
        <p className="mt-3 max-w-md text-sm text-slate-600 sm:text-base dark:text-slate-400">
          The ledger page, customer resource, or API view you requested does not exist or has been
          relocated.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          {/* Primary CTA */}
          <Button
            asChild
            size="lg"
            className="shadow-xs cursor-pointer gap-2 bg-emerald-600 text-sm font-medium text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            <Link href="/dashboard">
              <Home className="h-4 w-4" aria-hidden="true" />
              <span>Return to Dashboard</span>
            </Link>
          </Button>

          {/* Secondary CTA */}
          <Button
            asChild
            variant="outline"
            size="lg"
            className="cursor-pointer gap-2 border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <Link href="/transactions">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Transactions Ledger</span>
            </Link>
          </Button>
        </div>

        {/* Hint footer */}
        <div className="mt-8 w-full border-t border-slate-100 pt-6 dark:border-slate-800/80">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tip: Press{" "}
            <kbd className="shadow-xs inline-flex items-center justify-center rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              ⌘K
            </kbd>{" "}
            anywhere to open global command palette.
          </p>
        </div>
      </div>
    </main>
  );
}
