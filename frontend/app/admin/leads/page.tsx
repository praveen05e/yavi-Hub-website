"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRequireAdmin } from "@/lib/adminAuth";
import { api } from "@/lib/api";
import { Trash2 } from "lucide-react";

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

  const exportCSV = () => {
    if (leads.length === 0) return;
    const headers = ["Name", "Phone", "Email", "Location", "Project", "Style", "Budget", "Tier", "Status", "Date"];
    const rows = leads.map(l => [
      l.name || "",
      l.phone || "",
      (l as any).email || "",
      (l as any).location || "",
      l.project_type || "",
      l.design_style || "",
      l.budget || "",
      l.lead_tier,
      l.lead_status,
      new Date(l.created_at).toLocaleDateString()
    ].map(field => `"${field}"`).join(","));
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `yavi_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!checked || !token) return null;

  return (
    <div className="px-6 py-8 sm:px-10 pb-20 sm:pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl">Leads Overview</h1>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white border border-near-black/10 px-4 py-2 text-sm">
            <span className="text-near-black/50">Total:</span> <span className="font-bold">{leads.length}</span>
          </div>
          <button 
            onClick={exportCSV}
            className="rounded-lg bg-charcoal text-ivory px-4 py-2 text-sm font-medium hover:bg-charcoal/90 transition-colors"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          placeholder="Search name, phone, email..."
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
        <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
          <thead className="border-b border-near-black/10 text-xs uppercase text-near-black/50 bg-near-black/5">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Budget</th>
              <th className="px-4 py-3">Style</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={9} className="px-4 py-6 text-center text-near-black/50">Loading…</td></tr>
            )}
            {!loading && leads.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-6 text-center text-near-black/50">No leads found.</td></tr>
            )}
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-near-black/5 last:border-0 hover:bg-near-black/[0.02]">
                <td className="px-4 py-3">
                  <Link href={`/admin/leads/${lead.id}`} className="font-medium text-near-black hover:text-bronze underline underline-offset-2">
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
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : lead.lead_tier === "WARM"
                        ? "bg-amber-100 text-amber-700 border border-amber-200"
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
                    className={`rounded-lg border px-2.5 py-1 text-xs font-medium outline-none cursor-pointer transition-colors ${
                      lead.lead_status === "Confirmed"
                        ? "bg-green-50 border-green-200 text-green-700 focus:border-green-400"
                        : lead.lead_status === "Reject"
                        ? "bg-red-50 border-red-200 text-red-700 focus:border-red-400"
                        : lead.lead_status === "Completed"
                        ? "bg-blue-50 border-blue-200 text-blue-700 focus:border-blue-400"
                        : lead.lead_status === "Pending"
                        ? "bg-amber-50 border-amber-200 text-amber-700 focus:border-amber-400"
                        : "bg-near-black/5 border-transparent text-near-black/70 focus:border-near-black/20"
                    }`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s} className="bg-white text-near-black font-normal">
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-near-black/50">
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={async () => {
                      if (
                        confirm(
                          `Are you sure you want to delete lead "${
                            lead.name || "Unnamed"
                          }"? This will permanently delete the lead and all associated chat logs, freeing up Supabase database storage.`
                        )
                      ) {
                        try {
                          await api.deleteLead(token, lead.id);
                          setLeads((prev) => prev.filter((l) => l.id !== lead.id));
                        } catch (err) {
                          alert("Failed to delete lead");
                        }
                      }
                    }}
                    title="Delete Lead"
                    className="inline-flex items-center gap-1.5 justify-center px-2 py-1.5 rounded bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors border border-red-100 text-xs font-medium"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
