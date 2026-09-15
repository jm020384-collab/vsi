"use client";

import { useEffect, useState } from "react";

/**
 * Межа помилки для кореневого layout.
 *
 * app/error.tsx ловить лише збої всередині сторінок. Якщо ж падає те, що
 * рендериться на кожній сторінці — провайдери теми й сесії, шапка, або
 * застарілий JS із кешу service worker, — без цього файлу Next.js показує
 * голий білий текст «Application error», з якого нема куди натиснути.
 *
 * Кореневий layout тут не рендериться, тож ні globals.css, ні шрифтів, ні
 * компонентів UI немає: розмітка власна, стилі інлайн.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    // Помилку не ховаємо: без Sentry консоль — єдине місце, де її видно.
    console.error(error);
  }, [error]);

  /**
   * Застарілий service worker може віддавати HTML від попереднього деплою,
   * що посилається на JS-файли, яких на сервері вже немає. Звичайне
   * оновлення тоді не допомагає — той самий worker знову віддасть старе.
   * Знімаємо реєстрацію й чистимо кеші, щоб сторінка прийшла з мережі.
   */
  async function clearAndReload() {
    setClearing(true);
    try {
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((r) => r.unregister()));
      }
      if ("caches" in window) {
        const names = await caches.keys();
        await Promise.all(names.map((name) => caches.delete(name)));
      }
    } finally {
      window.location.reload();
    }
  }

  const detail = error.digest ? `${error.message} · ${error.digest}` : error.message;

  return (
    <html lang="uk">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "24px",
          background: "#F8F4EC",
          color: "#142744",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
        }}
      >
        <main style={{ maxWidth: 440, textAlign: "center" }}>
          <h1
            style={{
              margin: 0,
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 400,
              fontSize: 30,
              lineHeight: 1.2,
            }}
          >
            Щось пішло не так
          </h1>
          <p style={{ margin: "14px 0 0", fontSize: 16, lineHeight: 1.6, color: "#4A5568" }}>
            Сторінка не змогла завантажитися. Найчастіше допомагає очистити збережену копію сайту в
            браузері.
          </p>

          <div
            style={{
              marginTop: 26,
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              justifyContent: "center",
            }}
          >
            <button
              type="button"
              onClick={clearAndReload}
              disabled={clearing}
              style={{
                minHeight: 44,
                padding: "0 20px",
                borderRadius: 12,
                border: "none",
                background: "#142744",
                color: "#F8F4EC",
                fontSize: 15,
                fontWeight: 500,
                cursor: clearing ? "wait" : "pointer",
                opacity: clearing ? 0.7 : 1,
              }}
            >
              {clearing ? "Очищуємо…" : "Очистити кеш і оновити"}
            </button>
            <button
              type="button"
              onClick={reset}
              style={{
                minHeight: 44,
                padding: "0 20px",
                borderRadius: 12,
                border: "1px solid rgba(20, 39, 68, 0.2)",
                background: "transparent",
                color: "#142744",
                fontSize: 15,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Спробувати ще раз
            </button>
          </div>

          {/*
            Технічний рядок для звернення в підтримку: без Sentry інакше не
            дізнатися, що саме впало у відвідувача.
          */}
          {detail && (
            <p
              style={{
                margin: "28px 0 0",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 12,
                lineHeight: 1.5,
                color: "#78828C",
                wordBreak: "break-word",
              }}
            >
              {detail}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
