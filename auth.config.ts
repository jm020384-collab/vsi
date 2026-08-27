import type { NextAuthConfig } from "next-auth";

/**
 * Edge-сумісна конфігурація: без adapter і Node-only providers.
 * Використовується в middleware.ts. Повна конфігурація — в auth.ts.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;

      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnAuthPages =
        nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");

      if (isOnAdmin) {
        if (!isLoggedIn) return false;
        return role === "ADMIN";
      }
      if (isOnDashboard) {
        if (!isLoggedIn) return false;
        return role === "THERAPIST" || role === "ADMIN";
      }
      // Адміна на /login чи /register не відкидаємо — їй/йому може бути
      // потрібно переглянути ці публічні сторінки (QA, підтримка тощо),
      // а не лише пройти чужий шлях реєстрації/входу.
      if (isOnAuthPages && isLoggedIn && role !== "ADMIN") {
        const target = role === "THERAPIST" ? "/dashboard" : "/";
        return Response.redirect(new URL(target, nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "PATIENT" | "THERAPIST" | "ADMIN";
      }
      return session;
    },
  },
  providers: [], // конкретні провайдери — в auth.ts (потребують Node API)
} satisfies NextAuthConfig;
