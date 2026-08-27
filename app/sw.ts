/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, NetworkOnly, NetworkFirst, StaleWhileRevalidate, CacheFirst } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // Auth & API — лише мережа, ніколи не кешуємо
    {
      matcher: ({ url }) =>
        url.pathname.startsWith("/api/") ||
        url.pathname.startsWith("/dashboard") ||
        url.pathname.startsWith("/admin"),
      handler: new NetworkOnly(),
    },
    // Профілі терапевтів та статті — SWR
    {
      matcher: ({ url }) =>
        /^\/therapists(\/[^/]+)?$/.test(url.pathname) || /^\/blog(\/[^/]+)?$/.test(url.pathname),
      handler: new StaleWhileRevalidate({
        cacheName: "content-cache",
      }),
    },
    // Іконки та статичні файли
    {
      matcher: ({ url }) =>
        url.pathname.startsWith("/icons/") || url.pathname.startsWith("/images/"),
      handler: new CacheFirst({
        cacheName: "assets-cache",
      }),
    },
    // Шрифти Google — CacheFirst з обмеженим TTL
    {
      matcher: ({ url }) =>
        url.origin === "https://fonts.googleapis.com" || url.origin === "https://fonts.gstatic.com",
      handler: new CacheFirst({
        cacheName: "google-fonts-cache",
      }),
    },
    // Решта навігаційних запитів — мережа з фолбеком на офлайн
    {
      matcher: ({ request }) => request.mode === "navigate",
      handler: new NetworkFirst({
        cacheName: "pages-cache",
      }),
    },
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher: ({ request }) => request.destination === "document",
      },
    ],
  },
});

serwist.addEventListeners();
