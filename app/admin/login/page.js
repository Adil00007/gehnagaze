"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError((await res.json()).error || "Login failed");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink text-ivory px-6">
      <form onSubmit={submit} className="w-full max-w-sm">
        <div className="font-display text-3xl mb-2 text-center">
          Gehna <span className="text-gold-bright">Gaze</span>
        </div>
        <p className="text-center text-ivory/50 text-sm mb-10">Admin panel</p>

        <label className="block mb-6">
          <span className="text-xs text-ivory/50 mb-1.5 block">Admin password</span>
          <input
            type="password"
            autoFocus
            className="w-full bg-transparent border border-ivory/30 px-4 py-2.5 outline-none focus:border-gold-bright"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <p className="text-sm text-rose mb-4">{error}</p>}

        <button type="submit" disabled={loading} className="btn btn-gold w-full">
          {loading ? "Checking…" : "Log in"}
        </button>
      </form>
    </div>
  );
}
