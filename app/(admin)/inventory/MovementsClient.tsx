// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
"use client";
import ResourceManager, { type Column, type Field } from "@/components/ResourceManager";
import { Badge } from "@/components/ui";
import { dateTime } from "@/lib/format";
import type { StockMovement } from "@/lib/demo-data";

const TYPES = ["Stock in", "Stock out", "Transfer", "Adjustment"];
const columns: Column<StockMovement>[] = [
  { key: "date", label: "Date", render: (m) => <span className="text-slate-400">{dateTime(m.date)}</span> },
  { key: "product", label: "Product", render: (m) => <span className="font-semibold text-ink">{m.product}<span className="block text-xs font-normal text-slate-400">{m.sku}</span></span> },
  { key: "type", label: "Type", render: (m) => <Badge>{m.type}</Badge> },
  { key: "qty", label: "Qty", align: "right", render: (m) => <span className={`font-semibold ${m.type === "Stock in" ? "text-emerald-600" : m.type === "Stock out" || m.qty < 0 ? "text-red-500" : ""}`}>{m.type === "Stock in" ? "+" : m.type === "Stock out" || m.qty < 0 ? "-" : ""}{Math.abs(m.qty)}</span> },
  { key: "warehouse", label: "Warehouse" },
  { key: "ref", label: "Reference", render: (m) => <span className="font-mono text-xs">{m.ref}</span> },
];

export default function MovementsClient({ rows, products, warehouses }: { rows: StockMovement[]; products: string[]; warehouses: string[] }) {
  const fields: Field[] = [
    { key: "product", label: "Product", type: "select", options: products, full: true },
    { key: "type", label: "Movement type", type: "select", options: TYPES },
    { key: "qty", label: "Quantity", type: "number", required: true },
    { key: "warehouse", label: "Warehouse", type: "select", options: warehouses },
    { key: "ref", label: "Reference (PO, order, note)" },
  ];
  return (
    <ResourceManager entity="Movement" rows={rows} columns={columns} fields={fields} canEdit
      searchKeys={["product", "sku", "ref", "warehouse"]} filter={{ key: "type", label: "Type", options: TYPES }}
      defaults={{ type: "Stock in", sku: "-", date: new Date().toISOString() }} />
  );
}
