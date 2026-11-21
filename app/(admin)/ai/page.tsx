// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
import type { Metadata } from "next";
import { requirePage } from "@/lib/auth";
import { aiConfigured, aiProviderName } from "@/lib/ai";
import { Badge, Forbidden, PageHeader } from "@/components/ui";
import AiClient from "./AiClient";

export const metadata: Metadata = { title: "AI assistant" };

export default async function AiPage() {
  const { allowed } = await requirePage("ai:use");
  if (!allowed) return <Forbidden />;
  const live = aiConfigured();
  return (
    <>
      <PageHeader title="AI assistant" subtitle="Write product copy, blog posts, SMS and customer replies, or ask about your store."
        actions={<Badge tone={live ? "green" : "amber"}>{live ? `Live: ${aiProviderName()}` : "Demo mode - add an API key"}</Badge>} />
      <AiClient />
    </>
  );
}
