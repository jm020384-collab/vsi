export const ARTICLE_KINDS = [
  "ARTICLE",
  "NOTE",
  "RESEARCH",
  "BOOK_REVIEW",
  "VIDEO",
  "AUDIO",
] as const;

/** Межі полів — спільні для перевірки на сервері й лічильників на формі. */
export const ARTICLE_LIMITS = {
  title: { min: 6, max: 160 },
  excerpt: { min: 20, max: 400 },
  content: { min: 80 },
  abstract: { max: 600 },
  references: { max: 60 },
} as const;
