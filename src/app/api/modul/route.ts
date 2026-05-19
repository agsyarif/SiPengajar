import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const moduls = await prisma.modul.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      judul: true,
      mapel: true,
      jenjang: true,
      kelas: true,
      fase: true,
      topik: true,
      status: true,
      pertemuan: true,
      menit: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ data: moduls });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { judul, mapel, jenjang, kelas, fase, topik, tujuan, model, pertemuan, menit, cp } = body;

  if (!judul || !mapel || !jenjang || !kelas || !fase || !topik || !tujuan || !model || !pertemuan || !menit) {
    return NextResponse.json({ message: "Data tidak lengkap." }, { status: 400 });
  }

  const modul = await prisma.modul.create({
    data: {
      userId: session.user.id,
      judul,
      mapel,
      jenjang,
      kelas,
      fase,
      topik,
      tujuan,
      model,
      pertemuan: Number(pertemuan),
      menit: Number(menit),
      cp: cp ?? null,
      status: "DRAFT",
    },
  });

  return NextResponse.json({ data: modul }, { status: 201 });
}
