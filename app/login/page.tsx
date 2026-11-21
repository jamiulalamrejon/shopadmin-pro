// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
import type { Metadata } from "next";
import { Check } from "lucide-react";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

const FEATURES = ["Orders, invoices and shipping", "Inventory, suppliers and purchase orders", "Finance: profit, cash flow and expenses", "SMS campaigns and an AI assistant"];

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  // Only allow redirects to our own pages (prevents open-redirect attacks).
  const safeNext = next && /^\/[a-z0-9/_-]*$/i.test(next) && !next.startsWith("//") ? next : "/dashboard";

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-500 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -left-16 size-80 rounded-full bg-white/10" />
        <div className="relative flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-white text-lg font-bold text-brand-600">S</span>
          <span className="text-lg font-bold">ShopAdmin Pro</span>
        </div>
        <div className="relative">
          <h1 className="text-4xl leading-tight font-bold text-white">Run your online business from one smart dashboard.</h1>
          <ul className="mt-8 space-y-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3 text-white/90"><span className="grid size-6 place-items-center rounded-full bg-white/20"><Check size={14} /></span>{f}</li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-white/80">Developed by <a className="font-semibold text-white underline" href="https://www.Jamiulalamrejon.com" target="_blank" rel="noopener noreferrer">www.Jamiulalamrejon.com</a></p>
      </section>
      <section className="flex items-center justify-center p-6 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-indigo-500 text-lg font-bold text-white shadow-tile">S</span>
            <span className="text-lg font-bold text-ink">ShopAdmin<span className="text-brand-600"> Pro</span></span>
          </div>
          <h2 className="text-3xl font-bold">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-400">Sign in with your staff account.</p>
          <LoginForm next={safeNext} />
          <div className="card mt-8 p-4 text-xs text-slate-500">
            <p className="mb-2 font-semibold text-ink">Demo accounts</p>
            <ul className="space-y-1 font-mono">
              <li>admin@demo.com / Admin@123</li>
              <li>manager@demo.com / Manager@123</li>
              <li>editor@demo.com / Editor@123</li>
              <li>support@demo.com / Support@123</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
