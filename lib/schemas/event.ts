export const EVENT_TYPES = [
  "LECTURE",
  "SEMINAR",
  "CONFERENCE",
  "SUPERVISION_GROUP",
  "INTERVISION_GROUP",
  "READING_GROUP",
  "TRAINING_PROGRAM",
  "WORKSHOP",
] as const;

/** Межі полів — спільні для перевірки на сервері й лічильників на формі. */
export const EVENT_LIMITS = {
  title: { min: 4, max: 160 },
  description: { min: 20, max: 1000 },
} as const;
