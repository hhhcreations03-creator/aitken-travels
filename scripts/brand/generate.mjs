/**
 * Builds the favicon and app icon set.
 *
 *   npm run brand
 *
 * Reads optional source logos from assets/brand/ (see the README there) and
 * writes to public/. Generated files are committed, so the Vercel build never
 * runs this script.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const PUB = path.join(ROOT, "public");
const SRC = path.join(ROOT, "assets/brand");
const C = { ivory: "#F5F1E8", forest: "#1E3A2F" };

const find = (base) => ["svg", "png"].map((ext) => path.join(SRC, `${base}.${ext}`)).find((p) => fs.existsSync(p));
const userIcon = find("icon");
const userLogoLight = find("logo-light");
const userLogo = find("logo");

/** The LH monogram: a gabled roofline over a ligatured L and H. */
const markPaths = `<path d="M11 27 L32 11 L53 27"/><path d="M19 30 V53 H33"/><path d="M33 30 V53 M45 30 V53 M33 41.5 H45"/>`;
const markSvg = (stroke, width) =>
  `<g fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="square" stroke-linejoin="miter">${markPaths}</g>`;

/** Square app icon: forest tile with an ivory mark. `scale` shrinks the mark for maskable safe zones. */
function tileSvg({ stroke = 2.6, radius = 0, scale = 1 } = {}) {
  const t = 32 - 32 * scale;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="${radius}" fill="${C.forest}"/>
  <g transform="translate(${t} ${t + 1 * scale}) scale(${scale})">${markSvg(C.ivory, stroke)}</g>
</svg>`;
}

async function iconBuffer(size, opts) {
  if (userIcon) {
    const inner = Math.round(size * (opts.scale ?? 0.78));
    const art = await sharp(userIcon, { density: 1200 }).resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
    const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${(opts.radius ?? 0) * (size / 64)}" fill="${C.forest}"/></svg>`);
    return sharp(bg).composite([{ input: art, gravity: "centre" }]).png().toBuffer();
  }
  return sharp(Buffer.from(tileSvg(opts)), { density: 1200 }).resize(size, size).png().toBuffer();
}

function ico(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + 16 * pngs.length;
  const entries = pngs.map(({ size, buf }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(buf.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += buf.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.buf)]);
}

async function buildIcons() {
  fs.mkdirSync(path.join(PUB, "brand"), { recursive: true });
  // Small sizes get a heavier stroke so the mark survives at 16 px.
  const small = await Promise.all([16, 32, 48].map(async (size) => ({ size, buf: await iconBuffer(size, { stroke: size <= 16 ? 4.6 : 3.8, radius: 12, scale: 0.92 }) })));
  fs.writeFileSync(path.join(PUB, "favicon.ico"), ico(small));
  fs.writeFileSync(
    path.join(PUB, "icon.svg"),
    userIcon && userIcon.endsWith(".svg") ? fs.readFileSync(userIcon) : tileSvg({ stroke: 3.4, radius: 12, scale: 0.92 })
  );
  fs.writeFileSync(path.join(PUB, "apple-touch-icon.png"), await iconBuffer(180, { stroke: 2.8, radius: 0, scale: 0.78 }));
  fs.writeFileSync(path.join(PUB, "brand/icon-192.png"), await iconBuffer(192, { stroke: 3, radius: 12, scale: 0.86 }));
  fs.writeFileSync(path.join(PUB, "brand/icon-512.png"), await iconBuffer(512, { stroke: 2.6, radius: 12, scale: 0.86 }));
  fs.writeFileSync(path.join(PUB, "brand/icon-maskable-512.png"), await iconBuffer(512, { stroke: 2.6, radius: 0, scale: 0.62 }));
  if (userLogo) fs.copyFileSync(userLogo, path.join(PUB, "brand", path.basename(userLogo)));
  if (userLogoLight) fs.copyFileSync(userLogoLight, path.join(PUB, "brand", path.basename(userLogoLight)));
  console.log(`icons written${userIcon ? ` from ${path.relative(ROOT, userIcon)}` : " from the built-in monogram"}`);
}

await buildIcons();
