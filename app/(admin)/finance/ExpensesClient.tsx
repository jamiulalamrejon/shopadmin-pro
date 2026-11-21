// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
"use client";
import ResourceManager, { type Column, type Field } from "@/components/ResourceManager";
import { Badge } from "@/components/ui";
import { money, shortDate } from "@/lib/format";
import type { Expense } from "@/lib/demo-data";

const CATEGORIES = ["Marketing", "Shipping", "Salaries", "Rent", "Software", "Operations", "Utilities", "Inventory", "Other"];
const columns: Column<Expense>[] = [
  { key: "date", label: "Date", render: (e) => <span className="text-slate-400">{shortDate(e.date)}</span> },
  { key: "title", label: "Expense", render: (e) => <span className="font-semibold text-ink">{e.title}</span> },
  { key: "category", label: "Category", render: (e) => <Badge tone="blue">{e.category}</Badge> },
  { key: "vendor", label: "Vendor" },
  { key: "amount", label: "Amount", align: "right", render: (e) => <span className="font-semibold">{money(e.amount)}</span> },
  { key: "status", label: "Status", render: (e) => <Badge>{e.status}</Badge> },
];
const fields: Field[] = [
  { key: "title", label: "Description", required: true, full: true },
  { key: "category", label: "Category", type: "select", options: CATEGORIES },
  { key: "vendor", label: "Vendor" },
  { key: "amount", label: "Amount ($)", type: "number", required: true },
  { key: "date", label: "Date", type: "date" },
  { key: "status", label: "Status", type: "select", options: ["Paid", "Pending"] },
];

export default function ExpensesClient({ rows }: { rows: Expense[] }) {
  return (
    <ResourceManager entity="Expense" rows={rows} columns={columns} fields={fields} canEdit
      searchKeys={["title", "vendor", "category"]} filter={{ key: "category", label: "Category", options: CATEGORIES }}
      defaults={{ status: "Paid", category: "Marketing", date: new Date().toISOString() }} />
  );
}
