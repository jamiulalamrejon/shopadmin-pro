// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
"use client";
import { createContext, useCallback, useContext, useState } from "react";
import { Check, TriangleAlert } from "lucide-react";

type Toast = { id: number; text: string; kind: "success" | "error" };
const Ctx = createContext<(text: string, kind?: Toast["kind"]) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((text: string, kind: Toast["kind"] = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);
  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-24 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:items-end" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-white shadow-lg ${t.kind === "error" ? "bg-red-600" : "bg-slate-900"}`}>
            {t.kind === "error" ? <TriangleAlert size={16} /> : <Check size={16} />} {t.text}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);
