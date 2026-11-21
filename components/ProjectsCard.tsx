// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
"use client";
import { useState } from "react";
import Link from "next/link";
import { AvatarStack, Progress } from "./ui";
import type { Project } from "@/lib/demo-data";

const TABS = ["All", "Active", "Done"] as const;

export default function ProjectsCard({ projects }: { projects: Project[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const rows = projects.filter((p) => tab === "All" || (tab === "Done" ? p.status === "Completed" : p.status !== "Completed"));
  const done = projects.filter((p) => p.status === "Completed").length;
  return (
    <section className="card">
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
        <div>
          <h2 className="text-base font-semibold">Projects</h2>
          <p className="text-xs text-slate-400"><span className="font-semibold text-emerald-500">{done} done</span> · {projects.length - done} in flight</p>
        </div>
        <div className="flex rounded-lg border border-slate-200 p-0.5 text-xs font-semibold">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-md px-3 py-1.5 ${tab === t ? "bg-brand-50 text-brand-600" : "text-slate-400 hover:text-ink"}`}>{t.toUpperCase()}</button>
          ))}
        </div>
      </div>
      <ul className="mt-3 divide-y divide-slate-100 px-5 md:hidden">
        {rows.map((p) => (
          <li key={p.id} className="py-3.5">
            <div className="flex items-center justify-between gap-3">
              <p className="min-w-0 truncate text-sm font-semibold text-ink">{p.name}</p>
              <AvatarStack names={p.members.split(",").map((m) => m.trim()).filter(Boolean)} max={3} />
            </div>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex-1"><Progress value={p.completion} tone={p.completion === 100 ? "green" : p.status === "On hold" ? "amber" : "blue"} /></div>
              <span className="text-xs font-semibold">{p.completion}%</span>
              <span className="text-xs text-slate-400">{p.budget ? `$${p.budget.toLocaleString("en-US")}` : "No budget"}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead><tr className="border-b border-slate-100"><th className="table-th">Project</th><th className="table-th">Team</th><th className="table-th">Budget</th><th className="table-th w-48">Completion</th></tr></thead>
          <tbody className="divide-y divide-slate-50">
            {rows.map((p) => (
              <tr key={p.id}>
                <td className="table-td font-semibold text-ink">{p.name}</td>
                <td className="table-td"><AvatarStack names={p.members.split(",").map((m) => m.trim()).filter(Boolean)} /></td>
                <td className="table-td font-semibold">{p.budget ? `$${p.budget.toLocaleString("en-US")}` : "Not set"}</td>
                <td className="table-td">
                  <p className="mb-1 text-xs font-semibold">{p.completion}%</p>
                  <Progress value={p.completion} tone={p.completion === 100 ? "green" : p.status === "On hold" ? "amber" : "blue"} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-4 sm:px-6"><Link href="/projects" className="text-xs font-semibold text-brand-600">Manage projects →</Link></div>
    </section>
  );
}
