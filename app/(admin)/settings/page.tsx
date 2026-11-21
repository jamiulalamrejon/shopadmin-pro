// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
import type { Metadata } from "next";
import { requirePage } from "@/lib/auth";
import { aiConfigured, aiProviderName } from "@/lib/ai";
import { smsConfigured, smsProviderName } from "@/lib/sms";
import { SESSION_HOURS } from "@/lib/session";
import { Forbidden, PageHeader } from "@/components/ui";
import SettingsClient from "./SettingsClient";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const { allowed } = await requirePage("settings:manage");
  if (!allowed) return <Forbidden />;
  // Only status flags are sent to the browser - never the API keys themselves.
  const integrations = {
    sms: { provider: smsProviderName(), live: smsConfigured() },
    ai: { provider: aiProviderName(), live: aiConfigured() },
    authSecret: Boolean(process.env.AUTH_SECRET && process.env.AUTH_SECRET.length >= 32),
    sessionHours: SESSION_HOURS,
  };
  return (
    <>
      <PageHeader title="Settings" subtitle="Store details, security, payments and integrations." />
      <SettingsClient integrations={integrations} />
    </>
  );
}
