import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SPECIALIZATIONS: Array<{ slug: string; nameUk: string; description: string }> = [
  {
    slug: "anxiety",
    nameUk: "Тривожні розлади",
    description: "Робота з тривогою, панічними атаками, фобіями",
  },
  { slug: "depression", nameUk: "Депресія", description: "Депресивні стани, втрата сенсу, апатія" },
  {
    slug: "relationships",
    nameUk: "Стосунки",
    description: "Партнерські, сімейні, дитячо-батьківські стосунки",
  },
  {
    slug: "trauma",
    nameUk: "Психологічна травма",
    description: "Робота з наслідками травматичних подій",
  },
  { slug: "ptsd", nameUk: "ПТСР", description: "Посттравматичний стресовий розлад" },
  {
    slug: "grief",
    nameUk: "Горювання та втрата",
    description: "Переживання втрат, смерті близьких",
  },
  {
    slug: "self-esteem",
    nameUk: "Самооцінка та ідентичність",
    description: "Робота з образом себе, кризою ідентичності",
  },
  {
    slug: "psychosomatics",
    nameUk: "Психосоматика",
    description: "Тілесні прояви психічних процесів",
  },
  {
    slug: "eating-disorders",
    nameUk: "Розлади харчової поведінки",
    description: "Анорексія, булімія, компульсивне переїдання",
  },
  {
    slug: "obsessions",
    nameUk: "Нав'язливості та компульсії",
    description: "ОКР, нав'язливі думки",
  },
  { slug: "addiction", nameUk: "Залежності", description: "Хімічні та поведінкові залежності" },
  {
    slug: "existential",
    nameUk: "Екзистенційні питання",
    description: "Сенс життя, страх смерті, свобода",
  },
  {
    slug: "career",
    nameUk: "Професійне самовизначення",
    description: "Вибір професії, кар'єрні кризи",
  },
  { slug: "parenting", nameUk: "Батьківство", description: "Робота з батьками, виховання" },
  { slug: "adolescents", nameUk: "Підлітковий вік", description: "Робота з підлітками" },
  { slug: "lgbtqi", nameUk: "ЛГБТКІ+", description: "Робота з ЛГБТКІ+ темами та клієнтами" },
  {
    slug: "war-experience",
    nameUk: "Воєнний досвід",
    description: "Робота з досвідом війни, вимушеним переселенням",
  },
  { slug: "burnout", nameUk: "Емоційне вигорання", description: "Хронічне вигорання, втома" },
  {
    slug: "dreams",
    nameUk: "Аналіз сновидінь",
    description: "Робота зі сновидіннями в аналітичному ключі",
  },
  {
    slug: "personality-disorders",
    nameUk: "Розлади особистості",
    description: "Прикордонний, нарцисичний та інші розлади особистості",
  },
];

const LANGUAGES = [
  { code: "uk", nameUk: "Українська" },
  { code: "en", nameUk: "Англійська" },
  { code: "pl", nameUk: "Польська" },
  { code: "de", nameUk: "Німецька" },
  { code: "ru", nameUk: "Російська" },
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
