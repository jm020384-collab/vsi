# Аналітична Терапія — сайт + PWA

Платформа для популяризації аналітично орієнтованої психотерапії та пошуку фахівця.

**Стек:** Next.js 15 (App Router, RSC, Server Actions) · TypeScript strict · PostgreSQL + Prisma · Auth.js v5 · Tailwind v3 + shadcn/ui · Serwist (PWA) · UploadThing · Resend · react-leaflet · next-intl.

Повний план MVP — у `../docs/sorted-frolicking-stearns.md` (6 спринтів).

---

## Передумови

- **Node.js 20 LTS** ([nodejs.org](https://nodejs.org/) або через `winget install OpenJS.NodeJS.LTS`)
- **pnpm 9+** (`corepack enable && corepack prepare pnpm@latest --activate`)
- Акаунт у [Neon](https://neon.tech) (EU-регіон)
- Акаунти у [Resend](https://resend.com), [UploadThing](https://uploadthing.com), [Google Cloud](https://console.cloud.google.com/) — для відповідних провайдерів

## Перший запуск

```powershell
# 1. Залежності
pnpm install

# 2. Скопіювати env і заповнити секрети
Copy-Item .env.example .env

# 3. Створити схему БД
pnpm prisma:migrate

# 4. Сід довідників (спеціалізації, мови)
pnpm db:seed

# 5. Dev-сервер
pnpm dev
```

Сайт: http://localhost:3000

## Скрипти

| Команда               | Дія                             |
| --------------------- | ------------------------------- |
| `pnpm dev`            | Запустити Next.js у dev-режимі  |
| `pnpm build`          | Збірка продакшна (з Serwist SW) |
| `pnpm start`          | Запустити продакшн-збірку       |
| `pnpm lint`           | ESLint                          |
| `pnpm typecheck`      | tsc --noEmit                    |
| `pnpm format`         | Prettier --write                |
| `pnpm prisma:migrate` | Запустити нову міграцію в dev   |
| `pnpm prisma:deploy`  | Застосувати міграції у проді    |
| `pnpm prisma:studio`  | Prisma Studio (UI для БД)       |
| `pnpm db:seed`        | Сід спеціалізацій і мов         |

## Структура

```
app/
  (public)/        — публічні сторінки (лендинг, каталог, профілі, блог, юридичне)
  (auth)/          — вхід, реєстрація, перевірка email
  (therapist)/     — кабінет фахівця (захищено middleware)
  (admin)/         — адмін-панель (захищено middleware)
  api/             — REST endpoints (auth, uploadthing, публічні GET)
  manifest.ts      — PWA manifest
  sw.ts            — Serwist service worker (стратегії кешування)
components/        — UI (shadcn) + кастомні
lib/
  db.ts            — Prisma singleton
  utils.ts         — хелпери (cn, формат ціни, дата)
  hash.ts          — sha256/hashIp для anti-spam
  schemas/         — Zod-схеми (auth, therapist, contact-request, review)
  actions/         — Server Actions (register, …)
prisma/
  schema.prisma    — моделі даних
  seed.ts          — сід довідників
auth.ts            — Auth.js v5 (адаптер Prisma, провайдери)
auth.config.ts     — Edge-сумісна частина (RBAC у middleware)
middleware.ts      — захист маршрутів
```

## Дорожня карта (нагадування зі стратегічного плану)

- ✅ **Спринт 1 — Фундамент** (поточний): scaffolding, Prisma, Auth.js, базовий UI, заглушки сторінок, PWA-каркас.
- **Спринт 2** — Каталог + редактор профілю фахівця + карта + UploadThing
- **Спринт 3** — Верифікація + контакт-форма + Resend нотифікації + Turnstile + pgcrypto
- **Спринт 4** — Блог + MDX-редактор + Postgres FTS + текстові відгуки
- **Спринт 5** — i18n + GDPR Server Actions + Serwist + офлайн
- **Спринт 6** — Sentry + Lighthouse + Playwright + реліз

## Деплой

- **Vercel** для застосунку (Next.js auto)
- **Neon** для БД (увімкніть branching → preview-деплої отримають окрему БД)
- DNS + EU-регіони для всіх процесорів (Vercel/Neon/Resend/UploadThing/Sentry) — обов'язково для GDPR

## Безпека та GDPR

- Тема — психічне здоров'я (GDPR art. 9 — спеціальна категорія)
- Не зберігаємо діагнози у MVP; форма попереджає
- ContactRequest.message — шифрується (pgcrypto, спринт 3)
- Документи верифікації — приватний bucket з підписаними URL (TTL 5 хв)
- IP не зберігається — лише hash із сіллю (`IP_HASH_SALT`)
- Soft-delete акаунту + auto-purge анонімних запитів через 12 міс
