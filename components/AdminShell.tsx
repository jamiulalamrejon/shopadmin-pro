// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
// App frame: tile-icon sidebar, breadcrumb top bar, notifications. Menu items are
// filtered by the permissions computed on the server.
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Activity, Bell, Boxes, ChartColumn, ClipboardList, FolderKanban, IdCard, LayoutDashboard, LifeBuoy, LogOut, Menu,
  MessageSquare, Newspaper, Package, Receipt, Search, Settings, ShoppingCart, Sparkles, Star, TicketPercent, Truck, Users, Wallet, X,
} from "lucide-react";
import { ToastProvider } from "./Toast";
import { Avatar } from "./ui";

const NAV = [
  { group: "Overview", items: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }, { href: "/reports", label: "Reports", icon: ChartColumn },
    { href: "/finance", label: "Finance", icon: Wallet },
  ] },
  { group: "Sales", items: [
    { href: "/orders", label: "Orders", icon: ShoppingCart }, { href: "/invoices", label: "Invoices", icon: Receipt },
    { href: "/customers", label: "Customers", icon: Users }, { href: "/shipping", label: "Shipping", icon: Truck },
  ] },
  { group: "Catalog", items: [
    { href: "/products", label: "Products", icon: Package }, { href: "/inventory", label: "Inventory", icon: Boxes },
    { href: "/purchasing", label: "Purchasing", icon: ClipboardList },
  ] },
  { group: "Growth", items: [
    { href: "/marketing", label: "Marketing", icon: TicketPercent }, { href: "/sms", label: "SMS", icon: MessageSquare },
    { href: "/ai", label: "AI assistant", icon: Sparkles }, { href: "/blog", label: "Blog", icon: Newspaper }, { href: "/reviews", label: "Reviews", icon: Star },
  ] },
  { group: "Team", items: [
    { href: "/projects", label: "Projects", icon: FolderKanban }, { href: "/support", label: "Support desk", icon: LifeBuoy },
    { href: "/staff", label: "Staff and roles", icon: IdCard }, { href: "/activity", label: "Activity log", icon: Activity },
    { href: "/settings", label: "Settings", icon: Settings },
  ] },
];
const ALL_ITEMS = NAV.flatMap((g) => g.items.map((i) => ({ ...i, group: g.group })));

const NOTIFICATIONS = [
  { title: "New order $289 from Olivia Smith", time: "2 min ago", href: "/orders" },
  { title: "GPS Tracker V3 is almost out of stock", time: "1 h ago", href: "/inventory" },
  { title: "Urgent ticket: payment charged twice", time: "3 h ago", href: "/support" },
];

type User = { name: string; email: string; roleLabel: string };

export default function AdminShell({ user, allowed, children }: { user: User; allowed: string[]; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [bell, setBell] = useState(false);
  const [q, setQ] = useState("");
  const [mobileSearch, setMobileSearch] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const current = ALL_ITEMS.find((i) => pathname === i.href || pathname.startsWith(i.href + "/"));

  useEffect(() => { setOpen(false); }, [pathname]); // close the phone menu after navigating

  useEffect(() => {
    const close = (e: MouseEvent) => { if (!bellRef.current?.contains(e.target as Node)) setBell(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/login");
  }

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim().slice(0, 60);
    if (!term) return;
    const target = term.startsWith("#") ? "/orders" : term.toUpperCase().startsWith("INV") ? "/invoices" : allowed.includes("/products") ? "/products" : "/orders";
    router.push(`${target}?q=${encodeURIComponent(term)}`);
    setMobileSearch(false);
  }

  // Bottom tab bar on phones: the first 4 allowed of these, plus "More" (opens the full menu).
  const tabs = ["/dashboard", "/orders", "/products", "/sms", "/support", "/blog", "/ai"]
    .filter((h) => allowed.includes(h)).slice(0, 4)
    .map((h) => ALL_ITEMS.find((i) => i.href === h)!);

  const sidebar = (
    <nav className="flex h-full flex-col">
      <Link href="/dashboard" className="flex h-20 items-center gap-3 px-6">
        <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-indigo-500 text-sm font-bold text-white shadow-tile">S</span>
        <span className="font-bold tracking-tight text-ink">ShopAdmin<span className="text-brand-600"> Pro</span></span>
      </Link>
      <div className="flex-1 space-y-5 overflow-y-auto px-4 pb-4">
        {NAV.map((g) => {
          const items = g.items.filter((i) => allowed.includes(i.href));
          if (!items.length) return null;
          return (
            <div key={g.group}>
              <p className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">{g.group}</p>
              <div className="space-y-1">
                {items.map(({ href, label, icon: Icon }) => {
                  const active = current?.href === href;
                  return (
                    <Link key={href} href={href} onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${active ? "bg-white font-semibold text-ink shadow-soft" : "text-slate-500 hover:bg-white/70 hover:text-ink"}`}>
                      <span className={`grid size-8 place-items-center rounded-lg transition ${active ? "bg-brand-600 text-white shadow-tile" : "bg-white text-slate-400 shadow-sm"}`}>
                        <Icon size={16} />
                      </span>
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="m-4 hidden rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-500 p-4 text-white shadow-tile lg:block">
        <span className="grid size-8 place-items-center rounded-lg bg-white/20"><LifeBuoy size={16} /></span>
        <p className="mt-3 text-sm font-semibold">Need a custom feature?</p>
        <p className="text-xs text-white/80">Talk to the developer.</p>
        <a href="https://www.Jamiulalamrejon.com" target="_blank" rel="noopener noreferrer"
          className="mt-3 block rounded-lg bg-white py-2 text-center text-xs font-semibold text-brand-700 hover:bg-brand-50">Jamiulalamrejon.com</a>
      </div>
      <p className="px-7 py-4 text-[11px] text-slate-400 lg:hidden">
        Developed by <a href="https://www.Jamiulalamrejon.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-600">Jamiulalamrejon.com</a>
      </p>
    </nav>
  );

  return (
    <ToastProvider>
      <div className="min-h-screen lg:pl-64">
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">{sidebar}</aside>
        {open && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
            <aside className="relative h-full w-[82%] max-w-xs overflow-y-auto bg-page pb-safe">
              <button className="btn-ghost absolute top-5 right-3 size-9 p-0" onClick={() => setOpen(false)} aria-label="Close menu"><X size={18} /></button>
              {sidebar}
            </aside>
          </div>
        )}

        <header className="sticky top-0 z-20 bg-page/85 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3 backdrop-blur sm:px-8 sm:pb-4">
          <div className="flex items-center gap-3">
            <button className="btn-ghost size-10 rounded-xl bg-white p-0 shadow-soft lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
            <div className="min-w-0">
              <p className="text-xs text-slate-400">Pages <span className="mx-1">/</span><span className="text-ink">{current?.label ?? "Dashboard"}</span></p>
              <p className="truncate text-base font-semibold text-ink">{current?.label ?? "Dashboard"}</p>
            </div>
            <div className="ml-auto flex items-center gap-1 sm:gap-2">
              <button onClick={() => setMobileSearch(!mobileSearch)} className="btn-ghost size-10 rounded-full p-0 md:hidden" aria-label="Search" aria-expanded={mobileSearch}><Search size={18} /></button>
              <form onSubmit={onSearch} className="relative hidden md:block">
                <Search size={15} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400" />
                <input value={q} onChange={(e) => setQ(e.target.value)} maxLength={60} placeholder="Type here…" aria-label="Search"
                  className="input h-10 w-64 rounded-full border-transparent pl-9 shadow-soft" />
              </form>
              <div className="relative" ref={bellRef}>
                <button onClick={() => setBell(!bell)} className="btn-ghost relative size-10 rounded-full p-0" aria-label="Notifications" aria-expanded={bell}>
                  <Bell size={18} /><span className="absolute top-1.5 right-1.5 grid size-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">3</span>
                </button>
                {bell && (
                  <div className="card fixed inset-x-4 top-20 p-2 sm:absolute sm:inset-x-auto sm:top-auto sm:right-0 sm:mt-2 sm:w-80">
                    {NOTIFICATIONS.map((n) => (
                      <Link key={n.title} href={n.href} onClick={() => setBell(false)} className="block rounded-xl px-3 py-2.5 hover:bg-page">
                        <p className="text-sm text-ink">{n.title}</p><p className="text-xs text-slate-400">{n.time}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <div className="hidden items-center gap-2.5 pl-1 sm:flex">
                <Avatar name={user.name} size={36} />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-ink">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.roleLabel}</p>
                </div>
              </div>
              <button onClick={logout} className="btn-ghost size-10 rounded-full p-0" aria-label="Sign out" title="Sign out"><LogOut size={18} /></button>
            </div>
          </div>
          {mobileSearch && (
            <form onSubmit={onSearch} className="relative mt-3 md:hidden">
              <Search size={16} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400" />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} maxLength={60} placeholder="Search products, #order or INV-…" aria-label="Search"
                className="input rounded-full border-transparent pl-10 shadow-soft" />
            </form>
          )}
        </header>
        <main className="mx-auto max-w-[1400px] px-4 pb-28 sm:px-8 lg:pb-10">{children}</main>

        {/* Bottom tab bar (phones and tablets) */}
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/70 bg-white/95 backdrop-blur pb-safe lg:hidden" aria-label="Quick navigation">
          <div className="mx-auto grid max-w-md grid-cols-5">
            {tabs.map(({ href, label, icon: Icon }) => {
              const active = current?.href === href;
              return (
                <Link key={href} href={href} className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${active ? "text-brand-600" : "text-slate-400"}`}>
                  <span className={`grid h-7 w-12 place-items-center rounded-full transition ${active ? "bg-brand-50" : ""}`}><Icon size={19} /></span>
                  {label.split(" ")[0]}
                </Link>
              );
            })}
            <button onClick={() => setOpen(true)} className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-slate-400">
              <span className="grid h-7 w-12 place-items-center rounded-full"><Menu size={19} /></span>More
            </button>
          </div>
        </nav>
      </div>
    </ToastProvider>
  );
}
