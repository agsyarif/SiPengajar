import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminSubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");
  return <>{children}</>;
}
