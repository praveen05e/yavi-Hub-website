"use client";

import { useEffect, useState } from "react";
import { useRequireAdmin } from "@/lib/adminAuth";
import { api } from "@/lib/api";

type Stats = {
  total_leads: number;
  enquired_leads: number;
  pending_leads: number;
  confirmed_leads: number;
  completed_leads: number;
  reject_leads: number;
  hot_leads: number;
};

export default function AdminDashboardPage() {
  const { token, checked } = useRequireAdmin();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    api
      .getDashboard(token)
      .then((res) => setStats(res as Stats))
      .catch(() => setError("Could not load dashboard stats."));
  }, [token]);

  if (!checked || !token) return null;

  const cards = stats
    ? [
        { label: "Total Leads", value: stats.total_leads },
        { label: "Enquired", value: stats.enquired_leads },
        { label: "Pending", value: stats.pending_leads },
        { label: "Confirmed", value: stats.confirmed_leads },
        { label: "Completed", value: stats.completed_leads },
        { label: "Reject", value: stats.reject_leads },
        { label: "Hot Leads", value: stats.hot_leads },
      ]
    : [];

  return (
    <div className="px-6 py-8 sm:px-10">
      <h1 className="font-display text-2xl">Dashboard</h1>
      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-near-black/10 bg-white p-5">
            <div className="text-xs uppercase tracking-wide text-near-black/50">{c.label}</div>
            <div className="mt-2 font-display text-3xl">{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
