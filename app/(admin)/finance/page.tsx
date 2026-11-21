// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
// Profit and loss, cash flow, expenses by category and expense tracking.
import type { Metadata } from "next";
import { DollarSign, PiggyBank, Receipt, Wallet } from "lucide-react";
import { requirePage } from "@/lib/auth";
import { expenses, invoices, monthlyRevenue } from "@/lib/demo-data";
import { money, pct } from "@/lib/format";
import { Donut, Legend, SmoothLineChart } from "@/components/charts";
import { Card, Forbidden, PageHeader, StatCard } from "@/components/ui";
import ExpensesClient from "./ExpensesClient";

export const metadata: Metadata = { title: "Finance" };

export default async function FinancePage() {
  const { allowed } = await requirePage("finance:view");
  if (!allowed) return <Forbidden />;

  const monthlyOpex = expenses.reduce((s, e) => s + e.amount, 0);
  // Simple P&L model for the demo: COGS = 40% of revenue, operating costs grow slowly.
  const pnl = monthlyRevenue.map((m, i) => {
    const cogs = Math.round(m.revenue * 0.4);
    const opex = Math.round(monthlyOpex * (0.8 + i * 0.02));
    return { ...m, cogs, gross: m.revenue - cogs, opex, net: m.revenue - cogs - opex };
  });
  const year = pnl.reduce((a, m) => ({ revenue: a.revenue + m.revenue, cogs: a.cogs + m.cogs, opex: a.opex + m.opex, net: a.net + m.net }), { revenue: 0, cogs: 0, opex: 0, net: 0 });
  const categories = [...new Set(expenses.map((e) => e.category))].map((c) => ({ label: c, value: expenses.filter((e) => e.category === c).reduce((s, e) => s + e.amount, 0) }))
    .sort((a, b) => b.value - a.value);
  const receivable = invoices.filter((i) => i.status === "Unpaid" || i.status === "Overdue").reduce((s, i) => s + i.amount + i.tax, 0);

  return (
    <>
      <PageHeader title="Finance" subtitle="Profit and loss, cash flow and operating expenses." />
      <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
        <StatCard label="Revenue (12 months)" value={money(year.revenue)} change={18.6} icon={<DollarSign size={18} />} />
        <StatCard label="Net profit (12 months)" value={money(year.net)} change={9.2} icon={<PiggyBank size={18} />} />
        <StatCard label="Net margin" value={pct((year.net / year.revenue) * 100)} icon={<Wallet size={18} />} />
        <StatCard label="Accounts receivable" value={money(receivable)} icon={<Receipt size={18} />} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-12">
        <Card title="Cash flow" subtitle="Money in vs money out" className="xl:col-span-8"
          action={<Legend series={[{ name: "Revenue", color: "#1660f5" }, { name: "Costs", color: "#f59e0b" }, { name: "Net profit", color: "#22c55e" }]} />}>
          <SmoothLineChart prefix="$" labels={pnl.map((m) => m.month)} series={[
            { name: "Revenue", color: "#1660f5", values: pnl.map((m) => m.revenue) },
            { name: "Costs", color: "#f59e0b", values: pnl.map((m) => m.cogs + m.opex) },
            { name: "Net profit", color: "#22c55e", values: pnl.map((m) => m.net) },
          ]} />
        </Card>
        <Card title="Expenses by category" subtitle="This month" className="xl:col-span-4">
          <Donut data={categories} />
        </Card>
      </div>

      <Card title="Profit and loss statement" subtitle="Last 6 months" className="mt-5" padded={false}>
        <div className="overflow-x-auto pb-2">
          <table className="w-full">
            <thead><tr className="border-b border-slate-100">
              <th className="table-th">Month</th><th className="table-th text-right">Revenue</th><th className="table-th text-right">Cost of goods</th>
              <th className="table-th text-right">Gross profit</th><th className="table-th text-right">Operating costs</th><th className="table-th text-right">Net profit</th><th className="table-th text-right">Margin</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-50">
              {pnl.slice(-6).reverse().map((m) => (
                <tr key={m.month}>
                  <td className="table-td font-semibold text-ink">{m.month}</td>
                  <td className="table-td text-right">{money(m.revenue)}</td>
                  <td className="table-td text-right text-slate-400">{money(-m.cogs)}</td>
                  <td className="table-td text-right">{money(m.gross)}</td>
                  <td className="table-td text-right text-slate-400">{money(-m.opex)}</td>
                  <td className={`table-td text-right font-semibold ${m.net >= 0 ? "text-emerald-600" : "text-red-500"}`}>{money(m.net)}</td>
                  <td className="table-td text-right">{pct((m.net / m.revenue) * 100)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <h2 className="mt-8 mb-3 text-base font-semibold">Expenses</h2>
      <ExpensesClient rows={expenses} />
    </>
  );
}
