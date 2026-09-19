"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { CreditCard, Building2, Wallet, X, ArrowUpRight } from "lucide-react";
import { PaymentMethodType, Transaction, TransactionStatus } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useScrollLock } from "@/hooks/useScrollLock";

export interface CreateChargeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (transaction: Transaction) => void;
}

const emptySubscribe = () => () => {};

interface PaymentMethodOption {
  label: string;
  methodType: PaymentMethodType;
  paymentIcon: string;
}

const paymentMethodOptions: PaymentMethodOption[] = [
  { label: "Visa •••• 4242", methodType: "card", paymentIcon: "CreditCard" },
  { label: "Mastercard •••• 8821", methodType: "card", paymentIcon: "CreditCard" },
  { label: "ACH Transfer (Chase Bank)", methodType: "ach", paymentIcon: "Building2" },
  { label: "Wire Transfer (SVB)", methodType: "wire", paymentIcon: "Building2" },
  { label: "Apple Pay (Wallet)", methodType: "wallet", paymentIcon: "Wallet" },
];

export function CreateChargeDialog({ isOpen, onClose, onCreate }: CreateChargeDialogProps) {
  const toast = useToast();
  const [customer, setCustomer] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [amount, setAmount] = useState<string>("1250.00");
  const [currency] = useState("USD");
  const [selectedMethodIdx, setSelectedMethodIdx] = useState(0);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TransactionStatus>("Succeeded");

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  useScrollLock(isOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const numericAmount = Math.max(0, parseFloat(amount) || 0);
  const selectedMethod = paymentMethodOptions[selectedMethodIdx];

  // Calculate fee based on payment method
  const fee =
    selectedMethod.methodType === "card"
      ? Number((numericAmount * 0.029 + 0.3).toFixed(2))
      : selectedMethod.methodType === "wallet"
        ? Number((numericAmount * 0.025 + 0.25).toFixed(2))
        : Number(Math.min(5.0, numericAmount * 0.008).toFixed(2));

  const netAmount = Number(Math.max(0, numericAmount - fee).toFixed(2));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.trim() || !customerEmail.trim() || numericAmount <= 0) return;

    const now = new Date();
    const formattedDate =
      now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) +
      ", " +
      now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const txId = `txn_2026_${randomSuffix}`;

    const newTransaction: Transaction = {
      id: txId,
      amount: `$${numericAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      grossAmount: numericAmount,
      fee,
      netAmount,
      currency,
      paymentMethod: selectedMethod.label,
      paymentIcon: selectedMethod.paymentIcon,
      methodType: selectedMethod.methodType,
      description: description.trim() || `Charge for ${customer}`,
      customer: customer.trim(),
      customerEmail: customerEmail.trim(),
      date: formattedDate,
      status,
      timeline: [
        {
          step: "Created",
          timestamp: formattedDate,
          done: true,
        },
        {
          step: "Authorized",
          timestamp: formattedDate,
          done: status !== "Failed",
        },
        {
          step: "Captured",
          timestamp: status === "Succeeded" ? formattedDate : "Awaiting capture",
          done: status === "Succeeded",
        },
        {
          step: "Settled / Paid Out",
          timestamp: status === "Succeeded" ? formattedDate : "Pending batch settlement",
          done: status === "Succeeded",
        },
      ],
    };

    onCreate(newTransaction);
    toast.success(`Charge of $${amount} successfully created`);
    onClose();

    // Reset form
    setCustomer("");
    setCustomerEmail("");
    setDescription("");
    setAmount("1250.00");
    setStatus("Succeeded");
  };

  return createPortal(
    <div className="z-100 fixed inset-0 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Window */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-[#111827]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Create New Charge
              </h3>
              <p className="text-xs text-slate-500">
                Authorize and process a new payment directly to the ledger
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* Customer info */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Customer Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Acme Corporation"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Customer Email *
              </label>
              <input
                type="email"
                required
                placeholder="billing@acme.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Amount & Currency */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Charge Amount (USD) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-semibold text-slate-400">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0.50"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 pl-7 pr-3 font-mono text-xs focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TransactionStatus)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              >
                <option value="Succeeded">Succeeded</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Payment Method
            </label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {paymentMethodOptions.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedMethodIdx(idx)}
                  className={`flex items-center gap-2 rounded-lg border p-2.5 text-left text-xs transition-colors ${
                    selectedMethodIdx === idx
                      ? "border-emerald-500 bg-emerald-50/50 text-emerald-900 dark:border-emerald-500/80 dark:bg-emerald-950/30 dark:text-emerald-300"
                      : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                  }`}
                >
                  {opt.methodType === "card" && (
                    <CreditCard className="h-4 w-4 shrink-0 text-slate-400" />
                  )}
                  {opt.methodType === "wire" && (
                    <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
                  )}
                  {opt.methodType === "ach" && (
                    <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
                  )}
                  {opt.methodType === "wallet" && (
                    <Wallet className="h-4 w-4 shrink-0 text-slate-400" />
                  )}
                  <span className="truncate font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description / Memo */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Description / Memo
            </label>
            <input
              type="text"
              placeholder="e.g. Monthly API Subscription Tier 2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>

          {/* Financial Breakdown Preview */}
          <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-3 text-xs dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex justify-between py-0.5 text-slate-600 dark:text-slate-400">
              <span>Gross Inflow</span>
              <span className="font-mono font-medium text-slate-900 dark:text-white">
                {formatCurrency(numericAmount)}
              </span>
            </div>
            <div className="flex justify-between py-0.5 text-slate-600 dark:text-slate-400">
              <span>Estimated Processing Fee</span>
              <span className="font-mono text-rose-600 dark:text-rose-400">
                -{formatCurrency(fee)}
              </span>
            </div>
            <div className="mt-1 flex justify-between border-t border-slate-200 pt-1.5 font-semibold text-slate-900 dark:border-slate-800 dark:text-white">
              <span>Net Settlement</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">
                {formatCurrency(netAmount)}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="h-9 text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-9 bg-emerald-600 text-xs font-medium text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              Authorize & Capture Charge
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default CreateChargeDialog;
