// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
// Shared layout for every signed-in page. Re-checks the session on the server.
import { redirect } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import { getSession } from "@/lib/auth";
import { can, ROLE_LABELS, ROUTE_PERMISSIONS } from "@/lib/rbac";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const allowed = ROUTE_PERMISSIONS.filter((r) => can(session.role, r.permission)).map((r) => r.prefix);
  return (
    <AdminShell user={{ name: session.name, email: session.email, roleLabel: ROLE_LABELS[session.role] }} allowed={allowed}>
      {children}
    </AdminShell>
  );
}
