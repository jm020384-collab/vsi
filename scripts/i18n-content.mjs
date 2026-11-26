// Тексти фахівців, яким бракує російського перекладу.
//
//   node scripts/i18n-content.mjs out.json
//
// Записує [{ key, field, uk }] — те, що показується на публічних
// сторінках і ще не має пари в lib/i18n/content-ru.json. Ключ — той самий
// відбиток, що рахує lib/i18n/content.ts: перекладене кладемо туди як
// { key: "текст російською" }. Нічого в базі не змінює.
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const require = createRequire(`${ROOT}package.json`);
try {
  process.loadEnvFile(`${ROOT}.env`);
} catch {
  // Змінні можуть бути задані середовищем.
}
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

const key = (t) => createHash("sha256").update(t.replace(/\r\n/g, "\n").trim()).digest("hex").slice(0, 24);
const cyr = /[А-Яа-яІіЇїЄєҐґ]/;
const done = JSON.parse(readFileSync(`${ROOT}lib/i18n/content-ru.json`, "utf8"));
const out = new Map();
const add = (field, value) => {
  if (!value || !cyr.test(value)) return;
  const k = key(value);
  if (!(k in done) && !out.has(k)) out.set(k, { key: k, field, uk: value.replace(/\r\n/g, "\n").trim() });
};

const profiles = await db.therapistProfile.findMany({
  where: { status: "APPROVED", deletedAt: null },
  include: { education: true, documents: true },
});
for (const p of profiles) {
  for (const f of ["professionalTitle", "analyticalOrientation", "bio", "city", "workingHours"]) add(f, p[f]);
  for (const e of p.education) {
    for (const f of ["title", "institution", "specialization", "duration", "presentationTitle", "eventDate"]) {
      add(`education.${f}`, e[f]);
    }
  }
  for (const d of p.documents) for (const f of ["institution", "specialization"]) add(`document.${f}`, d[f]);
}
const articles = await db.article.findMany({ where: { status: "PUBLISHED", deletedAt: null } });
for (const a of articles) for (const f of ["title", "excerpt", "content"]) add(`article.${f}`, a[f]);
const events = await db.event.findMany({ where: { status: "PUBLISHED" } });
for (const e of events) for (const f of ["title", "description"]) add(`event.${f}`, e[f]);

await db.$disconnect();
writeFileSync(process.argv[2] ?? "content-missing.json", JSON.stringify([...out.values()], null, 2));
console.log(`без перекладу: ${out.size}`);
