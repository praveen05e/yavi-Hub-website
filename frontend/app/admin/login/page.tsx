"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { saveToken } from "@/lib/adminAuth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.login(email, password);
      saveToken((res as any).access_token);
      router.push("/admin/dashboard");
    } catch {
      setError("Incorrect email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl bg-ivory p-8">
        <div className="font-display text-2xl text-near-black">YAVI Admin</div>
        <p className="mt-1 text-sm text-near-black/55">Sign in to manage leads and conversations.</p>

        <label className="mt-6 block text-sm">
          <span className="mb-1.5 block text-near-black/70">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-near-black/15 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-bronze"
          />
        </label>
        <label className="mt-4 block text-sm">
          <span className="mb-1.5 block text-near-black/70">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-near-black/15 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-bronze"
          />
        </label>

        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-charcoal py-3 text-sm font-medium text-ivory disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
