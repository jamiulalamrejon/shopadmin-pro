// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
import type { Metadata } from "next";
import { requirePage } from "@/lib/auth";
import { customers, smsCampaigns, smsLogs, smsTemplates } from "@/lib/demo-data";
import { smsConfigured, smsProviderName } from "@/lib/sms";
import { num } from "@/lib/format";
import { Badge, Forbidden, PageHeader, StatCard } from "@/components/ui";
import SmsClient from "./SmsClient";

export const metadata: Metadata = { title: "SMS" };

export default async function SmsPage() {
  const { allowed } = await requirePage("sms:send");
  if (!allowed) return <Forbidden />;
  const provider = smsProviderName();
  const live = smsConfigured();
  const delivered = smsLogs.filter((l) => l.status === "Delivered").length;
  const audiences = {
    "All customers": customers.filter((c) => c.status !== "Blocked").map((c) => c.phone),
    "VIP customers": customers.filter((c) => c.status === "VIP").map((c) => c.phone),
    "New York customers": customers.filter((c) => c.city === "New York" && c.status !== "Blocked").map((c) => c.phone),
  };
  return (
    <>
      <PageHeader title="SMS" subtitle="Send order updates, OTPs and promotional campaigns."
        actions={<Badge tone={live ? "green" : "amber"}>{live ? `Live: ${provider}` : "Demo mode - no SMS is sent"}</Badge>} />
      <div className="mb-4 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
        <StatCard label="SMS balance" value={num(48250)} />
        <StatCard label="Sent this month" value={num(12460)} change={-2} />
        <StatCard label="Delivery rate" value={`${Math.round((delivered / smsLogs.length) * 100)}%`} />
        <StatCard label="Campaigns" value={String(smsCampaigns.length)} />
      </div>
      <SmsClient templates={smsTemplates} logs={smsLogs} campaigns={smsCampaigns} audiences={audiences} />
    </>
  );
}
