import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  current: z.string().min(1),
  next: z.string().min(8, "Password minimal 8 karakter"),
});

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  });

  if (!user?.password) {
    return NextResponse.json({ error: "Akun ini menggunakan login Google, tidak bisa ganti password." }, { status: 400 });
  }

  const valid = await bcrypt.compare(parsed.data.current, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Password saat ini salah." }, { status: 400 });
  }

  const hashed = await bcrypt.hash(parsed.data.next, 12);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashed },
  });

  return NextResponse.json({ ok: true });
}
