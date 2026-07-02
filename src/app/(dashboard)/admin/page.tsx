import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Users, CreditCard, Clock } from "lucide-react";

export default async function AdminOverviewPage() {
  const [totalUsers, planCounts, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.groupBy({ by: ["plan"], _count: true }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, plan: true, role: true, createdAt: true },
    }),
  ]);

  const planMap = Object.fromEntries(planCounts.map((p) => [p.plan, p._count]));

  const stats = [
    { label: "Total Users", value: totalUsers, icon: Users },
    { label: "PRO Users", value: planMap["PRO"] ?? 0, icon: CreditCard },
    { label: "SCHOOL Users", value: planMap["SCHOOL"] ?? 0, icon: CreditCard },
    { label: "FREE Users", value: planMap["FREE"] ?? 0, icon: Clock },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Overview</h1>
        <p className="text-sm text-stone-500 mt-1">Platform statistics at a glance.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-stone-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={15} className="text-stone-500" />
              <span className="text-xs text-stone-500">{label}</span>
            </div>
            <p className="text-2xl font-semibold text-stone-900">{value}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-base font-semibold text-stone-900 mb-4">Recent Signups</h2>
        <div className="bg-stone-100 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="text-left px-4 py-3 text-xs font-medium text-stone-500">User</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-stone-500">Plan</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-stone-500">Role</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-stone-500">Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.id} className="border-b border-stone-200 last:border-0 hover:bg-stone-200 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-stone-900">{user.name ?? "—"}</p>
                    <p className="text-stone-500 text-xs">{user.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <PlanBadge plan={user.plan} />
                  </td>
                  <td className="px-4 py-3">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-4 py-3 text-stone-500 text-xs">
                    {user.createdAt.toLocaleDateString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
