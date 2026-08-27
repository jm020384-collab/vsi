"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, MapPin, Search, SlidersHorizontal, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { TherapistCard, TherapistCardSkeleton } from "./therapist-card";
import {
  AGE_GROUP_LABEL,
  WORK_FORMAT_LABEL,
  specialistSpace,
  type AgeGroup,
  type Therapist,
  type WorkFormat,
} from "./data";
import { focusRing, ink, touch } from "./theme";

const AGE_GROUPS: AgeGroup[] = ["children", "teens", "adults"];

/** Стабільний псевдовипадковий seed для будь-якого id — і демо "t10", і реального slug. */
function seedFromString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
const WORK_FORMATS: WorkFormat[] = ["individual", "couples", "family", "group"];

type MeetingFilter = "all" | "online" | "offline";

/** Способи познайомитися — не сортування, а різні входи в те саме середовище. */
type ViewMode = "all" | "new" | "research";

const VIEW_TABS: { value: ViewMode; label: string }[] = [
  { value: "all", label: "Усі фахівці" },
  { value: "new", label: "Нові у VSI" },
  { value: "research", label: "Дослідницькі інтереси" },
];

export function TherapistCatalog({ therapists }: { therapists: Therapist[] }) {
  // Довідники — виводяться з переданих даних, щоб не розходились
  const LANGUAGES = useMemo(
    () => [...new Set(therapists.flatMap((t) => t.languages))],
    [therapists],
  );
  const CITIES = useMemo(
    () => [...new Set(therapists.map((t) => t.city).filter(Boolean))] as string[],
    [therapists],
  );

  const [q, setQ] = useState("");
  const [view, setView] = useState<ViewMode>("all");
  const [searchOpen, setSearchOpen] = useState(false);

  // Уточнення пошуку — лише практичні критерії, без теми/ціни/сортування
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [workFormat, setWorkFormat] = useState<WorkFormat | null>(null);
  const [meeting, setMeeting] = useState<MeetingFilter>("all");
  const [lang, setLang] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasRefinedFilters =
    ageGroup !== null ||
    workFormat !== null ||
    meeting !== "all" ||
    lang !== null ||
    city !== null ||
    onlyAvailable;
  const hasActiveFilters = q !== "" || hasRefinedFilters;

  // Імітація мережевого запиту — видно loading state, як у проді
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [q, view, ageGroup, workFormat, meeting, lang, city, onlyAvailable]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return therapists.filter((t) => {
      const okQ =
        !needle ||
        t.name.toLowerCase().includes(needle) ||
        t.approach.toLowerCase().includes(needle) ||
        t.topics.some((topic) => topic.toLowerCase().includes(needle)) ||
        (t.city ?? "").toLowerCase().includes(needle);
      const okAge = !ageGroup || (t.ageGroups ?? ["adults"]).includes(ageGroup);
      const okWork = !workFormat || (t.workFormats ?? ["individual"]).includes(workFormat);
      const okMeeting = meeting === "all" || t.format === meeting || t.format === "both";
      const okLang = !lang || t.languages.includes(lang);
      const okCity = !city || t.city === city;
      const okAvail = !onlyAvailable || t.acceptingNew;
      const okView =
        view === "all" ||
        (view === "new" && t.isNew) ||
        (view === "research" && specialistSpace(t).research.length > 0);
      return okQ && okAge && okWork && okMeeting && okLang && okCity && okAvail && okView;
    });
    // Порядок навмисно редакційний: без «за релевантністю» чи «за ціною» —
    // просто природний, кураторський порядок появи у списку фахівців
    // (реальні профілі йдуть першими — див. page.tsx).
  }, [therapists, q, view, ageGroup, workFormat, meeting, lang, city, onlyAvailable]);

  const resetRefined = () => {
    setAgeGroup(null);
    setWorkFormat(null);
    setMeeting("all");
    setLang(null);
    setCity(null);
    setOnlyAvailable(false);
  };

  const resetAll = () => {
    setQ("");
    setView("all");
    resetRefined();
  };

  const chip = (active: boolean) =>
    cn(
      "inline-flex items-center rounded-full border px-4 text-sm transition-all duration-200 motion-reduce:transition-none",
      touch,
      focusRing,
      active
        ? "border-[#1C3557] bg-[#1C3557] text-[#FFFDF8]"
        : "border-[#142744]/15 bg-[#FFFDF8] text-[#4A5568] hover:border-[#142744]/35 hover:bg-[#142744]/[0.03]",
    );

  return (
    <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8 lg:px-10">
      {/* ── Шапка сторінки: редакційна, без слідів маркетплейсу ── */}
      <div className="relative pt-10 lg:pt-14">
        {/* Тонке орбітальне мереживо — той самий мотив, що й у знаку бренду */}
        <svg
          aria-hidden
          viewBox="0 0 200 200"
          className="pointer-events-none absolute -right-10 -top-8 hidden h-48 w-48 opacity-[0.35] md:block"
          fill="none"
        >
          <ellipse
            cx="100"
            cy="100"
            rx="88"
            ry="34"
            transform="rotate(-20 100 100)"
            stroke="#B38B49"
            strokeOpacity="0.6"
            strokeWidth="1"
          />
          <circle
            cx="100"
            cy="100"
            r="56"
            stroke="#142744"
            strokeOpacity="0.12"
            strokeWidth="1"
            strokeDasharray="1 6"
          />
          <circle cx="168" cy="72" r="4" fill="#B38B49" fillOpacity="0.7" />
        </svg>

        <div className="relative max-w-2xl">
          <h1
            className={`text-balance text-4xl font-normal leading-[1.1] sm:text-5xl ${ink.strong}`}
            style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
          >
            Познайомитися з фахівцями
          </h1>
          <p className={`mt-4 text-pretty text-[17px] leading-relaxed ${ink.muted}`}>
            Кожен фахівець VSI має власний професійний простір. Тут можна познайомитися з його
            підходом до терапії, практикою, професійним шляхом, текстами та темами, які його
            цікавлять.
          </p>
        </div>

        {/* ── Другорядний пошук — не домінує, розкривається на запит ── */}
        <div className="mt-8 border-t border-[#142744]/10 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className={`text-[15px] ${ink.muted}`}>Шукаєте фахівця для конкретної ситуації?</p>
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-expanded={searchOpen}
              aria-controls="refine-search-panel"
              className={cn(
                "inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#142744]/20 px-4 text-sm font-medium text-[#142744]",
                "transition-colors hover:border-[#142744]/40 hover:bg-[#142744]/[0.04] motion-reduce:transition-none",
                focusRing,
              )}
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden />
              Уточнити пошук
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform motion-reduce:transition-none",
                  searchOpen && "rotate-180",
                )}
                aria-hidden
              />
            </button>
          </div>

          {searchOpen && (
            <div
              id="refine-search-panel"
              className="mt-5 rounded-2xl border border-[#142744]/10 bg-[#FFFDF8]/70 p-5 backdrop-blur-sm sm:p-6"
            >
              {/* Ім'я, тема, місто — вільний текстовий пошук лишається, але скромно */}
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#5C6672]"
                  aria-hidden
                />
                <input
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Ім'я, тема або місто"
                  aria-label="Пошук фахівця"
                  className={cn(
                    "h-12 w-full rounded-xl border border-[#142744]/15 bg-[#FFFDF8] pl-11 pr-10 text-[15px] text-[#142744]",
                    "placeholder:text-[#7A828C]",
                    "focus:border-[#1C3557] focus:outline-none focus:ring-2 focus:ring-[#1C3557]/25",
                  )}
                />
                {q && (
                  <button
                    type="button"
                    onClick={() => setQ("")}
                    aria-label="Очистити пошук"
                    className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-[#5C6672] hover:text-[#142744]"
                  >
                    <X className="h-4 w-4" aria-hidden />
                  </button>
                )}
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <span
                    className={`text-[11px] font-medium uppercase tracking-[0.16em] ${ink.soft}`}
                  >
                    З ким працює
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {AGE_GROUPS.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setAgeGroup((cur) => (cur === g ? null : g))}
                        aria-pressed={ageGroup === g}
                        className={chip(ageGroup === g)}
                      >
                        {AGE_GROUP_LABEL[g]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span
                    className={`text-[11px] font-medium uppercase tracking-[0.16em] ${ink.soft}`}
                  >
                    Формат роботи
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {WORK_FORMATS.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setWorkFormat((cur) => (cur === f ? null : f))}
                        aria-pressed={workFormat === f}
                        className={chip(workFormat === f)}
                      >
                        {WORK_FORMAT_LABEL[f]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span
                    className={`text-[11px] font-medium uppercase tracking-[0.16em] ${ink.soft}`}
                  >
                    Формат зустрічі
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(
                      [
                        { value: "all", label: "Будь-який" },
                        { value: "online", label: "Онлайн" },
                        { value: "offline", label: "Очно" },
                      ] as const
                    ).map((m) => (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => setMeeting(m.value)}
                        aria-pressed={meeting === m.value}
                        className={chip(meeting === m.value)}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span
                    className={`text-[11px] font-medium uppercase tracking-[0.16em] ${ink.soft}`}
                  >
                    Мова
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setLang((cur) => (cur === l ? null : l))}
                        aria-pressed={lang === l}
                        className={chip(lang === l)}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Локація — лише коли обрано «Очно», через пошуковий список, не постійні кнопки */}
                {meeting === "offline" && (
                  <div className="sm:col-span-2">
                    <label
                      className={`text-[11px] font-medium uppercase tracking-[0.16em] ${ink.soft}`}
                    >
                      Локація
                    </label>
                    <div className="relative mt-2 max-w-xs">
                      <MapPin
                        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C6672]"
                        aria-hidden
                      />
                      <input
                        list="vsi-city-options"
                        value={city ?? ""}
                        onChange={(e) => setCity(e.target.value || null)}
                        placeholder="Пошук міста"
                        className={cn(
                          "h-11 w-full rounded-xl border border-[#142744]/15 bg-[#FFFDF8] pl-10 pr-3 text-sm text-[#142744]",
                          "placeholder:text-[#7A828C]",
                          "focus:border-[#1C3557] focus:outline-none focus:ring-2 focus:ring-[#1C3557]/25",
                        )}
                      />
                      <datalist id="vsi-city-options">
                        {CITIES.map((c) => (
                          <option key={c} value={c} />
                        ))}
                      </datalist>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#142744]/[0.08] pt-4">
                <button
                  type="button"
                  onClick={() => setOnlyAvailable((v) => !v)}
                  aria-pressed={onlyAvailable}
                  className={chip(onlyAvailable)}
                >
                  Приймає нових клієнтів
                </button>

                {hasRefinedFilters && (
                  <button
                    type="button"
                    onClick={resetRefined}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-normal text-[#5C6672] hover:text-[#142744]",
                      focusRing,
                    )}
                  >
                    <X className="h-3.5 w-3.5" aria-hidden />
                    Скинути уточнення
                  </button>
                )}
              </div>
            </div>
          )}

          {hasActiveFilters && !loading && (
            <p className={`mt-4 text-sm ${ink.soft}`}>
              Показано {results.length} з {therapists.length}
            </p>
          )}
        </div>

        {/* ── Способи познайомитися — не сортування, а різні входи ── */}
        <div className="mt-8 flex flex-wrap items-center gap-x-1 gap-y-2 border-b border-[#142744]/10 pb-px">
          {VIEW_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setView(tab.value)}
              aria-pressed={view === tab.value}
              className={cn(
                "relative inline-flex min-h-[44px] items-center whitespace-nowrap px-3.5 text-sm",
                view === tab.value
                  ? `font-medium ${ink.strong}`
                  : `${ink.soft} hover:text-[#142744]`,
                "after:absolute after:inset-x-3.5 after:bottom-0 after:h-px after:origin-left after:bg-[#B38B49] after:transition-transform motion-reduce:after:transition-none",
                view === tab.value
                  ? "after:scale-x-100"
                  : "after:scale-x-0 hover:after:scale-x-100",
                focusRing,
              )}
            >
              {tab.label}
            </button>
          ))}
          <Link
            href="/library"
            className={cn(
              "inline-flex min-h-[44px] items-center px-3.5 text-sm text-[#5C6672] hover:text-[#142744]",
              focusRing,
            )}
          >
            Читати їхні тексти →
          </Link>
        </div>
      </div>

      {/* ── Результати — одразу після вступу, без стіни фільтрів ── */}
      <div className="pb-20 pt-8" aria-live="polite" aria-busy={loading}>
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <TherapistCardSkeleton key={i} />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((t) => (
              <TherapistCard
                key={t.id}
                therapist={t}
                seed={seedFromString(t.id)}
                variant="editorial"
              />
            ))}
          </div>
        ) : (
          /* ── Empty state ── */
          <div className="border-[#142744]/18 rounded-2xl border border-dashed bg-[#FFFDF8]/60 px-6 py-16 text-center">
            <Image
              src="/brand/motifs/search.png"
              alt=""
              aria-hidden
              width={96}
              height={96}
              className="mx-auto h-24 w-24 rounded-2xl border border-[#142744]/10 object-cover"
            />
            <h2
              className={`mt-5 text-2xl font-normal ${ink.strong}`}
              style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
            >
              За цими критеріями нікого не знайшли
            </h2>
            <p className={`mx-auto mt-3 max-w-md text-[15px] leading-relaxed ${ink.muted}`}>
              Спробуйте прибрати частину уточнень або змінити запит. Або залиште заявку — ми
              підберемо фахівця вручну й повернемось протягом двох робочих днів.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={resetAll}
                className={cn(
                  "inline-flex items-center justify-center rounded-xl bg-[#1C3557] px-6 text-sm font-medium text-[#FFFDF8]",
                  "transition-colors hover:bg-[#142744] motion-reduce:transition-none",
                  touch,
                  focusRing,
                )}
              >
                Скинути все
              </button>
              <a
                href="#"
                className={cn(
                  "border-[#142744]/22 inline-flex items-center justify-center rounded-xl border px-6 text-sm font-medium text-[#142744]",
                  "transition-colors hover:border-[#142744]/45 hover:bg-[#142744]/[0.04] motion-reduce:transition-none",
                  touch,
                  focusRing,
                )}
              >
                Залишити заявку
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
