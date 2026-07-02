import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req: NextRequest & { auth: { user?: { role?: string } } | null }) => {
  if (!req.auth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (req.auth.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
