// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
"use client";
import ResourceManager, { type Column, type Field } from "@/components/ResourceManager";
import { Badge } from "@/components/ui";
import { money } from "@/lib/format";
import type { Product } from "@/lib/demo-data";

const CATEGORIES = ["Electronics", "Beauty", "Fashion", "Home & Kitchen", "Grocery"];
const columns: Column<Product>[] = [
  { key: "name", label: "Product", render: (p) => (
    <div className="flex items-center gap-3">
      <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-xs font-bold text-brand-600">{p.name.slice(0, 2).toUpperCase()}</span>
      <span>{p.name}<span className="block text-xs text-slate-400">{p.sku}</span></span>
    </div>
  ) },
  { key: "category", label: "Category" },
  { key: "price", label: "Price", align: "right", render: (p) => money(p.price) },
  { key: "cost", label: "Margin", align: "right", render: (p) => <span className="font-semibold text-emerald-600">{p.price ? Math.round(((p.price - p.cost) / p.price) * 100) : 0}%</span> },
  { key: "stock", label: "Stock", align: "right", render: (p) => <span className={p.stock < 10 ? "font-medium text-red-600" : ""}>{p.stock}</span> },
  { key: "sold", label: "Sold", align: "right" },
  { key: "status", label: "Status", render: (p) => <Badge>{p.status}</Badge> },
];
const fields: Field[] = [
  { key: "name", label: "Product name", required: true, full: true },
  { key: "sku", label: "SKU", required: true },
  { key: "category", label: "Category", type: "select", options: CATEGORIES },
  { key: "price", label: "Price ($)", type: "number", required: true },
  { key: "cost", label: "Unit cost ($)", type: "number" },
  { key: "stock", label: "Stock", type: "number" },
  { key: "status", label: "Status", type: "select", options: ["Published", "Draft", "Archived"] },
  { key: "description", label: "Description", type: "textarea", ai: { task: "product_description", from: "name" } },
];

export default function ProductsClient({ rows, canEdit, q }: { rows: Product[]; canEdit: boolean; q?: string }) {
  return (
    <ResourceManager entity="Product" rows={rows} columns={columns} fields={fields} canEdit={canEdit} initialQuery={q}
      searchKeys={["name", "sku", "category"]} filter={{ key: "category", label: "Category", options: CATEGORIES }}
      defaults={{ status: "Draft", sold: 0, stock: 0, category: "Electronics" }} />
  );
}
