// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
"use client";
import ResourceManager, { type Column, type Field } from "@/components/ResourceManager";
import { Badge, Stars } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { shortDate } from "@/lib/format";
import type { Review } from "@/lib/demo-data";

const STATUS = ["Approved", "Pending", "Hidden"];
const columns: Column<Review>[] = [
  { key: "product", label: "Product", render: (r) => <span className="font-semibold text-ink">{r.product}</span> },
  { key: "rating", label: "Rating", render: (r) => <Stars rating={r.rating} /> },
  { key: "comment", label: "Review", render: (r) => <span className="block max-w-sm truncate">{r.comment}<span className="block text-xs text-slate-400">{r.customer}</span></span> },
  { key: "date", label: "Date", render: (r) => <span className="text-slate-400">{shortDate(r.date)}</span> },
  { key: "status", label: "Status", render: (r) => <Badge>{r.status}</Badge> },
];
const fields: Field[] = [
  { key: "product", label: "Product", required: true },
  { key: "customer", label: "Customer", required: true },
  { key: "rating", label: "Rating (1-5)", type: "select", options: ["5", "4", "3", "2", "1"] },
  { key: "status", label: "Status", type: "select", options: STATUS },
  { key: "comment", label: "Review text", type: "textarea" },
];

export default function ReviewsClient({ rows }: { rows: Review[] }) {
  const toast = useToast();
  return (
    <ResourceManager entity="Review" rows={rows} columns={columns} fields={fields} canEdit
      searchKeys={["product", "customer", "comment"]} filter={{ key: "status", label: "Status", options: STATUS }}
      defaults={{ status: "Pending", rating: 5, date: new Date().toISOString() }}
      rowActions={(r, update) => r.status === "Pending" && (
        <button onClick={() => { update({ status: "Approved", rating: Number(r.rating) }); toast("Review approved"); }} className="btn-ghost h-8 text-xs text-emerald-600">Approve</button>
      )} />
  );
}
