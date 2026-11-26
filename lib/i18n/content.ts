import { createHash } from "node:crypto";

import type { Material, PublicEvent, Therapist } from "@/components/preview/vsi/data";
import type { Locale } from "./config";
import dictionary from "./content-ru.json";

/**
 * Переклади текстів, які написали фахівці: біографії, статті, події.
 *
 * Ключ — відбиток українського оригіналу, а не id запису. Щойно автор
 * змінить текст, відбиток перестане збігатися й замість застарілого
 * перекладу покажеться нова версія мовою автора. Оригінали в базі не
 * чіпаємо, і чужих слів, яких автор уже не пише, не публікуємо.
 */
const RU: Record<string, string> = dictionary;

export function contentKey(text: string): string {
  return createHash("sha256").update(text.replace(/\r\n/g, "\n").trim()).digest("hex").slice(0, 24);
}

export function createContentTranslator(locale: Locale) {
  let used = false;

  function text(value: string): string;
  function text(value: string | null | undefined): string | null;
  function text(value: string | null | undefined): string | null {
    if (!value) return value ?? null;
    if (locale !== "ru") return value;
    const found = RU[contentKey(value)];
    if (!found) return value;
    used = true;
    return found;
  }

  /**
   * Ім'я людини — так, як вона сама пише його російською. Позначки
   * «перекладено» не вмикає: ім'я не є перекладом чиїхось слів.
   */
  function name(value: string): string {
    return locale === "ru" ? (RU[contentKey(value)] ?? value) : value;
  }

  return {
    text,
    name,
    /** Чи показано на сторінці хоч один переклад — тоді потрібна позначка. */
    get used() {
      return used;
    },
  };
}

export type ContentTranslator = ReturnType<typeof createContentTranslator>;

/*
 * Нижче — переклад уже зібраних даних. Значення, за якими фільтрують
 * (теми, мови, категорії, види матеріалів), лишаються українськими:
 * вони перекладаються під час показу, через tr().
 */

export function localizeTherapists(list: Therapist[], c: ContentTranslator): Therapist[] {
  return list.map((t) => ({
    ...t,
    name: c.name(t.name),
    status: c.text(t.status),
    approach: c.text(t.approach),
    city: c.text(t.city) ?? undefined,
    researchInterests: t.researchInterests?.map((r) => c.text(r)),
    education: t.education && {
      ...t.education,
      institution: c.text(t.education.institution),
    },
  }));
}

/** Викликати після підбору за темами: він шукає українські слова. */
export function localizeMaterials(list: Material[], c: ContentTranslator): Material[] {
  return list.map((m) => ({
    ...m,
    title: c.text(m.title),
    excerpt: c.text(m.excerpt),
    author: c.name(m.author),
  }));
}

/** Так само, як і з текстами, — лише після підбору за темами. */
export function localizeEvents(list: PublicEvent[], c: ContentTranslator): PublicEvent[] {
  return list.map((e) => ({
    ...e,
    title: c.text(e.title),
    description: c.text(e.description),
    lead: c.name(e.lead),
  }));
}
