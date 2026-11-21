// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
import type { Metadata } from "next";
import { DollarSign, PackageCheck, TriangleAlert, Truck } from "lucide-react";
import { requirePage } from "@/lib/auth";
import { shipments } from "@/lib/demo-data";
import { money } from "@/lib/format";
import { Card, Forbidden, PageHeader, Progress, StatCard } from "@/components/ui";
import ShipmentsClient from "./ShipmentsClient";

export const metadata: Metadata = { title: "Shipping" };

export default async function ShippingPage() {
  const { allowed } = await requirePage("shipping:manage");
  if (!allowed) return <Forbidden />;
  const carriers = [...new Set(shipments.map((s) => s.carrier))].map((c) => {
    const list = shipments.filter((s) => s.carrier === c);
    const ok = list.filter((s) => s.status !== "Exception").length;
    return { carrier: c, count: list.length, onTime: Math.round((ok / list.length) * 100), avgCost: list.reduce((t, s) => t + s.cost, 0) / list.length };
  });
  return (
    <>
      <PageHeader title="Shipping" subtitle="Track every parcel and compare carrier performance." />
      <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
        <StatCard label="In transit" value={String(shipments.filter((s) => s.status === "In transit" || s.status === "Out for delivery").length)} icon={<Truck size={18} />} />
        <StatCard label="Delivered" value={String(shipments.filter((s) => s.status === "Delivered").length)} icon={<PackageCheck size={18} />} />
        <StatCard label="Exceptions" value={String(shipments.filter((s) => s.status === "Exception").length)} icon={<TriangleAlert size={18} />} />
        <StatCard label="Avg. shipping cost" value={`$${(shipments.reduce((t, s) => t + s.cost, 0) / shipments.length).toFixed(2)}`} icon={<DollarSign size={18} />} />
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {carriers.map((c) => (
          <Card key={c.carrier} title={c.carrier} subtitle={`${c.count} shipments · avg ${money(c.avgCost)}`}>
            <div className="mb-1 flex justify-between text-xs"><span className="text-slate-400">On-time rate</span><span className="font-semibold">{c.onTime}%</span></div>
            <Progress value={c.onTime} tone={c.onTime > 90 ? "green" : "amber"} />
          </Card>
        ))}
      </div>
      <div className="mt-5"><ShipmentsClient rows={shipments} carriers={carriers.map((c) => c.carrier)} /></div>
    </>
  );
}
