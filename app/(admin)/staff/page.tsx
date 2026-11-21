// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import { requirePage } from "@/lib/auth";
import { PERMISSIONS, ROLE_LABELS, ROLE_PERMISSIONS, type Role } from "@/lib/rbac";
import { publicStaff } from "@/lib/demo-data";
import { Card, Forbidden, PageHeader } from "@/components/ui";
import StaffClient from "./StaffClient";

export const metadata: Metadata = { title: "Staff and roles" };

export default async function StaffPage() {
  const { allowed } = await requirePage("staff:manage");
  if (!allowed) return <Forbidden />;
  const roles = Object.keys(ROLE_LABELS) as Role[];
  return (
    <>
      <PageHeader title="Staff and roles" subtitle="Who can sign in to the admin panel and what each role can do." />
      <StaffClient rows={publicStaff()} />
      <Card title="Role permissions" className="mt-6">
        <div className="-mx-5 overflow-x-auto sm:-mx-6">
          <table className="w-full">
            <thead><tr className="border-y border-slate-100 bg-page">
              <th className="table-th">Permission</th>
              {roles.map((r) => <th key={r} className="table-th text-center">{ROLE_LABELS[r]}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {PERMISSIONS.map((p) => (
                <tr key={p}>
                  <td className="table-td font-mono text-xs">{p}</td>
                  {roles.map((r) => (
                    <td key={r} className="table-td text-center">
                      {ROLE_PERMISSIONS[r].includes(p) ? <Check size={16} className="inline text-emerald-600" /> : <Minus size={16} className="inline text-slate-300" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
