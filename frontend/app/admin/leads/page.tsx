"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRequireAdmin } from "@/lib/adminAuth";
import { api } from "@/lib/api";

type Lead = {
  id: string;
  name: string | null;
  phone: string | null;
  project_type: string | null;
  budget: string | null;
  design_style: string | null;
  lead_score: number;
  lead_status: string;
  lead_tier: string;
  created_at: string;
};

const STATUSES = ["Enquired", "Pending", "Confirmed", "Completed", "Reject"];

export default function AdminLeadsPage() {
  const { token, checked } = useRequireAdmin();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (search) params.set("search", search);
    api
      .getLeads(token, params.toString() ? `?${params.toString()}` : "")
      .then((res) => setLeads((res as any).items))
      .finally(() => setLoading(false));
  }, [token, status, search]);

  if (!checked || !token) return null;

  return (
    <div className="px-6 py-8 sm:px-10">
      <h1 className="font-display text-2xl">Leads</h1>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          placeholder="Search name, phone, email, location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs rounded-lg border border-near-black/15 bg-white px-3 py-2 text-sm outline-none focus-visible:border-bronze"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatus("")}
            className={`rounded-full border px-3 py-1.5 text-xs ${status === "" ? "border-charcoal bg-charcoal text-ivory" : "border-near-black/20"}`}
          >
            All
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-full border px-3 py-1.5 text-xs ${status === s ? "border-charcoal bg-charcoal text-ivory" : "border-near-black/20"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-near-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-near-black/10 text-xs uppercase text-near-black/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Budget</th>
              <th className="px-4 py-3">Style</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={8} className="px-4 py-6 text-center text-near-black/50">Loading…</td></tr>
            )}
            {!loading && leads.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-6 text-center text-near-black/50">No leads found.</td></tr>
            )}
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-near-black/5 last:border-0 hover:bg-near-black/[0.02]">
                <td className="px-4 py-3">
                  <Link href={`/admin/leads/${lead.id}`} className="font-medium text-near-black hover:text-bronze">
                    {lead.name || "—"}
                  </Link>
                </td>
                <td className="px-4 py-3 text-near-black/70">{lead.phone || "—"}</td>
                <td className="px-4 py-3 text-near-black/70">{lead.project_type || "—"}</td>
                <td className="px-4 py-3 text-near-black/70">{lead.budget || "—"}</td>
                <td className="px-4 py-3 text-near-black/70">{lead.design_style || "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      lead.lead_tier === "HOT"
                        ? "bg-red-100 text-red-700"
                        : lead.lead_tier === "WARM"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-near-black/5 text-near-black/60"
                    }`}
                  >
                    {lead.lead_score} · {lead.lead_tier}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={lead.lead_status}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      try {
                        await api.updateLeadStatus(token, lead.id, newStatus);
                        setLeads((prev) =>
                          prev.map((l) => (l.id === lead.id ? { ...l, lead_status: newStatus } : l))
                        );
                      } catch (err) {
                        alert("Failed to update status");
                      }
                    }}
                    className="rounded-lg border border-near-black/15 bg-white px-2 py-1 text-xs outline-none focus:border-charcoal cursor-pointer"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-near-black/50">
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
