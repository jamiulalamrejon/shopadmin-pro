// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
"use client";
import ResourceManager, { type Column, type Field } from "@/components/ResourceManager";
import { Badge } from "@/components/ui";
import { money, shortDate } from "@/lib/format";
import { CITIES, PAYMENT_METHODS, type Order } from "@/lib/demo-data";

const STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"];
const columns: Column<Order>[] = [
  { key: "number", label: "Order", render: (o) => <span className="font-medium">{o.number}</span> },
  { key: "customer", label: "Customer", render: (o) => <>{o.customer}<span className="block text-xs text-slate-400">{o.phone}</span></> },
  { key: "city", label: "City" },
  { key: "items", label: "Items", align: "right" },
  { key: "total", label: "Total", align: "right", render: (o) => <span className="font-medium">{money(o.total)}</span> },
  { key: "payment", label: "Payment" },
  { key: "date", label: "Date", render: (o) => <span className="text-slate-500">{shortDate(o.date)}</span> },
  { key: "status", label: "Status", render: (o) => <Badge>{o.status}</Badge> },
];
const fields: Field[] = [
  { key: "number", label: "Order number", required: true },
  { key: "customer", label: "Customer name", required: true },
  { key: "phone", label: "Phone", type: "tel", required: true },
  { key: "city", label: "City", type: "select", options: CITIES },
  { key: "items", label: "Items", type: "number" },
  { key: "total", label: "Total ($)", type: "number", required: true },
  { key: "payment", label: "Payment", type: "select", options: PAYMENT_METHODS },
  { key: "status", label: "Status", type: "select", options: STATUSES },
];

export default function OrdersClient({ rows, canEdit, q }: { rows: Order[]; canEdit: boolean; q?: string }) {
  return (
    <ResourceManager entity="Order" rows={rows} columns={columns} fields={fields} canEdit={canEdit} initialQuery={q}
      searchKeys={["number", "customer", "phone", "city"]} filter={{ key: "status", label: "Status", options: STATUSES }}
      defaults={{ number: `#${1100 + Math.floor(Math.random() * 900)}`, items: 1, status: "Pending", payment: "Card", date: new Date().toISOString() }} />
  );
}
