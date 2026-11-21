// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
"use client";
import { useState } from "react";
import { KeyRound, MessageSquare, Save, ShieldCheck, Sparkles, Store } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { useToast } from "@/components/Toast";

type Integrations = { sms: { provider: string; live: boolean }; ai: { provider: string; live: boolean }; authSecret: boolean; sessionHours: number };

function Toggle({ label, desc, checked, onChange }: { label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 py-3">
      <span><span className="block text-sm font-medium">{label}</span>{desc && <span className="block text-xs text-slate-500">{desc}</span>}</span>
      <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-brand-600" : "bg-slate-200"}`}>
        <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition ${checked ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </label>
  );
}

export default function SettingsClient({ integrations }: { integrations: Integrations }) {
  const toast = useToast();
  const [store, setStore] = useState({ name: "ShopAdmin Store", email: "support@shopadmin.example", phone: "+14155550100", address: "350 Fifth Avenue, New York, NY", currency: "USD" });
  const [sec, setSec] = useState({ twoFactor: true, strongPasswords: true, loginAlerts: true, ipAllowlist: false });
  const [pay, setPay] = useState({ stripe: true, paypal: true, cod: true, bank: false });

  const save = (e: React.FormEvent) => { e.preventDefault(); toast("Settings saved"); };

  return (
    <form onSubmit={save} className="grid gap-4 xl:grid-cols-2">
      <Card title="Store details" action={<Store size={16} className="text-slate-400" />}>
        <div className="grid gap-4 sm:grid-cols-2">
          {(["name", "email", "phone", "currency"] as const).map((k) => (
            <div key={k}>
              <label className="label capitalize" htmlFor={k}>{k}</label>
              <input id={k} className="input" value={store[k]} maxLength={120} onChange={(e) => setStore({ ...store, [k]: e.target.value })} />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="label" htmlFor="address">Address</label>
            <input id="address" className="input" value={store.address} maxLength={200} onChange={(e) => setStore({ ...store, address: e.target.value })} />
          </div>
        </div>
      </Card>

      <Card title="Security" action={<ShieldCheck size={16} className="text-slate-400" />}>
        <div className="divide-y divide-slate-100">
          <Toggle label="Require two-factor authentication" desc="All staff must use an authenticator app." checked={sec.twoFactor} onChange={(v) => setSec({ ...sec, twoFactor: v })} />
          <Toggle label="Strong password policy" desc="Min 10 characters with numbers and symbols." checked={sec.strongPasswords} onChange={(v) => setSec({ ...sec, strongPasswords: v })} />
          <Toggle label="Email alerts for new sign-ins" checked={sec.loginAlerts} onChange={(v) => setSec({ ...sec, loginAlerts: v })} />
          <Toggle label="Office IP allowlist" desc="Only allow admin sign-ins from approved IPs." checked={sec.ipAllowlist} onChange={(v) => setSec({ ...sec, ipAllowlist: v })} />
        </div>
        <div className="mt-3 grid gap-2 rounded-lg bg-page p-3 text-xs text-slate-600">
          <p className="flex items-center justify-between"><span><KeyRound size={13} className="mr-1 inline" />Session signing secret</span><Badge tone={integrations.authSecret ? "green" : "red"}>{integrations.authSecret ? "Set" : "Missing - set AUTH_SECRET"}</Badge></p>
          <p className="flex items-center justify-between"><span>Session timeout</span><span className="font-medium">{integrations.sessionHours} hours</span></p>
          <p className="flex items-center justify-between"><span>Login lockout</span><span className="font-medium">5 attempts / 15 min</span></p>
        </div>
      </Card>

      <Card title="Payment methods">
        <div className="divide-y divide-slate-100">
          <Toggle label="Cards (Stripe)" desc="Visa, Mastercard, Amex, Apple Pay and Google Pay." checked={pay.stripe} onChange={(v) => setPay({ ...pay, stripe: v })} />
          <Toggle label="PayPal" checked={pay.paypal} onChange={(v) => setPay({ ...pay, paypal: v })} />
          <Toggle label="Cash on delivery" checked={pay.cod} onChange={(v) => setPay({ ...pay, cod: v })} />
          <Toggle label="Bank transfer" checked={pay.bank} onChange={(v) => setPay({ ...pay, bank: v })} />
        </div>
      </Card>

      <Card title="Integrations">
        <ul className="space-y-4 text-sm">
          <li className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-brand-50 text-brand-600"><MessageSquare size={16} /></span>
            <span className="flex-1"><span className="font-medium">SMS gateway</span><span className="block text-xs text-slate-500">Provider: {integrations.sms.provider} · set SMS_* in .env.local</span></span>
            <Badge tone={integrations.sms.live ? "green" : "amber"}>{integrations.sms.live ? "Connected" : "Demo"}</Badge>
          </li>
          <li className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-brand-50 text-brand-600"><Sparkles size={16} /></span>
            <span className="flex-1"><span className="font-medium">AI provider</span><span className="block text-xs text-slate-500">Provider: {integrations.ai.provider} · set AI_* in .env.local</span></span>
            <Badge tone={integrations.ai.live ? "green" : "amber"}>{integrations.ai.live ? "Connected" : "Demo"}</Badge>
          </li>
        </ul>
        <p className="mt-4 text-xs text-slate-500">API keys are read on the server only and are never shown or sent to the browser.</p>
      </Card>

      <div className="flex justify-end xl:col-span-2">
        <button className="btn-primary"><Save size={16} /> Save changes</button>
      </div>
    </form>
  );
}
