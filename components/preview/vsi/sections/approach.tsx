import { Eyebrow, Lead, SectionTitle, Wrap } from "../ui";
import { ink, VSI } from "../theme";

/**
 * Що таке аналітично орієнтована психотерапія.
 *
 * Світла секція з тонкими лінійними діаграмами в колах — стиль
 * бренд-борду. Алхімічність передана структурою, а не символами:
 * контейнер, частина і ціле, зміна станів, внутрішній центр.
 */

const NAVY = VSI.navy;
const GOLD = VSI.gold;

/** Контейнер — арка, що тримає простір. */
function IconVessel() {
  return (
    <g fill="none">
      <path d="M 20 44 L 20 27 A 12 12 0 0 1 44 27 L 44 44" stroke={NAVY} strokeWidth="1.4" />
      <line x1="15" y1="44" x2="49" y2="44" stroke={NAVY} strokeWidth="1.4" strokeOpacity="0.6" />
      <circle cx="32" cy="32" r="4.5" fill={GOLD} />
    </g>
  );
}

/** Частина і ціле — перетин форм. */
function IconIntersect() {
  return (
    <g fill="none">
      <circle cx="27" cy="32" r="11" stroke={NAVY} strokeWidth="1.4" />
      <circle cx="37" cy="32" r="11" stroke={NAVY} strokeWidth="1.4" strokeOpacity="0.55" />
      <path
        d="M 32 22.9 A 11 11 0 0 1 32 41.1 A 11 11 0 0 1 32 22.9 Z"
        fill={GOLD}
        fillOpacity="0.35"
      />
    </g>
  );
}

/** Несвідоме — під поверхнею: видима частина і глибина із золотом. */
function IconStates() {
  return (
    <g fill="none">
      {/* Лінія поверхні */}
      <line x1="12" y1="30" x2="52" y2="30" stroke={NAVY} strokeWidth="1.4" strokeOpacity="0.55" />
      {/* Видима половина — тонкий контур над поверхнею */}
      <path d="M 20 30 A 12 12 0 0 1 44 30" stroke={NAVY} strokeWidth="1.4" />
      {/* Занурена половина — глибина */}
      <path d="M 20 30 A 12 12 0 0 0 44 30 Z" fill={NAVY} fillOpacity="0.5" />
      {/* Цінне лежить у глибині */}
      <circle cx="32" cy="37" r="3" fill={GOLD} />
    </g>
  );
}

/** Внутрішній центр. */
function IconCore() {
  return (
    <g fill="none">
      <circle
        cx="32"
        cy="32"
        r="14"
        stroke={NAVY}
        strokeWidth="1.4"
        strokeOpacity="0.4"
        strokeDasharray="1 4"
      />
      <circle cx="32" cy="32" r="8.5" stroke={NAVY} strokeWidth="1.4" />
      <circle cx="32" cy="32" r="3" fill={GOLD} />
    </g>
  );
}

const PRINCIPLES = [
  {
    icon: IconVessel,
    title: "Простір, що витримує",
    body: "Регулярність, час і межі створюють контейнер, у якому можна не поспішати і не пояснювати себе наперед.",
  },
  {
    icon: IconIntersect,
    title: "Те, що виникає в контакті",
    body: "Стосунки з терапевтом стають матеріалом дослідження — у них проявляється те, що повторюється й поза кабінетом.",
  },
  {
    icon: IconStates,
    title: "Робота з несвідомим",
    body: "Сновидіння, обмовки, повторювані сценарії. Не тлумачення наперед, а спільне читання власної мови.",
  },
  {
    icon: IconCore,
    title: "Рух до цілісності",
    body: "Мета не в тому, щоб позбутися частини себе, а в тому, щоб відновити зв'язок із тим, що було відкинуте.",
  },
];

export function Approach() {
  return (
    <section id="approach" className="relative bg-[#FFFDF8]">
      <Wrap className="py-10 lg:py-14">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow className="justify-center">Про підхід</Eyebrow>
          <SectionTitle className="mt-6">
            Терапія, що працює з причиною, а не лише з симптомом
          </SectionTitle>
          <Lead className="mt-6">
            Аналітично орієнтована психотерапія допомагає зрозуміти, що стоїть за тривогою,
            повторюваними труднощами чи внутрішніми конфліктами. Вона досліджує особисту історію,
            стосунки, психологічні захисти та несвідомі процеси, щоб розширити розуміння себе і
            можливість більш вільного вибору.
          </Lead>
        </div>

        <div className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4">
          {PRINCIPLES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="group text-center">
              {/* Іконка в тонкому колі — мотив бренд-борду */}
              <span className="mx-auto inline-grid h-[72px] w-[72px] place-items-center rounded-full border border-[#142744]/15 bg-[#F8F4EC] transition-colors duration-300 group-hover:border-[#B38B49]/60 motion-reduce:transition-none">
                <svg viewBox="0 0 64 64" className="h-14 w-14" aria-hidden>
                  <Icon />
                </svg>
              </span>

              <h3
                className={`mt-5 text-2xl font-normal leading-snug ${ink.strong}`}
                style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
              >
                {title}
              </h3>
              <p className={`mx-auto mt-3 max-w-[17rem] text-[15px] leading-relaxed ${ink.muted}`}>
                {body}
              </p>
            </div>
          ))}
        </div>

        {/* Клінічна традиція і професійні стандарти */}
        <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-[#142744]/10 bg-[#F8F4EC] p-6 text-center sm:p-8">
          <p className={`text-[15px] leading-relaxed ${ink.muted}`}>
            <span className={`font-medium ${ink.strong}`}>
              Аналітична традиція має понад століття клінічного розвитку
            </span>{" "}
            та залишається важливою частиною сучасної психотерапії. Фахівці VSI працюють у
            професійних спільнотах, проходять власну терапію або аналіз і регулярну супервізію, що
            підтримує якість, відповідальність та етичність терапевтичної роботи.
          </p>
        </div>
      </Wrap>
    </section>
  );
}
