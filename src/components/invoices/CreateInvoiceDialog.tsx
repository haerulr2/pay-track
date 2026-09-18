"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Plus, Trash2, X, Receipt } from "lucide-react";
import { Invoice, InvoiceLineItem } from "@/lib/dummy-invoices";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useScrollLock } from "@/hooks/useScrollLock";

export interface CreateInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (invoice: Invoice) => void;
}

const emptySubscribe = () => () => {};

let nextInvoiceNumber = 109;

export function CreateInvoiceDialog({ isOpen, onClose, onCreate }: CreateInvoiceDialogProps) {
  const [customer, setCustomer] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerCompany, setCustomerCompany] = useState("");
  const [dueDate, setDueDate] = useState("2026-06-15");
  const [memo, setMemo] = useState("");
  const [items, setItems] = useState<
    Array<{ id: string; description: string; quantity: number; unitPrice: number }>
  >([{ id: "item-1", description: "Software Engineering Retainer", quantity: 1, unitPrice: 5000 }]);

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

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        description: "",
        quantity: 1,
        unitPrice: 0,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleItemChange = (
    id: string,
    field: "description" | "quantity" | "unitPrice",
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0
  );
  const tax = Number((subtotal * 0.09).toFixed(2));
  const total = subtotal + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || !customerEmail || !customerCompany) return;

    const formattedItems: InvoiceLineItem[] = items.map((i) => ({
      id: i.id,
      description: i.description || "Service Item",
      quantity: Number(i.quantity) || 1,
      unitPrice: Number(i.unitPrice) || 0,
      amount: (Number(i.quantity) || 1) * (Number(i.unitPrice) || 0),
    }));

    const newInvoice: Invoice = {
      id: `INV-2026-${String(nextInvoiceNumber++).padStart(3, "0")}`,
      customer,
      customerEmail,
      customerCompany,
      status: "Open",
      issueDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      dueDate: new Date(dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      subtotal,
      tax,
      total,
      currency: "USD",
      memo: memo.trim() || undefined,
      items: formattedItems,
    };

    onCreate(newInvoice);
    onClose();
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
      <div className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-[#111827]">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Receipt className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Create New Invoice
              </h3>
              <p className="text-xs text-slate-500">
                Generate an itemized B2B bill with automatic tax calculation
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto p-6 text-xs">
          {/* Client Details */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300">
                Company Name
              </label>
              <input
                type="text"
                required
                value={customerCompany}
                onChange={(e) => setCustomerCompany(e.target.value)}
                placeholder="e.g. Acme Corporation"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900/60 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300">
                Contact Person
              </label>
              <input
                type="text"
                required
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="e.g. John Doe"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900/60 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300">
                Billing Email
              </label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="billing@acme.com"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900/60 dark:text-white"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300">
                Due Date
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900/60 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300">
                Memo / Notes
              </label>
              <input
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="Payment terms, PO number, or notes"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900/60 dark:text-white"
              />
            </div>
          </div>

          {/* Line Items Section */}
          <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Line Items
              </span>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Item
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Description of service or product"
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900/60 dark:text-white"
                  />
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(item.id, "quantity", parseInt(e.target.value) || 1)
                    }
                    className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-2 text-right font-mono text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900/60 dark:text-white"
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="Unit Price"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(item.id, "unitPrice", parseFloat(e.target.value) || 0)
                    }
                    className="w-24 rounded-lg border border-slate-200 bg-white px-2 py-2 text-right font-mono text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900/60 dark:text-white"
                  />
                  <span className="w-24 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">
                    {formatCurrency((item.quantity || 0) * (item.unitPrice || 0))}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={items.length === 1}
                    className="p-1.5 text-slate-400 hover:text-rose-500 disabled:opacity-30"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Subtotal & Total calculations */}
          <div className="mt-6 space-y-1.5 rounded-lg bg-slate-50/80 p-3.5 text-xs dark:bg-slate-900/40">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-mono">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Estimated Tax (9%)</span>
              <span className="font-mono">{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200/80 pt-1.5 font-semibold text-slate-900 dark:border-slate-800 dark:text-white">
              <span>Total Due</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-slate-200 pt-4 dark:border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              Issue Invoice
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default CreateInvoiceDialog;
