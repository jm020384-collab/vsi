PWA-іконки потрібно згенерувати після створення логотипа.

Команда:
  pnpm dlx pwa-asset-generator ./brand/logo.svg ./public/icons --manifest ./public/manifest.webmanifest --icon-only --type png --opaque false --padding "12%"

Очікувані файли:
  icon-192.png
  icon-512.png
  maskable-192.png
  maskable-512.png
  apple-touch-icon.png
