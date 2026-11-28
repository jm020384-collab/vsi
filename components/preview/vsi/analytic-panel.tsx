import type { AnalyticNote } from "./analytic-notes";
import { ink, serif } from "./theme";
import { getI18n } from "@/lib/i18n/server";

const EYEBROW = "text-[11px] font-medium uppercase tracking-[0.2em] text-[#876428]";

/**
 * Юнгіанська нотатка на сторінці теми.
 *
 * Чотири частини одного блоку: пояснення, поняття, вправа, література.
 * Вони навмисно в одній рамці, а не чотирма окремими секціями —
 * інакше сторінка теми, і без того складена зі списків, розсипалася б
 * на вісім заголовків однакової ваги.
 */
export async function AnalyticPanel({ note }: { note: AnalyticNote }) {
  const { tr } = await getI18n();
  const { body, terms, practice, reading } = note;

  return (
    <section
      aria-labelledby="theme-analytic"
      className="mt-8 rounded-[28px] border border-[#142744]/10 bg-[#FFFDF8] p-7 sm:p-9 lg:p-10"
    >
      <p className={`inline-flex items-center gap-3 ${EYEBROW}`}>
        <span aria-hidden className="h-px w-6 bg-[#B38B49]" />
        {tr("Юнгіанський погляд")}
      </p>

      <h2
        id="theme-analytic"
        className={`mt-4 text-3xl font-normal leading-tight ${ink.strong}`}
        style={serif}
      >
        {tr("Як на це дивиться аналітична психологія")}
      </h2>

      {/* Міра рядка така сама, як в описі теми вище */}
      <div className="mt-5 max-w-[680px] space-y-4">
        {body.map((p) => (
          <p key={p} className={`text-pretty text-[16px] leading-[1.8] ${ink.body}`}>
            {tr(p)}
          </p>
        ))}
      </div>

      <div className="mt-6 border-t border-[#142744]/10 pt-5">
        <h3 className={EYEBROW}>{tr("Поняття")}</h3>
        <dl className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-3">
          {terms.map(({ term, gloss }) => (
            <div key={term}>
              <dt className={`text-[17px] font-normal ${ink.strong}`} style={serif}>
                {tr(term)}
              </dt>
              <dd className={`mt-1.5 text-[14px] leading-relaxed ${ink.muted}`}>{tr(gloss)}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-6 grid gap-4 border-t border-[#142744]/10 pt-5 lg:grid-cols-2 lg:gap-7">
        {/*
          Вправа — єдине на сторінці, що пропонує щось зробити, тому
          лежить на підкладці: інакше губиться серед переліків.
        */}
        <div className="rounded-2xl bg-[#F8F4EC] p-6">
          <h3 className={EYEBROW}>{tr("Вправа")}</h3>
          <p className={`mt-3 text-xl font-normal leading-snug ${ink.strong}`} style={serif}>
            {tr(practice.title)}
          </p>
          <p className={`mt-1 text-[13px] ${ink.soft}`}>{tr(practice.duration)}</p>

          <ol className="mt-5 space-y-3">
            {practice.steps.map((step, i) => (
              <li key={step} className="flex gap-3">
                <span
                  aria-hidden
                  className="w-4 shrink-0 text-[15px] leading-relaxed text-[#876428]"
                  style={serif}
                >
                  {i + 1}
                </span>
                <span className={`text-[14px] leading-relaxed ${ink.body}`}>{tr(step)}</span>
              </li>
            ))}
          </ol>

          {practice.note && (
            <p className="mt-5 border-t border-[#B38B49]/30 pt-4 text-[13px] leading-relaxed text-[#6E5120]">
              {tr(practice.note)}
            </p>
          )}
        </div>

        <div>
          <h3 className={EYEBROW}>{tr("Література")}</h3>
          <ul className="mt-4 space-y-4">
            {reading.map((b) => (
              <li key={b.title}>
                <p className={`text-[17px] font-normal leading-snug ${ink.strong}`} style={serif}>
                  {tr(b.author)} — «{tr(b.title)}»
                </p>
                {/*
                  Назва оригіналу потрібна не для солідності: українських
                  перекладів більшості цих книжок немає, і шукати їх
                  доведеться саме за нею.
                */}
                {b.original && <p className={`mt-0.5 text-[13px] ${ink.soft}`}>{b.original}</p>}
                <p className={`mt-1.5 text-[14px] leading-relaxed ${ink.muted}`}>{tr(b.note)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p
        className={`mt-6 border-t border-[#142744]/10 pt-5 text-[13px] leading-relaxed ${ink.soft}`}
      >
        {tr(
          "Цей розділ оглядовий: він описує спосіб думати про тему, а не ставить діагноз і не замінює роботу з фахівцем.",
        )}
      </p>
    </section>
  );
}
