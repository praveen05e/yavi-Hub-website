"use client";

import { useState } from "react";
import { useRequireAdmin } from "@/lib/adminAuth";
import { api } from "@/lib/api";

export default function SettingsPage() {
  const { token, checked } = useRequireAdmin();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setStatus("saving");
    setErrorMsg("");
    try {
      await api.changePassword(token, {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setStatus("success");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Failed to change password.");
    }
  };

  if (!checked || !token) return null;

  return (
    <div className="px-6 py-8 sm:px-10">
      <h1 className="font-display text-2xl">Settings</h1>
      <p className="mt-2 text-sm text-near-black/60">Manage your account settings.</p>

      <div className="mt-8 max-w-md rounded-xl border border-near-black/10 bg-white p-6">
        <h2 className="font-display text-lg">Change Password</h2>
        
        {status === "success" && (
          <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">
            Password successfully updated!
          </div>
        )}
        {status === "error" && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm text-near-black/70">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-near-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-charcoal"
            />
          </div>
          <div>
            <label className="block text-sm text-near-black/70">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-near-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-charcoal"
            />
          </div>
          <button
            type="submit"
            disabled={status === "saving"}
            className="mt-6 w-full rounded-lg bg-charcoal px-4 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-near-black disabled:opacity-70"
          >
            {status === "saving" ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
