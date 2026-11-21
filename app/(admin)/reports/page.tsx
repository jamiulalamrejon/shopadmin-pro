// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
import type { Metadata } from "next";
import { requirePage } from "@/lib/auth";
import { customers, monthlyRevenue, orders, products, PAYMENT_METHODS } from "@/lib/demo-data";
import { num, money } from "@/lib/format";
import { AreaChart, BarChart, Donut } from "@/components/charts";
import { Avatar, Card, Forbidden, PageHeader, StatCard } from "@/components/ui";

export const metadata: Metadata = { title: "Reports" };

export default async function ReportsPage() {
  const { allowed } = await requirePage("reports:view");
  if (!allowed) return <Forbidden />;

  const yearRevenue = monthlyRevenue.reduce((s, m) => s + m.revenue, 0);
  const yearOrders = monthlyRevenue.reduce((s, m) => s + m.orders, 0);
  const categories = [...new Set(products.map((p) => p.category))].map((c) => ({
    label: c, value: products.filter((p) => p.category === c).reduce((s, p) => s + p.sold * p.price, 0),
  }));
  const payments = PAYMENT_METHODS.map((p) => ({ label: p, value: orders.filter((o) => o.payment === p).length }));
  const cities = [...new Set(orders.map((o) => o.city))].map((c) => ({ label: c.split(" ")[0].slice(0, 8), value: orders.filter((o) => o.city === c).reduce((s, o) => s + o.total, 0) }))
    .sort((a, b) => b.value - a.value).slice(0, 7);
  const topCustomers = [...customers].sort((a, b) => b.spent - a.spent).slice(0, 6);

  return (
    <>
      <PageHeader title="Reports" subtitle="Sales performance for the last 12 months." />
      <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
        <StatCard label="Yearly revenue" value={money(yearRevenue)} change={18.6} />
        <StatCard label="Yearly orders" value={num(yearOrders)} change={11.2} />
        <StatCard label="Avg. order value" value={money(yearRevenue / yearOrders)} change={4.1} />
        <StatCard label="Return rate" value={`${Math.round((orders.filter((o) => o.status === "Returned").length / orders.length) * 1000) / 10}%`} change={-0.8} />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card title="Monthly revenue"><AreaChart data={monthlyRevenue.map((m) => ({ label: m.month, value: m.revenue }))} prefix="$" /></Card>
        <Card title="Monthly orders"><BarChart data={monthlyRevenue.map((m) => ({ label: m.month, value: m.orders }))} height={220} /></Card>
        <Card title="Revenue by category"><Donut data={categories} /></Card>
        <Card title="Payment methods"><Donut data={payments} centerLabel={String(orders.length)} /></Card>
        <Card title="Sales by city"><BarChart data={cities} color="#1d9e75" height={220} /></Card>
        <Card title="Top customers">
          <ul className="space-y-3">
            {topCustomers.map((c) => (
              <li key={c.id} className="flex items-center gap-3 text-sm">
                <Avatar name={c.name} />
                <span className="flex-1">{c.name}<span className="block text-xs text-slate-400">{c.city} · {c.orders} orders</span></span>
                <span className="font-medium">{money(c.spent)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
