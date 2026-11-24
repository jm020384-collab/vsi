import { PrismaClient } from "@prisma/client";

import { SPECIALIZATIONS } from "./specializations";

const prisma = new PrismaClient();

// Порядок = порядок у випадаючому списку анкети. "other" — не мова, а
// перемикач, що відкриває поле «Вкажіть іншу мову».
const LANGUAGES = [
  { code: "uk", nameUk: "Українська" },
  { code: "ru", nameUk: "Російська" },
  { code: "en", nameUk: "Англійська" },
  { code: "pl", nameUk: "Польська" },
  { code: "de", nameUk: "Німецька" },
  { code: "fr", nameUk: "Французька" },
  { code: "es", nameUk: "Іспанська" },
  { code: "it", nameUk: "Італійська" },
  { code: "cs", nameUk: "Чеська" },
  { code: "pt", nameUk: "Португальська" },
  { code: "other", nameUk: "Інша мова" },
];

async function main() {
  console.info("🌱 Seed: спеціалізації...");
  for (const s of SPECIALIZATIONS) {
    await prisma.specialization.upsert({
      where: { slug: s.slug },
      update: { nameUk: s.nameUk, description: s.description },
      create: s,
    });
  }

  console.info("🌱 Seed: мови...");
  for (const l of LANGUAGES) {
    await prisma.language.upsert({
      where: { code: l.code },
      update: { nameUk: l.nameUk },
      create: l,
    });
  }

  console.info("✅ Seed готовий.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
