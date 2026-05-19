import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { ModulEditor } from "./modul-editor";

type Params = Promise<{ id: string }>;

export default async function ModulEditPage({ params }: { params: Params }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const modul = await prisma.modul.findUnique({ where: { id } });

  if (!modul || modul.userId !== session.user.id) notFound();

  return (
    <ModulEditor
      modul={{
        id: modul.id,
        judul: modul.judul,
        mapel: modul.mapel,
        jenjang: modul.jenjang,
        kelas: modul.kelas,
        fase: modul.fase,
        topik: modul.topik,
        tujuan: modul.tujuan,
        model: modul.model,
        pertemuan: modul.pertemuan,
        menit: modul.menit,
        status: modul.status,
        content: modul.content ?? "",
      }}
    />
  );
}
