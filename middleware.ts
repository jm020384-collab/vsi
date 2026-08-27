import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export const { auth: middleware } = NextAuth(authConfig);

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
