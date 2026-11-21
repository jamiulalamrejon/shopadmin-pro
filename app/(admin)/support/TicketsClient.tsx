// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
"use client";
import ResourceManager, { type Column, type Field } from "@/components/ResourceManager";
import { Badge } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { dateTime } from "@/lib/format";
import type { Ticket } from "@/lib/demo-data";

const STATUS = ["Open", "Pending", "Resolved", "Closed"];
const PRIORITY = ["Low", "Medium", "High", "Urgent"];
const columns: Column<Ticket>[] = [
  { key: "number", label: "Ticket", render: (t) => <span className="font-semibold text-ink">{t.number}</span> },
  { key: "subject", label: "Subject", render: (t) => <span className="block max-w-xs truncate">{t.subject}<span className="block text-xs text-slate-400">{t.customer} · {t.channel}</span></span> },
  { key: "priority", label: "Priority", render: (t) => <Badge>{t.priority}</Badge> },
  { key: "assignee", label: "Assignee" },
  { key: "updated", label: "Updated", render: (t) => <span className="text-slate-400">{dateTime(t.updated)}</span> },
  { key: "status", label: "Status", render: (t) => <Badge>{t.status}</Badge> },
];

export default function TicketsClient({ rows, agents }: { rows: Ticket[]; agents: string[] }) {
  const toast = useToast();
  const fields: Field[] = [
    { key: "subject", label: "Subject", required: true, full: true },
    { key: "customer", label: "Customer", required: true },
    { key: "channel", label: "Channel", type: "select", options: ["Email", "Chat", "Phone", "SMS"] },
    { key: "priority", label: "Priority", type: "select", options: PRIORITY },
    { key: "assignee", label: "Assign to", type: "select", options: agents },
    { key: "status", label: "Status", type: "select", options: STATUS },
    { key: "reply", label: "Reply to customer", type: "textarea", ai: { task: "reply_customer", from: "subject" } },
  ];
  return (
    <ResourceManager entity="Ticket" rows={rows} columns={columns} fields={fields} canEdit
      searchKeys={["number", "subject", "customer", "assignee"]} filter={{ key: "status", label: "Status", options: STATUS }}
      defaults={{ number: `T-${900 + Math.floor(Math.random() * 99)}`, status: "Open", priority: "Medium", channel: "Email", assignee: "Unassigned", updated: new Date().toISOString(), reply: "" }}
      rowActions={(t, update) => t.status !== "Resolved" && t.status !== "Closed" && (
        <button onClick={() => { update({ status: "Resolved", updated: new Date().toISOString() }); toast(`${t.number} resolved`); }} className="btn-ghost h-8 text-xs text-emerald-600">Resolve</button>
      )} />
  );
}
