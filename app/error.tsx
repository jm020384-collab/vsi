"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const RELOAD_FLAG = "vsi-chunk-reload";

/**
 * Помилка «не вдалося завантажити частину сайту».
 *
 * Трапляється, коли вкладка відкрита давно, а сайт за цей час оновили:
 * сторінка просить файл попередньої збірки, якого на сервері вже немає.
 * Це не збій у даних — достатньо перезавантажити сторінку.
 */
function isStaleBuildError(error: Error) {
  return (
    error.name === "ChunkLoadError" ||
    /Loading chunk|Failed to load chunk|Loading CSS chunk|dynamically imported module/i.test(
      error.message,
    )
  );
}

export default function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  const stale = isStaleBuildError(error);
  // Поки вирішуємо, чи перезавантажувати, екран помилки не показуємо —
  // інакше він блимнув би перед оновленням.
  const [reloading, setReloading] = useState(stale);

  useEffect(() => {
    console.error(error);
    if (!stale) return;

    // Перезавантажуємо лише раз: якщо файл не знайшовся й після цього,
    // показуємо звичайний екран, а не крутимо сторінку по колу.
    let alreadyTried = false;
    try {
      alreadyTried = sessionStorage.getItem(RELOAD_FLAG) === window.location.pathname;
      if (!alreadyTried) sessionStorage.setItem(RELOAD_FLAG, window.location.pathname);
    } catch {
      // Сховище недоступне (приватне вікно) — рахуємо, що вже пробували,
      // щоб не зациклитися.
      alreadyTried = true;
    }

    if (alreadyTried) setReloading(false);
    else window.location.reload();
  }, [error, stale]);

  if (reloading) return <div className="min-h-[60vh]" aria-busy />;

  return (
    <div className="container max-w-md py-24 text-center">
      <h1 className="text-3xl font-semibold">Щось пішло не так</h1>
      <p className="mt-3 text-muted-foreground">
        Спробуйте оновити сторінку або повторіть пізніше.
      </p>
      {/* Для застарілої збірки reset() не допоможе: потрібні нові файли. */}
      <Button className="mt-6" onClick={stale ? () => window.location.reload() : reset}>
        Спробувати ще раз
      </Button>
    </div>
  );
}
