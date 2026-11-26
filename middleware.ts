import NextAuth from "next-auth";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

import { authConfig } from "@/auth.config";
import { LOCALE_HEADER, isLocalizable, splitLocale } from "@/lib/i18n/config";

const withAuth = NextAuth(authConfig).auth as unknown as (
  request: NextRequest,
  event: NextFetchEvent,
) => Promise<Response>;

export default function middleware(request: NextRequest, event: NextFetchEvent) {
  const { locale, path } = splitLocale(request.nextUrl.pathname);
  if (locale !== "ru") return withAuth(request, event);

  const url = request.nextUrl.clone();
  url.pathname = path;
  // Усе поза білим списком — на звичайну адресу: там працює перевірка
  // доступу, і обійти її префіксом /ru неможливо.
  if (!isLocalizable(path)) return NextResponse.redirect(url);

  const headers = new Headers(request.headers);
  headers.set(LOCALE_HEADER, "ru");
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  matcher: [
    /*
     * Запускати middleware для всіх шляхів, крім:
     *  - api/auth (Auth.js хендлери)
     *  - api/uploadthing
     *  - _next/static, _next/image
     *  - favicon, sw, manifest, robots, sitemap, icons
     *  - публічних статичних файлів
     */
    "/((?!api/auth|api/uploadthing|_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest|robots.txt|sitemap.xml|icons/|images/).*)",
  ],
};
