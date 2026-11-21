// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
"use client";
import { useState } from "react";
import { Eye, EyeOff, LoaderCircle, Lock } from "lucide-react";

export default function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("Enter your email and password.");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign-in failed.");
      window.location.assign(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="username" className="input" value={email}
          onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" maxLength={120} />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <div className="relative">
          <input id="password" type={show ? "text" : "password"} autoComplete="current-password" className="input pr-10"
            value={password} onChange={(e) => setPassword(e.target.value)} maxLength={128} />
          <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 grid w-10 place-items-center text-slate-400 hover:text-slate-600">
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <button className="btn-primary h-11 w-full" disabled={loading}>
        {loading ? <LoaderCircle size={16} className="animate-spin" /> : <Lock size={16} />} Sign in
      </button>
    </form>
  );
}
