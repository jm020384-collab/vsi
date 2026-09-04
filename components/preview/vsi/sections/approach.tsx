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
const GOLD_LIGHT = VSI.goldBright;

/** Чотирикутна зірка — наскрізний акцент усіх чотирьох знаків. */
function starPath(cx: number, cy: number, r: number) {
  const w = r * 0.26;
  return [
    `M ${cx} ${cy - r}`,
    `L ${cx + w} ${cy - w}`,
    `L ${cx + r} ${cy}`,
    `L ${cx + w} ${cy + w}`,
    `L ${cx} ${cy + r}`,
    `L ${cx - w} ${cy + w}`,
    `L ${cx - r} ${cy}`,
    `L ${cx - w} ${cy - w}`,
    "Z",
  ].join(" ");
}

/**
 * Вертикальна вісь із крапкою вгорі — спільний каркас чотирьох знаків.
 * Саме вона тримає їх як набір, а не як чотири окремі малюнки.
 */
function Axis({ top, bottom }: { top: number; bottom: number }) {
  return (
    <g>
      <line
        x1="32"
        y1={top}
        x2="32"
        y2={bottom}
        stroke={GOLD}
        strokeWidth="0.6"
        strokeOpacity="0.5"
      />
      <circle cx="32" cy={top} r="1.3" fill={GOLD} />
    </g>
  );
}

/** Спільний градієнт золота; визначається один раз на секцію. */
const GOLD_FILL = "url(#vsi-approach-gold)";

/** Контейнер — арка, що тримає простір. */
function IconVessel() {
  return (
    <g fill="none">
      {/* Відлуння арки — пунктирна дуга ззовні */}
      <path
        d="M 13 45 A 19 19 0 0 1 51 45"
        stroke={GOLD}
        strokeWidth="0.7"
        strokeOpacity="0.45"
        strokeDasharray="0.6 3"
      />
      <Axis top={14} bottom={52} />
      {/* Права половина арки залита золотом — світло всередині контейнера */}
      <path d="M 32 20 A 10 10 0 0 1 42 30 L 42 45 L 32 45 Z" fill={GOLD_FILL} />
      <path d="M 22 45 L 22 30 A 10 10 0 0 1 42 30 L 42 45" stroke={NAVY} strokeWidth="1.3" />
      <line x1="13" y1="45" x2="51" y2="45" stroke={NAVY} strokeWidth="1" strokeOpacity="0.5" />
      <circle cx="32" cy="32" r="3.6" fill={GOLD} />
      <path d={starPath(32, 48.5, 4)} fill={GOLD} fillOpacity="0.75" />
    </g>
  );
}

/** Частина і ціле — те, що виникає саме в перетині. */
function IconIntersect() {
  return (
    <g fill="none">
      <Axis top={14} bottom={50} />
      <circle cx="25.5" cy="32" r="13" stroke={GOLD} strokeWidth="1.1" />
      <circle cx="38.5" cy="32" r="13" stroke={NAVY} strokeWidth="1.1" />
      <path d={starPath(32, 32, 5)} fill={GOLD} />
      <circle cx="32" cy="50" r="1.3" fill={GOLD} />
    </g>
  );
}

/** Несвідоме — відображення під поверхнею, глибше за видиме. */
function IconStates() {
  return (
    <g fill="none">
      <Axis top={13} bottom={51} />
      <path d="M 18 36 A 14 14 0 0 1 46 36" stroke={GOLD} strokeWidth="1.1" />
      <line x1="11" y1="36" x2="53" y2="36" stroke={NAVY} strokeWidth="1" strokeOpacity="0.65" />
      {/* Відображення — те саме, але нижче поверхні й дедалі тихіше */}
      <g stroke={NAVY} strokeWidth="0.8">
        <line x1="21" y1="40" x2="43" y2="40" strokeOpacity="0.3" />
        <line x1="24" y1="43" x2="40" y2="43" strokeOpacity="0.2" />
        <line x1="27" y1="46" x2="37" y2="46" strokeOpacity="0.12" />
      </g>
      <circle cx="32" cy="36" r="4.2" fill={GOLD_FILL} />
      <path d={starPath(32, 15.5, 4)} fill={GOLD} fillOpacity="0.75" />
      <circle cx="32" cy="51" r="1.3" fill={GOLD} />
    </g>
  );
}

/** Внутрішній центр, довкола якого йде рух. */
function IconCore() {
  return (
    <g fill="none">
      <Axis top={11} bottom={53} />
      {/* Зовнішні дуги — рух, що не замикається */}
      <path d="M 13 24 A 21 21 0 0 0 13 40" stroke={NAVY} strokeWidth="0.9" strokeOpacity="0.5" />
      <path d="M 51 24 A 21 21 0 0 1 51 40" stroke={NAVY} strokeWidth="0.9" strokeOpacity="0.5" />
      <circle
        cx="32"
        cy="32"
        r="16"
        stroke={GOLD}
        strokeWidth="0.7"
        strokeOpacity="0.6"
        strokeDasharray="0.6 3.2"
      />
      <circle cx="32" cy="32" r="11" stroke={GOLD} strokeWidth="1.1" />
      <circle cx="32" cy="32" r="4.6" fill={GOLD_FILL} />
      <circle cx="32" cy="53" r="1.3" fill={GOLD} />
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
      {/*
        Градієнт золота живе окремо від знаків: усі чотири лежать у своїх
        <svg>, а спільний <defs> достатньо оголосити раз на секцію.
      */}
      <svg width="0" height="0" aria-hidden className="absolute">
        <defs>
          <linearGradient id="vsi-approach-gold" x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0%" stopColor={GOLD_LIGHT} />
            <stop offset="100%" stopColor={GOLD} />
          </linearGradient>
        </defs>
      </svg>

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
              <span className="mx-auto inline-grid h-[42px] w-[42px] place-items-center rounded-full border border-[#B38B49]/30 bg-[#F8F4EC] transition-colors duration-300 group-hover:border-[#B38B49]/70 motion-reduce:transition-none">
                <svg viewBox="0 0 64 64" className="h-10 w-10" aria-hidden>
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
