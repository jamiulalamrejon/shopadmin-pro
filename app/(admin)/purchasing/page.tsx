// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
// Suppliers and purchase orders.
import type { Metadata } from "next";
import { ClipboardList, DollarSign, Truck, Users } from "lucide-react";
import { requirePage } from "@/lib/auth";
import { purchaseOrders, suppliers } from "@/lib/demo-data";
import { money } from "@/lib/format";
import { Forbidden, PageHeader, StatCard } from "@/components/ui";
import { PurchaseOrdersTable, SuppliersTable } from "./PurchasingClient";

export const metadata: Metadata = { title: "Purchasing" };

export default async function PurchasingPage() {
  const { allowed } = await requirePage("purchasing:manage");
  if (!allowed) return <Forbidden />;
  const open = purchaseOrders.filter((p) => p.status === "Ordered");
  return (
    <>
      <PageHeader title="Purchasing" subtitle="Buy stock from suppliers and track what's on the way." />
      <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
        <StatCard label="Active suppliers" value={String(suppliers.filter((s) => s.status === "Active").length)} icon={<Users size={18} />} />
        <StatCard label="Open purchase orders" value={String(open.length)} icon={<ClipboardList size={18} />} />
        <StatCard label="Incoming stock value" value={money(open.reduce((s, p) => s + p.total, 0))} icon={<Truck size={18} />} />
        <StatCard label="Owed to suppliers" value={money(suppliers.reduce((s, x) => s + x.balance, 0))} icon={<DollarSign size={18} />} />
      </div>
      <h2 className="mt-8 mb-3 text-base font-semibold">Purchase orders</h2>
      <PurchaseOrdersTable rows={purchaseOrders} suppliers={suppliers.map((s) => s.name)} />
      <h2 className="mt-8 mb-3 text-base font-semibold">Suppliers</h2>
      <SuppliersTable rows={suppliers} />
    </>
  );
}
