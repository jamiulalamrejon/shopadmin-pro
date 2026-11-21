// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
// Multi-warehouse inventory: capacity, reorder suggestions and stock movement history.
import type { Metadata } from "next";
import Link from "next/link";
import { Boxes, DollarSign, TriangleAlert, Warehouse } from "lucide-react";
import { requirePage } from "@/lib/auth";
import { products, stockMovements, suppliers, warehouses } from "@/lib/demo-data";
import { money, num } from "@/lib/format";
import { Badge, Card, Forbidden, PageHeader, Progress, StatCard } from "@/components/ui";
import MovementsClient from "./MovementsClient";

export const metadata: Metadata = { title: "Inventory" };

export default async function InventoryPage() {
  const { allowed } = await requirePage("inventory:manage");
  if (!allowed) return <Forbidden />;
  const units = products.reduce((s, p) => s + p.stock, 0);
  const value = products.reduce((s, p) => s + p.stock * p.cost, 0);
  // Reorder point: anything with less than ~2 weeks of sales left.
  const reorder = products
    .map((p) => ({ ...p, daily: p.sold / 30, daysLeft: p.sold ? Math.floor(p.stock / (p.sold / 30)) : 99 }))
    .filter((p) => p.daysLeft < 14 && p.status !== "Archived")
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <>
      <PageHeader title="Inventory" subtitle="Stock across warehouses, reorder suggestions and every stock movement."
        actions={<Link href="/purchasing" className="btn-primary">Create purchase order</Link>} />
      <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
        <StatCard label="Units in stock" value={num(units)} icon={<Boxes size={18} />} />
        <StatCard label="Stock value (cost)" value={money(value)} icon={<DollarSign size={18} />} />
        <StatCard label="Need reorder" value={String(reorder.length)} icon={<TriangleAlert size={18} />} />
        <StatCard label="Warehouses" value={String(warehouses.length)} icon={<Warehouse size={18} />} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        {warehouses.map((w) => {
          const pct = Math.round((w.used / w.capacity) * 100);
          return (
            <Card key={w.id} title={w.name} subtitle={`${w.location} · ${w.manager}`} action={<Badge tone={pct > 85 ? "red" : pct > 70 ? "amber" : "green"}>{pct}% full</Badge>}>
              <Progress value={pct} tone={pct > 85 ? "red" : pct > 70 ? "amber" : "blue"} />
              <p className="mt-2 text-xs text-slate-400">{num(w.used)} of {num(w.capacity)} bins used</p>
            </Card>
          );
        })}
      </div>

      <Card title="Reorder suggestions" subtitle="Products with less than 14 days of stock at the current sales rate" className="mt-5" padded={false}>
        <div className="overflow-x-auto pb-2">
          <table className="w-full">
            <thead><tr className="border-b border-slate-100">
              <th className="table-th">Product</th><th className="table-th text-right">In stock</th><th className="table-th text-right">Sells / day</th>
              <th className="table-th text-right">Days left</th><th className="table-th text-right">Suggested order</th><th className="table-th">Preferred supplier</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-50">
              {reorder.map((p, i) => (
                <tr key={p.id}>
                  <td className="table-td font-semibold text-ink">{p.name}<span className="block text-xs font-normal text-slate-400">{p.sku}</span></td>
                  <td className="table-td text-right">{p.stock}</td>
                  <td className="table-td text-right">{p.daily.toFixed(1)}</td>
                  <td className="table-td text-right"><Badge tone={p.daysLeft < 3 ? "red" : "amber"}>{p.daysLeft} days</Badge></td>
                  <td className="table-td text-right font-semibold">{Math.max(25, Math.ceil(p.daily * 30))} units · {money(Math.max(25, Math.ceil(p.daily * 30)) * p.cost)}</td>
                  <td className="table-td">{suppliers[i % suppliers.length].name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <h2 className="mt-8 mb-3 text-base font-semibold">Stock movements</h2>
      <MovementsClient rows={stockMovements} products={products.map((p) => p.name)} warehouses={warehouses.map((w) => w.name)} />
    </>
  );
}
