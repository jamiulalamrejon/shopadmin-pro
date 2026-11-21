// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
"use client";
import ResourceManager, { type Column, type Field } from "@/components/ResourceManager";
import { Badge } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { money, shortDate } from "@/lib/format";
import type { PurchaseOrder, Supplier } from "@/lib/demo-data";

const PO_STATUS = ["Draft", "Ordered", "Received", "Cancelled"];
const poColumns: Column<PurchaseOrder>[] = [
  { key: "number", label: "PO", render: (p) => <span className="font-semibold text-ink">{p.number}</span> },
  { key: "supplier", label: "Supplier" },
  { key: "items", label: "Items", align: "right" },
  { key: "total", label: "Total", align: "right", render: (p) => <span className="font-semibold">{money(p.total)}</span> },
  { key: "created", label: "Created", render: (p) => <span className="text-slate-400">{shortDate(p.created)}</span> },
  { key: "expected", label: "Expected", render: (p) => shortDate(p.expected) },
  { key: "status", label: "Status", render: (p) => <Badge>{p.status}</Badge> },
];

export function PurchaseOrdersTable({ rows, suppliers }: { rows: PurchaseOrder[]; suppliers: string[] }) {
  const toast = useToast();
  const fields: Field[] = [
    { key: "number", label: "PO number", required: true },
    { key: "supplier", label: "Supplier", type: "select", options: suppliers },
    { key: "items", label: "Line items", type: "number" },
    { key: "total", label: "Total ($)", type: "number", required: true },
    { key: "expected", label: "Expected delivery", type: "date" },
    { key: "status", label: "Status", type: "select", options: PO_STATUS },
  ];
  return (
    <ResourceManager entity="Purchase order" rows={rows} columns={poColumns} fields={fields} canEdit
      searchKeys={["number", "supplier"]} filter={{ key: "status", label: "Status", options: PO_STATUS }}
      defaults={{ number: `PO-${2100 + Math.floor(Math.random() * 800)}`, status: "Draft", items: 1, created: new Date().toISOString() }}
      rowActions={(p, update) => p.status === "Ordered" && (
        <button onClick={() => { update({ status: "Received" }); toast(`${p.number} received - stock updated`); }} className="btn-ghost h-8 text-xs text-emerald-600">Receive</button>
      )} />
  );
}

const supColumns: Column<Supplier>[] = [
  { key: "name", label: "Supplier", render: (s) => <span className="font-semibold text-ink">{s.name}<span className="block text-xs font-normal text-slate-400">{s.email}</span></span> },
  { key: "contact", label: "Contact" },
  { key: "country", label: "Country" },
  { key: "leadTime", label: "Lead time", align: "right", render: (s) => `${s.leadTime} days` },
  { key: "rating", label: "Rating", align: "right", render: (s) => <span className="font-semibold text-amber-500">★ {s.rating}</span> },
  { key: "balance", label: "Balance due", align: "right", render: (s) => money(s.balance) },
  { key: "status", label: "Status", render: (s) => <Badge>{s.status}</Badge> },
];
const supFields: Field[] = [
  { key: "name", label: "Company name", required: true, full: true },
  { key: "contact", label: "Contact person" },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "phone", label: "Phone", type: "tel" },
  { key: "country", label: "Country" },
  { key: "leadTime", label: "Lead time (days)", type: "number" },
  { key: "status", label: "Status", type: "select", options: ["Active", "On hold"] },
];

export function SuppliersTable({ rows }: { rows: Supplier[] }) {
  return (
    <ResourceManager entity="Supplier" rows={rows} columns={supColumns} fields={supFields} canEdit
      searchKeys={["name", "contact", "country", "email"]} defaults={{ status: "Active", rating: 0, balance: 0, leadTime: 7 }} />
  );
}
