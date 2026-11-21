// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
import type { Metadata } from "next";
import { requirePage } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { products } from "@/lib/demo-data";
import { money } from "@/lib/format";
import { Forbidden, PageHeader, StatCard } from "@/components/ui";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { session, allowed } = await requirePage("products:view");
  if (!allowed) return <Forbidden />;
  const { q } = await searchParams;
  return (
    <>
      <PageHeader title="Products" subtitle="Manage your catalogue, prices and stock. Use AI to write descriptions." />
      <div className="mb-4 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
        <StatCard label="Products" value={String(products.length)} />
        <StatCard label="Published" value={String(products.filter((p) => p.status === "Published").length)} />
        <StatCard label="Low stock" value={String(products.filter((p) => p.stock < 10).length)} />
        <StatCard label="Stock value" value={money(products.reduce((s, p) => s + p.price * p.stock, 0))} />
      </div>
      <ProductsClient rows={products} canEdit={can(session.role, "products:manage")} q={q?.slice(0, 60)} />
    </>
  );
}
