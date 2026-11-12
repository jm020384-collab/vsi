import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { sha256 } from "@/lib/hash";

/**
 * Власна статистика відвідувань для адмін-панелі.
 *
 * Без сторонніх лічильників і без cookies: сайт психотерапії не повинен
 * передавати комусь, хто й які сторінки на ньому читав. Відвідувача
 * розрізняємо за хешем IP і браузера із секретною сіллю — сам IP ніде не
 * зберігається, а з хешу його не відновити.
 *
 * Запити до таблиці — сирий SQL: агрегати з унікальними відвідувачами
 * та днями за київським часом через клієнт Prisma не виразити.
 */

/** Шляхи, які статистикою не вважаємо: кабінети, службові адреси. */
const SKIPPED_PREFIXES = ["/admin", "/dashboard", "/api", "/_next", "/offline"];

const BOT_RE =
  /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|monitor|uptime|curl|wget|python|node-fetch|axios|scrapy|facebookexternalhit|whatsapp|telegram|vercel/i;

export function isBot(userAgent: string) {
  return !userAgent || BOT_RE.test(userAgent);
}

/** Приводить адресу до вигляду, за яким її можна групувати. */
export function normalizePath(raw: unknown): string | null {
  if (typeof raw !== "string" || !raw.startsWith("/") || raw.startsWith("//")) return null;
  let path = (raw.split(/[?#]/)[0] ?? "").slice(0, 200);
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  if (SKIPPED_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`))) return null;
  return path;
}

/** Хост зовнішнього джерела; перехід усередині сайту джерелом не є. */
export function referrerHost(raw: unknown, ownHost: string | null): string | null {
  if (typeof raw !== "string" || !raw) return null;
  try {
    const host = new URL(raw).host.replace(/^www\./, "").slice(0, 100);
    if (!host || (ownHost && host === ownHost.replace(/^www\./, ""))) return null;
    return host;
  } catch {
    return null;
  }
}

export function deviceOf(userAgent: string): "mobile" | "desktop" {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent) ? "mobile" : "desktop";
}

export function visitorHash(ip: string, userAgent: string) {
  const salt = process.env.IP_HASH_SALT ?? "dev-salt-change-me";
  return sha256(`${salt}:visit:${ip}:${userAgent}`).slice(0, 32);
}

export async function recordPageView(view: {
  path: string;
  visitorHash: string;
  referrer: string | null;
  device: string;
}) {
  await prisma.$executeRaw`
    INSERT INTO "PageView" ("id", "path", "visitorHash", "referrer", "device")
    VALUES (${crypto.randomUUID()}, ${view.path}, ${view.visitorHash}, ${view.referrer}, ${view.device})
  `;
}

// ─── Читання ────────────────────────────────────────────────────────────────

const ZONE = "Europe/Kyiv";

/** День запису за київським часом, рядком YYYY-MM-DD. */
const KYIV_DAY = Prisma.sql`to_char("createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Kyiv', 'YYYY-MM-DD')`;

const isoDay = (d: Date) => d.toISOString().slice(0, 10);

/** Останні `count` днів за київським календарем, від найдавнішого. */
function kyivDays(count: number, endOffset = 0): string[] {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: ZONE }).format(new Date());
  // Полудень, а не північ: так зсув на добу не зачіпає перехід на літній час.
  const anchor = new Date(`${today}T12:00:00Z`).getTime();
  return Array.from({ length: count }, (_, i) =>
    isoDay(new Date(anchor - (endOffset + count - 1 - i) * 86_400_000)),
  );
}

export interface DayStat {
  day: string;
  visitors: number;
  views: number;
  catalog: number;
}

export interface Totals {
  visitors: number;
  views: number;
  catalog: number;
  profiles: number;
}

export interface SiteStats {
  days: number;
  daily: DayStat[];
  totals: Totals;
  previous: Totals;
  requests: number;
  topPages: { path: string; views: number; visitors: number }[];
  profiles: { path: string; views: number; visitors: number }[];
  referrers: { host: string; visitors: number }[];
  withReferrer: number;
  devices: { device: string; visitors: number }[];
  /** Коли записано перший перегляд; null — даних ще немає. */
  since: Date | null;
}

async function totalsFor(from: string, to: string): Promise<Totals> {
  // Грубе обмеження за createdAt — щоб спрацював індекс; точну межу дня дає KYIV_DAY.
  const floor = new Date(new Date(`${from}T00:00:00Z`).getTime() - 86_400_000);
  const [row] = await prisma.$queryRaw<Totals[]>`
    SELECT
      count(*)::int AS views,
      count(DISTINCT "visitorHash")::int AS visitors,
      (count(DISTINCT "visitorHash") FILTER (WHERE "path" = '/therapists'))::int AS catalog,
      (count(DISTINCT "visitorHash") FILTER (WHERE "path" LIKE '/specialists/%'))::int AS profiles
    FROM "PageView"
    WHERE "createdAt" >= ${floor} AND ${KYIV_DAY} BETWEEN ${from} AND ${to}
  `;
  return row ?? { views: 0, visitors: 0, catalog: 0, profiles: 0 };
}

export async function loadSiteStats(days: number): Promise<SiteStats> {
  const range = kyivDays(days);
  const from = range[0] ?? "";
  const to = range[range.length - 1] ?? "";
  const prev = kyivDays(days, days);
  const floor = new Date(new Date(`${from}T00:00:00Z`).getTime() - 86_400_000);
  const inRange = Prisma.sql`"createdAt" >= ${floor} AND ${KYIV_DAY} BETWEEN ${from} AND ${to}`;

  const [dailyRows, totals, previous, requests, topPages, profiles, referrers, devices, first] =
    await Promise.all([
      prisma.$queryRaw<DayStat[]>`
        SELECT ${KYIV_DAY} AS day,
          count(DISTINCT "visitorHash")::int AS visitors,
          count(*)::int AS views,
          (count(DISTINCT "visitorHash") FILTER (WHERE "path" = '/therapists'))::int AS catalog
        FROM "PageView" WHERE ${inRange}
        GROUP BY 1 ORDER BY 1
      `,
      totalsFor(from, to),
      totalsFor(prev[0] ?? "", prev[prev.length - 1] ?? ""),
      prisma.$queryRaw<{ n: number }[]>`
        SELECT count(*)::int AS n FROM "ContactRequest"
        WHERE "createdAt" >= ${floor} AND ${KYIV_DAY} BETWEEN ${from} AND ${to}
      `,
      prisma.$queryRaw<{ path: string; views: number; visitors: number }[]>`
        SELECT "path", count(*)::int AS views, count(DISTINCT "visitorHash")::int AS visitors
        FROM "PageView" WHERE ${inRange}
        GROUP BY 1 ORDER BY visitors DESC, views DESC LIMIT 12
      `,
      prisma.$queryRaw<{ path: string; views: number; visitors: number }[]>`
        SELECT "path", count(*)::int AS views, count(DISTINCT "visitorHash")::int AS visitors
        FROM "PageView" WHERE ${inRange} AND "path" LIKE '/specialists/%'
        GROUP BY 1 ORDER BY visitors DESC, views DESC LIMIT 20
      `,
      prisma.$queryRaw<{ host: string; visitors: number }[]>`
        SELECT "referrer" AS host, count(DISTINCT "visitorHash")::int AS visitors
        FROM "PageView" WHERE ${inRange} AND "referrer" IS NOT NULL
        GROUP BY 1 ORDER BY visitors DESC LIMIT 8
      `,
      prisma.$queryRaw<{ device: string; visitors: number }[]>`
        SELECT "device", count(DISTINCT "visitorHash")::int AS visitors
        FROM "PageView" WHERE ${inRange}
        GROUP BY 1 ORDER BY visitors DESC
      `,
      prisma.$queryRaw<{ since: Date | null; with_referrer: number }[]>`
        SELECT min("createdAt") AS since,
          (SELECT count(DISTINCT "visitorHash")::int FROM "PageView"
            WHERE ${inRange} AND "referrer" IS NOT NULL) AS with_referrer
        FROM "PageView"
      `,
    ]);

  // Дні без жодного візиту в запит не потрапляють — на графіку вони мають бути нулями.
  const byDay = new Map(dailyRows.map((r) => [r.day, r]));
  const daily = range.map((day) => byDay.get(day) ?? { day, visitors: 0, views: 0, catalog: 0 });

  return {
    days,
    daily,
    totals,
    previous,
    requests: requests[0]?.n ?? 0,
    topPages,
    profiles,
    referrers,
    withReferrer: first[0]?.with_referrer ?? 0,
    devices,
    since: first[0]?.since ?? null,
  };
}
