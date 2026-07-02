"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Trash2, RefreshCw, ShieldCheck, ShieldOff } from "lucide-react";

interface Props {
  userId: string;
  currentPlan: string;
  currentPlanExpiresAt: string | null;
  currentRole: string;
}

export function UserActionsPanel({ userId, currentPlan, currentPlanExpiresAt, currentRole }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [plan, setPlan] = useState(currentPlan);
  const [expiresAt, setExpiresAt] = useState(
    currentPlanExpiresAt ? currentPlanExpiresAt.slice(0, 10) : ""
  );

  async function apiCall(url: string, method: string, body?: object) {
    setError(null);
    setSuccess(null);
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Something went wrong");
    return data;
  }

  function run(fn: () => Promise<void>) {
    startTransition(async () => {
      try {
        await fn();
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    });
  }

  function handleSubscription(e: React.FormEvent) {
    e.preventDefault();
    run(async () => {
      await apiCall(`/api/admin/users/${userId}/subscription`, "PATCH", {
        plan,
        planExpiresAt: expiresAt || null,
      });
      setSuccess("Subscription updated.");
    });
  }

  function handleRoleToggle() {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    if (!confirm(`Change role to ${newRole}?`)) return;
    run(async () => {
      await apiCall(`/api/admin/users/${userId}`, "PATCH", { role: newRole });
      setSuccess(`Role updated to ${newRole}.`);
    });
  }

  function handleResetTokens() {
    if (!confirm("Force this user to re-authenticate? Their current session will be invalidated.")) return;
    run(async () => {
      await apiCall(`/api/admin/users/${userId}/reset-tokens`, "POST");
      setSuccess("Tokens revoked. User will be signed out on next request.");
    });
  }

  function handleDelete() {
    if (!confirm("Permanently delete this user and all their data? This cannot be undone.")) return;
    run(async () => {
      await apiCall(`/api/admin/users/${userId}`, "DELETE");
      router.push("/admin/users");
    });
  }

  return (
    <div className="space-y-4">
      {(error || success) && (
        <div className={`text-xs px-3 py-2 rounded-md ${error ? "bg-danger-bg text-danger-text" : "bg-success-bg text-success-text"}`}>
          {error ?? success}
        </div>
      )}

      {/* Subscription */}
      <div className="bg-stone-100 rounded-lg p-4">
        <h3 className="text-xs font-semibold text-stone-500 mb-3 uppercase tracking-wide">Subscription</h3>
        <form onSubmit={handleSubscription} className="space-y-3">
          <div>
            <label className="text-xs text-stone-500 block mb-1">Plan</label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="w-full h-9 px-3 rounded-md text-sm border border-stone-200 bg-stone-50 text-stone-900 focus:outline-none focus:border-teal-600"
            >
              <option value="FREE">FREE</option>
              <option value="PRO">PRO</option>
              <option value="SCHOOL">SCHOOL</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-stone-500 block mb-1">Expires at</label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full h-9 px-3 rounded-md text-sm border border-stone-200 bg-stone-50 text-stone-900 focus:outline-none focus:border-teal-600"
            />
          </div>
          <Button type="submit" size="sm" className="w-full" loading={isPending}>
            Update Subscription
          </Button>
        </form>
      </div>

      {/* Role */}
      <div className="bg-stone-100 rounded-lg p-4">
        <h3 className="text-xs font-semibold text-stone-500 mb-3 uppercase tracking-wide">Role</h3>
        <Button
          variant="ghost-stone"
          size="sm"
          className="w-full"
          onClick={handleRoleToggle}
          loading={isPending}
        >
          {currentRole === "ADMIN" ? (
            <><ShieldOff size={13} /> Revoke Admin</>
          ) : (
            <><ShieldCheck size={13} /> Make Admin</>
          )}
        </Button>
      </div>

      {/* Danger zone */}
      <div className="bg-stone-100 rounded-lg p-4 border border-danger-bg">
        <h3 className="text-xs font-semibold text-danger-text mb-3 uppercase tracking-wide">Danger Zone</h3>
        <div className="space-y-2">
          <Button
            variant="ghost-stone"
            size="sm"
            className="w-full text-warning-text hover:bg-warning-bg"
            onClick={handleResetTokens}
            loading={isPending}
          >
            <RefreshCw size={13} /> Reset Tokens
          </Button>
          <Button
            variant="ghost-stone"
            size="sm"
            className="w-full text-danger-text hover:bg-danger-bg"
            onClick={handleDelete}
            loading={isPending}
          >
            <Trash2 size={13} /> Delete User
          </Button>
        </div>
      </div>
    </div>
  );
}
