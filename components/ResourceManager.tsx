// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
// Reusable table with search, filter, pagination, add/edit/delete and safe CSV export.
// Demo note: changes live in browser memory. Connect create/update/delete to your API + database.
"use client";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Download, LoaderCircle, Pencil, Plus, Trash2, WandSparkles } from "lucide-react";
import Modal from "./Modal";
import { useToast } from "./Toast";
import { useAi, type AiTask } from "./useAi";
import { isValidPhone } from "@/lib/phone";

export type Field = {
  key: string;
  label: string;
  type?: "text" | "number" | "email" | "tel" | "select" | "textarea" | "date";
  options?: string[];
  required?: boolean;
  full?: boolean;
  ai?: { task: AiTask; from: string };
};
export type Column<T> = { key: string; label: string; render?: (row: T) => React.ReactNode; align?: "right" };
type Row = { id: string } & Record<string, unknown>;

const PAGE_SIZE = 10;

// Cells starting with = + - @ can run formulas in Excel (CSV injection) - prefix them.
function csvCell(v: unknown) {
  let s = String(v ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
}

export default function ResourceManager<T extends Row>(props: {
  entity: string;
  rows: T[];
  columns: Column<T>[];
  fields: Field[];
  searchKeys: (keyof T & string)[];
  filter?: { key: keyof T & string; label: string; options: string[] };
  canEdit: boolean;
  defaults: Partial<T>;
  initialQuery?: string;
  toolbar?: React.ReactNode;
  /** Extra per-row buttons. `update` patches the row (e.g. mark invoice paid). */
  rowActions?: (row: T, update: (patch: Partial<T>) => void) => React.ReactNode;
}) {
  const { entity, columns, fields, searchKeys, filter, canEdit, defaults } = props;
  const toast = useToast();
  const { generate, loading: aiLoading } = useAi();
  const [rows, setRows] = useState<T[]>(props.rows);
  const [query, setQuery] = useState(props.initialQuery ?? "");
  const [filterVal, setFilterVal] = useState("All");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<T | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleting, setDeleting] = useState<T | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) =>
      (!q || searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(q))) &&
      (!filter || filterVal === "All" || r[filter.key] === filterVal));
  }, [rows, query, filterVal, searchKeys, filter]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  function openForm(row: T | null) {
    const base = (row ?? defaults) as Record<string, unknown>;
    setForm(Object.fromEntries(fields.map((f) => [f.key, String(base[f.key] ?? (f.type === "select" ? f.options?.[0] ?? "" : ""))])));
    setErrors({});
    setEditing(row ?? ({ id: "" } as T));
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    const values: Record<string, unknown> = {};
    for (const f of fields) {
      const raw = (form[f.key] ?? "").trim().slice(0, f.type === "textarea" ? 8000 : 200);
      if (f.required && !raw) errs[f.key] = `Enter ${f.label.toLowerCase()}`;
      if (f.type === "number") {
        const n = Number(raw);
        if (raw && (!Number.isFinite(n) || n < 0)) errs[f.key] = "Enter a positive number";
        values[f.key] = raw ? n : 0;
      } else if (f.type === "email" && raw && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
        errs[f.key] = "Enter a valid email";
      } else if (f.type === "tel" && raw && !isValidPhone(raw)) {
        errs[f.key] = "Enter a valid phone, e.g. +14155550123";
      } else {
        values[f.key] = raw;
      }
    }
    setErrors(errs);
    if (Object.keys(errs).length) return;

    if (editing?.id) {
      setRows((rs) => rs.map((r) => (r.id === editing.id ? { ...r, ...values } : r)));
      toast(`${entity} updated`);
    } else {
      setRows((rs) => [{ ...defaults, ...values, id: crypto.randomUUID() } as T, ...rs]);
      toast(`${entity} added`);
      setPage(1);
    }
    setEditing(null);
  }

  async function aiFill(f: Field) {
    if (!f.ai) return;
    const source = form[f.ai.from]?.trim();
    if (!source) return setErrors((e) => ({ ...e, [f.ai!.from]: "Fill this first so AI knows what to write about" }));
    try {
      const { text } = await generate(f.ai.task, source);
      setForm((v) => ({ ...v, [f.key]: text }));
    } catch (err) {
      toast(err instanceof Error ? err.message : "AI failed", "error");
    }
  }

  function exportCsv() {
    const header = columns.map((c) => csvCell(c.label)).join(",");
    const body = filtered.map((r) => columns.map((c) => csvCell(r[c.key])).join(",")).join("\n");
    const blob = new Blob(["﻿" + header + "\n" + body], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${entity.toLowerCase()}s-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 p-4 sm:p-5">
        <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder={`Search ${entity.toLowerCase()}s`} className="input w-full rounded-full sm:h-9 sm:max-w-xs" maxLength={60} />
        {filter && (
          <select value={filterVal} onChange={(e) => { setFilterVal(e.target.value); setPage(1); }} className="input w-auto flex-1 sm:h-9 sm:flex-none" aria-label={filter.label}>
            <option>All</option>
            {filter.options.map((o) => <option key={o}>{o}</option>)}
          </select>
        )}
        <div className="ml-auto flex gap-2">
          {props.toolbar}
          <button onClick={exportCsv} className="btn-secondary" aria-label="Export CSV"><Download size={16} /><span className="hidden sm:inline">Export</span></button>
          {canEdit && <button onClick={() => openForm(null)} className="btn-primary"><Plus size={16} /> <span className="sm:hidden">Add</span><span className="hidden sm:inline">Add {entity.toLowerCase()}</span></button>}
        </div>
      </div>

      {/* Phones: one card per row */}
      <ul className="space-y-3 px-4 pb-2 md:hidden">
        {visible.map((r) => {
          const [first, ...rest] = columns;
          return (
            <li key={r.id} className="rounded-2xl border border-slate-100 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 text-sm font-semibold text-ink">{first.render ? first.render(r) : String(r[first.key] ?? "")}</div>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5">
                {rest.map((c) => (
                  <div key={c.key} className="min-w-0">
                    <dt className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">{c.label}</dt>
                    <dd className="mt-0.5 truncate text-sm text-slate-700">{c.render ? c.render(r) : String(r[c.key] ?? "")}</dd>
                  </div>
                ))}
              </dl>
              {(canEdit || props.rowActions) && (
                <div className="mt-3 flex flex-wrap items-center justify-end gap-1 border-t border-slate-100 pt-3">
                  {props.rowActions?.(r, (patch) => setRows((rs) => rs.map((x) => (x.id === r.id ? { ...x, ...patch } : x))))}
                  {canEdit && <>
                    <button onClick={() => openForm(r)} className="btn-ghost h-9 px-3 text-xs"><Pencil size={15} /> Edit</button>
                    <button onClick={() => setDeleting(r)} className="btn-ghost h-9 px-3 text-xs text-red-500 hover:bg-red-50"><Trash2 size={15} /> Delete</button>
                  </>}
                </div>
              )}
            </li>
          );
        })}
        {!visible.length && <li className="py-10 text-center text-sm text-slate-500">No {entity.toLowerCase()}s match your search.</li>}
      </ul>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead className="border-b border-slate-100">
            <tr>
              {columns.map((c) => <th key={c.key} className={`table-th ${c.align === "right" ? "text-right" : ""}`}>{c.label}</th>)}
              {(canEdit || props.rowActions) && <th className="table-th text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {visible.map((r) => (
              <tr key={r.id} className="hover:bg-page/60">
                {columns.map((c) => (
                  <td key={c.key} className={`table-td ${c.align === "right" ? "text-right" : ""}`}>{c.render ? c.render(r) : String(r[c.key] ?? "")}</td>
                ))}
                {(canEdit || props.rowActions) && (
                  <td className="table-td text-right">
                    {props.rowActions?.(r, (patch) => setRows((rs) => rs.map((x) => (x.id === r.id ? { ...x, ...patch } : x))))}
                    {canEdit && <>
                    <button onClick={() => openForm(r)} className="btn-ghost size-8 p-0" aria-label="Edit"><Pencil size={15} /></button>
                    <button onClick={() => setDeleting(r)} className="btn-ghost size-8 p-0 text-red-500 hover:bg-red-50" aria-label="Delete"><Trash2 size={15} /></button>
                    </>}
                  </td>
                )}
              </tr>
            ))}
            {!visible.length && (
              <tr><td colSpan={columns.length + 1} className="px-4 py-12 text-center text-sm text-slate-500">No {entity.toLowerCase()}s match your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2 text-sm text-slate-500 sm:py-3">
        <span>{filtered.length} {entity.toLowerCase()}{filtered.length === 1 ? "" : "s"}</span>
        <div className="flex items-center gap-1">
          <button className="btn-ghost size-10 p-0 sm:size-8" disabled={current === 1} onClick={() => setPage(current - 1)} aria-label="Previous page"><ChevronLeft size={16} /></button>
          <span className="px-2">{current} / {pages}</span>
          <button className="btn-ghost size-10 p-0 sm:size-8" disabled={current === pages} onClick={() => setPage(current + 1)} aria-label="Next page"><ChevronRight size={16} /></button>
        </div>
      </div>

      <Modal open={!!editing} title={editing?.id ? `Edit ${entity.toLowerCase()}` : `Add ${entity.toLowerCase()}`} onClose={() => setEditing(null)} wide={fields.length > 6}>
        <form onSubmit={save} noValidate className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.key} className={f.full || f.type === "textarea" ? "sm:col-span-2" : ""}>
              <div className="flex items-center justify-between">
                <label className="label" htmlFor={`f-${f.key}`}>{f.label}{f.required && " *"}</label>
                {f.ai && (
                  <button type="button" onClick={() => aiFill(f)} disabled={aiLoading} className="mb-1 inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700">
                    {aiLoading ? <LoaderCircle size={13} className="animate-spin" /> : <WandSparkles size={13} />} Write with AI
                  </button>
                )}
              </div>
              {f.type === "select" ? (
                <select id={`f-${f.key}`} className="input" value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}>
                  {f.options?.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : f.type === "textarea" ? (
                <textarea id={`f-${f.key}`} rows={6} className="input" value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
              ) : (
                <input id={`f-${f.key}`} type={f.type ?? "text"} className="input" value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
              )}
              {errors[f.key] && <p className="mt-1 text-xs text-red-600">{errors[f.key]}</p>}
            </div>
          ))}
          <div className="grid grid-cols-2 gap-2 sm:col-span-2 sm:flex sm:justify-end">
            <button type="button" onClick={() => setEditing(null)} className="btn-secondary">Cancel</button>
            <button className="btn-primary">Save</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleting} title={`Delete ${entity.toLowerCase()}`} onClose={() => setDeleting(null)}>
        <p className="text-sm text-slate-600">This removes the {entity.toLowerCase()} permanently. You can&apos;t undo this.</p>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:justify-end">
          <button onClick={() => setDeleting(null)} className="btn-secondary">Cancel</button>
          <button onClick={() => { setRows((rs) => rs.filter((r) => r.id !== deleting?.id)); setDeleting(null); toast(`${entity} deleted`); }} className="btn-danger">Delete</button>
        </div>
      </Modal>
    </div>
  );
}
