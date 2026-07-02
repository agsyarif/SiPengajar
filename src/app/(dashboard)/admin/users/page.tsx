import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; plan?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = params.q ?? "";
  const plan = params.plan ?? "";
  const page = Math.max(1, Number(params.page ?? 1));
  const perPage = 20;

  const where = {
    ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" as const } }, { email: { contains: q, mode: "insensitive" as const } }] } : {}),
    ...(plan ? { plan: plan as "FREE" | "PRO" | "SCHOOL" } : {}),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        role: true,
        planExpiresAt: true,
        createdAt: true,
        _count: { select: { moduls: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Users</h1>
          <p className="text-sm text-stone-500 mt-1">{total} total users</p>
        </div>
      </div>

      <form method="GET" className="flex gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by name or email…"
          className="h-9 px-3 rounded-md text-sm border border-stone-200 bg-stone-100 focus:outline-none focus:border-teal-600 w-64 text-stone-900 placeholder:text-stone-400"
        />
        <select
          name="plan"
          defaultValue={plan}
          className="h-9 px-3 rounded-md text-sm border border-stone-200 bg-stone-100 focus:outline-none focus:border-teal-600 text-stone-900"
        >
          <option value="">All plans</option>
          <option value="FREE">FREE</option>
          <option value="PRO">PRO</option>
          <option value="SCHOOL">SCHOOL</option>
        </select>
        <button
          type="submit"
          className="h-9 px-4 rounded-md text-sm font-medium bg-teal-600 text-white hover:bg-teal-800 transition-colors"
        >
          Filter
        </button>
      </form>

      <div className="bg-stone-100 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200">
              <th className="text-left px-4 py-3 text-xs font-medium text-stone-500">User</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-stone-500">Plan</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-stone-500">Role</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-stone-500">Moduls</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-stone-500">Joined</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-stone-200 last:border-0 hover:bg-stone-200 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-stone-900">{user.name ?? "—"}</p>
                  <p className="text-stone-500 text-xs">{user.email}</p>
                </td>
                <td className="px-4 py-3">
                  <PlanBadge plan={user.plan} />
                  {user.planExpiresAt && (
                    <p className="text-2xs text-stone-400 mt-0.5">
                      exp {user.planExpiresAt.toLocaleDateString("id-ID")}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <RoleBadge role={user.role} />
                </td>
                <td className="px-4 py-3 text-stone-600">{user._count.moduls}</td>
                <td className="px-4 py-3 text-stone-500 text-xs">
                  {user.createdAt.toLocaleDateString("id-ID")}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="text-stone-400 hover:text-stone-700 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-12 text-stone-400 text-sm">No users found.</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-stone-500">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`?q=${q}&plan=${plan}&page=${page - 1}`}
                className="h-8 px-3 rounded-md bg-stone-100 border border-stone-200 flex items-center hover:bg-stone-200 transition-colors text-stone-700"
              >
                Prev
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`?q=${q}&plan=${plan}&page=${page + 1}`}
                className="h-8 px-3 rounded-md bg-stone-100 border border-stone-200 flex items-center hover:bg-stone-200 transition-colors text-stone-700"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
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
