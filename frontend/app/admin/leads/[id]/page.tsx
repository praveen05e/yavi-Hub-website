"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRequireAdmin } from "@/lib/adminAuth";
import { api } from "@/lib/api";

type Lead = {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  location: string | null;
  property_type: string | null;
  project_type: string | null;
  property_size: string | null;
  design_style: string | null;
  budget: string | null;
  timeline: string | null;
  requirements: string | null;
  lead_score: number;
  lead_status: string;
  lead_tier: string;
};

type Conversation = {
  id: string;
  summary: string | null;
  messages: { role: string; content: string; created_at: string }[];
};

const STATUSES = ["Enquired", "Pending", "Confirmed", "Completed", "Reject"];

export default function AdminLeadDetailPage() {
  const { token, checked } = useRequireAdmin();
  const params = useParams();
  const leadId = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!token) return;
    api.getLead(token, leadId).then((res) => setLead(res as Lead));
    api.getLeadConversations(token, leadId).then((res) => setConversations(res as Conversation[]));
  }, [token, leadId]);

  const updateStatus = async (status: string) => {
    if (!token || !lead) return;
    const oldLead = { ...lead };
    setLead({ ...lead, lead_status: status }); // Optimistic update
    
    setUpdating(true);
    try {
      const updated = await api.updateLeadStatus(token, leadId, status);
      setLead(updated as Lead);
    } catch (err) {
      setLead(oldLead); // Revert on failure
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (!checked || !token) return null;
  if (!lead) return <div className="px-6 py-8 sm:px-10">Loading…</div>;

  const fields: [string, string | null][] = [
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["Location", lead.location],
    ["Property Type", lead.property_type],
    ["Project Type", lead.project_type],
    ["Property Size", lead.property_size],
    ["Design Style", lead.design_style],
    ["Budget", lead.budget],
    ["Timeline", lead.timeline],
  ];

  return (
    <div className="px-6 py-8 sm:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl">{lead.name || "Unnamed Lead"}</h1>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            lead.lead_tier === "HOT" ? "bg-red-100 text-red-700" : lead.lead_tier === "WARM" ? "bg-amber-100 text-amber-700" : "bg-near-black/5"
          }`}
        >
          Lead Score: {lead.lead_score}/100 · {lead.lead_tier}
        </span>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            disabled={updating}
            onClick={() => updateStatus(s)}
            className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
              lead.lead_status === s ? "border-charcoal bg-charcoal text-ivory" : "border-near-black/20 hover:border-near-black/40"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-near-black/10 bg-white p-6">
          <h2 className="font-display text-lg">Project Information</h2>
          <dl className="mt-4 space-y-3 text-sm">
            {fields.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 border-b border-near-black/5 pb-2">
                <dt className="text-near-black/50">{label}</dt>
                <dd className="text-right text-near-black">{value || "—"}</dd>
              </div>
            ))}
          </dl>
          {lead.requirements && (
            <div className="mt-4">
              <div className="text-sm text-near-black/50">Requirements</div>
              <p className="mt-1 text-sm text-near-black">{lead.requirements}</p>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-near-black/10 bg-white p-6">
          <h2 className="font-display text-lg">Conversation</h2>
          {conversations.length === 0 && (
            <p className="mt-4 text-sm text-near-black/50">No chatbot conversation for this lead.</p>
          )}
          {conversations.map((c) => (
            <div key={c.id} className="mt-4">
              {c.summary && (
                <div className="mb-4 rounded-lg bg-cream p-3 text-sm text-near-black/80">{c.summary}</div>
              )}
              <div className="max-h-96 space-y-3 overflow-y-auto">
                {c.messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                        m.role === "user" ? "bg-charcoal text-ivory" : "bg-near-black/5 text-near-black"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
