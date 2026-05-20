"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User, Lock, Trash2, Check, AlertTriangle,
  Eye, EyeOff, Sparkles, ShieldCheck, CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeInStagger, FadeInItem } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils";

type Plan = "FREE" | "PRO" | "SCHOOL";

interface Props {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    hasPassword: boolean;
    plan: Plan;
    createdAt: Date;
  };
}

function Avatar({ name, image }: { name: string; image: string | null }) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="w-16 h-16 rounded-full object-cover ring-2 ring-white shadow"
      />
    );
  }
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center ring-2 ring-white shadow">
      <span className="font-display text-xl text-white font-semibold">{initials || "?"}</span>
    </div>
  );
}

const PLAN_LABEL: Record<Plan, string> = {
  FREE: "Gratis",
  PRO: "Pro",
  SCHOOL: "Sekolah",
};

const PLAN_VARIANT: Record<Plan, "stone" | "violet" | "teal"> = {
  FREE: "stone",
  PRO: "violet",
  SCHOOL: "teal",
};

function SectionCard({ title, icon, children }: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-stone-100 bg-stone-50/60">
        <span className="text-stone-400">{icon}</span>
        <h2 className="text-sm font-semibold text-stone-700">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function StatusMessage({ type, msg }: { type: "success" | "error"; msg: string }) {
  return (
    <div className={cn(
      "flex items-center gap-2 text-xs rounded-lg px-3 py-2 mt-3",
      type === "success" ? "bg-success-bg text-success-text" : "bg-danger-bg text-danger-text"
    )}>
      {type === "success" ? <Check size={12} /> : <AlertTriangle size={12} />}
      {msg}
    </div>
  );
}

export function SettingsForm({ user }: Props) {
  const router = useRouter();

  // Profile state
  const [name, setName] = useState(user.name);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileStatus, setProfileStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Password state
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwStatus, setPwStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || name === user.name) return;
    setProfileLoading(true);
    setProfileStatus(null);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal menyimpan.");
      setProfileStatus({ type: "success", msg: "Profil berhasil disimpan." });
      router.refresh();
    } catch (err) {
      setProfileStatus({ type: "error", msg: err instanceof Error ? err.message : "Gagal menyimpan." });
    } finally {
      setProfileLoading(false);
    }
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPw || !newPw) return;
    setPwLoading(true);
    setPwStatus(null);
    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current: currentPw, next: newPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal mengubah password.");
      setPwStatus({ type: "success", msg: "Password berhasil diubah." });
      setCurrentPw("");
      setNewPw("");
    } catch (err) {
      setPwStatus({ type: "error", msg: err instanceof Error ? err.message : "Gagal mengubah password." });
    } finally {
      setPwLoading(false);
    }
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  return (
    <FadeInStagger staggerDelay={0.06} className="space-y-6">
      {/* Header */}
      <FadeInItem>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-stone-900">Pengaturan</h1>
            <p className="text-sm text-stone-500 mt-0.5">Kelola profil dan keamanan akunmu.</p>
          </div>
          <Badge variant={PLAN_VARIANT[user.plan]}>
            {user.plan === "PRO" && "✦ "}
            {PLAN_LABEL[user.plan]}
          </Badge>
        </div>
      </FadeInItem>

      {/* Account overview */}
      <FadeInItem>
        <div className="bg-white border border-stone-200 rounded-xl px-6 py-5 flex items-center gap-5">
          <Avatar name={user.name} image={user.image} />
          <div className="flex-1 min-w-0">
            <p className="font-display text-lg text-stone-900 truncate">{user.name || "—"}</p>
            <p className="text-sm text-stone-500 truncate">{user.email}</p>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-1.5 text-right">
            <div className="flex items-center gap-1.5 text-xs text-stone-400">
              <CalendarDays size={12} />
              <span>Bergabung {memberSince}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-400">
              <ShieldCheck size={12} />
              <span>{user.hasPassword ? "Login email & password" : "Login via Google"}</span>
            </div>
          </div>
        </div>
      </FadeInItem>

      {/* Profile section */}
      <FadeInItem>
        <SectionCard title="Profil" icon={<User size={14} />}>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">
                Nama lengkap
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
                className="w-full h-10 px-3 rounded-lg border border-stone-200 text-sm text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full h-10 px-3 rounded-lg border border-stone-200 text-sm text-stone-400 bg-stone-50 cursor-not-allowed"
              />
              <p className="text-2xs text-stone-400 mt-1.5">Email tidak bisa diubah.</p>
            </div>
            {profileStatus && <StatusMessage {...profileStatus} />}
            <div className="flex justify-end">
              <Button
                type="submit"
                size="sm"
                disabled={profileLoading || !name.trim() || name === user.name}
              >
                {profileLoading ? "Menyimpan…" : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </SectionCard>
      </FadeInItem>

      {/* Password section */}
      <FadeInItem>
        <SectionCard title="Keamanan" icon={<Lock size={14} />}>
          {!user.hasPassword ? (
            <div className="flex items-start gap-3 text-sm text-stone-500">
              <Sparkles size={15} className="text-teal-500 mt-0.5 shrink-0" />
              <p>
                Akunmu terhubung via <span className="font-medium text-stone-700">Google OAuth</span>.
                Penggantian password tidak tersedia untuk metode login ini.
              </p>
            </div>
          ) : (
            <form onSubmit={handlePasswordSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1.5">
                  Password saat ini
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    className="w-full h-10 px-3 pr-10 rounded-lg border border-stone-200 text-sm text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1.5">
                  Password baru
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    className="w-full h-10 px-3 pr-10 rounded-lg border border-stone-200 text-sm text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {newPw.length > 0 && newPw.length < 8 && (
                  <p className="text-2xs text-amber-600 mt-1">Minimal 8 karakter</p>
                )}
              </div>
              {pwStatus && <StatusMessage {...pwStatus} />}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  disabled={pwLoading || !currentPw || newPw.length < 8}
                >
                  {pwLoading ? "Mengubah…" : "Ubah Password"}
                </Button>
              </div>
            </form>
          )}
        </SectionCard>
      </FadeInItem>

      {/* Danger zone */}
      <FadeInItem>
        <div className="border border-stone-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-stone-100 bg-stone-50/60">
            <AlertTriangle size={14} className="text-stone-400" />
            <h2 className="text-sm font-semibold text-stone-700">Zona Berbahaya</h2>
          </div>
          <div className="px-6 py-5 bg-white flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-700">Hapus akun</p>
              <p className="text-xs text-stone-400 mt-0.5">
                Semua data dihapus permanen dan tidak bisa dipulihkan.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 shrink-0"
            >
              <Trash2 size={13} />
              Hapus Akun
            </Button>
          </div>
        </div>
      </FadeInItem>
    </FadeInStagger>
  );
}
