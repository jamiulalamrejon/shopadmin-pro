// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
// SMS gateway integration. Pick a provider with SMS_PROVIDER in .env.local.
// API keys stay on the server and are never sent to the browser.
import "server-only";

export type SmsResult = { ok: boolean; provider: string; messageId?: string; error?: string };

export { normalizePhone } from "./phone";

export function smsProviderName(): string {
  return (process.env.SMS_PROVIDER || "demo").toLowerCase();
}

export function smsConfigured(): boolean {
  const p = smsProviderName();
  if (p === "bulksmsbd") return Boolean(process.env.SMS_API_KEY && process.env.SMS_SENDER_ID);
  if (p === "twilio") return Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM);
  return false;
}

export async function sendSms(to: string, message: string): Promise<SmsResult> {
  const provider = smsProviderName();
  const signal = AbortSignal.timeout(15_000);

  try {
    if (provider === "bulksmsbd" && smsConfigured()) {
      // BulkSMSBD-style API. Check your gateway's docs - parameter names differ between providers.
      const body = new URLSearchParams({
        api_key: process.env.SMS_API_KEY!,
        type: "text",
        number: to,
        senderid: process.env.SMS_SENDER_ID!,
        message,
      });
      const res = await fetch(process.env.SMS_API_URL || "http://bulksmsbd.net/api/smsapi", { method: "POST", body, signal });
      const data = await res.json().catch(() => ({}));
      const ok = res.ok && (data.response_code === 202 || data.success === true);
      return { ok, provider, messageId: data.message_id, error: ok ? undefined : "Gateway rejected the message." };
    }

    if (provider === "twilio" && smsConfigured()) {
      const sid = process.env.TWILIO_ACCOUNT_SID!;
      const auth = Buffer.from(`${sid}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64");
      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`, {
        method: "POST",
        headers: { Authorization: `Basic ${auth}` },
        body: new URLSearchParams({ To: "+" + to, From: process.env.TWILIO_FROM!, Body: message }),
        signal,
      });
      const data = await res.json().catch(() => ({}));
      return { ok: res.ok, provider, messageId: data.sid, error: res.ok ? undefined : "Gateway rejected the message." };
    }

    // Demo mode: nothing leaves the server.
    console.info(`[sms:demo] to=${to.slice(0, 5)}****** chars=${message.length}`);
    return { ok: true, provider: "demo", messageId: "demo_" + crypto.randomUUID().slice(0, 8) };
  } catch {
    // Never leak gateway errors or keys to the client.
    return { ok: false, provider, error: "SMS gateway is unreachable. Try again later." };
  }
}
