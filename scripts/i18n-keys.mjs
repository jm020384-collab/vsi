// Збирає українські рядки, які бачить клієнт, і звіряє їх зі словником
// lib/i18n/ru.json.
//
//   pnpm i18n:check            — показати рядки без перекладу (код виходу 1)
//   pnpm i18n:check --write F  — записати їх у файл F як {"рядок": ""}
//
// Рядки з бази (назви тем і мов) тут не враховуються — їх видно на сайті
// за позначкою відсутнього перекладу (оригінал українською).
import { createRequire } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const require = createRequire(`${ROOT}package.json`);
const ts = require("typescript");

// Цілі файли, усе українське в яких іде до клієнта.
const WHOLE = [
  "app/(public)",
  "app/layout.tsx",
  "app/not-found.tsx",
  "app/error.tsx",
  "components/site-header.tsx",
  "components/site-footer.tsx",
  "components/theme-toggle.tsx",
  "components/preview/vsi/data.ts",
  "components/preview/vsi/analytic-notes.ts",
  "components/preview/vsi/analytic-panel.tsx",
  "components/preview/vsi/catalog.tsx",
  "components/preview/vsi/therapist-card.tsx",
  "components/preview/vsi/contact-request-form.tsx",
  "components/preview/vsi/event-interest-buttons.tsx",
  "components/preview/vsi/social-support-form.tsx",
  "components/preview/vsi/sections/approach.tsx",
  "components/preview/vsi/sections/closing.tsx",
  "components/preview/vsi/sections/ethics.tsx",
  "components/preview/vsi/sections/events-row.tsx",
  "components/preview/vsi/sections/for-professionals.tsx",
  "components/preview/vsi/sections/hero.tsx",
  "components/preview/vsi/sections/how-to-choose.tsx",
  "components/preview/vsi/sections/quote-band.tsx",
  "components/preview/vsi/sections/specialists-row.tsx",
  "components/preview/vsi/sections/texts-row.tsx",
  "components/preview/vsi/sections/theme-circles.tsx",
  "components/preview/vsi/sections/themes.tsx",
  "lib/brand.ts",
  "lib/events.ts",
  "lib/i18n/counts.ts",
  "lib/social-support.ts",
  "lib/therapy-approaches.ts",
  "lib/schemas/contact-request.ts",
  "lib/schemas/social-support.ts",
  "lib/actions/contact-request.ts",
  "lib/actions/social-support.ts",
  "lib/actions/events.ts",
];
// Звідусіль ще й аргументи tr("…").
const ANYWHERE = ["app", "components", "lib"];

const cyr = /[А-Яа-яІіЇїЄєҐґ]/;
const files = (paths) =>
  execSync(`git ls-files --cached --others --exclude-standard ${paths.map((p) => `"${p}"`).join(" ")}`, { cwd: ROOT, encoding: "utf8" })
    .split("\n")
    .filter((f) => /\.tsx?$/.test(f));

const keys = new Set();
const whole = new Set(files(WHOLE));
for (const file of files(ANYWHERE)) {
  const src = readFileSync(ROOT + file, "utf8");
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const visit = (n) => {
    if ((ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) && cyr.test(n.text)) {
      const p = n.parent;
      const isTr = ts.isCallExpression(p) && p.expression.getText() === "tr" && p.arguments[0] === n;
      // Серверні дії: лише тексти помилок, не листи фахівцям.
      const inMail =
        file.startsWith("lib/actions/") &&
        ts.isPropertyAssignment(p) &&
        ["subject", "text"].includes(p.name.getText());
      if (isTr || (whole.has(file) && !inMail)) keys.add(n.text);
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
}

const ru = JSON.parse(readFileSync(`${ROOT}lib/i18n/ru.json`, "utf8"));
const missing = [...keys].filter((k) => !(k in ru)).sort();
const at = process.argv.indexOf("--write");
if (at > 0) {
  writeFileSync(process.argv[at + 1], JSON.stringify(Object.fromEntries(missing.map((k) => [k, ""])), null, 2));
}
console.log(`рядків: ${keys.size}, без перекладу: ${missing.length}`);
if (at < 0 && missing.length) {
  for (const k of missing.slice(0, 50)) console.log(" •", k.slice(0, 100));
  process.exitCode = 1;
}
