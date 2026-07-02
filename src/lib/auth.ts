import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user) return null;

        const passwordHash = (user as { password?: string }).password;
        if (!passwordHash) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          passwordHash
        );
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  session: { strategy: "jwt" },
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // First sign-in: fetch authoritative role from DB
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id as string },
          select: { role: true },
        });
        token.id = user.id;
        token.role = dbUser?.role ?? "USER";
        token.checkedAt = Date.now();
        return token;
      }

      // Subsequent requests: re-check DB every 5 minutes for role changes
      // and token revocation
      const now = Date.now();
      const lastCheck = (token.checkedAt as number) ?? 0;
      if (now - lastCheck > 5 * 60 * 1000) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, tokenRevokedAt: true },
        });
        if (!dbUser) return null;

        // If tokenRevokedAt was set after this JWT was issued, invalidate it
        if (dbUser.tokenRevokedAt && token.iat) {
          const revokedMs = dbUser.tokenRevokedAt.getTime();
          const issuedMs = (token.iat as number) * 1000;
          if (revokedMs > issuedMs) return null;
        }

        token.role = dbUser.role;
        token.checkedAt = now;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "USER" | "ADMIN";
      }
      return session;
    },
    async signIn({ user }) {
      if (!user?.id) return true;
      // Clear revocation on successful re-auth so the new JWT is valid
      await prisma.user.update({
        where: { id: user.id as string },
        data: { tokenRevokedAt: null },
      });
      return true;
    },
  },
});
