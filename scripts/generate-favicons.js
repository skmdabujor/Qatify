const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// =============================================================================
// Qatify — New Official Brand Favicon & Icon Generation Script
// Vibrant Signature Orange Squircle with White Shopping Bag & Orange Q Monogram
// =============================================================================

const svgContent = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="iconOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E86E2A" />
      <stop offset="50%" stop-color="#E06C2A" />
      <stop offset="100%" stop-color="#D65D1E" />
    </linearGradient>
  </defs>

  <!-- Squircle Icon Background -->
  <rect width="512" height="512" rx="112" fill="url(#iconOrangeGrad)"/>

  <!-- Centered Tilted Shopping Bag with Q Monogram -->
  <g transform="translate(68, 44) rotate(2.5 188 208)">
    <!-- Arched Bag Handles (Bolder 28px for razor-sharp micro-resolution) -->
    <path 
      d="M 132 112 C 132 32, 244 32, 244 112" 
      stroke="#FFFFFF" 
      stroke-width="28" 
      stroke-linecap="round" 
      fill="none" 
    />
    <!-- Bag Body -->
    <path 
      d="M 82 116 C 82 96, 98 86, 118 86 L 258 86 C 278 86, 294 96, 294 116 L 322 324 C 324 344, 308 358, 288 358 L 88 358 C 68 358, 52 344, 54 324 Z" 
      fill="#FFFFFF" 
    />
    <!-- Rivets / Grommets -->
    <circle cx="132" cy="122" r="9" fill="#E06C2A" />
    <circle cx="244" cy="122" r="9" fill="#E06C2A" />

    <!-- Q Monogram in Signature Orange -->
    <g id="icon-letter-Q">
      <ellipse cx="188" cy="232" rx="60" ry="70" fill="#E06C2A" />
      <ellipse cx="188" cy="230" rx="31" ry="40" fill="#FFFFFF" />
      <!-- Punchy Q Tail -->
      <path 
        d="M 190 252 C 215 268, 244 288, 272 310 C 258 318, 236 322, 218 306 Z" 
        fill="#E06C2A" 
      />
      <path 
        d="M 214 272 L 276 314 C 282 319, 278 330, 268 330 L 232 325 Z" 
        fill="#E06C2A" 
      />
    </g>
  </g>
</svg>`;

function createIco(images) {
  const count = images.length;
  const headerSize = 6;
  const entrySize = 16;
  let offset = headerSize + count * entrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(count, 4); // count of images

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

  // Generate PNG buffers for all standard device resolutions
  const buf16 = await sharp(svgBuf).resize(16, 16).png().toBuffer();
  const buf32 = await sharp(svgBuf).resize(32, 32).png().toBuffer();
  const buf48 = await sharp(svgBuf).resize(48, 48).png().toBuffer();
  const buf180 = await sharp(svgBuf).resize(180, 180).png().toBuffer();
  const buf192 = await sharp(svgBuf).resize(192, 192).png().toBuffer();
  const buf512 = await sharp(svgBuf).resize(512, 512).png().toBuffer();

  // Multi-resolution ICO (16x16, 32x32, 48x48)
  const icoBuf = createIco([
    { width: 16, height: 16, buffer: buf16 },
    { width: 32, height: 32, buffer: buf32 },
    { width: 48, height: 48, buffer: buf48 },
  ]);

  const publicDir = path.join(__dirname, '..', 'public');
  const brandDir = path.join(publicDir, 'brand');

  if (!fs.existsSync(brandDir)) {
    fs.mkdirSync(brandDir, { recursive: true });
  }

  // 1. Vector SVG Favicon
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf-8');
  fs.writeFileSync(path.join(brandDir, 'qatify-icon.svg'), svgContent, 'utf-8');

  // 2. Standard Multi-Res ICO
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuf);

  // 3. PNG Browser & App Icons
  fs.writeFileSync(path.join(publicDir, 'icon.png'), buf32);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), buf180);
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), buf192);
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), buf512);

  // 4. Update brand/ mirrors as well
  fs.writeFileSync(path.join(brandDir, 'qatify-icon-192.png'), buf192);
  fs.writeFileSync(path.join(brandDir, 'qatify-icon-512.png'), buf512);

  // 5. Web App Manifest
  const manifest = {
    name: 'Qatify Qatar - Online Shopping for Mobiles & Electronics',
    short_name: 'Qatify',
    description: 'Qatar premier online store for authentic mobile accessories, chargers, earbuds & smart gadgets.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0A0C',
    theme_color: '#E06C2A',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };

  fs.writeFileSync(
    path.join(publicDir, 'site.webmanifest'),
    JSON.stringify(manifest, null, 2),
    'utf-8'
  );

  console.log('Successfully generated all new Qatify favicons & brand icons in public/ and public/brand/!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
