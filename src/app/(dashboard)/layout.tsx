import { SessionProvider } from "@/components/layout/session-provider";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageTransition } from "@/components/motion/page-transition";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <SessionProvider>
      <DashboardShell>
        <PageTransition>{children}</PageTransition>
      </DashboardShell>
    </SessionProvider>
  );
}
