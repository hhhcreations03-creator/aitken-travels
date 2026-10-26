/**
 * Builds every logo asset the site uses from the official logo files.
 *
 *   npm run brand
 *
 * Source (assets/brand/): logo.png or logo.jpg, the full logo for light
 * backgrounds. A transparent logo-light.png is used as a fallback source.
 * The script separates the artwork from its background, then writes to
 * public/:
 *   brand/logo.png, brand/logo-light.png        full stacked logo, brown and cream
 *   brand/symbol.png, brand/symbol-light.png    palm symbol only
 *   brand/wordmark.png, brand/wordmark-light.png  name block only
 *   favicon.ico, apple-touch-icon.png, brand/icon-*.png   icons
 *   og.jpg                                       link preview for WhatsApp, Facebook, X
 * and records sizes in src/lib/brand-assets.json for the Logo component.
 * Generated files are committed, so the Vercel build never runs this script.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const PUB = path.join(ROOT, "public");
const SRC = path.join(ROOT, "assets/brand");
const OUT = path.join(PUB, "brand");

/** Brand colours taken from the logo artwork. */
const BROWN = [58, 26, 3]; // #3A1A03
const CREAM = [239, 227, 205]; // #EFE3CD, the logo's own background
const IVORY = [245, 241, 232]; // #F5F1E8, site background
const FOREST_DEEP = [19, 38, 31];

const pick = (...names) => names.map((n) => path.join(SRC, n)).find((p) => fs.existsSync(p));
const source = pick("logo.png", "logo.jpg", "logo.jpeg", "logo-light.png");
if (!source) throw new Error("Put the logo in assets/brand/logo.png (see assets/brand/README.md).");

/** Returns a single-channel alpha mask of the artwork at full resolution. */
async function artworkMask(file) {
  const img = sharp(file);
  const meta = await img.metadata();
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const mask = Buffer.alloc(W * H);
  // Transparent artwork: use its alpha directly.
  let transparentPixels = 0;
  for (let i = 0; i < W * H; i++) if (data[i * 4 + 3] < 250) transparentPixels++;
  if (meta.hasAlpha && transparentPixels > W * H * 0.2) {
    for (let i = 0; i < W * H; i++) mask[i] = data[i * 4 + 3];
    return { mask, W, H };
  }
  // Flat background: key it out by brightness, keeping anti-aliased edges.
  const lum = (i) => 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
  const bg = lum(5 * W + 5);
  const ink = 0.299 * BROWN[0] + 0.587 * BROWN[1] + 0.114 * BROWN[2];
  for (let i = 0; i < W * H; i++) {
    const a = (bg - lum(i)) / (bg - ink);
    mask[i] = Math.round(255 * Math.min(1, Math.max(0, (a - 0.06) / 0.88)));
  }
  return { mask, W, H };
}

/** Bounding box of mask pixels inside a row range. */
function bbox(mask, W, y0, y1) {
  let x0 = W, x1 = 0, top = y1, bottom = y0;
  for (let y = y0; y < y1; y++)
    for (let x = 0; x < W; x++)
      if (mask[y * W + x] > 24) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
  return { left: x0, top, width: x1 - x0 + 1, height: bottom - top + 1 };
}

/** Horizontal bands of artwork separated by empty rows. */
function bands(mask, W, H) {
  const out = [];
  let start = -1;
  for (let y = 0; y < H; y++) {
    let count = 0;
    for (let x = 0; x < W; x++) if (mask[y * W + x] > 24) count++;
    if (count > 3 && start < 0) start = y;
    if (count <= 3 && start >= 0) { out.push([start, y]); start = -1; }
  }
  if (start >= 0) out.push([start, H]);
  return out;
}

/** Solid-colour RGBA image using the mask as alpha. */
function tinted(mask, W, H, rgb) {
  const buf = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    buf[i * 4] = rgb[0]; buf[i * 4 + 1] = rgb[1]; buf[i * 4 + 2] = rgb[2]; buf[i * 4 + 3] = mask[i];
  }
  return sharp(buf, { raw: { width: W, height: H, channels: 4 } });
}

async function writePart(mask, W, H, box, name, targetHeight) {
  const sizes = {};
  for (const [suffix, rgb] of [["", BROWN], ["-light", IVORY]]) {
    const png = await tinted(mask, W, H, rgb).extract(box).png().toBuffer();
    const out = await sharp(png).resize({ height: targetHeight, withoutEnlargement: true }).png({ compressionLevel: 9, palette: false }).toBuffer({ resolveWithObject: true });
    fs.writeFileSync(path.join(OUT, `${name}${suffix}.png`), out.data);
    sizes.width = out.info.width;
    sizes.height = out.info.height;
  }
  return sizes;
}

function ico(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + 16 * pngs.length;
  const entries = pngs.map(({ size, buf }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size, 0); e.writeUInt8(size, 1); e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
    e.writeUInt32LE(buf.length, 8); e.writeUInt32LE(offset, 12);
    offset += buf.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.buf)]);
}

const hex = (rgb) => "#" + rgb.map((v) => v.toString(16).padStart(2, "0")).join("");

/** Square icon: cream tile with the brown palm symbol. */
async function icon(symbolPng, size, { pad = 0.14, radius = 0 } = {}) {
  const inner = Math.round(size * (1 - pad * 2));
  const art = await sharp(symbolPng).resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  const tile = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="${hex(CREAM)}"/></svg>`);
  return sharp(tile).composite([{ input: art, gravity: "centre" }]).png().toBuffer();
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const { mask, W, H } = await artworkMask(source);
  const b = bands(mask, W, H);
  if (b.length < 2) throw new Error("Could not find a symbol above the name in the logo.");
  const full = bbox(mask, W, b[0][0], b[b.length - 1][1]);
  const symbol = bbox(mask, W, b[0][0], b[0][1]);
  const word = bbox(mask, W, b[1][0], b[b.length - 1][1]);

  const sizes = {
    logo: await writePart(mask, W, H, full, "logo", 900),
    symbol: await writePart(mask, W, H, symbol, "symbol", 512),
    wordmark: await writePart(mask, W, H, word, "wordmark", 300),
  };

  // Icons from the brown symbol.
  const symbolPng = await tinted(mask, W, H, BROWN).extract(symbol).png().toBuffer();
  const small = [];
  for (const size of [16, 32, 48]) small.push({ size, buf: await icon(symbolPng, size, { pad: size <= 16 ? 0.04 : 0.08, radius: Math.round(size * 0.18) }) });
  fs.writeFileSync(path.join(PUB, "favicon.ico"), ico(small));
  fs.writeFileSync(path.join(PUB, "apple-touch-icon.png"), await icon(symbolPng, 180, { pad: 0.14 }));
  fs.writeFileSync(path.join(OUT, "icon-192.png"), await icon(symbolPng, 192, { pad: 0.12, radius: 34 }));
  fs.writeFileSync(path.join(OUT, "icon-512.png"), await icon(symbolPng, 512, { pad: 0.12, radius: 92 }));
  fs.writeFileSync(path.join(OUT, "icon-maskable-512.png"), await icon(symbolPng, 512, { pad: 0.22 }));
  if (fs.existsSync(path.join(PUB, "icon.svg"))) fs.rmSync(path.join(PUB, "icon.svg"));

  // Link preview: the dusk pool photograph with the cream logo centred,
  // so it still reads when WhatsApp crops the image to a square.
  const photo = await sharp(path.join(PUB, "images/property/pool-dusk-wide.webp")).resize(1200, 630, { fit: "cover", position: "centre" }).toBuffer();
  const shade = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <defs>
      <radialGradient id="r" cx="50%" cy="50%" r="55%"><stop offset="0" stop-color="${hex(FOREST_DEEP)}" stop-opacity=".78"/><stop offset=".7" stop-color="${hex(FOREST_DEEP)}" stop-opacity=".55"/><stop offset="1" stop-color="${hex(FOREST_DEEP)}" stop-opacity=".35"/></radialGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#r)"/>
    <rect x="22" y="22" width="1156" height="586" fill="none" stroke="${hex(IVORY)}" stroke-opacity=".3"/>
  </svg>`);
  const logoLight = await tinted(mask, W, H, IVORY).extract(full).png().toBuffer();
  const logoOg = await sharp(logoLight).resize({ height: 470 }).toBuffer();
  await sharp(photo)
    .composite([{ input: shade }, { input: logoOg, gravity: "centre" }])
    .jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(path.join(PUB, "og.jpg"));

  fs.writeFileSync(path.join(ROOT, "src/lib/brand-assets.json"), JSON.stringify({ colors: { brown: hex(BROWN), cream: hex(CREAM) }, ...sizes }, null, 2) + "\n");
  console.log(`built from ${path.relative(ROOT, source)}:`, JSON.stringify(sizes));
  console.log(`og.jpg ${Math.round(fs.statSync(path.join(PUB, "og.jpg")).size / 1024)} KB`);
}

await main();
