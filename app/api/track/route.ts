import { auth } from "@/auth";
import {
  deviceOf,
  isBot,
  normalizePath,
  recordPageView,
  referrerHost,
  visitorHash,
} from "@/lib/analytics";

export const dynamic = "force-dynamic";

const NO_CONTENT = () => new Response(null, { status: 204 });

/**
 * Приймає один перегляд сторінки від <PageTracker />.
 *
 * Завжди відповідає 204 і ніколи не кидає помилку назовні: лічильник не
 * має права зламати сторінку чи засмітити консоль відвідувача.
 */
export async function POST(req: Request) {
  try {
    // Локальна розробка ходить у ту саму базу — її перегляди статистику б спотворили.
    if (process.env.NODE_ENV !== "production") return NO_CONTENT();

    const userAgent = req.headers.get("user-agent") ?? "";
    if (isBot(userAgent)) return NO_CONTENT();

    // Лише запити з самого сайту: чужа сторінка не повинна накручувати цифри.
    const host = req.headers.get("host");
    const origin = req.headers.get("origin");
    if (origin && host && new URL(origin).host !== host) return NO_CONTENT();

    const body = JSON.parse(await req.text()) as { path?: unknown; referrer?: unknown };
    const path = normalizePath(body.path);
    if (!path) return NO_CONTENT();

    // Власні заходи адміністратора в статистику не йдуть.
    const session = await auth();
    if (session?.user?.role === "ADMIN") return NO_CONTENT();

    const ip = ((req.headers.get("x-forwarded-for") ?? "").split(",")[0] ?? "").trim() || "unknown";

    await recordPageView({
      path,
      visitorHash: visitorHash(ip, userAgent),
      referrer: referrerHost(body.referrer, host),
      device: deviceOf(userAgent),
    });
  } catch (error) {
    console.error("[track]", error);
  }
  return NO_CONTENT();
}
