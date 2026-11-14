// =============================================================================
// Qatify — Dedicated Favicon & App Icon Generator
// Storage ID: kg2es5ma5mm9fyran39zpnxakn8j497x
// Generates:
// - Multi-resolution ICO (16x16, 32x32, 48x48) -> public/favicon.ico & app/favicon.ico
// - Modern PNG Favicon (32x32) -> public/icon.png & app/icon.png
// - PWA Manifest Icons (192x192, 512x512) -> public/icon-192.png, public/icon-512.png
// - Apple Touch Icon (180x180) -> public/apple-touch-icon.png & app/apple-icon.png
// - Scalable SVG Icon -> public/icon.svg & public/brand/qatify-icon.svg
// - Brand Assets -> public/brand/qatify-icon.png, qatify-icon-512.png, qatify-icon-192.png
// =============================================================================

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const APP_DIR = path.join(ROOT_DIR, 'app');
const BRAND_DIR = path.join(PUBLIC_DIR, 'brand');

async function createIco(pngBuffers) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const dirSize = 16 * count;
  let offset = 6 + dirSize;

  const dirEntries = [];
  for (const item of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.width >= 256 ? 0 : item.width, 0);
    entry.writeUInt8(item.height >= 256 ? 0 : item.height, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(item.buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    dirEntries.push(entry);
    offset += item.buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...pngBuffers.map((p) => p.buffer)]);
}

async function main() {
  const masterRaw = path.join(BRAND_DIR, 'uploaded-favicon-raw.png');
  if (!fs.existsSync(masterRaw)) {
    throw new Error(`Master raw file missing: ${masterRaw}`);
  }

  console.log('1. Precision unmatting and background transparency extraction...');
  const trimmed = await sharp(masterRaw).trim().toBuffer();
  const { data, info } = await sharp(trimmed).raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

  const out = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const idx = i * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const maxDiff = Math.max(255 - r, 255 - g, 255 - b);

    if (maxDiff < 8) {
      out[idx] = 0;
      out[idx + 1] = 0;
      out[idx + 2] = 0;
      out[idx + 3] = 0;
    } else {
      let alpha = Math.min(255, Math.round((maxDiff / 255) * 255 * 1.05));
      if (maxDiff > 30) alpha = 255;
      out[idx] = r;
      out[idx + 1] = g;
      out[idx + 2] = b;
      out[idx + 3] = alpha;
    }
  }

  const masterTransBuffer = await sharp(out, {
    raw: { width: w, height: h, channels: 4 },
  })
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(BRAND_DIR, 'qatify-icon-master.png'), masterTransBuffer);
  fs.writeFileSync(path.join(BRAND_DIR, 'qatify-icon.png'), masterTransBuffer);
  await sharp(masterTransBuffer).webp().toFile(path.join(BRAND_DIR, 'qatify-icon.webp'));

  console.log('2. Generating 512x512 HD master canvas with balanced margins...');
  const icon512Inner = await sharp(masterTransBuffer)
    .resize(420, 420, { fit: 'inside' })
    .toBuffer();
  const icon512Meta = await sharp(icon512Inner).metadata();
  const padLeft = Math.floor((512 - icon512Meta.width) / 2);
  const padTop = Math.floor((512 - icon512Meta.height) / 2);

  const canvas512 = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: icon512Inner, left: padLeft, top: padTop }])
    .png()
    .toBuffer();

  // Save 512x512
  fs.writeFileSync(path.join(PUBLIC_DIR, 'icon-512.png'), canvas512);
  fs.writeFileSync(path.join(BRAND_DIR, 'qatify-icon-512.png'), canvas512);

  // Save 192x192
  const canvas192 = await sharp(canvas512).resize(192, 192).png().toBuffer();
  fs.writeFileSync(path.join(PUBLIC_DIR, 'icon-192.png'), canvas192);
  fs.writeFileSync(path.join(BRAND_DIR, 'qatify-icon-192.png'), canvas192);

  // Save 180x180 Apple Touch Icon (clean soft white background for iOS home screens)
  const appleTouch = await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([
      {
        input: await sharp(masterTransBuffer)
          .resize(144, 144, { fit: 'inside' })
          .toBuffer(),
        gravity: 'centre',
      },
    ])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(PUBLIC_DIR, 'apple-touch-icon.png'), appleTouch);
  fs.writeFileSync(path.join(APP_DIR, 'apple-icon.png'), appleTouch);

  // 32x32 Favicon PNG
  const icon32 = await sharp(canvas512).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.join(PUBLIC_DIR, 'icon.png'), icon32);
  fs.writeFileSync(path.join(APP_DIR, 'icon.png'), icon32);

  // Multi-resolution ICO (16, 32, 48)
  console.log('3. Generating multi-resolution ICO (16x16, 32x32, 48x48)...');
  const p16 = await sharp(canvas512).resize(16, 16).png().toBuffer();
  const p32 = await sharp(canvas512).resize(32, 32).png().toBuffer();
  const p48 = await sharp(canvas512).resize(48, 48).png().toBuffer();

  const icoBuffer = await createIco([
    { width: 16, height: 16, buffer: p16 },
    { width: 32, height: 32, buffer: p32 },
    { width: 48, height: 48, buffer: p48 },
  ]);

  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(APP_DIR, 'favicon.ico'), icoBuffer);

  // Scalable SVG Favicon
  console.log('4. Generating SVG Favicon with high-DPI raster embedding...');
  const iconBase64 = canvas512.toString('base64');
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image href="data:image/png;base64,${iconBase64}" width="512" height="512" />
</svg>`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'icon.svg'), svgContent);
  fs.writeFileSync(path.join(BRAND_DIR, 'qatify-icon.svg'), svgContent);
  fs.writeFileSync(path.join(BRAND_DIR, 'qatify-icon-new.svg'), svgContent);

  console.log('✅ Favicon & App Icon suite successfully generated and deployed!');
}

main().catch((err) => {
  console.error('❌ Error generating favicon:', err);
  process.exit(1);
});
