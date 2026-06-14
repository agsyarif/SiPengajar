import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const cp = await prisma.learningOutcome.findUnique({
    where: { id },
    include: {
      elements: true,
      chapters: {
        orderBy: { number: "asc" },
        include: {
          objectives: {
            orderBy: { code: "asc" },
            include: { learningFlow: { orderBy: { sequence: "asc" } } },
          },
        },
      },
    },
  });

  if (!cp)
    return NextResponse.json({ error: "CP tidak ditemukan" }, { status: 404 });
  return NextResponse.json(cp);
}
