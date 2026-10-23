const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const svgContent = `<svg width="512" height="512" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="qatifyRedGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F43F5E" />
      <stop offset="1" stop-color="#BE123C" />
    </linearGradient>
    <linearGradient id="sparkYellowGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FEF08A" />
      <stop offset="1" stop-color="#EAB308" />
    </linearGradient>
  </defs>

  <!-- Squircle Badge -->
  <rect
    x="4"
    y="4"
    width="92"
    height="92"
    rx="24"
    fill="url(#qatifyRedGrad)"
  />

  <!-- Geometric "Q" Body Outer Ring -->
  <circle
    cx="48"
    cy="46"
    r="26"
    stroke="#FFFFFF"
    stroke-width="11"
    stroke-linecap="round"
  />

  <!-- Dynamic Forward-Leaning Lightning Bolt / Spark as the "Q" Tail in Electric Yellow -->
  <path
    d="M 52 50 L 66 32 L 60 52 L 78 50 L 46 80 L 52 58 Z"
    fill="url(#sparkYellowGrad)"
    stroke="#0A0A0C"
    stroke-width="2.5"
    stroke-linejoin="round"
  />

  <!-- Forward Speed Lines in Yellow -->
  <circle cx="28" cy="28" r="3.5" fill="#FACC15" />
</svg>`;

function createIco(images) {
  const count = images.length;
  const headerSize = 6;
  const entrySize = 16;
  let offset = headerSize + count * entrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const entries = [];
  for (const img of images) {
    const entry = Buffer.alloc(entrySize);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(img.buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += img.buffer.length;
  }

  return Buffer.concat([header, ...entries, ...images.map(img => img.buffer)]);
}

async function main() {
  const svgBuf = Buffer.from(svgContent);

  // Generate PNG buffers
  const buf16 = await sharp(svgBuf).resize(16, 16).png().toBuffer();
  const buf32 = await sharp(svgBuf).resize(32, 32).png().toBuffer();
  const buf48 = await sharp(svgBuf).resize(48, 48).png().toBuffer();
  const buf180 = await sharp(svgBuf).resize(180, 180).png().toBuffer();
  const buf192 = await sharp(svgBuf).resize(192, 192).png().toBuffer();
  const buf512 = await sharp(svgBuf).resize(512, 512).png().toBuffer();

  const icoBuf = createIco([
    { width: 16, height: 16, buffer: buf16 },
    { width: 32, height: 32, buffer: buf32 },
    { width: 48, height: 48, buffer: buf48 },
  ]);

  const publicDir = path.join(__dirname, '..', 'public');

  // Write SVG files (stored in public/ to avoid Next.js conflicting-public-file-page errors)
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf-8');

  // Write ICO files
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuf);

  // Write PNG files
  fs.writeFileSync(path.join(publicDir, 'icon.png'), buf32);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), buf180);
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), buf192);
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), buf512);

  console.log('Successfully generated all favicons & icons in public/!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

