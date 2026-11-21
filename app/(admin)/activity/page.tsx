// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
// Security audit trail: logins, failed attempts, SMS and AI usage.
import type { Metadata } from "next";
import { requirePage } from "@/lib/auth";
import { getAudit } from "@/lib/audit";
import { dateTime } from "@/lib/format";
import { Badge, Card, Forbidden, PageHeader, StatCard } from "@/components/ui";

export const metadata: Metadata = { title: "Activity log" };
export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const { allowed } = await requirePage("activity:view");
  if (!allowed) return <Forbidden />;
  const log = getAudit();
  return (
    <>
      <PageHeader title="Activity log" subtitle="Every sign-in, failed attempt and sensitive action is recorded here." />
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
        <StatCard label="Events" value={String(log.length)} />
        <StatCard label="Failed sign-ins" value={String(log.filter((l) => l.action.startsWith("login.failed")).length)} />
        <StatCard label="Blocked / rate limited" value={String(log.filter((l) => l.level === "danger").length)} />
      </div>
      <Card>
        <div className="-m-5 overflow-x-auto sm:-m-6">
          <table className="w-full">
            <thead className="bg-page"><tr>
              <th className="table-th">Time</th><th className="table-th">User</th><th className="table-th">Action</th><th className="table-th">Target</th><th className="table-th">IP address</th><th className="table-th">Level</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {log.map((l) => (
                <tr key={l.id}>
                  <td className="table-td text-slate-500">{dateTime(l.at)}</td>
                  <td className="table-td">{l.actor}</td>
                  <td className="table-td font-mono text-xs">{l.action}</td>
                  <td className="table-td max-w-xs truncate text-slate-600">{l.target}</td>
                  <td className="table-td font-mono text-xs">{l.ip}</td>
                  <td className="table-td"><Badge>{l.level}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
