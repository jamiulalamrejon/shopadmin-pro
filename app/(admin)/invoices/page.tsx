// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
import type { Metadata } from "next";
import { CircleDot, DollarSign, Receipt, TriangleAlert } from "lucide-react";
import { requirePage } from "@/lib/auth";
import { invoices } from "@/lib/demo-data";
import { money } from "@/lib/format";
import { Forbidden, PageHeader, StatCard } from "@/components/ui";
import InvoicesClient from "./InvoicesClient";

export const metadata: Metadata = { title: "Invoices" };

export default async function InvoicesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { allowed } = await requirePage("invoices:manage");
  if (!allowed) return <Forbidden />;
  const { q } = await searchParams;
  const sum = (s: string) => invoices.filter((i) => i.status === s).reduce((t, i) => t + i.amount + i.tax, 0);
  return (
    <>
      <PageHeader title="Invoices" subtitle="Bill customers, track payments and print invoices." />
      <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
        <StatCard label="Paid" value={money(sum("Paid"))} change={12} icon={<DollarSign size={18} />} />
        <StatCard label="Outstanding" value={money(sum("Unpaid"))} icon={<Receipt size={18} />} />
        <StatCard label="Overdue" value={money(sum("Overdue"))} icon={<TriangleAlert size={18} />} />
        <StatCard label="Tax collected" value={money(invoices.filter((i) => i.status === "Paid").reduce((t, i) => t + i.tax, 0))} icon={<CircleDot size={18} />} />
      </div>
      <div className="mt-5"><InvoicesClient rows={invoices} q={q?.slice(0, 60)} /></div>
    </>
  );
}
