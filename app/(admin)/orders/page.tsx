// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
import type { Metadata } from "next";
import { requirePage } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { orders } from "@/lib/demo-data";
import { money } from "@/lib/format";
import { Forbidden, PageHeader, StatCard } from "@/components/ui";
import OrdersClient from "./OrdersClient";

export const metadata: Metadata = { title: "Orders" };

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { session, allowed } = await requirePage("orders:view");
  if (!allowed) return <Forbidden />;
  const { q } = await searchParams;
  const count = (s: string) => orders.filter((o) => o.status === s).length;
  return (
    <>
      <PageHeader title="Orders" subtitle="Track, update and export every order." />
      <div className="mb-4 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
        <StatCard label="Total sales" value={money(orders.reduce((s, o) => s + o.total, 0))} />
        <StatCard label="Pending" value={String(count("Pending"))} />
        <StatCard label="Shipped" value={String(count("Shipped"))} />
        <StatCard label="Returned / cancelled" value={String(count("Returned") + count("Cancelled"))} />
      </div>
      <OrdersClient rows={orders} canEdit={can(session.role, "orders:manage")} q={q?.slice(0, 60)} />
    </>
  );
}
