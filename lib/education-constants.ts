/**
 * Константи розділу освіти живуть ОКРЕМО від lib/actions/education.ts:
 * файл із "use server" може експортувати лише async-функції, і будь-який
 * інший експорт ламає всі server actions у ньому під час виконання.
 */
export const EDUCATION_KINDS = [
  "EDUCATION",
  "SPECIALIZATION",
  "TRAINING",
  "SHORT_PROGRAM",
  "CONFERENCE",
] as const;

export const DEGREE_LEVELS = ["BACHELOR", "MASTER", "SPECIALIST", "PHD", "OTHER"] as const;

export const CONFERENCE_ROLES = ["PARTICIPANT", "SPEAKER", "MODERATOR", "ORGANIZER"] as const;

export const DOCUMENT_TYPES = [
  "DIPLOMA",
  "CERTIFICATE",
  "COURSE",
  "MASTERCLASS",
  "CONFERENCE",
  "ID",
  "OTHER",
] as const;
