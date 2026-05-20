import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SettingsForm } from "./_form";

export default async function PengaturanPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true, password: true, plan: true, createdAt: true },
  });

  if (!user) redirect("/login");

  return (
    <SettingsForm
      user={{
        id: user.id,
        name: user.name ?? "",
        email: user.email,
        image: user.image ?? null,
        hasPassword: !!user.password,
        plan: user.plan,
        createdAt: user.createdAt,
      }}
    />
  );
}
