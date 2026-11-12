import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { VisitsChart } from "@/components/admin/visits-chart";
import type { SiteStats } from "@/lib/analytics";

export const PERIODS = [7, 30, 90] as const;

const PAGE_LABEL: Record<string, string> = {
  "/": "Головна",
  "/therapists": "Фахівці — каталог",
  "/library": "Тексти",
  "/blog": "Тексти",
  "/events": "Події",
  "/pro-metod": "Про простір",
  "/social-support": "Соціальна підтримка",
  "/explore": "Теми",
  "/register": "Реєстрація фахівця",
  "/login": "Вхід",
  "/privacy": "Політика конфіденційності",
  "/terms": "Умови користування",
};

const DEVICE_LABEL: Record<string, string> = { mobile: "Телефон", desktop: "Комп'ютер" };

const DATE = new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long", year: "numeric" });
const SHORT = new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "short" });
const num = (n: number) => n.toLocaleString("uk-UA");
const share = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 100) : 0);

function pageLabel(path: string, names: Record<string, string>) {
  if (PAGE_LABEL[path]) return PAGE_LABEL[path];
  if (path.startsWith("/specialists/")) {
    const slug = path.slice("/specialists/".length);
    return `Профіль: ${names[slug] ?? slug}`;
  }
  if (path.startsWith("/themes/")) return `Тема: ${path.slice("/themes/".length)}`;
  if (path.startsWith("/library/") || path.startsWith("/blog/")) return `Текст: ${path}`;
  if (path.startsWith("/events/")) return `Подія: ${path}`;
  return path;
}

/** Порівняння з попереднім таким самим періодом — словами, не лише кольором. */
function Delta({ now, before, days }: { now: number; before: number; days: number }) {
  if (before === 0) {
    return <span>за попередні {days} дн. даних ще немає</span>;
  }
  const pct = Math.round(((now - before) / before) * 100);
  const sign = pct > 0 ? "▲ +" : pct < 0 ? "▼ −" : "";
  return (
    <span>
      {pct === 0 ? "без змін" : `${sign}${Math.abs(pct)}%`} до попередніх {days} дн. ({num(before)})
    </span>
  );
}

function Tile({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children?: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="mt-1 text-3xl font-semibold tabular-nums">{value}</div>
        {children && <div className="mt-2 text-xs text-muted-foreground">{children}</div>}
      </CardContent>
    </Card>
  );
}

/** Горизонтальні смуги однієї шкали: довжина — частка від найбільшого значення. */
function Bars({ rows }: { rows: { label: string; value: number; note?: string }[] }) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0 truncate">{r.label}</span>
            <span className="shrink-0 tabular-nums">
              <span className="font-semibold">{num(r.value)}</span>
              {r.note && <span className="ml-2 text-xs text-muted-foreground">{r.note}</span>}
            </span>
          </div>
          <div className="mt-1.5 h-2 rounded-full bg-muted" aria-hidden>
            <div
              className="h-2 rounded-full bg-[#142744]"
              style={{ width: `${(r.value / max) * 100}%`, minWidth: r.value > 0 ? 4 : 0 }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function PageTable({
  rows,
  names,
  empty,
}: {
  rows: { path: string; views: number; visitors: number }[];
  names: Record<string, string>;
  empty: string;
}) {
  if (rows.length === 0) return <p className="text-sm text-muted-foreground">{empty}</p>;
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left text-xs text-muted-foreground">
          <th className="py-2 font-normal">Сторінка</th>
          <th className="py-2 text-right font-normal">Відвідувачі</th>
          <th className="py-2 pl-4 text-right font-normal">Перегляди</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.path} className="border-b last:border-0">
            <td className="max-w-0 truncate py-2 pr-3" title={r.path}>
              {pageLabel(r.path, names)}
            </td>
            <td className="py-2 text-right font-medium tabular-nums">{num(r.visitors)}</td>
            <td className="py-2 pl-4 text-right tabular-nums text-muted-foreground">
              {num(r.views)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function SiteStatsView({
  stats,
  names,
  basePath,
}: {
  stats: SiteStats;
  /** slug фахівця → ім'я, для підписів профілів. */
  names: Record<string, string>;
  basePath: string;
}) {
  const { totals, previous, days, daily } = stats;
  const direct = Math.max(totals.visitors - stats.withReferrer, 0);
  const today = daily[daily.length - 1];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Статистика відвідувань</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {stats.since
              ? `Облік ведеться з ${DATE.format(stats.since).replace(/\s*р\.$/, "")}. Ваші власні заходи як адміністратора не враховуються.`
              : "Облік щойно ввімкнено — перші цифри з'являться, щойно на сайт хтось зайде."}
          </p>
        </div>

        {/* Період — один рядок над усіма графіками */}
        <nav aria-label="Період" className="flex gap-1 rounded-lg border p-1 text-sm">
          {PERIODS.map((p) => (
            <Link
              key={p}
              href={`${basePath}?days=${p}`}
              aria-current={p === days ? "page" : undefined}
              className={
                "rounded-md px-3 py-1.5 " +
                (p === days ? "bg-[#142744] text-white" : "text-muted-foreground hover:bg-muted")
              }
            >
              {p} днів
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Tile label="Відвідувачі" value={num(totals.visitors)}>
          <Delta now={totals.visitors} before={previous.visitors} days={days} />
        </Tile>
        <Tile label="Перегляди сторінок" value={num(totals.views)}>
          {totals.visitors > 0
            ? `у середньому ${(totals.views / totals.visitors).toFixed(1).replace(".", ",")} сторінки на відвідувача`
            : "—"}
        </Tile>
        <Tile label="Зайшли на «Фахівці»" value={num(totals.catalog)}>
          {share(totals.catalog, totals.visitors)}% усіх відвідувачів
        </Tile>
        <Tile label="Сьогодні" value={num(today?.visitors ?? 0)}>
          відвідувачів · {num(today?.views ?? 0)} переглядів
        </Tile>
      </div>

      <Card className="mt-6">
        <CardContent className="pt-6">
          <h2 className="text-base font-semibold">Відвідувачі за день</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Скільки різних людей заходило на сайт щодня, останні {days} днів.
          </p>
          <div className="mt-6">
            <VisitsChart
              label="Відвідувачі за день"
              points={daily.map((d) => ({
                day: d.day,
                value: d.visitors,
                details: [
                  { value: d.visitors, label: "відвідувачів" },
                  { value: d.views, label: "переглядів сторінок" },
                  { value: d.catalog, label: "зайшли на «Фахівці»" },
                ],
              }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent className="pt-6">
          <h2 className="text-base font-semibold">Перейшли на «Фахівці» за день</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Скільки різних людей щодня відкривало каталог фахівців.
          </p>
          <div className="mt-6">
            <VisitsChart
              label="Перейшли на «Фахівці» за день"
              points={daily.map((d) => ({
                day: d.day,
                value: d.catalog,
                details: [
                  { value: d.catalog, label: "зайшли на «Фахівці»" },
                  { value: d.visitors, label: "усього відвідувачів" },
                ],
              }))}
            />
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-base font-semibold">Шлях до фахівця</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Скільки відвідувачів дійшло до кожного кроку за {days} днів.
            </p>
            <div className="mt-5">
              <Bars
                rows={[
                  { label: "Зайшли на сайт", value: totals.visitors },
                  {
                    label: "Відкрили каталог фахівців",
                    value: totals.catalog,
                    note: `${share(totals.catalog, totals.visitors)}%`,
                  },
                  {
                    label: "Відкрили профіль фахівця",
                    value: totals.profiles,
                    note: `${share(totals.profiles, totals.visitors)}%`,
                  },
                  { label: "Залишили заявку фахівцеві", value: stats.requests },
                ]}
              />
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Останній рядок — кількість заявок, а не людей: одна людина може написати кільком
              фахівцям.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-base font-semibold">Звідки приходять</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Сайт, з якого людина перейшла на VSI, за {days} днів.
            </p>
            <div className="mt-5">
              {totals.visitors === 0 ? (
                <p className="text-sm text-muted-foreground">Даних ще немає.</p>
              ) : (
                <Bars
                  rows={[
                    { label: "Напряму або джерело невідоме", value: direct },
                    ...stats.referrers.map((r) => ({ label: r.host, value: r.visitors })),
                  ]}
                />
              )}
            </div>
            {stats.devices.length > 0 && (
              <p className="mt-5 border-t pt-4 text-xs text-muted-foreground">
                Пристрої:{" "}
                {stats.devices
                  .map(
                    (d) =>
                      `${DEVICE_LABEL[d.device] ?? d.device} — ${num(d.visitors)} (${share(d.visitors, totals.visitors)}%)`,
                  )
                  .join(", ")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-base font-semibold">Найвідвідуваніші сторінки</h2>
            <div className="mt-3">
              <PageTable rows={stats.topPages} names={names} empty="Даних ще немає." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-base font-semibold">Профілі фахівців</h2>
            <div className="mt-3">
              <PageTable
                rows={stats.profiles}
                names={names}
                empty="Профілі за цей період ще ніхто не відкривав."
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Таблиця — ті самі цифри, що на графіках, для читання й копіювання */}
      <details className="mt-6 rounded-lg border bg-card p-6">
        <summary className="cursor-pointer text-sm font-medium">Усі дні таблицею</summary>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th className="py-2 font-normal">День</th>
              <th className="py-2 text-right font-normal">Відвідувачі</th>
              <th className="py-2 text-right font-normal">Перегляди</th>
              <th className="py-2 text-right font-normal">На «Фахівці»</th>
            </tr>
          </thead>
          <tbody>
            {[...daily].reverse().map((d) => (
              <tr key={d.day} className="border-b last:border-0">
                <td className="py-1.5">{SHORT.format(new Date(`${d.day}T12:00:00Z`))}</td>
                <td className="py-1.5 text-right tabular-nums">{num(d.visitors)}</td>
                <td className="py-1.5 text-right tabular-nums">{num(d.views)}</td>
                <td className="py-1.5 text-right tabular-nums">{num(d.catalog)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
