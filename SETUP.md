# Що зробити перед першим `pnpm install`

Node.js не було знайдено у системі при початковому скафолдингу. Усі вихідні файли вже створені вручну — залишилось встановити Node і виконати команди.

## 1. Встановити Node.js 20 LTS

PowerShell з правами адміністратора:

```powershell
winget install OpenJS.NodeJS.LTS
```

Відкрити НОВЕ вікно терміналу і перевірити:

```powershell
node --version   # має бути v20.x.x
npm --version
```

## 2. Активувати pnpm через corepack

```powershell
corepack enable
corepack prepare pnpm@latest --activate
pnpm --version
```

## 3. Створити проєкт у Neon і заповнити .env

1. Зареєструватися на https://neon.tech (EU-регіон).
2. Створити проєкт `analyt-psy`.
3. Скопіювати connection string у `DATABASE_URL`.
4. Згенерувати `AUTH_SECRET`:

```powershell
# Якщо є openssl:
openssl rand -base64 32

# Або у Node:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

5. Скопіювати `.env.example` у `.env` і заповнити решту змінних (інші сервіси можна підключити пізніше — у MVP досить DATABASE_URL і AUTH_SECRET).

```powershell
Copy-Item .env.example .env
```

## 4. Встановити залежності та запустити

```powershell
pnpm install
pnpm prisma:migrate
pnpm db:seed
pnpm dev
```

Відкрити http://localhost:3000.

## 5. Перевірити, що працює

- Лендинг `/` — повинен показати hero-секцію
- `/pro-metod` — інформаційна сторінка
- `/therapists` — порожній каталог (0 фахівців, поки не зробите когось APPROVED)
- `/register` — реєстрація (Credentials)
- `/login` — вхід
- Після реєстрації як `THERAPIST` (через `?role=THERAPIST`) має створитися чернетка профілю

## Наступні кроки (спринт 2)

- Реалізувати повну форму редагування профілю фахівця
- UploadThing для фото профілю
- Геокодування міст через OpenStreetMap Nominatim
- Карта `react-leaflet` у каталозі
