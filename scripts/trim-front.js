/* Готує front-trim.png із front.png.
   Два режими:
   — якщо вихідник УЖЕ з прозорим фоном: лише зрізає прозорі поля
     (межі шукаються по альфа-каналу), пікселі не чіпаються;
   — якщо вихідник на паперовому тлі: знаходить межі композиції
     high-pass-профілем і м'яко ключує папір у прозорість. */
const path = require("path");

let sharp;
try {
  sharp = require("sharp");
} catch {
  sharp = require(path.join(process.cwd(), "node_modules/.pnpm/sharp@0.33.5/node_modules/sharp"));
}

const src = "public/brand/motifs/front.png";
const out = "public/brand/motifs/front-trim.png";
const PAD = 24;

/** Межі за профілем щільності: рядок/стовпець із помітною кількістю влучань. */
function bounds(hitTest, W, H) {
  const colHits = new Array(W).fill(0);
  const rowHits = new Array(H).fill(0);
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      if (hitTest(x, y)) {
        colHits[x]++;
        rowHits[y]++;
      }
    }
  }
  const MIN = 4;
  let minX = 0,
    maxX = W - 2,
    minY = 0,
    maxY = H - 2;
  if (maxX % 2) maxX -= 1;
  if (maxY % 2) maxY -= 1;
  while (minX < W && colHits[minX] < MIN) minX += 2;
  while (maxX > 0 && colHits[maxX] < MIN) maxX -= 2;
  while (minY < H && rowHits[minY] < MIN) minY += 2;
  while (maxY > 0 && rowHits[maxY] < MIN) maxY -= 2;
  const left = Math.max(0, minX - PAD);
  const top = Math.max(0, minY - PAD);
  return {
    left,
    top,
    width: Math.min(W, maxX + PAD) - left,
    height: Math.min(H, maxY + PAD) - top,
  };
}

(async () => {
  const meta = await sharp(src).metadata();

  if (meta.hasAlpha) {
    /* ── Режим 1: прозорість уже є — тільки зрізати порожні поля ── */
    const { data, info } = await sharp(src)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const { width: W, height: H } = info;
    const crop = bounds((x, y) => data[(y * W + x) * 4 + 3] > 10, W, H);
    console.log("alpha source → crop:", crop);
    await sharp(src).extract(crop).toFile(out);
  } else {
    /* ── Режим 2: паперове тло — межі high-pass'ом, папір у прозорість ── */
    const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });
    const { width: W, height: H, channels: C } = info;
    const px = (x, y) => {
      const i = (y * W + x) * C;
      return [data[i], data[i + 1], data[i + 2]];
    };
    const corners = [px(4, 4), px(W - 5, 4), px(4, H - 5), px(W - 5, H - 5)];
    const paper = [0, 1, 2].map((k) =>
      Math.round(corners.reduce((s, c) => s + c[k], 0) / corners.length),
    );
    const { data: blur } = await sharp(src).blur(30).raw().toBuffer({ resolveWithObject: true });

    const crop = bounds(
      (x, y) => {
        const i = (y * W + x) * C;
        const d =
          Math.abs(data[i] - blur[i]) +
          Math.abs(data[i + 1] - blur[i + 1]) +
          Math.abs(data[i + 2] - blur[i + 2]);
        return d > 30;
      },
      W,
      H,
    );
    console.log("paper source → crop:", crop, "paper:", paper);

    const { data: rgba, info: ri } = await sharp(src)
      .extract(crop)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const LO = 16;
    const HI = 58;
    for (let i = 0; i < rgba.length; i += 4) {
      const d =
        Math.abs(rgba[i] - paper[0]) +
        Math.abs(rgba[i + 1] - paper[1]) +
        Math.abs(rgba[i + 2] - paper[2]);
      let a = (d - LO) / (HI - LO);
      a = a < 0 ? 0 : a > 1 ? 1 : a;
      a = a * a * (3 - 2 * a);
      rgba[i + 3] = Math.round(rgba[i + 3] * a);
    }
    await sharp(rgba, { raw: { width: ri.width, height: ri.height, channels: 4 } })
      .png()
      .toFile(out);
  }

  const m = await sharp(out).metadata();
  console.log("OK", m.width, m.height, "alpha:", m.hasAlpha);
})();
