// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
"use client";
import ResourceManager, { type Column, type Field } from "@/components/ResourceManager";
import { Avatar, Badge } from "@/components/ui";
import { money, shortDate } from "@/lib/format";
import { CITIES, type Customer } from "@/lib/demo-data";

const columns: Column<Customer>[] = [
  { key: "name", label: "Customer", render: (c) => (
    <div className="flex items-center gap-3"><Avatar name={c.name} /><span>{c.name}<span className="block text-xs text-slate-400">{c.email}</span></span></div>
  ) },
  { key: "phone", label: "Phone" },
  { key: "city", label: "City" },
  { key: "orders", label: "Orders", align: "right" },
  { key: "spent", label: "Spent", align: "right", render: (c) => money(c.spent) },
  { key: "joined", label: "Joined", render: (c) => <span className="text-slate-500">{shortDate(c.joined)}</span> },
  { key: "status", label: "Status", render: (c) => <Badge>{c.status}</Badge> },
];
const fields: Field[] = [
  { key: "name", label: "Full name", required: true },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "phone", label: "Phone", type: "tel", required: true },
  { key: "city", label: "City", type: "select", options: CITIES },
  { key: "status", label: "Account status", type: "select", options: ["Active", "VIP", "Blocked"] },
];

export default function CustomersClient({ rows, canEdit }: { rows: Customer[]; canEdit: boolean }) {
  return (
    <ResourceManager entity="Customer" rows={rows} columns={columns} fields={fields} canEdit={canEdit}
      searchKeys={["name", "email", "phone", "city"]} filter={{ key: "status", label: "Status", options: ["Active", "VIP", "Blocked"] }}
      defaults={{ orders: 0, spent: 0, status: "Active", joined: new Date().toISOString() }} />
  );
}
