"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Повідомляє серверу про кожну відкриту сторінку — і про перше
 * завантаження, і про переходи всередині сайту.
 *
 * Нічого не зберігає в браузері: ні cookies, ні localStorage. Джерело
 * переходу передаємо лише раз, із першою сторінкою візиту.
 */
export function PageTracker() {
  const pathname = usePathname();
  const last = useRef<string | null>(null);
  const referrerSent = useRef(false);

  useEffect(() => {
    if (!pathname || last.current === pathname) return;
    last.current = pathname;
    if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) return;

    // З адреси беремо тільки три мітки, а не весь рядок запиту: там може
    // бути що завгодно, зокрема одноразові токени з листів.
    const query = new URLSearchParams(window.location.search);
    const payload = JSON.stringify({
      path: pathname,
      referrer: referrerSent.current ? "" : document.referrer,
      utm: referrerSent.current
        ? undefined
        : {
            source: query.get("utm_source"),
            medium: query.get("utm_medium"),
            campaign: query.get("utm_campaign"),
          },
    });
    referrerSent.current = true;

    try {
      // sendBeacon не блокує сторінку й доходить, навіть якщо її одразу закрили.
      if (!navigator.sendBeacon?.("/api/track", payload)) {
        void fetch("/api/track", { method: "POST", body: payload, keepalive: true });
      }
    } catch {
      // Лічильник не має права заважати сторінці.
    }
  }, [pathname]);

  return null;
}
