// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
"use client";
import ResourceManager, { type Column, type Field } from "@/components/ResourceManager";
import { Badge } from "@/components/ui";
import { num, shortDate } from "@/lib/format";
import type { BlogPost } from "@/lib/demo-data";

const CATEGORIES = ["Guides", "News", "Beauty", "Fashion", "Reviews", "Shopping"];
const columns: Column<BlogPost>[] = [
  { key: "title", label: "Title", render: (p) => <span className="block max-w-sm truncate font-medium">{p.title}<span className="block text-xs font-normal text-slate-400">/blog/{p.slug}</span></span> },
  { key: "category", label: "Category" },
  { key: "author", label: "Author" },
  { key: "views", label: "Views", align: "right", render: (p) => num(p.views) },
  { key: "date", label: "Date", render: (p) => <span className="text-slate-500">{shortDate(p.date)}</span> },
  { key: "status", label: "Status", render: (p) => <Badge>{p.status}</Badge> },
];
const fields: Field[] = [
  { key: "title", label: "Title", required: true, full: true },
  { key: "slug", label: "URL slug", required: true },
  { key: "category", label: "Category", type: "select", options: CATEGORIES },
  { key: "status", label: "Status", type: "select", options: ["Draft", "Published", "Scheduled"] },
  { key: "content", label: "Content", type: "textarea", ai: { task: "blog_post", from: "title" } },
];

export default function BlogClient({ rows, canEdit, author }: { rows: BlogPost[]; canEdit: boolean; author: string }) {
  return (
    <ResourceManager entity="Post" rows={rows} columns={columns} fields={fields} canEdit={canEdit}
      searchKeys={["title", "category", "author"]} filter={{ key: "status", label: "Status", options: ["Published", "Draft", "Scheduled"] }}
      defaults={{ author, views: 0, status: "Draft", category: "Guides", date: new Date().toISOString() }} />
  );
}
