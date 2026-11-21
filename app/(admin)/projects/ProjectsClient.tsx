// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
"use client";
import ResourceManager, { type Column, type Field } from "@/components/ResourceManager";
import { AvatarStack, Badge, Progress } from "@/components/ui";
import { money, shortDate } from "@/lib/format";
import type { Project } from "@/lib/demo-data";

const STATUS = ["Planning", "In progress", "Completed", "On hold"];
const columns: Column<Project>[] = [
  { key: "name", label: "Project", render: (p) => <span className="font-semibold text-ink">{p.name}<span className="block text-xs font-normal text-slate-400">Owner: {p.owner}</span></span> },
  { key: "members", label: "Team", render: (p) => <AvatarStack names={String(p.members).split(",").map((m) => m.trim()).filter(Boolean)} /> },
  { key: "budget", label: "Budget", align: "right", render: (p) => (p.budget ? money(p.budget) : "Not set") },
  { key: "completion", label: "Completion", render: (p) => (
    <div className="w-40"><p className="mb-1 text-xs font-semibold">{p.completion}%</p><Progress value={Number(p.completion)} tone={Number(p.completion) === 100 ? "green" : "blue"} /></div>
  ) },
  { key: "due", label: "Due", render: (p) => shortDate(p.due) },
  { key: "status", label: "Status", render: (p) => <Badge>{p.status}</Badge> },
];

export default function ProjectsClient({ rows, people }: { rows: Project[]; people: string[] }) {
  const fields: Field[] = [
    { key: "name", label: "Project name", required: true, full: true },
    { key: "owner", label: "Owner", type: "select", options: people },
    { key: "members", label: "Team members (comma separated)", full: true },
    { key: "budget", label: "Budget ($)", type: "number" },
    { key: "completion", label: "Completion (%)", type: "number" },
    { key: "due", label: "Due date", type: "date" },
    { key: "status", label: "Status", type: "select", options: STATUS },
  ];
  return (
    <ResourceManager entity="Project" rows={rows} columns={columns} fields={fields} canEdit
      searchKeys={["name", "owner", "members"]} filter={{ key: "status", label: "Status", options: STATUS }}
      defaults={{ status: "Planning", completion: 0, budget: 0 }} />
  );
}
