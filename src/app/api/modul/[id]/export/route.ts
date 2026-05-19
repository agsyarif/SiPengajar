import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildModulDocx } from "@/lib/export-docx";

type Params = Promise<{ id: string }>;

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const modul = await prisma.modul.findUnique({ where: { id } });

  if (!modul || modul.userId !== session.user.id) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  if (!modul.content) {
    return NextResponse.json({ message: "Konten modul belum tersedia." }, { status: 400 });
  }

  const format = req.nextUrl.searchParams.get("format") ?? "docx";

  if (format === "docx") {
    const buffer = await buildModulDocx(modul.content);
    const filename = encodeURIComponent(
      `Modul_Ajar_${modul.mapel}_${modul.judul}`.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "")
    );
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}.docx"`,
      },
    });
  }

  return NextResponse.json({ message: `Format "${format}" belum didukung.` }, { status: 400 });
}
