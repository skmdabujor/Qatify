const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function buildBanner() {
  console.log('Fetching high-res product photos...');

  // 1. ANC Headphones
  const headphonesRaw = await fetchBuffer('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80');
  // 2. Smartwatch
  const watchRaw = await fetchBuffer('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80');
  // 3. TWS Earbuds
  const earbudsRaw = await fetchBuffer('https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80');

  // Process images into full-card high quality PNGs
  const headphonesPng = await sharp(headphonesRaw)
    .resize(360, 420, { fit: 'cover' })
    .png({ quality: 95 })
    .toBuffer();

  const watchPng = await sharp(watchRaw)
    .resize(390, 450, { fit: 'cover' })
    .png({ quality: 95 })
    .toBuffer();

  const earbudsPng = await sharp(earbudsRaw)
    .resize(360, 420, { fit: 'cover' })
    .png({ quality: 95 })
    .toBuffer();

  const headphonesB64 = `data:image/png;base64,${headphonesPng.toString('base64')}`;
  const watchB64 = `data:image/png;base64,${watchPng.toString('base64')}`;
  const earbudsB64 = `data:image/png;base64,${earbudsPng.toString('base64')}`;

  const width = 2400;
  const height = 520;

  // ViewBox: 0 0 1200 260
  // Clean full bleed rectangle (CSS handles border-radius uniformly on all 4 sides)
  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 1200 260" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Deep Obsidian / Tech Gradient -->
      <linearGradient id="adBg" x1="0" y1="0" x2="1200" y2="260" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#08090C" />
        <stop offset="35%" stop-color="#120D1A" />
        <stop offset="70%" stop-color="#22091A" />
        <stop offset="100%" stop-color="#0C040A" />
      </linearGradient>

      <!-- Ambient Glow Behind Products -->
      <radialGradient id="productAmbient" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
        <stop offset="0%" stop-color="#E11D48" stop-opacity="0.50" />
        <stop offset="60%" stop-color="#BE123C" stop-opacity="0.18" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0" />
      </radialGradient>

      <!-- Yellow / Gold Ambient Glow -->
      <radialGradient id="goldAmbient" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
        <stop offset="0%" stop-color="#FACC15" stop-opacity="0.38" />
        <stop offset="70%" stop-color="#EAB308" stop-opacity="0.06" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0" />
      </radialGradient>

      <!-- Electric Yellow Text Gradient -->
      <linearGradient id="textYellow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FFFBEB" />
        <stop offset="35%" stop-color="#FEF08A" />
        <stop offset="100%" stop-color="#FACC15" />
      </linearGradient>

      <!-- Product Card Clip Paths (Full Card Image Display) -->
      <clipPath id="clip1">
        <rect x="0" y="0" width="176" height="200" rx="12" />
      </clipPath>
      <clipPath id="clip2">
        <rect x="0" y="0" width="190" height="220" rx="14" />
      </clipPath>
      <clipPath id="clip3">
        <rect x="0" y="0" width="176" height="200" rx="12" />
      </clipPath>
    </defs>

    <!-- FULL BLEED BACKGROUND (No baked-in corner radius - CSS controls the 4 side radius) -->
    <rect width="1200" height="260" fill="url(#adBg)" />

    <!-- Ambient Product Lighting -->
    <circle cx="950" cy="130" r="240" fill="url(#productAmbient)" />
    <circle cx="680" cy="80" r="160" fill="url(#goldAmbient)" />
    <circle cx="180" cy="130" r="160" fill="url(#productAmbient)" opacity="0.25" />

    <!-- Subtle Diagonal Pattern on Left -->
    <g stroke="#FFFFFF" stroke-opacity="0.025" stroke-width="1.5">
      <line x1="-50" y1="60" x2="260" y2="-60" />
      <line x1="-20" y1="130" x2="290" y2="30" />
      <line x1="10" y1="200" x2="320" y2="100" />
      <line x1="40" y1="270" x2="350" y2="170" />
      <line x1="70" y1="340" x2="380" y2="240" />
    </g>

    <!-- Subtle Sparks / Confetti Accents -->
    <circle cx="510" cy="40" r="3.5" fill="#FACC15" />
    <circle cx="580" cy="225" r="3" fill="#F43F5E" />
    <circle cx="540" cy="100" r="2.5" fill="#38BDF8" opacity="0.8" />
    <polygon points="525,170 531,167 528,174" fill="#FACC15" />
    <polygon points="1150,45 1156,42 1153,49" fill="#F43F5E" />
    <polygon points="1135,225 1141,222 1138,229" fill="#FACC15" />

    <!-- ===================================================================
         LEFT SIDE: ONLY THE BIG TITLE TEXT (ALL OTHER TEXT REMOVED)
    ==================================================================== -->
    <g transform="translate(56, 0)">
      <!-- Line 1: MEGA TECH SALE -->
      <text x="0" y="118" fill="#FFFFFF" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="44" font-weight="900" letter-spacing="-0.035em">
        MEGA TECH SALE
      </text>

      <!-- Line 2: UP TO 60% OFF TRENDING GADGETS -->
      <text x="0" y="170" fill="url(#textYellow)" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="36" font-weight="900" letter-spacing="-0.025em">
        UP TO 60% OFF <tspan fill="#FFFFFF" font-weight="800" font-size="30">TRENDING GADGETS</tspan>
      </text>
    </g>

    <!-- ===================================================================
         RIGHT SIDE: CLEAN PRODUCT SHOWCASE (FULL PRODUCT IMAGES, NO TEXT)
    ==================================================================== -->

    <!-- Product 1: Studio ANC Headphones (Left) -->
    <g transform="translate(615, 30)">
      <!-- Shadow Glow -->
      <rect x="-2" y="-2" width="180" height="204" rx="14" fill="#E11D48" fill-opacity="0.2" />
      <!-- Image with Rounded Clip -->
      <g clip-path="url(#clip1)">
        <image href="${headphonesB64}" x="0" y="0" width="176" height="200" preserveAspectRatio="xMidYMid slice" />
      </g>
      <!-- Outer Border -->
      <rect width="176" height="200" rx="12" stroke="#FFFFFF" stroke-opacity="0.15" stroke-width="1.5" fill="none" />
    </g>

    <!-- Product 2: Ultra Smartwatch (Center - Hero Elevated) -->
    <g transform="translate(808, 20)">
      <!-- Prominent Ambient Shadow -->
      <rect x="-3" y="-3" width="196" height="226" rx="16" fill="#BE123C" fill-opacity="0.4" />
      <!-- Image with Rounded Clip -->
      <g clip-path="url(#clip2)">
        <image href="${watchB64}" x="0" y="0" width="190" height="220" preserveAspectRatio="xMidYMid slice" />
      </g>
      <!-- Glowing Red Border -->
      <rect width="190" height="220" rx="14" stroke="#F43F5E" stroke-width="2" fill="none" />
    </g>

    <!-- Product 3: PulsePro ANC Earbuds (Right) -->
    <g transform="translate(1015, 30)">
      <!-- Shadow Glow -->
      <rect x="-2" y="-2" width="180" height="204" rx="14" fill="#E11D48" fill-opacity="0.2" />
      <!-- Image with Rounded Clip -->
      <g clip-path="url(#clip3)">
        <image href="${earbudsB64}" x="0" y="0" width="176" height="200" preserveAspectRatio="xMidYMid slice" />
      </g>
      <!-- Outer Border -->
      <rect width="176" height="200" rx="12" stroke="#FFFFFF" stroke-opacity="0.15" stroke-width="1.5" fill="none" />
    </g>
  </svg>`;

  console.log('Rendering new banner with only big title text...');
  const outWebp = await sharp(Buffer.from(svg))
    .webp({ quality: 92 })
    .toBuffer();

  const outPng = await sharp(Buffer.from(svg))
    .png({ quality: 92 })
    .toBuffer();

  const outDir = path.join(__dirname, '..', 'public', 'banners');
  fs.writeFileSync(path.join(outDir, 'sale-promo-banner.webp'), outWebp);
  fs.writeFileSync(path.join(outDir, 'sale-promo-banner.png'), outPng);

  console.log('Successfully generated new clean advertisement banner!');
  console.log(`WebP: ${outWebp.length} bytes, PNG: ${outPng.length} bytes`);
}

buildBanner().catch(err => {
  console.error(err);
  process.exit(1);
});
