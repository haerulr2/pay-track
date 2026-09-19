"use client";

import { Bell, Building2, Check, CreditCard, Globe, Mail, Save, ShieldCheck } from "lucide-react";
import React, { useState } from "react";

import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SettingsTab = "general" | "payouts" | "security" | "notifications";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [isSaved, setIsSaved] = useState(false);

  // Form State
  const [businessName, setBusinessName] = useState("Acme Payments Inc.");
  const [supportEmail, setSupportEmail] = useState("billing@acmepayments.com");
  const [businessUrl, setBusinessUrl] = useState("https://acmepayments.com");
  const [currency, setCurrency] = useState("USD");
  const [timezone, setTimezone] = useState("America/New_York (EST)");

  // Payout State
  const [payoutSchedule, setPayoutSchedule] = useState("daily");
  const [minPayout, setMinPayout] = useState("250");
  const [instantPayout, setInstantPayout] = useState(true);

  // Notifications State
  const [notifyDisputes, setNotifyDisputes] = useState(true);
  const [notifyFailed, setNotifyFailed] = useState(true);
  const [notifyDailySummary, setNotifyDailySummary] = useState(false);

  // Security State
  const [sessionTimeout, setSessionTimeout] = useState("1h");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
      {/* Header */}
      <Reveal>
        <div className="flex flex-col gap-2 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Organization Settings
            </h1>
            <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
              Manage your merchant profile, payout banking rails, security, and alert preferences
            </p>
          </div>

          {/* Save Status / Button */}
          <div className="flex items-center gap-3">
            {isSaved && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <Check className="h-4 w-4" />
                Changes saved
              </span>
            )}
            <Button
              type="submit"
              form="settings-form"
              size="sm"
              className="cursor-pointer gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </Button>
          </div>
        </div>
      </Reveal>

      {/* Settings Navigation Tabs */}
      <Reveal>
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-1 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={cn(
              "flex cursor-pointer items-center gap-2 border-b-2 px-3.5 py-2 text-xs font-medium transition-colors",
              activeTab === "general"
                ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
                : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            )}
          >
            <Building2 className="h-4 w-4" />
            <span>General & Profile</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("payouts")}
            className={cn(
              "flex cursor-pointer items-center gap-2 border-b-2 px-3.5 py-2 text-xs font-medium transition-colors",
              activeTab === "payouts"
                ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
                : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            )}
          >
            <CreditCard className="h-4 w-4" />
            <span>Payouts & Banking</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={cn(
              "flex cursor-pointer items-center gap-2 border-b-2 px-3.5 py-2 text-xs font-medium transition-colors",
              activeTab === "security"
                ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
                : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            )}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Security & Auth</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("notifications")}
            className={cn(
              "flex cursor-pointer items-center gap-2 border-b-2 px-3.5 py-2 text-xs font-medium transition-colors",
              activeTab === "notifications"
                ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
                : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            )}
          >
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </button>
        </div>
      </Reveal>

      {/* Tab Panels */}
      <form id="settings-form" onSubmit={handleSave}>
        {/* Tab 1: General & Profile */}
        {activeTab === "general" && (
          <Reveal>
            <div className="shadow-xs space-y-6 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#111827]">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Merchant Identity
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Visible on customer receipts, invoices, and charge descriptors
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Business Display Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-900 outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Customer Support Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-900 outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Website URL
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="url"
                      value={businessUrl}
                      onChange={(e) => setBusinessUrl(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-900 outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Primary Operating Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-emerald-500"
                  >
                    <option value="USD">USD - United States Dollar ($)</option>
                    <option value="EUR">EUR - Euro (€)</option>
                    <option value="GBP">GBP - British Pound (£)</option>
                    <option value="SGD">SGD - Singapore Dollar (S$)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Settlement Reporting Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-emerald-500"
                >
                  <option value="America/New_York (EST)">America/New_York (EST, UTC-5)</option>
                  <option value="America/Los_Angeles (PST)">
                    America/Los_Angeles (PST, UTC-8)
                  </option>
                  <option value="Europe/London (GMT)">Europe/London (GMT, UTC+0)</option>
                  <option value="Asia/Singapore (SGT)">Asia/Singapore (SGT, UTC+8)</option>
                  <option value="Asia/Jakarta (WIB)">Asia/Jakarta (WIB, UTC+7)</option>
                </select>
              </div>
            </div>
          </Reveal>
        )}

        {/* Tab 2: Payouts & Banking */}
        {activeTab === "payouts" && (
          <Reveal>
            <div className="shadow-xs space-y-6 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#111827]">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Designated Settlement Account
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Direct deposit destination for captured transaction settlements
                </p>
              </div>

              {/* Linked Bank Card */}
              <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900/60">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-800">
                    <Building2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        JPMorgan Chase Bank, N.A.
                      </span>
                      <span className="rounded-md border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/40 dark:text-emerald-400">
                        Verified Primary
                      </span>
                    </div>
                    <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
                      Checking •••• 9012 (Routing 021000021)
                    </p>
                  </div>
                </div>

                <Button variant="outline" size="sm" type="button" className="text-xs">
                  Change Account
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Payout Cadence
                  </label>
                  <select
                    value={payoutSchedule}
                    onChange={(e) => setPayoutSchedule(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-emerald-500"
                  >
                    <option value="daily">Rolling Daily (T+2 business days)</option>
                    <option value="weekly">Weekly (Every Monday)</option>
                    <option value="monthly">Monthly (1st business day)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Minimum Auto-Payout Threshold (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400">$</span>
                    <input
                      type="number"
                      value={minPayout}
                      onChange={(e) => setMinPayout(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-7 pr-3 text-xs text-slate-900 outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Instant Payout Toggle */}
              <div className="flex items-center justify-between rounded-lg border border-slate-100 p-3.5 dark:border-slate-800/80">
                <div>
                  <h4 className="text-xs font-medium text-slate-900 dark:text-white">
                    Instant Payouts Acceleration (30-Minute ACH)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Transfer settled funds within 30 minutes for a 1.0% processing fee
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setInstantPayout(!instantPayout)}
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                    instantPayout ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                      instantPayout ? "translate-x-4" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            </div>
          </Reveal>
        )}

        {/* Tab 3: Security & Auth */}
        {activeTab === "security" && (
          <Reveal>
            <div className="shadow-xs space-y-6 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#111827]">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Authentication & Compliance
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Access security policies and session management
                </p>
              </div>

              {/* 2FA Status Banner */}
              <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-800/40 dark:bg-emerald-950/20">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                      Two-Factor Authentication (2FA) is Active
                    </h4>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                      Enforced via Authenticator App (TOTP) for all admin operations
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" type="button" className="text-xs">
                  Reconfigure
                </Button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Dashboard Inactivity Session Timeout
                </label>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-emerald-500"
                >
                  <option value="15m">15 minutes (Strict PCI-DSS)</option>
                  <option value="1h">1 hour (Recommended)</option>
                  <option value="8h">8 hours (Standard Workday)</option>
                  <option value="24h">24 hours</option>
                </select>
              </div>
            </div>
          </Reveal>
        )}

        {/* Tab 4: Notifications */}
        {activeTab === "notifications" && (
          <Reveal>
            <div className="shadow-xs space-y-6 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#111827]">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Notification Triggers
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Automated email alerts sent to {supportEmail}
                </p>
              </div>

              <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800/80">
                <div className="flex items-center justify-between pt-3">
                  <div>
                    <h4 className="text-xs font-medium text-slate-900 dark:text-white">
                      Dispute & Chargeback Alerts
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Receive immediate notification when a customer files a dispute with their bank
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifyDisputes(!notifyDisputes)}
                    className={cn(
                      "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                      notifyDisputes ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                        notifyDisputes ? "translate-x-4" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <h4 className="text-xs font-medium text-slate-900 dark:text-white">
                      High-Value Payment Failure Alerts
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Notify team whenever a charge over $1,000 is declined by card network
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifyFailed(!notifyFailed)}
                    className={cn(
                      "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                      notifyFailed ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                        notifyFailed ? "translate-x-4" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <h4 className="text-xs font-medium text-slate-900 dark:text-white">
                      Daily Settlement Summary Digest
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Consolidated report of daily gross volume and scheduled payout amount
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifyDailySummary(!notifyDailySummary)}
                    className={cn(
                      "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                      notifyDailySummary ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                        notifyDailySummary ? "translate-x-4" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        )}
      </form>
    </div>
  );
}
