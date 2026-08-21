import { siteConfig } from "@/data/siteConfig";

const BASE = siteConfig.apiBaseUrl;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    let detail = "Something went wrong. Please try again.";
    try {
      const body = await res.json();
      detail = body.detail || detail;
    } catch {
      /* fall through to default message — never leak raw errors */
    }
    throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
  }
  return res.json();
}

export const api = {
  // Public
  getProjects: (category?: string) =>
    request(`/api/projects${category && category !== "All" ? `?category=${encodeURIComponent(category)}` : ""}`),
  getProject: (slug: string) => request(`/api/projects/${slug}`),
  createLead: (payload: Record<string, unknown>) =>
    request(`/api/leads`, { method: "POST", body: JSON.stringify(payload) }),
  sendChatMessage: (payload: { session_id: string; message: string; context?: Record<string, unknown> }) =>
    request(`/api/chatbot/message`, { method: "POST", body: JSON.stringify(payload) }),

  // Admin
  login: (email: string, password: string) =>
    request<{ access_token: string }>(`/api/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  getDashboard: (token: string) =>
    request(`/api/admin/dashboard`, { headers: { Authorization: `Bearer ${token}` } }),
  getLeads: (token: string, params: string = "") =>
    request(`/api/admin/leads${params}`, { headers: { Authorization: `Bearer ${token}` } }),
  getLead: (token: string, id: string) =>
    request(`/api/admin/leads/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
  getLeadConversations: (token: string, id: string) =>
    request(`/api/admin/leads/${id}/conversations`, { headers: { Authorization: `Bearer ${token}` } }),
  updateLeadStatus: (token: string, id: string, lead_status: string) =>
    request(`/api/admin/leads/${id}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ lead_status }),
    }),
  changePassword: (token: string, payload: Record<string, string>) =>
    request(`/api/auth/change-password`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    }),
};
