// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
// Abandoned cart recovery. Wire "Send reminder" to your email/SMS provider for real use.
"use client";
import ResourceManager, { type Column } from "@/components/ResourceManager";
import { Badge } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { dateTime, money } from "@/lib/format";
import type { AbandonedCart } from "@/lib/demo-data";

const columns: Column<AbandonedCart>[] = [
  { key: "customer", label: "Customer", render: (c) => <span className="font-semibold text-ink">{c.customer}<span className="block text-xs font-normal text-slate-400">{c.email}</span></span> },
  { key: "items", label: "Items", align: "right" },
  { key: "value", label: "Cart value", align: "right", render: (c) => <span className="font-semibold">{money(c.value)}</span> },
  { key: "lastSeen", label: "Last seen", render: (c) => <span className="text-slate-400">{dateTime(c.lastSeen)}</span> },
  { key: "status", label: "Status", render: (c) => <Badge>{c.status}</Badge> },
];

export default function CartsClient({ rows }: { rows: AbandonedCart[] }) {
  const toast = useToast();
  return (
    <ResourceManager entity="Cart" rows={rows} columns={columns} fields={[]} canEdit={false} searchKeys={["customer", "email"]}
      filter={{ key: "status", label: "Status", options: ["Not contacted", "Reminder sent", "Recovered"] }} defaults={{}}
      rowActions={(c, update) => c.status === "Not contacted" && (
        <button onClick={() => { update({ status: "Reminder sent" }); toast(`Recovery reminder with 10% code sent to ${c.customer}`); }} className="btn-ghost h-8 text-xs text-brand-600">Send reminder</button>
      )} />
  );
}
