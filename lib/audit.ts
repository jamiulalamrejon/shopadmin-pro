// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
// In-memory audit log (resets when the server restarts). Swap for a DB table in production.
import { demoAudit, type AuditEntry } from "./demo-data";

const store: AuditEntry[] = [...demoAudit];

export function audit(entry: Omit<AuditEntry, "id" | "at">) {
  store.unshift({ ...entry, id: crypto.randomUUID(), at: new Date().toISOString() });
  if (store.length > 500) store.length = 500;
}

export function getAudit(): AuditEntry[] {
  return store.slice(0, 200);
}
