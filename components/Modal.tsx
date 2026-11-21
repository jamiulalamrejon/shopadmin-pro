// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
"use client";
import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ open, title, onClose, children, wide }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 sm:items-center sm:overflow-y-auto sm:p-4" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => e.stopPropagation()}
        className={`flex max-h-[92dvh] w-full flex-col rounded-t-3xl bg-white shadow-2xl sm:max-h-none sm:rounded-2xl ${wide ? "sm:max-w-2xl" : "sm:max-w-lg"}`}>
        <span className="mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-slate-200 sm:hidden" aria-hidden />
        <div className="flex items-center justify-between shrink-0 border-b border-slate-100 px-5 py-3.5 sm:px-6 sm:py-4">
          <h2 className="font-semibold">{title}</h2>
          <button onClick={onClose} className="btn-ghost size-8 p-0" aria-label="Close"><X size={18} /></button>
        </div>
        <div className="overflow-y-auto p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:overflow-visible sm:p-6">{children}</div>
      </div>
    </div>
  );
}
