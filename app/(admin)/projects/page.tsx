// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
import type { Metadata } from "next";
import { CircleDot, DollarSign, FolderKanban, Target } from "lucide-react";
import { requirePage } from "@/lib/auth";
import { projects, staff } from "@/lib/demo-data";
import { money } from "@/lib/format";
import { Forbidden, PageHeader, StatCard } from "@/components/ui";
import ProjectsClient from "./ProjectsClient";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const { allowed } = await requirePage("projects:view");
  if (!allowed) return <Forbidden />;
  return (
    <>
      <PageHeader title="Projects" subtitle="Plan campaigns and business projects with your team." />
      <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
        <StatCard label="Projects" value={String(projects.length)} icon={<FolderKanban size={18} />} />
        <StatCard label="In progress" value={String(projects.filter((p) => p.status === "In progress").length)} icon={<CircleDot size={18} />} />
        <StatCard label="Avg. completion" value={`${Math.round(projects.reduce((s, p) => s + p.completion, 0) / projects.length)}%`} icon={<Target size={18} />} />
        <StatCard label="Total budget" value={money(projects.reduce((s, p) => s + p.budget, 0))} icon={<DollarSign size={18} />} />
      </div>
      <div className="mt-5"><ProjectsClient rows={projects} people={staff.map((s) => s.name)} /></div>
    </>
  );
}
