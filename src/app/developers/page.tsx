"use client";

import {
  Check,
  Code2,
  Copy,
  ExternalLink,
  KeyRound,
  Plus,
  RefreshCw,
  Send,
  Shield,
  Trash2,
  Webhook,
} from "lucide-react";
import React, { useState } from "react";

import ApiKeyCard from "@/components/ApiKeyCard";
import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import {
  codeSnippets,
  defaultApiKeys,
  dummyDeliveryLogs,
  dummyRestrictedKeys,
  dummyWebhooks,
} from "@/lib/dummy-developers";
import { cn } from "@/lib/utils";
import type { RestrictedApiKey, WebhookDeliveryLog, WebhookEndpoint } from "@/types";

type DevTab = "keys" | "webhooks" | "sdks";
type SnippetLang = "curl" | "node" | "python" | "go";

export default function DevelopersPage() {
  const [activeTab, setActiveTab] = useState<DevTab>("keys");
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [activeLang, setActiveLang] = useState<SnippetLang>("curl");

  // State for Keys
  const [restrictedKeys, setRestrictedKeys] = useState<RestrictedApiKey[]>(dummyRestrictedKeys);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyPermission, setNewKeyPermission] = useState("charges:read");

  // State for Webhooks
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>(dummyWebhooks);
  const [logs, setLogs] = useState<WebhookDeliveryLog[]>(dummyDeliveryLogs);
  const [showNewWebhookModal, setShowNewWebhookModal] = useState(false);
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [newWebhookEvent, setNewWebhookEvent] = useState("payment.captured");

  // State for Event Simulator
  const [simulatingEvent, setSimulatingEvent] = useState(false);
  const [simulationSuccess, setSimulationSuccess] = useState(false);
  const [selectedSimEvent, setSelectedSimEvent] = useState("payment.captured");

  const currentKeys = isLiveMode ? defaultApiKeys.live : defaultApiKeys.test;

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(code);
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    }
  };

  const handleCreateRestrictedKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const newKey: RestrictedApiKey = {
      id: `rk_${Date.now()}`,
      name: newKeyName.trim(),
      keyPrefix: isLiveMode ? "rk_live_custom..." : "rk_test_custom...",
      permissions: [newKeyPermission],
      createdAt: "Just now",
      lastUsed: "Never",
    };

    setRestrictedKeys([newKey, ...restrictedKeys]);
    setNewKeyName("");
    setShowNewKeyModal(false);
  };

  const handleDeleteRestrictedKey = (id: string) => {
    setRestrictedKeys(restrictedKeys.filter((k) => k.id !== id));
  };

  const handleCreateWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebhookUrl.trim()) return;

    const newEndpoint: WebhookEndpoint = {
      id: `we_${Date.now()}`,
      url: newWebhookUrl.trim(),
      status: "active",
      events: [newWebhookEvent],
      secret: `whsec_${Math.random().toString(36).substring(2, 12)}`,
      lastDeliveryTime: "Just now",
      successRate: "100%",
    };

    setWebhooks([newEndpoint, ...webhooks]);
    setNewWebhookUrl("");
    setShowNewWebhookModal(false);
  };

  const handleSimulateWebhook = () => {
    setSimulatingEvent(true);
    setSimulationSuccess(false);

    setTimeout(() => {
      const newLog: WebhookDeliveryLog = {
        id: `evt_${Date.now().toString().slice(-7)}`,
        event: selectedSimEvent,
        status: 200,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        durationMs: Math.floor(Math.random() * 45) + 20,
        payload: JSON.stringify(
          {
            id: `evt_${Date.now().toString().slice(-7)}`,
            type: selectedSimEvent,
            simulated: true,
            timestamp: new Date().toISOString(),
          },
          null,
          2
        ),
      };

      setLogs([newLog, ...logs]);
      setSimulatingEvent(false);
      setSimulationSuccess(true);
      setTimeout(() => setSimulationSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
      {/* Header */}
      <Reveal>
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                Developer & API Keys
              </h1>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider",
                  isLiveMode
                    ? "border border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                    : "border border-amber-500/30 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                )}
              >
                {isLiveMode ? "Live Environment" : "Test Environment"}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
              Manage programmatic credentials, webhook listeners, and SDK code implementations
            </p>
          </div>

          {/* Environment Mode Switcher */}
          <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-slate-100 p-1 sm:self-auto dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setIsLiveMode(false)}
              className={cn(
                "cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                !isLiveMode
                  ? "shadow-xs bg-white font-semibold text-slate-900 dark:bg-slate-800 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              )}
            >
              Test Keys
            </button>
            <button
              type="button"
              onClick={() => setIsLiveMode(true)}
              className={cn(
                "cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                isLiveMode
                  ? "shadow-xs bg-emerald-600 font-semibold text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              )}
            >
              Live Keys
            </button>
          </div>
        </div>
      </Reveal>

      {/* Tabs */}
      <Reveal>
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-1 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab("keys")}
            className={cn(
              "flex cursor-pointer items-center gap-2 border-b-2 px-3.5 py-2 text-xs font-medium transition-colors",
              activeTab === "keys"
                ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
                : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            )}
          >
            <KeyRound className="h-4 w-4" />
            <span>API Credentials</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("webhooks")}
            className={cn(
              "flex cursor-pointer items-center gap-2 border-b-2 px-3.5 py-2 text-xs font-medium transition-colors",
              activeTab === "webhooks"
                ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
                : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            )}
          >
            <Webhook className="h-4 w-4" />
            <span>Webhooks & Events</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("sdks")}
            className={cn(
              "flex cursor-pointer items-center gap-2 border-b-2 px-3.5 py-2 text-xs font-medium transition-colors",
              activeTab === "sdks"
                ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
                : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            )}
          >
            <Code2 className="h-4 w-4" />
            <span>Quickstart & SDKs</span>
          </button>
        </div>
      </Reveal>

      {/* Tab 1: API Keys */}
      {activeTab === "keys" && (
        <div className="space-y-6">
          <Reveal>
            <ApiKeyCard
              publishableKey={currentKeys.publishableKey}
              secretKey={currentKeys.secretKey}
            />
          </Reveal>

          {/* Restricted Keys Section */}
          <Reveal>
            <div className="shadow-xs space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#111827]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Restricted Access Keys
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Granular least-privilege tokens for microservices and specialized worker
                    instances
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowNewKeyModal(true)}
                  className="cursor-pointer gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Create Restricted Key</span>
                </Button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50/75 text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-2.5 font-medium">Key Name</th>
                      <th className="px-4 py-2.5 font-medium">Prefix</th>
                      <th className="px-4 py-2.5 font-medium">Permissions</th>
                      <th className="px-4 py-2.5 font-medium">Created</th>
                      <th className="px-4 py-2.5 font-medium">Last Used</th>
                      <th className="px-4 py-2.5 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {restrictedKeys.map((rk) => (
                      <tr key={rk.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                          {rk.name}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">
                          {rk.keyPrefix}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {rk.permissions.map((perm) => (
                              <span
                                key={perm}
                                className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                              >
                                {perm}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                          {rk.createdAt}
                        </td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                          {rk.lastUsed}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteRestrictedKey(rk.id)}
                            className="cursor-pointer rounded p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                            title="Revoke Key"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>
        </div>
      )}

      {/* Tab 2: Webhooks & Events */}
      {activeTab === "webhooks" && (
        <div className="space-y-6">
          {/* Endpoints List */}
          <Reveal>
            <div className="shadow-xs space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#111827]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Webhook Endpoints
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    HTTP POST listeners receiving real-time event notifications
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowNewWebhookModal(true)}
                  className="cursor-pointer gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Endpoint</span>
                </Button>
              </div>

              <div className="space-y-3">
                {webhooks.map((wh) => (
                  <div
                    key={wh.id}
                    className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900/40"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "relative flex h-2 w-2 rounded-full",
                            wh.status === "active" ? "bg-emerald-500" : "bg-rose-500"
                          )}
                        />
                        <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                          {wh.url}
                        </span>
                        <span
                          className={cn(
                            "py-0.2 rounded px-1.5 text-[10px] font-medium",
                            wh.status === "active"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                              : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                          )}
                        >
                          {wh.status === "active" ? "Healthy" : "Failing"}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span>Signing secret:</span>
                        <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[10px] dark:bg-slate-800">
                          {wh.secret.slice(0, 12)}...
                        </code>
                        <span>•</span>
                        <span>Success rate: {wh.successRate}</span>
                        <span>•</span>
                        <span>Last delivery: {wh.lastDeliveryTime}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {wh.events.map((evt) => (
                          <span
                            key={evt}
                            className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                          >
                            {evt}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (typeof navigator !== "undefined") {
                            navigator.clipboard.writeText(wh.secret);
                          }
                        }}
                        className="cursor-pointer text-xs"
                      >
                        Copy Secret
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Event Dispatch Simulator */}
          <Reveal>
            <div className="shadow-xs space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#111827]">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Webhook Event Simulator
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Dispatch test events directly to your configured webhook endpoints
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedSimEvent}
                    onChange={(e) => setSelectedSimEvent(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-xs text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  >
                    <option value="payment.captured">payment.captured</option>
                    <option value="charge.disputed">charge.disputed</option>
                    <option value="refund.succeeded">refund.succeeded</option>
                    <option value="invoice.paid">invoice.paid</option>
                  </select>

                  <Button
                    size="sm"
                    disabled={simulatingEvent}
                    onClick={handleSimulateWebhook}
                    className="cursor-pointer gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
                  >
                    {simulatingEvent ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                    <span>{simulatingEvent ? "Dispatching..." : "Send Test Webhook"}</span>
                  </Button>
                </div>
              </div>

              {simulationSuccess && (
                <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 text-xs text-emerald-800 dark:border-emerald-800/40 dark:bg-emerald-950/20 dark:text-emerald-300">
                  <Check className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    Test webhook for <strong>{selectedSimEvent}</strong> successfully dispatched
                    with HTTP 200 response!
                  </span>
                </div>
              )}

              {/* Delivery Logs */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Recent Deliveries
                </h4>
                <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 font-mono text-xs dark:divide-slate-800 dark:border-slate-800">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-2.5 hover:bg-slate-50/50 dark:hover:bg-slate-900/30"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5 text-[10px] font-bold",
                            log.status === 200
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                          )}
                        >
                          {log.status}
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {log.event}
                        </span>
                        <span className="text-[11px] text-slate-400">{log.id}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span>{log.durationMs}ms</span>
                        <span>{log.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      )}

      {/* Tab 3: Quickstart & SDKs */}
      {activeTab === "sdks" && (
        <Reveal>
          <div className="shadow-xs space-y-6 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#111827]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Integration Quickstart
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Code samples for server-side charge creation and payment orchestration
                </p>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-900">
                {(["curl", "node", "python", "go"] as SnippetLang[]).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setActiveLang(lang)}
                    className={cn(
                      "cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                      activeLang === lang
                        ? "shadow-xs bg-white font-semibold text-slate-900 dark:bg-slate-800 dark:text-white"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    )}
                  >
                    {lang === "curl"
                      ? "cURL"
                      : lang === "node"
                        ? "Node.js"
                        : lang === "python"
                          ? "Python"
                          : "Go"}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Viewer Container */}
            <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-[#0B0F17] text-slate-200">
              <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-2 text-xs text-slate-400">
                <span className="font-mono">
                  {activeLang === "curl"
                    ? "Terminal / Bash"
                    : activeLang === "node"
                      ? "server.ts"
                      : activeLang === "python"
                        ? "main.py"
                        : "main.go"}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(codeSnippets[activeLang])}
                  className="flex cursor-pointer items-center gap-1.5 rounded p-1 text-slate-400 transition-colors hover:text-white"
                >
                  {copiedSnippet ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-[11px] text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span className="text-[11px]">Copy Snippet</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-slate-300">
                <code>{codeSnippets[activeLang]}</code>
              </pre>
            </div>

            {/* Documentation CTA Banner */}
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                    Official API Reference & SDKs
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Comprehensive documentation covering idempotency keys, webhooks signing, and
                    rate limits
                  </p>
                </div>
              </div>

              <a
                href="https://github.com/haerulr2/pay-track"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
              >
                <span>Read Docs</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </Reveal>
      )}

      {/* New Restricted Key Modal */}
      {showNewKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowNewKeyModal(false)}
          />
          <div className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-[#111827]">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Create Restricted API Key
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Generate a scoped credential with limited access rights
            </p>

            <form onSubmit={handleCreateRestrictedKey} className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Key Identifier Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Billing Service Worker"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Permission Scope
                </label>
                <select
                  value={newKeyPermission}
                  onChange={(e) => setNewKeyPermission(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                >
                  <option value="charges:read">charges:read (Read-only)</option>
                  <option value="charges:write">charges:write (Create & capture)</option>
                  <option value="invoices:read">invoices:read (Invoicing)</option>
                  <option value="refunds:write">refunds:write (Issue refunds)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewKeyModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Generate Key
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Webhook Modal */}
      {showNewWebhookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowNewWebhookModal(false)}
          />
          <div className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-[#111827]">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Add Webhook Endpoint
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Register a destination URL for PayTrack event webhooks
            </p>

            <form onSubmit={handleCreateWebhook} className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Endpoint URL
                </label>
                <input
                  type="url"
                  placeholder="https://api.yourdomain.com/webhooks"
                  value={newWebhookUrl}
                  onChange={(e) => setNewWebhookUrl(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Primary Subscribed Event
                </label>
                <select
                  value={newWebhookEvent}
                  onChange={(e) => setNewWebhookEvent(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                >
                  <option value="payment.captured">payment.captured</option>
                  <option value="charge.disputed">charge.disputed</option>
                  <option value="refund.succeeded">refund.succeeded</option>
                  <option value="invoice.paid">invoice.paid</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewWebhookModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Save Endpoint
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
