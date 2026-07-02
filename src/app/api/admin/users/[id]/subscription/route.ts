import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  if (session.user.role !== "ADMIN") return null;
  return session;
}

const schema = z.object({
  plan: z.enum(["FREE", "PRO", "SCHOOL"]),
  planExpiresAt: z.string().datetime({ offset: true }).nullable().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json();

  // Accept a plain date string (YYYY-MM-DD) or null
  const normalised = {
    ...body,
    planExpiresAt: body.planExpiresAt
      ? new Date(body.planExpiresAt).toISOString()
      : null,
  };

  const parsed = schema.safeParse(normalised);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      plan: parsed.data.plan,
      planExpiresAt: parsed.data.planExpiresAt
        ? new Date(parsed.data.planExpiresAt)
        : null,
    },
    select: { id: true, plan: true, planExpiresAt: true },
  });

  return NextResponse.json(user);
}
