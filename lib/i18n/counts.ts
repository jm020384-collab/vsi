import { pluralForm, type Translate } from "./translate";

/** Три форми для 1, 2 і 5: «1 стаття · 2 статті · 5 статей». */
export const COUNT_FORMS = {
  therapists: ["{n} фахівець", "{n} фахівці", "{n} фахівців"],
  articles: ["{n} стаття", "{n} статті", "{n} статей"],
  lectures: ["{n} лекція", "{n} лекції", "{n} лекцій"],
  groups: ["{n} група", "{n} групи", "{n} груп"],
  years: ["{n} рік", "{n} роки", "{n} років"],
  programs: ["{n} програма", "{n} програми", "{n} програм"],
} as const satisfies Record<string, readonly [string, string, string]>;

export function countLabel(n: number, kind: keyof typeof COUNT_FORMS, tr: Translate): string {
  return tr(pluralForm(n, COUNT_FORMS[kind]), { n });
}
