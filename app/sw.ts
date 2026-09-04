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
    /*
      Решта зображень — SWR, і саме тому це правило стоїть перед defaultCache.
      Типовий набір Serwist кешує файли з /public стратегією CacheFirst на
      30 днів: замінена картинка не з'явилась би в того, хто вже був на
      сайті, цілий місяць. Тут браузер показує наявну копію одразу, але
      паралельно тягне свіжу, тож заміну видно з наступного заходу.
    */
    {
      matcher: ({ request }) => request.destination === "image",
      handler: new StaleWhileRevalidate({
        cacheName: "image-cache",
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

/**
 * Прибирання кешів зображень при активації нового service worker.
 *
 * Зміна стратегії сама по собі не чіпає вже збережені копії: вони лежать
 * під власними іменами кешів і не зникають при оновленні worker'а. Без
 * цього той, хто вже був на сайті, ще довго бачив би замінені зображення
 * старими. Ціна — одне повторне завантаження картинок після деплою.
 */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    self.caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name.includes("image") || name === "assets-cache")
            .map((name) => self.caches.delete(name)),
        ),
      ),
  );
});
