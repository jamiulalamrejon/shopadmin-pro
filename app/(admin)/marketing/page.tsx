// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
import type { Metadata } from "next";
import { requirePage } from "@/lib/auth";
import { abandonedCarts, coupons, smsCampaigns } from "@/lib/demo-data";
import { money, num, shortDate } from "@/lib/format";
import { Badge, Card, Forbidden, PageHeader, StatCard } from "@/components/ui";
import CouponsClient from "./CouponsClient";
import CartsClient from "./CartsClient";

export const metadata: Metadata = { title: "Marketing" };

export default async function MarketingPage() {
  const { allowed } = await requirePage("marketing:manage");
  if (!allowed) return <Forbidden />;
  return (
    <>
      <PageHeader title="Marketing" subtitle="Coupons, discounts and campaign performance." />
      <div className="mb-4 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
        <StatCard label="Active coupons" value={String(coupons.filter((c) => c.status === "Active").length)} />
        <StatCard label="Coupon redemptions" value={num(coupons.reduce((s, c) => s + c.used, 0))} change={9.4} />
        <StatCard label="Campaign reach" value={num(smsCampaigns.reduce((s, c) => s + c.recipients, 0))} />
        <StatCard label="Recoverable carts" value={money(abandonedCarts.filter((c) => c.status !== "Recovered").reduce((s, c) => s + c.value, 0))} change={-4.2} />
      </div>
      <h2 className="mb-3 text-base font-semibold">Coupons</h2>
      <CouponsClient rows={coupons} />
      <h2 className="mt-8 mb-3 text-base font-semibold">Abandoned cart recovery</h2>
      <CartsClient rows={abandonedCarts} />
      <Card title="Campaigns" className="mt-6">
        <div className="grid gap-4 md:grid-cols-3">
          {smsCampaigns.map((c) => (
            <div key={c.id} className="rounded-xl bg-page p-4">
              <div className="flex items-center justify-between"><p className="font-medium">{c.name}</p><Badge>{c.status}</Badge></div>
              <p className="mt-1 text-xs text-slate-500">{c.audience} · {shortDate(c.date)}</p>
              <p className="mt-3 text-sm">{num(c.recipients)} recipients · {c.recipients ? Math.round((c.delivered / c.recipients) * 100) : 0}% delivered</p>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
