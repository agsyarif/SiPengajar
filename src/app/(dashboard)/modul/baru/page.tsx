import { prisma } from "@/lib/prisma";
import { BuatModulForm } from "./_form";

export default async function BuatModulPage() {
  const mapelList = await prisma.subject.findMany({
    where:   { active: true },
    orderBy: { order: "asc" },
    select:  { id: true, name: true },
  });

  return <BuatModulForm mapelList={mapelList} />;
}
