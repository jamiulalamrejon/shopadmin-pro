// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
"use client";
import { useState } from "react";
import { Eye, Printer } from "lucide-react";
import ResourceManager, { type Column, type Field } from "@/components/ResourceManager";
import Modal from "@/components/Modal";
import { Badge } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { money, shortDate } from "@/lib/format";
import { PAYMENT_METHODS, type Invoice } from "@/lib/demo-data";

const STATUS = ["Paid", "Unpaid", "Overdue", "Refunded"];
const columns: Column<Invoice>[] = [
  { key: "number", label: "Invoice", render: (i) => <span className="font-semibold text-ink">{i.number}</span> },
  { key: "customer", label: "Customer" },
  { key: "issued", label: "Issued", render: (i) => <span className="text-slate-400">{shortDate(i.issued)}</span> },
  { key: "due", label: "Due", render: (i) => shortDate(i.due) },
  { key: "method", label: "Method" },
  { key: "amount", label: "Total", align: "right", render: (i) => <span className="font-semibold">{money(i.amount + i.tax)}</span> },
  { key: "status", label: "Status", render: (i) => <Badge>{i.status}</Badge> },
];
const fields: Field[] = [
  { key: "number", label: "Invoice number", required: true },
  { key: "customer", label: "Customer", required: true },
  { key: "amount", label: "Amount before tax ($)", type: "number", required: true },
  { key: "tax", label: "Tax ($)", type: "number" },
  { key: "method", label: "Payment method", type: "select", options: PAYMENT_METHODS },
  { key: "due", label: "Due date", type: "date" },
  { key: "status", label: "Status", type: "select", options: STATUS },
];

export default function InvoicesClient({ rows, q }: { rows: Invoice[]; q?: string }) {
  const toast = useToast();
  const [view, setView] = useState<Invoice | null>(null);
  return (
    <>
      <ResourceManager entity="Invoice" rows={rows} columns={columns} fields={fields} canEdit initialQuery={q}
        searchKeys={["number", "customer"]} filter={{ key: "status", label: "Status", options: STATUS }}
        defaults={{ number: `INV-${5300 + Math.floor(Math.random() * 600)}`, status: "Unpaid", tax: 0, method: "Card", issued: new Date().toISOString() }}
        rowActions={(inv, update) => (
          <>
            {inv.status !== "Paid" && inv.status !== "Refunded" && (
              <button onClick={() => { update({ status: "Paid" }); toast(`${inv.number} marked as paid`); }} className="btn-ghost h-8 text-xs text-emerald-600">Mark paid</button>
            )}
            <button onClick={() => setView(inv)} className="btn-ghost size-8 p-0" aria-label="View invoice"><Eye size={15} /></button>
          </>
        )} />

      <Modal open={!!view} title={view?.number ?? ""} onClose={() => setView(null)} wide>
        {view && (
          <div className="print-area text-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xl font-bold text-ink">ShopAdmin Store</p>
                <p className="text-slate-400">350 Fifth Avenue, New York, NY</p>
              </div>
              <div className="sm:text-right">
                <p className="text-lg font-semibold">Invoice {view.number}</p>
                <Badge>{view.status}</Badge>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-page p-4 sm:grid-cols-3">
              <div><p className="text-xs text-slate-400">Billed to</p><p className="font-semibold text-ink">{view.customer}</p></div>
              <div><p className="text-xs text-slate-400">Issued</p><p className="font-semibold">{shortDate(view.issued)}</p></div>
              <div><p className="text-xs text-slate-400">Due</p><p className="font-semibold">{shortDate(view.due)}</p></div>
            </div>
            <table className="mt-6 w-full">
              <thead><tr className="border-b border-slate-100"><th className="table-th px-0">Description</th><th className="table-th px-0 text-right">Amount</th></tr></thead>
              <tbody>
                <tr><td className="py-3">Order items</td><td className="py-3 text-right">{money(view.amount)}</td></tr>
                <tr><td className="py-1 text-slate-400">Tax</td><td className="py-1 text-right text-slate-400">${view.tax.toFixed(2)}</td></tr>
                <tr className="border-t border-slate-100"><td className="pt-3 font-semibold">Total ({view.method})</td><td className="pt-3 text-right text-lg font-bold text-ink">${(view.amount + view.tax).toFixed(2)}</td></tr>
              </tbody>
            </table>
            <p className="mt-8 text-center text-xs text-slate-400">Thank you for your business.</p>
            <div className="no-print mt-6 flex justify-end [&>button]:w-full sm:[&>button]:w-auto">
              <button onClick={() => window.print()} className="btn-primary"><Printer size={16} /> Print or save PDF</button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
