import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      const isPublic =
        pathname === "/login" ||
        pathname === "/" ||
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/_next") ||
        pathname.includes("favicon.ico");

      if (!isLoggedIn && !isPublic) {
        return false;
      }

      // If logged in and visiting login page, send directly to dashboard
      if (isLoggedIn && pathname === "/login") {
        return Response.redirect(new URL("/dashboard", nextUrl).toString());
      }

      if (pathname.startsWith("/admin")) {
        const role = (auth?.user as any)?.role;
        if (role !== "ADMIN") {
          return Response.redirect(new URL("/dashboard?error=unauthorized_admin", nextUrl).toString());
        }
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.status = (user as any).status;
        token.department = (user as any).department;
        token.spendingLimit = (user as any).spendingLimit;
      }

      if (trigger === "update" && session) {
        token.name = session.name || token.name;
        token.role = session.role || token.role;
        token.department = session.department || token.department;
        token.spendingLimit = session.spendingLimit || token.spendingLimit;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
        (session.user as any).status = token.status;
        (session.user as any).department = token.department as string | null;
        (session.user as any).spendingLimit = token.spendingLimit as number | null;
      }
      return session;
    },
  },
  providers: [],
};
