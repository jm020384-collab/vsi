/**
 * Який заклад показувати першим як освіту фахівця.
 *
 * Людина, яка шукає психотерапевта, першим бачить вищу освіту за фахом:
 * бакалавр або магістр психології. Курси, перепідготовка й навчання
 * у психотерапевтичних методах важливі, але вони йдуть далі, у профілі.
 * Раніше брався просто перший запис, і в картці опинявся, наприклад,
 * інститут арт-терапії замість університету.
 *
 * Порядок вибору, від найважливішого:
 *   1. вища освіта (бакалавр, магістр, спеціаліст, PhD) за психологією;
 *   2. вища освіта за іншим фахом;
 *   3. запис «Освіта» без вказаного рівня (наприклад, інститут);
 *   4. будь-який запис із закладом.
 * Усередині групи вище стоїть магістр, потім бакалавр. Якщо рівні
 * однакові, лишається перший у списку.
 */
export interface EducationCandidate {
  kind: string;
  institution: string | null;
  degree: string | null;
  specialization: string | null;
  faculty: string | null;
}

/** PhD нижче бакалавра: докторський заклад показуємо, лише коли інших немає. */
const DEGREE_RANK: Record<string, number> = { MASTER: 3, SPECIALIST: 3, BACHELOR: 2, PHD: 1 };

const PSYCHOLOGY = /психолог/i;

function score(e: EducationCandidate) {
  if (!e.institution) return -1;
  const level = e.degree ? (DEGREE_RANK[e.degree] ?? 0) : 0;
  if (e.kind === "EDUCATION" && level > 0) {
    const psychology = PSYCHOLOGY.test(`${e.specialization ?? ""} ${e.faculty ?? ""}`);
    return (psychology ? 40 : 30) + level;
  }
  if (e.kind === "EDUCATION") return 20;
  return 10;
}

export function pickBaseEducation<T extends EducationCandidate>(rows: T[]): T | undefined {
  let best: T | undefined;
  let bestScore = -1;
  for (const row of rows) {
    const s = score(row);
    if (s > bestScore) {
      best = row;
      bestScore = s;
    }
  }
  return best;
}
