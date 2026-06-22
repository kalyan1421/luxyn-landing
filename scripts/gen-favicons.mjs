// Regenerates the raster app icons from the LUXYN brand mark.
//   app/apple-icon.png  — 180x180, full-bleed (iOS rounds the corners itself)
//   app/favicon.ico     — multi-size (16/32/48) PNG-in-ICO for legacy browsers
// The master vector lives at app/icon.svg (used directly by modern browsers).
// Run:  node scripts/gen-favicons.mjs
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Arch + glowing dot on brand navy. `rounded` controls the corner radius:
// the browser/ICO art is rounded; the Apple touch icon is full-bleed square.
const art = ({ rounded }) => `
<svg width="512" height="512" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" rx="${rounded ? 14 : 0}" fill="#142337"/>
  <g stroke="#E9E6D9" stroke-width="2.6" stroke-linecap="round" fill="none">
    <path d="M11 42 A21 21 0 0 1 53 42"/>
    <path d="M19 42 A13 13 0 0 1 45 42"/>
  </g>
  <circle cx="32" cy="42" r="9" fill="#C2A06B" opacity="0.30"/>
  <circle cx="32" cy="42" r="4.3" fill="#E2CB8E"/>
</svg>`;

const png = (svg, size) =>
  sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();

// Assemble a PNG-in-ICO container (supported by all modern browsers + Windows Vista+).
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entries = [];
  for (const { size, data } of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // width  (0 => 256)
    e.writeUInt8(size >= 256 ? 0 : size, 1); // height
    e.writeUInt8(0, 2); // palette
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // color planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const apple = await png(art({ rounded: false }), 180);
writeFileSync(join(root, "app/apple-icon.png"), apple);

const icoSizes = [16, 32, 48];
const icoImages = await Promise.all(
  icoSizes.map(async (size) => ({ size, data: await png(art({ rounded: true }), size) }))
);
writeFileSync(join(root, "app/favicon.ico"), buildIco(icoImages));

console.log("Wrote app/apple-icon.png (180) and app/favicon.ico (16/32/48)");
