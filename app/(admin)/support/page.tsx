// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
import type { Metadata } from "next";
import { Clock, Headset, Heart, LifeBuoy } from "lucide-react";
import { requirePage } from "@/lib/auth";
import { staff, tickets } from "@/lib/demo-data";
import { Forbidden, PageHeader, StatCard } from "@/components/ui";
import TicketsClient from "./TicketsClient";

export const metadata: Metadata = { title: "Support desk" };

export default async function SupportPage() {
  const { allowed } = await requirePage("support:manage");
  if (!allowed) return <Forbidden />;
  return (
    <>
      <PageHeader title="Support desk" subtitle="Customer tickets from email, chat, phone and SMS. Draft replies with AI." />
      <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
        <StatCard label="Open tickets" value={String(tickets.filter((t) => t.status === "Open").length)} icon={<LifeBuoy size={18} />} />
        <StatCard label="Urgent" value={String(tickets.filter((t) => t.priority === "Urgent" && t.status !== "Closed").length)} icon={<Headset size={18} />} />
        <StatCard label="Avg. first reply" value="1h 12m" change={-18} icon={<Clock size={18} />} />
        <StatCard label="Customer satisfaction" value="94%" change={2.4} icon={<Heart size={18} />} />
      </div>
      <div className="mt-5"><TicketsClient rows={tickets} agents={["Unassigned", ...staff.filter((s) => s.status === "Active").map((s) => s.name)]} /></div>
    </>
  );
}
