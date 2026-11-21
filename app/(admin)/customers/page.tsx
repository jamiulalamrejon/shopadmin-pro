// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
import type { Metadata } from "next";
import { requirePage } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { customers } from "@/lib/demo-data";
import { money } from "@/lib/format";
import { Forbidden, PageHeader, StatCard } from "@/components/ui";
import CustomersClient from "./CustomersClient";

export const metadata: Metadata = { title: "Customers" };

export default async function CustomersPage() {
  const { session, allowed } = await requirePage("customers:view");
  if (!allowed) return <Forbidden />;
  const spent = customers.reduce((s, c) => s + c.spent, 0);
  return (
    <>
      <PageHeader title="Customers" subtitle="User accounts, order history and lifetime value." />
      <div className="mb-4 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
        <StatCard label="Customers" value={String(customers.length)} />
        <StatCard label="VIP" value={String(customers.filter((c) => c.status === "VIP").length)} />
        <StatCard label="Blocked" value={String(customers.filter((c) => c.status === "Blocked").length)} />
        <StatCard label="Avg. lifetime value" value={money(spent / customers.length)} />
      </div>
      <CustomersClient rows={customers} canEdit={can(session.role, "customers:manage")} />
    </>
  );
}
