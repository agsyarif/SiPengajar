import { Sidebar } from "@/components/layout/sidebar";
import { SessionProvider } from "@/components/layout/session-provider";
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
      <div className="flex min-h-screen bg-stone-50">
        <Sidebar />
        <main className="flex-1 min-h-screen transition-[margin] duration-300" style={{ marginLeft: "var(--sidebar-w, 240px)" }}>
          <div className="max-w-4xl mx-auto px-8 py-8">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
      </div>
    </SessionProvider>
  );
}
