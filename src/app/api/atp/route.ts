import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const subject = searchParams.get("subject");
  const phase = searchParams.get("phase");
  const grade = searchParams.get("grade");

  const cps = await prisma.learningOutcome.findMany({
    where: {
      ...(subject && { subject }),
      ...(phase && { phase }),
    },
    include: {
      elements: true,
      chapters: {
        where: grade ? { grade } : undefined,
        orderBy: { number: "asc" },
        include: {
          objectives: {
            orderBy: { code: "asc" },
            include: { learningFlow: { orderBy: { sequence: "asc" } } },
          },
        },
      },
    },
    orderBy: { subject: "asc" },
  });

  return NextResponse.json(cps);
}
