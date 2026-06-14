import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { BuatModulForm } from "./_form";

async function BuatModulFormServer() {
  const mapelList = await prisma.subject.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    select: { id: true, name: true },
  });

  return <BuatModulForm mapelList={mapelList} />;
}

export default function BuatModulPage() {
  return (
    <Suspense>
      <BuatModulFormServer />
    </Suspense>
  );
}
