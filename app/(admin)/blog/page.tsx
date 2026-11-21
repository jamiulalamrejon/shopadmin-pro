// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
import type { Metadata } from "next";
import { requirePage } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { blogPosts } from "@/lib/demo-data";
import { num } from "@/lib/format";
import { Forbidden, PageHeader, StatCard } from "@/components/ui";
import BlogClient from "./BlogClient";

export const metadata: Metadata = { title: "Blog" };

export default async function BlogPage() {
  const { session, allowed } = await requirePage("blog:view");
  if (!allowed) return <Forbidden />;
  return (
    <>
      <PageHeader title="Blog" subtitle="Write and publish articles. Draft them with AI in one click." />
      <div className="mb-4 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
        <StatCard label="Posts" value={String(blogPosts.length)} />
        <StatCard label="Published" value={String(blogPosts.filter((p) => p.status === "Published").length)} />
        <StatCard label="Scheduled" value={String(blogPosts.filter((p) => p.status === "Scheduled").length)} />
        <StatCard label="Total views" value={num(blogPosts.reduce((s, p) => s + p.views, 0))} change={14.2} />
      </div>
      <BlogClient rows={blogPosts} canEdit={can(session.role, "blog:manage")} author={session.name} />
    </>
  );
}
