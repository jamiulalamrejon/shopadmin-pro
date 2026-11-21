// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
// Small presentational building blocks shared by every page.
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

/** Page intro. The page title itself is shown in the top bar breadcrumb, so it's screen-reader only here. */
export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 sm:mb-6">
      <h1 className="sr-only">{title}</h1>
      {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      {actions && <div className="flex w-full flex-wrap gap-2 sm:ml-auto sm:w-auto [&>a]:flex-1 [&>button]:flex-1 sm:[&>a]:flex-none sm:[&>button]:flex-none">{actions}</div>}
    </div>
  );
}

export function Card({ title, subtitle, action, children, className = "", padded = true }: {
  title?: string; subtitle?: React.ReactNode; action?: React.ReactNode; children: React.ReactNode; className?: string; padded?: boolean;
}) {
  return (
    <section className={`card ${padded ? "p-5 sm:p-6" : ""} ${className}`}>
      {(title || action) && (
        <div className={`mb-5 flex flex-wrap items-start justify-between gap-2 ${padded ? "" : "px-5 pt-5 sm:px-6 sm:pt-6"}`}>
          <div>
            {title && <h2 className="text-base font-semibold">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Trend({ value }: { value: number }) {
  return <span className={`text-xs font-semibold ${value >= 0 ? "text-emerald-500" : "text-red-500"}`}>{value >= 0 ? "+" : ""}{value}%</span>;
}

export function StatCard({ label, value, change, icon }: { label: string; value: string; change?: number; icon?: React.ReactNode }) {
  return (
    <div className="card flex items-start justify-between gap-2 p-4 sm:items-center sm:gap-3 sm:p-5">
      <div className="min-w-0">
        <p className="truncate text-xs text-slate-400 sm:text-sm">{label}</p>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
          <span className="text-lg font-bold text-ink sm:text-2xl">{value}</span>
          {change !== undefined && <Trend value={change} />}
        </p>
      </div>
      {icon && <span className="tile size-8 rounded-lg sm:size-10 sm:rounded-xl [&>svg]:size-4 sm:[&>svg]:size-[18px]">{icon}</span>}
    </div>
  );
}

const TONES: Record<string, string> = {
  green: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  blue: "bg-brand-50 text-brand-600",
  red: "bg-red-50 text-red-500",
  violet: "bg-violet-50 text-violet-600",
  gray: "bg-slate-100 text-slate-500",
};

const STATUS_TONE: Record<string, keyof typeof TONES> = {
  Delivered: "green", Active: "green", Published: "green", Sent: "green", Paid: "green", Approved: "green", Received: "green",
  Resolved: "green", Completed: "green", Recovered: "green", "Stock in": "green", info: "blue",
  Pending: "amber", Scheduled: "amber", Queued: "amber", Paused: "amber", warning: "amber", Unpaid: "amber", "On hold": "amber",
  Ordered: "blue", Processing: "blue", Shipped: "blue", "In transit": "blue", "Out for delivery": "blue", Open: "blue", "In progress": "blue",
  "Reminder sent": "blue", Transfer: "violet", VIP: "violet", Planning: "violet", Medium: "blue", High: "amber",
  Cancelled: "red", Returned: "red", Blocked: "red", Failed: "red", Suspended: "red", Overdue: "red", Exception: "red", Urgent: "red",
  "Stock out": "red", danger: "red", "Not contacted": "gray", Refunded: "gray", Hidden: "gray", Closed: "gray", Low: "gray",
  Expired: "gray", Archived: "gray", Draft: "gray", "Label created": "gray", Adjustment: "gray",
};

export function Badge({ children, tone }: { children: React.ReactNode; tone?: keyof typeof TONES }) {
  const t = tone ?? STATUS_TONE[String(children)] ?? "gray";
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONES[t]}`}>{children}</span>;
}

export function Progress({ value, tone = "blue" }: { value: number; tone?: "blue" | "green" | "amber" | "red" }) {
  const color = { blue: "bg-brand-500", green: "bg-emerald-500", amber: "bg-amber-500", red: "bg-red-500" }[tone];
  return (
    <div className="h-1.5 w-full rounded-full bg-slate-100">
      <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function Forbidden() {
  return (
    <div className="card mx-auto mt-10 max-w-md p-8 text-center">
      <span className="tile mx-auto"><ShieldCheck size={20} /></span>
      <h1 className="mt-4 text-lg font-semibold">You don&apos;t have access to this page</h1>
      <p className="mt-1 text-sm text-slate-500">Ask a super admin to update your role.</p>
      <Link href="/dashboard" className="btn-primary mt-5">Back to dashboard</Link>
    </div>
  );
}

const AVATAR_COLORS = ["bg-brand-500", "bg-emerald-500", "bg-amber-500", "bg-violet-500", "bg-rose-500", "bg-cyan-500"];

export function Avatar({ name, size = 32, ring = false }: { name: string; size?: number; ring?: boolean }) {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  const color = AVATAR_COLORS[[...name].reduce((s, c) => s + c.charCodeAt(0), 0) % AVATAR_COLORS.length];
  return (
    <span title={name} style={{ width: size, height: size }}
      className={`inline-grid shrink-0 place-items-center rounded-full text-[11px] font-semibold text-white ${color} ${ring ? "ring-2 ring-white" : ""}`}>
      {initials}
    </span>
  );
}

export function AvatarStack({ names, max = 4 }: { names: string[]; max?: number }) {
  return (
    <div className="flex -space-x-2">
      {names.slice(0, max).map((n) => <Avatar key={n} name={n} size={28} ring />)}
      {names.length > max && <span className="grid size-7 place-items-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-500 ring-2 ring-white">+{names.length - max}</span>}
    </div>
  );
}

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-amber-400" aria-label={`${rating} out of 5`}>
      {"★".repeat(rating)}<span className="text-slate-200">{"★".repeat(5 - rating)}</span>
    </span>
  );
}
