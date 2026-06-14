import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const modul = await prisma.modul.findUnique({ where: { id } });

  if (!modul || modul.userId !== session.user.id) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data: modul });
}

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const modul = await prisma.modul.findUnique({ where: { id }, select: { userId: true } });

  if (!modul || modul.userId !== session.user.id) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const allowed = ["content", "judul", "status"] as const;
  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) data[key] = body[key];
  }

  const updated = await prisma.modul.update({ where: { id }, data });

  if ("template" in body && typeof body.template === "string") {
    await prisma.modulDesign.upsert({
      where: { modulId: id },
      update: { template: body.template },
      create: { modulId: id, template: body.template },
    });
  }

  if ("schoolName" in body && typeof body.schoolName === "string") {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { schoolName: body.schoolName },
    });
  }

  return NextResponse.json({ data: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: Params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const modul = await prisma.modul.findUnique({ where: { id }, select: { userId: true } });

  if (!modul || modul.userId !== session.user.id) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  await prisma.modul.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
