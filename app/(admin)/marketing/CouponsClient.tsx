// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
"use client";
import ResourceManager, { type Column, type Field } from "@/components/ResourceManager";
import { Badge } from "@/components/ui";
import { shortDate, money } from "@/lib/format";
import type { Coupon } from "@/lib/demo-data";

const columns: Column<Coupon>[] = [
  { key: "code", label: "Code", render: (c) => <span className="font-mono font-medium">{c.code}</span> },
  { key: "value", label: "Discount", render: (c) => (c.type === "Percent" ? `${c.value}%` : money(c.value)) },
  { key: "minOrder", label: "Min. order", align: "right", render: (c) => money(c.minOrder) },
  { key: "used", label: "Used", render: (c) => (
    <div className="w-28"><span className="text-xs">{c.used} / {c.limit}</span>
      <div className="mt-1 h-1.5 rounded-full bg-slate-100"><div className="h-1.5 rounded-full bg-brand-500" style={{ width: `${Math.min(100, (c.used / Math.max(1, c.limit)) * 100)}%` }} /></div></div>
  ) },
  { key: "expires", label: "Expires", render: (c) => <span className="text-slate-500">{shortDate(c.expires)}</span> },
  { key: "status", label: "Status", render: (c) => <Badge>{c.status}</Badge> },
];
const fields: Field[] = [
  { key: "code", label: "Coupon code", required: true },
  { key: "type", label: "Type", type: "select", options: ["Percent", "Fixed"] },
  { key: "value", label: "Value", type: "number", required: true },
  { key: "minOrder", label: "Minimum order ($)", type: "number" },
  { key: "limit", label: "Usage limit", type: "number" },
  { key: "expires", label: "Expiry date", type: "date" },
  { key: "status", label: "Status", type: "select", options: ["Active", "Paused", "Expired"] },
];

export default function CouponsClient({ rows }: { rows: Coupon[] }) {
  return (
    <ResourceManager entity="Coupon" rows={rows} columns={columns} fields={fields} canEdit searchKeys={["code"]}
      filter={{ key: "status", label: "Status", options: ["Active", "Paused", "Expired"] }}
      defaults={{ type: "Percent", used: 0, limit: 100, status: "Active" }} />
  );
}
