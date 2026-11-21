// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
"use client";
import ResourceManager, { type Column, type Field } from "@/components/ResourceManager";
import { Avatar, Badge } from "@/components/ui";
import { dateTime } from "@/lib/format";
import { ROLE_LABELS, type Role } from "@/lib/rbac";
import type { StaffMember } from "@/lib/demo-data";

type Row = Omit<StaffMember, "passwordHash">;
const columns: Column<Row>[] = [
  { key: "name", label: "Name", render: (s) => (
    <div className="flex items-center gap-3"><Avatar name={s.name} /><span>{s.name}<span className="block text-xs text-slate-400">{s.email}</span></span></div>
  ) },
  { key: "phone", label: "Phone" },
  { key: "role", label: "Role", render: (s) => <Badge tone="violet">{ROLE_LABELS[s.role as Role] ?? s.role}</Badge> },
  { key: "twoFactor", label: "2FA", render: (s) => <Badge tone={s.twoFactor ? "green" : "amber"}>{s.twoFactor ? "On" : "Off"}</Badge> },
  { key: "lastLogin", label: "Last login", render: (s) => <span className="text-slate-500">{dateTime(s.lastLogin)}</span> },
  { key: "status", label: "Status", render: (s) => <Badge>{s.status}</Badge> },
];
const fields: Field[] = [
  { key: "name", label: "Full name", required: true },
  { key: "email", label: "Work email", type: "email", required: true },
  { key: "phone", label: "Phone", type: "tel" },
  { key: "role", label: "Role", type: "select", options: Object.keys(ROLE_LABELS) },
  { key: "status", label: "Status", type: "select", options: ["Active", "Suspended"] },
];

export default function StaffClient({ rows }: { rows: Row[] }) {
  return (
    <ResourceManager entity="Staff member" rows={rows} columns={columns} fields={fields} canEdit
      searchKeys={["name", "email", "phone"]} filter={{ key: "role", label: "Role", options: Object.keys(ROLE_LABELS) }}
      defaults={{ role: "support", status: "Active", twoFactor: false, lastLogin: new Date().toISOString() }} />
  );
}
