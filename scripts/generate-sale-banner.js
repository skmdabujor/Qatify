const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function fetchImageBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function generateBanner() {
  console.log('Fetching product images...');

  // 1. Earbuds
  const earbudsRaw = await fetchImageBuffer('https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80');
  // 2. Smartwatch
  const watchRaw = await fetchImageBuffer('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80');
  // 3. Headphones
  const headphonesRaw = await fetchImageBuffer('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80');

  // Resize and optimize product images
  const earbudsBuf = await sharp(earbudsRaw)
    .resize(320, 240, { fit: 'cover' })
    .webp({ quality: 90 })
    .toBuffer();

  const watchBuf = await sharp(watchRaw)
    .resize(340, 260, { fit: 'cover' })
    .webp({ quality: 90 })
    .toBuffer();

  const headphonesBuf = await sharp(headphonesRaw)
    .resize(320, 240, { fit: 'cover' })
    .webp({ quality: 90 })
    .toBuffer();

  const earbudsB64 = `data:image/webp;base64,${earbudsBuf.toString('base64')}`;
  const watchB64 = `data:image/webp;base64,${watchBuf.toString('base64')}`;
  const headphonesB64 = `data:image/webp;base64,${headphonesBuf.toString('base64')}`;

  const width = 2400;
  const height = 520;

  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 1200 260" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Background Main Gradient -->
      <linearGradient id="bannerBg" x1="0" y1="0" x2="1200" y2="260" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#07080B" />
        <stop offset="40%" stop-color="#140A18" />
        <stop offset="75%" stop-color="#23091B" />
        <stop offset="100%" stop-color="#12050D" />
      </linearGradient>

      <!-- Crimson Glow -->
      <radialGradient id="crimsonGlow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
        <stop offset="0%" stop-color="#E11D48" stop-opacity="0.45" />
        <stop offset="60%" stop-color="#BE123C" stop-opacity="0.15" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0" />
      </radialGradient>

      <!-- Gold Glow -->
      <radialGradient id="goldGlow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
        <stop offset="0%" stop-color="#FACC15" stop-opacity="0.40" />
        <stop offset="70%" stop-color="#EAB308" stop-opacity="0.08" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0" />
      </radialGradient>

      <!-- Button Gradient -->
      <linearGradient id="btnGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#F43F5E" />
        <stop offset="100%" stop-color="#BE123C" />
      </linearGradient>

      <!-- Gold Text Gradient -->
      <linearGradient id="goldText" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FFFBEB" />
        <stop offset="40%" stop-color="#FEF08A" />
        <stop offset="100%" stop-color="#EAB308" />
      </linearGradient>

      <!-- Badge Red Gradient -->
      <linearGradient id="badgeRed" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#E11D48" />
        <stop offset="100%" stop-color="#9F1239" />
      </linearGradient>

      <!-- Card Clip Paths -->
      <clipPath id="cardClip1">
        <rect x="0" y="0" width="160" height="110" rx="12" />
      </clipPath>
      <clipPath id="cardClip2">
        <rect x="0" y="0" width="170" height="120" rx="14" />
      </clipPath>
      <clipPath id="cardClip3">
        <rect x="0" y="0" width="160" height="110" rx="12" />
      </clipPath>
    </defs>

    <!-- 1. Background Container with 16px border-radius -->
    <rect width="1200" height="260" rx="16" fill="url(#bannerBg)" />
    <!-- Outer Border -->
    <rect x="0.5" y="0.5" width="1199" height="259" rx="15.5" stroke="#3F122B" stroke-opacity="0.8" />

    <!-- 2. Ambient Lighting Effects -->
    <circle cx="950" cy="130" r="240" fill="url(#crimsonGlow)" />
    <circle cx="680" cy="70" r="160" fill="url(#goldGlow)" />
    <circle cx="200" cy="220" r="140" fill="url(#crimsonGlow)" opacity="0.3" />

    <!-- Decorative Diagonal Pattern lines on Left -->
    <g stroke="#FFFFFF" stroke-opacity="0.03" stroke-width="2">
      <line x1="-50" y1="50" x2="250" y2="-50" />
      <line x1="-20" y1="120" x2="280" y2="20" />
      <line x1="10" y1="190" x2="310" y2="90" />
      <line x1="40" y1="260" x2="340" y2="160" />
    </g>

    <!-- Confetti / Tech Spark Accents -->
    <circle cx="490" cy="45" r="3.5" fill="#FACC15" />
    <circle cx="610" cy="215" r="2.5" fill="#F43F5E" />
    <circle cx="560" cy="30" r="4" fill="#38BDF8" opacity="0.8" />
    <polygon points="530,95 536,92 533,98" fill="#FACC15" />
    <polygon points="1130,55 1136,52 1133,58" fill="#F43F5E" />
    <polygon points="1070,225 1076,222 1073,228" fill="#FACC15" />

    <!-- ===================================================================
         LEFT COLUMN: CAMPAIGN HEADLINE & VALUE PROPOSITION
    ==================================================================== -->
    <g transform="translate(48, 0)">
      <!-- Top Pill Badge -->
      <g transform="translate(0, 32)">
        <rect width="270" height="26" rx="13" fill="#2E0E1F" stroke="#E11D48" stroke-width="1.2" />
        <circle cx="14" cy="13" r="4.5" fill="#FACC15" />
        <text x="26" y="17" fill="#FECDD3" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="10.5" font-weight="700" letter-spacing="0.5">
          FLASH TECH DEALS • 6–10 DAYS TO QATAR
        </text>
      </g>

      <!-- Main Headline Line 1: MID-SEASON MEGA SALE -->
      <text x="0" y="96" fill="#FFFFFF" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="34" font-weight="900" letter-spacing="-0.03em">
        MID-SEASON MEGA SALE
      </text>

      <!-- Main Headline Line 2: UP TO 60% OFF + GADGETS -->
      <text x="0" y="136" fill="url(#goldText)" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="32" font-weight="900" letter-spacing="-0.02em">
        UP TO 60% OFF <tspan fill="#FFFFFF" font-weight="800" font-size="26">TOP TRENDING TECH</tspan>
      </text>

      <!-- Subtitle Description -->
      <text x="0" y="168" fill="#94A3B8" font-family="'Inter', system-ui, sans-serif" font-size="13" font-weight="500">
        Premium ANC Earbuds, Smartwatches, GaN Fast Chargers &amp; MagSafe Essentials
      </text>

      <!-- CTA Button Pill + Extra Promo Tag -->
      <g transform="translate(0, 192)">
        <!-- Pill Button -->
        <rect width="186" height="40" rx="20" fill="url(#btnGrad)" />
        <text x="24" y="25" fill="#FFFFFF" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="13" font-weight="800" letter-spacing="0.3">
          EXPLORE DEALS
        </text>
        <circle cx="160" cy="20" r="10" fill="#FFFFFF" fill-opacity="0.2" />
        <text x="156" y="24" fill="#FFFFFF" font-family="sans-serif" font-size="13" font-weight="900">→</text>

        <!-- Guarantee Pill next to button -->
        <g transform="translate(202, 7)">
          <text x="0" y="18" fill="#CBD5E1" font-family="'Inter', system-ui, sans-serif" font-size="12" font-weight="600">
            ✈️ Tracked Direct Air Express Delivery to Doha
          </text>
        </g>
      </g>
    </g>

    <!-- ===================================================================
         RIGHT COLUMN: 3 SHOWCASED PRODUCT CARDS
    ==================================================================== -->

    <!-- Product Card 1: Wireless Headphones (Left) -->
    <g transform="translate(620, 36)">
      <!-- Card Container with Glassmorphism -->
      <rect width="168" height="190" rx="14" fill="#130B1C" fill-opacity="0.9" stroke="#3B1C38" stroke-width="1.2" />
      <!-- Image Wrapper with Clip -->
      <g transform="translate(4, 4)" clip-path="url(#cardClip1)">
        <image href="${headphonesB64}" x="0" y="0" width="160" height="110" preserveAspectRatio="xMidYMid slice" />
      </g>
      <!-- Badge: -45% OFF -->
      <g transform="translate(10, 12)">
        <rect width="56" height="18" rx="4" fill="#E11D48" />
        <text x="6" y="13" fill="#FFFFFF" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="800">-45%</text>
      </g>
      <!-- Title -->
      <text x="12" y="134" fill="#F1F5F9" font-family="'Inter', system-ui, sans-serif" font-size="11.5" font-weight="700">Studio ANC Pro</text>
      <text x="12" y="148" fill="#94A3B8" font-family="'Inter', system-ui, sans-serif" font-size="9.5" font-weight="500">Spatial Hi-Res Audio</text>
      <!-- Price -->
      <text x="12" y="172" fill="#FACC15" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="800">QAR 189</text>
      <text x="82" y="171" fill="#64748B" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="500" text-decoration="line-through">349</text>
    </g>

    <!-- Product Card 2: Smartwatch (Center - Hero Elevated) -->
    <g transform="translate(804, 20)">
      <!-- Drop Shadow Glow -->
      <rect x="-2" y="-2" width="186" height="224" rx="18" fill="#BE123C" fill-opacity="0.25" />
      <!-- Card Container -->
      <rect width="182" height="220" rx="16" fill="#1A0D24" stroke="#F43F5E" stroke-width="1.8" />
      <!-- Image Wrapper with Clip -->
      <g transform="translate(6, 6)" clip-path="url(#cardClip2)">
        <image href="${watchB64}" x="0" y="0" width="170" height="120" preserveAspectRatio="xMidYMid slice" />
      </g>
      <!-- Top Badge: 🔥 BEST SELLER -->
      <g transform="translate(12, 14)">
        <rect width="78" height="20" rx="5" fill="url(#badgeRed)" />
        <text x="7" y="14" fill="#FFFFFF" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="9" font-weight="800" letter-spacing="0.3">🔥 -50% OFF</text>
      </g>
      <!-- Title -->
      <text x="14" y="148" fill="#FFFFFF" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="13" font-weight="800">Apex Ultra Watch</text>
      <text x="14" y="164" fill="#CBD5E1" font-family="'Inter', system-ui, sans-serif" font-size="10" font-weight="500">AMOLED • ECG &amp; Titanium</text>
      <!-- Price -->
      <text x="14" y="196" fill="#FACC15" font-family="'JetBrains Mono', monospace" font-size="17" font-weight="900">QAR 169</text>
      <text x="96" y="194" fill="#94A3B8" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="600" text-decoration="line-through">339</text>
    </g>

    <!-- Product Card 3: ANC Earbuds (Right) -->
    <g transform="translate(1002, 36)">
      <!-- Card Container -->
      <rect width="168" height="190" rx="14" fill="#130B1C" fill-opacity="0.9" stroke="#3B1C38" stroke-width="1.2" />
      <!-- Image Wrapper with Clip -->
      <g transform="translate(4, 4)" clip-path="url(#cardClip3)">
        <image href="${earbudsB64}" x="0" y="0" width="160" height="110" preserveAspectRatio="xMidYMid slice" />
      </g>
      <!-- Badge: -40% OFF -->
      <g transform="translate(10, 12)">
        <rect width="56" height="18" rx="4" fill="#E11D48" />
        <text x="6" y="13" fill="#FFFFFF" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="800">-40%</text>
      </g>
      <!-- Title -->
      <text x="12" y="134" fill="#F1F5F9" font-family="'Inter', system-ui, sans-serif" font-size="11.5" font-weight="700">PulsePro Earbuds</text>
      <text x="12" y="148" fill="#94A3B8" font-family="'Inter', system-ui, sans-serif" font-size="9.5" font-weight="500">48dB Hybrid ANC</text>
      <!-- Price -->
      <text x="12" y="172" fill="#FACC15" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="800">QAR 149</text>
      <text x="82" y="171" fill="#64748B" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="500" text-decoration="line-through">249</text>
    </g>
  </svg>`;

  console.log('Rendering high-res banner via sharp...');
  const outWebp = await sharp(Buffer.from(svg))
    .webp({ quality: 92 })
    .toBuffer();

  const outPng = await sharp(Buffer.from(svg))
    .png({ quality: 92 })
    .toBuffer();

  const outDir = path.join(__dirname, '..', 'public', 'banners');
  fs.writeFileSync(path.join(outDir, 'sale-promo-banner.webp'), outWebp);
  fs.writeFileSync(path.join(outDir, 'sale-promo-banner.png'), outPng);

  console.log(`Successfully generated banner!`);
  console.log(`WebP size: ${outWebp.length} bytes`);
  console.log(`PNG size: ${outPng.length} bytes`);
}

generateBanner().catch(err => {
  console.error(err);
  process.exit(1);
});

