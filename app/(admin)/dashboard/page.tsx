// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
import type { Metadata } from "next";
import Link from "next/link";
import { DollarSign, Heart, ShoppingBag, Sparkles, TriangleAlert, Users } from "lucide-react";
import { requirePage } from "@/lib/auth";
import { can } from "@/lib/rbac";
import {
  abandonedCarts, expenses, funnel, invoices, monthlyRevenue, monthlyTarget, orderTimeline, orders, products, projects, tickets, weeklyActiveUsers,
} from "@/lib/demo-data";
import { money, moneyCompact, num, dateTime } from "@/lib/format";
import { Funnel, GradientBars, Legend, Ring, SmoothLineChart } from "@/components/charts";
import { Badge, Card, Forbidden, PageHeader, StatCard, Trend } from "@/components/ui";
import QuickSms from "@/components/QuickSms";
import AiInsight from "@/components/AiInsight";
import ProjectsCard from "@/components/ProjectsCard";

export const metadata: Metadata = { title: "Dashboard" };

const TONE_DOT: Record<string, string> = {
  green: "border-emerald-500", blue: "border-brand-500", violet: "border-violet-500", red: "border-red-500", amber: "border-amber-500",
};

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const { session, allowed } = await requirePage("dashboard:view");
  if (!allowed) return <Forbidden />;
  const { denied } = await searchParams;

  const m = monthlyRevenue.at(-1)!, prev = monthlyRevenue.at(-2)!;
  const growth = (a: number, b: number) => Math.round(((a - b) / b) * 1000) / 10;
  const todaySales = orders.filter((o) => Date.now() - new Date(o.date).getTime() < 86_400_000 * 1.5).reduce((s, o) => s + o.total, 0);
  const lowStock = products.filter((p) => p.stock < 10 && p.status !== "Archived");
  const expenseTotal = expenses.reduce((s, e) => s + e.amount, 0);
  const net = m.revenue - Math.round(m.revenue * 0.4) - expenseTotal;
  const overdue = invoices.filter((i) => i.status === "Overdue");
  const openTickets = tickets.filter((t) => t.status === "Open").length;
  const cartValue = abandonedCarts.filter((c) => c.status !== "Recovered").reduce((s, c) => s + c.value, 0);
  const targetPct = Math.round((m.revenue / monthlyTarget) * 100);
  const summary = `This month revenue $${m.revenue} (last month $${prev.revenue}), profit $${m.profit}. Target $${monthlyTarget}. Low stock: ${lowStock.map((p) => p.name).join(", ")}. Abandoned carts worth $${cartValue}. Overdue invoices: ${overdue.length}. Open support tickets: ${openTickets}.`;

  return (
    <>
      {denied && <p className="mb-4 rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-amber-700">You don&apos;t have access to that page, so you were sent here.</p>}
      <PageHeader title="Dashboard" subtitle={`Welcome back, ${session.name.split(" ")[0]}. Here's your business at a glance.`}
        actions={<><Link href="/reports" className="btn-secondary">View reports</Link><Link href="/orders" className="btn-primary">New order</Link></>} />

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
        <StatCard label="Today's sales" value={money(todaySales)} change={30} icon={<DollarSign size={18} />} />
        <StatCard label="Visitors this month" value={num(m.visitors)} change={growth(m.visitors, prev.visitors)} icon={<Users size={18} />} />
        <StatCard label="New customers" value={`+${num(1204)}`} change={-2.1} icon={<Heart size={18} />} />
        <StatCard label="Monthly revenue" value={moneyCompact(m.revenue)} change={growth(m.revenue, prev.revenue)} icon={<ShoppingBag size={18} />} />
      </div>

      {/* Charts row */}
      <div className="mt-5 grid gap-5 xl:grid-cols-12">
        <section className="card p-3 sm:p-4 xl:col-span-5">
          <div className="rounded-xl bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-500 px-3 pt-5 pb-2">
            <GradientBars data={weeklyActiveUsers} />
          </div>
          <div className="px-2 pt-5">
            <h2 className="text-base font-semibold">Active buyers</h2>
            <p className="text-xs text-slate-400">vs last 9 weeks <Trend value={23} /></p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[["3.6k", "Buyers"], ["2m", "Clicks"], [moneyCompact(m.revenue / m.orders), "Avg order"], [num(products.length), "Products"]].map(([v, l]) => (
                <div key={l}><p className="text-lg font-bold text-ink">{v}</p><p className="text-xs text-slate-400">{l}</p></div>
              ))}
            </div>
          </div>
        </section>
        <Card title="Sales overview" subtitle={<>Revenue vs profit, last 12 months <Trend value={growth(m.revenue, monthlyRevenue[0].revenue)} /></>}
          className="xl:col-span-7" action={<Legend series={[{ name: "Revenue", color: "#1660f5" }, { name: "Profit", color: "#a78bfa" }]} />}>
          <SmoothLineChart prefix="$" labels={monthlyRevenue.map((x) => x.month)}
            series={[{ name: "Revenue", color: "#1660f5", values: monthlyRevenue.map((x) => x.revenue) }, { name: "Profit", color: "#a78bfa", values: monthlyRevenue.map((x) => x.profit) }]} />
        </Card>
      </div>

      {/* Projects + timeline */}
      <div className="mt-5 grid gap-5 xl:grid-cols-12">
        <div className="xl:col-span-8"><ProjectsCard projects={projects} /></div>
        <Card title="Business timeline" subtitle={<><Trend value={20} /> this month</>} className="xl:col-span-4">
          <ol className="relative space-y-5 before:absolute before:top-2 before:bottom-2 before:left-[7px] before:w-px before:bg-slate-200">
            {orderTimeline.map((t) => (
              <li key={t.id} className="relative flex gap-4">
                <span className={`relative z-10 mt-0.5 size-[15px] shrink-0 rounded-full border-[3px] bg-white ${TONE_DOT[t.tone]}`} />
                <div><p className="text-sm font-semibold text-ink">{t.title}</p><p className="text-xs text-slate-400">{dateTime(t.at)}</p></div>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      {/* Advanced business row */}
      <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Monthly goal" subtitle={`Target ${money(monthlyTarget)}`}>
          <Ring value={targetPct} label={`${targetPct}%`} sub={money(m.revenue)} />
          <p className="mt-4 text-center text-xs text-slate-400">{targetPct >= 100 ? "Target reached. Great work!" : `${money(monthlyTarget - m.revenue)} to go this month`}</p>
        </Card>
        <Card title="Profit snapshot" subtitle="This month" action={<Link href="/finance" className="text-xs font-semibold text-brand-600">Finance</Link>}>
          {[["Revenue", m.revenue, "text-ink"], ["Cost of goods", -Math.round(m.revenue * 0.4), "text-slate-500"], ["Operating expenses", -expenseTotal, "text-slate-500"]].map(([l, v, c]) => (
            <div key={l as string} className="flex justify-between border-b border-slate-50 py-2.5 text-sm"><span className="text-slate-500">{l}</span><span className={`font-semibold ${c}`}>{money(v as number)}</span></div>
          ))}
          <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2.5">
            <span className="text-sm font-semibold text-emerald-700">Net profit</span><span className="font-bold text-emerald-700">{money(net)}</span>
          </div>
        </Card>
        <Card title="Conversion funnel" subtitle="Visitors to buyers">
          <Funnel steps={funnel} />
        </Card>
        <Card title="Needs attention">
          <ul className="space-y-3 text-sm">
            <li><Link href="/inventory" className="flex items-center justify-between rounded-xl bg-page px-3 py-2.5 hover:bg-brand-50"><span className="flex items-center gap-2"><TriangleAlert size={15} className="text-amber-500" />Low stock items</span><Badge tone="amber">{lowStock.length}</Badge></Link></li>
            <li><Link href="/invoices" className="flex items-center justify-between rounded-xl bg-page px-3 py-2.5 hover:bg-brand-50"><span>Overdue invoices</span><Badge tone="red">{overdue.length}</Badge></Link></li>
            <li><Link href="/support" className="flex items-center justify-between rounded-xl bg-page px-3 py-2.5 hover:bg-brand-50"><span>Open support tickets</span><Badge tone="blue">{openTickets}</Badge></Link></li>
            <li><Link href="/marketing" className="flex items-center justify-between rounded-xl bg-page px-3 py-2.5 hover:bg-brand-50"><span>Abandoned carts</span><Badge tone="violet">{money(cartValue)}</Badge></Link></li>
          </ul>
        </Card>
      </div>

      {/* Recent orders + AI + SMS */}
      <div className="mt-5 grid gap-5 xl:grid-cols-12">
        <Card title="Recent orders" padded={false} className="xl:col-span-8" action={<Link href="/orders" className="text-xs font-semibold text-brand-600">View all</Link>}>
          <ul className="divide-y divide-slate-100 px-5 pb-2 md:hidden">
            {orders.slice(0, 6).map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0"><p className="text-sm font-semibold text-ink">{o.number} · {o.customer}</p><p className="text-xs text-slate-400">{o.city} · {o.payment}</p></div>
                <div className="text-right"><p className="text-sm font-semibold text-ink">{money(o.total)}</p><Badge>{o.status}</Badge></div>
              </li>
            ))}
          </ul>
          <div className="hidden overflow-x-auto pb-2 md:block">
            <table className="w-full">
              <thead><tr className="border-b border-slate-100"><th className="table-th">Order</th><th className="table-th">Customer</th><th className="table-th">Payment</th><th className="table-th text-right">Total</th><th className="table-th">Status</th></tr></thead>
              <tbody className="divide-y divide-slate-50">
                {orders.slice(0, 6).map((o) => (
                  <tr key={o.id}>
                    <td className="table-td font-semibold text-ink">{o.number}</td>
                    <td className="table-td">{o.customer}<span className="block text-xs text-slate-400">{o.city}</span></td>
                    <td className="table-td">{o.payment}</td>
                    <td className="table-td text-right font-semibold text-ink">{money(o.total)}</td>
                    <td className="table-td"><Badge>{o.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <div className="space-y-5 xl:col-span-4">
          {can(session.role, "ai:use") && <Card title="AI business insights" action={<span className="tile size-8"><Sparkles size={15} /></span>}><AiInsight summary={summary} /></Card>}
          {can(session.role, "sms:send") && <Card title="Quick SMS"><QuickSms compact /></Card>}
        </div>
      </div>
    </>
  );
}
