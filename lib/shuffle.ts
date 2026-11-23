/**
 * Випадковий порядок (Фішер-Єйтс) без зміни вихідного масиву.
 *
 * Викликати лише на сервері, під час рендеру запиту: тоді порядок
 * вирішується один раз і однаково доходить до браузера. Тасування в
 * клієнтському компоненті дало б різний результат на сервері й після
 * гідратації.
 */
export function shuffle<T>(list: readonly T[]): T[] {
  const pool = [...list];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const held = pool[i] as T;
    pool[i] = pool[j] as T;
    pool[j] = held;
  }
  return pool;
}
