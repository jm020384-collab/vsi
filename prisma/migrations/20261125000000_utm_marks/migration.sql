-- Лише додавання необов'язкових колонок: наявні рядки не змінюються.
ALTER TABLE "PageView" ADD COLUMN "utmSource" TEXT,
ADD COLUMN "utmMedium" TEXT,
ADD COLUMN "utmCampaign" TEXT;

ALTER TABLE "ContactRequest" ADD COLUMN "utmSource" TEXT,
ADD COLUMN "utmMedium" TEXT,
ADD COLUMN "utmCampaign" TEXT;
