import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateModulAjar } from "@/lib/ai";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

type Params = Promise<{ id: string }>;

export async function POST(_req: NextRequest, { params }: { params: Params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const modul = await prisma.modul.findUnique({ where: { id } });

  if (!modul || modul.userId !== session.user.id) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  await prisma.modul.update({ where: { id }, data: { status: "PROCESSING" } });

  try {
    const content = await generateModulAjar({
      mapel: modul.mapel,
      jenjang: modul.jenjang,
      kelas: modul.kelas,
      fase: modul.fase,
      topik: modul.topik,
      tujuan: modul.tujuan,
      model: modul.model,
      pertemuan: modul.pertemuan,
      menit: modul.menit,
      cp: modul.cp ?? undefined,
    });

    await prisma.modul.update({ where: { id }, data: { content, status: "DONE" } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    await prisma.modul.update({ where: { id }, data: { status: "DRAFT" } });
    console.error("[generate]", err);
    return NextResponse.json({ message: "Gagal generate konten." }, { status: 500 });
  }
}
