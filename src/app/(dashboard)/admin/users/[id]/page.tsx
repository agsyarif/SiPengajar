import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { UserActionsPanel } from "@/components/admin/user-actions-panel";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      role: true,
      planExpiresAt: true,
      schoolName: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { moduls: true } },
    },
  });

  if (!user) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/users"
          className="text-stone-400 hover:text-stone-700 transition-colors"
        >
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-stone-900">{user.name ?? "Unnamed User"}</h1>
          <p className="text-sm text-stone-500">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-stone-100 rounded-lg p-5">
            <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-4">Account Details</h2>
            <dl className="space-y-3">
              {[
                { label: "ID", value: user.id },
                { label: "Name", value: user.name ?? "—" },
                { label: "Email", value: user.email },
                { label: "School", value: user.schoolName ?? "—" },
                { label: "Moduls", value: String(user._count.moduls) },
                { label: "Joined", value: user.createdAt.toLocaleString("id-ID") },
                { label: "Updated", value: user.updatedAt.toLocaleString("id-ID") },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-4">
                  <dt className="w-24 text-xs font-medium text-stone-500 shrink-0">{label}</dt>
                  <dd className="text-sm text-stone-800 break-all">{value}</dd>
                </div>
              ))}
              <div className="flex gap-4">
                <dt className="w-24 text-xs font-medium text-stone-500 shrink-0">Plan</dt>
                <dd className="flex items-center gap-2">
                  <PlanBadge plan={user.plan} />
                  {user.planExpiresAt && (
                    <span className="text-xs text-stone-400">
                      expires {user.planExpiresAt.toLocaleDateString("id-ID")}
                    </span>
                  )}
                </dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-24 text-xs font-medium text-stone-500 shrink-0">Role</dt>
                <dd><RoleBadge role={user.role} /></dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="space-y-4">
          <UserActionsPanel
            userId={user.id}
            currentPlan={user.plan}
            currentPlanExpiresAt={user.planExpiresAt?.toISOString() ?? null}
            currentRole={user.role}
          />
        </div>
      </div>
    </div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  if (plan === "PRO") return <Badge variant="violet">PRO</Badge>;
  if (plan === "SCHOOL") return <Badge variant="teal">SCHOOL</Badge>;
  return <Badge variant="stone">FREE</Badge>;
}

function RoleBadge({ role }: { role: string }) {
  if (role === "ADMIN") return <Badge variant="danger">ADMIN</Badge>;
  return <Badge variant="stone">USER</Badge>;
}
