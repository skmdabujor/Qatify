const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Ensure directories exist
const brandDir = path.join(__dirname, '../public/brand');
if (!fs.existsSync(brandDir)) {
  fs.mkdirSync(brandDir, { recursive: true });
}

// -----------------------------------------------------------------------------
// 1. Signature Orange Badge Logo (Direct inspiration from user's Sokoni example)
// -----------------------------------------------------------------------------
function getOrangeBadgeSvg({
  width = 640,
  height = 300,
  tagline = "SHOP MORE, PAY LESS"
} = {}) {
  return `<svg width="${width}" height="${height}" viewBox="0 0 640 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="qatifyOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E86E2A" />
      <stop offset="50%" stop-color="#E06C2A" />
      <stop offset="100%" stop-color="#D65D1E" />
    </linearGradient>
    <filter id="cardShadow" x="-10%" y="-10%" width="125%" height="125%">
      <feDropShadow dx="0" dy="5" stdDeviation="6" flood-color="#000000" flood-opacity="0.14" />
    </filter>
  </defs>

  <!-- Orange Background with modern rounded corners -->
  <rect width="640" height="300" rx="24" fill="url(#qatifyOrangeGrad)"/>

  <!-- Centered Logo Composition -->
  <g transform="translate(68, 38)">
    
    <!-- Tilted Shopping Bag with Q cutout -->
    <g transform="rotate(3.5 85 92)" filter="url(#cardShadow)">
      <!-- Arched Bag Handles -->
      <path 
        d="M 60 50 C 60 18, 110 18, 110 50" 
        stroke="#FFFFFF" 
        stroke-width="8.5" 
        stroke-linecap="round" 
        fill="none" 
      />
      <!-- Bag Body -->
      <path 
        d="M 40 52 C 40 44, 46 40, 54 40 L 118 40 C 126 40, 131 44, 131 52 L 143 140 C 144 148, 138 154, 130 154 L 42 154 C 34 154, 28 148, 29 140 Z" 
        fill="#FFFFFF" 
      />
      <!-- Handle Rivets/Grommets -->
      <circle cx="60" cy="54" r="3.5" fill="#E06C2A" />
      <circle cx="110" cy="54" r="3.5" fill="#E06C2A" />

      <!-- Q Monogram in Bag in Signature Orange #E06C2A -->
      <g id="letter-Q">
        <!-- Q Outer Ring -->
        <ellipse cx="85" cy="102" rx="25" ry="30" fill="#E06C2A" />
        <!-- Q Inner Counter (White) -->
        <ellipse cx="85" cy="101" rx="13" ry="17" fill="#FFFFFF" />
        <!-- Dynamic Q Tail -->
        <path 
          d="M 86 110 C 96 117, 108 125, 120 134 C 114 137, 105 139, 97 132 Z" 
          fill="#E06C2A" 
        />
        <path 
          d="M 96 118 L 122 136 C 125 138, 123 142, 119 142 L 104 140 Z" 
          fill="#E06C2A" 
        />
      </g>
    </g>

    <!-- Wordmark 'atify' in bold rounded font -->
    <text 
      x="172" 
      y="134" 
      font-family="'Plus Jakarta Sans', Arial, Helvetica, sans-serif" 
      font-size="108" 
      font-weight="900" 
      letter-spacing="-2.5" 
      fill="#FFFFFF"
    >atify</text>

    <!-- Playful Smiling Face Dot on 'i' covering native dot at (304, 64) -->
    <g transform="translate(304, 64)">
      <!-- White Dot Base -->
      <circle cx="0" cy="0" r="13" fill="#FFFFFF" />
      <!-- Twin Cute Eyes -->
      <circle cx="-4" cy="-2.5" r="1.8" fill="#E06C2A" />
      <circle cx="4" cy="-2.5" r="1.8" fill="#E06C2A" />
      <!-- Happy Smile Arc -->
      <path 
        d="M -5 1.5 Q 0 7.5 5 1.5" 
        stroke="#E06C2A" 
        stroke-width="2.2" 
        stroke-linecap="round" 
        fill="none" 
      />
    </g>

    <!-- Bottom Tagline Banner: — SHOP MORE, PAY LESS — -->
    <g transform="translate(0, 180)">
      <!-- Left Dash -->
      <line x1="50" y1="12" x2="88" y2="12" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" />
      
      <!-- White Tagline Capsule Pill -->
      <rect x="100" y="0" width="245" height="25" rx="12.5" fill="#FFFFFF" />
      
      <!-- Tagline Text inside the white pill -->
      <text 
        x="222" 
        y="17" 
        font-family="'Plus Jakarta Sans', Arial, Helvetica, sans-serif" 
        font-size="12.5" 
        font-weight="900" 
        letter-spacing="2" 
        fill="#E06C2A" 
        text-anchor="middle"
      >${tagline}</text>
      
      <!-- Right Dash -->
      <line x1="357" y1="12" x2="395" y2="12" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" />
    </g>

  </g>
</svg>`;
}

// -----------------------------------------------------------------------------
// 2. White/Light Background Logo (For website Navbar & clean light themes)
// -----------------------------------------------------------------------------
function getWhiteBgLogoSvg({
  width = 640,
  height = 240,
  tagline = "SHOP MORE, PAY LESS"
} = {}) {
  return `<svg width="${width}" height="${height}" viewBox="0 0 640 240" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E86E2A" />
      <stop offset="100%" stop-color="#D65D1E" />
    </linearGradient>
    <filter id="softBagShadow" x="-10%" y="-10%" width="125%" height="125%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#E06C2A" flood-opacity="0.25" />
    </filter>
  </defs>

  <g transform="translate(68, 20)">
    
    <!-- Tilted Orange Shopping Bag with White Q -->
    <g transform="rotate(3.5 85 85)" filter="url(#softBagShadow)">
      <!-- Arched Handles in Orange -->
      <path 
        d="M 60 46 C 60 16, 110 16, 110 46" 
        stroke="#E06C2A" 
        stroke-width="8.5" 
        stroke-linecap="round" 
        fill="none" 
      />
      <!-- Bag Body in Vibrant Orange -->
      <path 
        d="M 40 48 C 40 40, 46 36, 54 36 L 118 36 C 126 36, 131 40, 131 48 L 143 134 C 144 142, 138 148, 130 148 L 42 148 C 34 148, 28 142, 29 134 Z" 
        fill="url(#bagGrad)" 
      />
      <!-- Handle Rivets -->
      <circle cx="60" cy="50" r="3.5" fill="#FFFFFF" />
      <circle cx="110" cy="50" r="3.5" fill="#FFFFFF" />

      <!-- White 'Q' Monogram inside Bag -->
      <g id="letter-Q-white">
        <ellipse cx="85" cy="96" rx="24" ry="28" fill="#FFFFFF" />
        <ellipse cx="85" cy="95" rx="13" ry="16" fill="#E06C2A" />
        <path 
          d="M 86 104 C 95 111, 106 119, 118 128 C 112 131, 103 133, 96 126 Z" 
          fill="#FFFFFF" 
        />
        <path 
          d="M 96 112 L 120 130 C 123 132, 121 136, 117 136 L 103 134 Z" 
          fill="#FFFFFF" 
        />
      </g>
    </g>

    <!-- Wordmark 'atify' in Premium Dark Charcoal #0F172A -->
    <text 
      x="172" 
      y="126" 
      font-family="'Plus Jakarta Sans', Arial, Helvetica, sans-serif" 
      font-size="104" 
      font-weight="900" 
      letter-spacing="-2.5" 
      fill="#0F172A"
    >atify</text>

    <!-- Smiling Face Dot on 'i' in Signature Orange at (299, 58) -->
    <g transform="translate(299, 58)">
      <circle cx="0" cy="0" r="13" fill="#E06C2A" />
      <circle cx="-4" cy="-2.5" r="1.8" fill="#FFFFFF" />
      <circle cx="4" cy="-2.5" r="1.8" fill="#FFFFFF" />
      <path 
        d="M -5 1.5 Q 0 7.5 5 1.5" 
        stroke="#FFFFFF" 
        stroke-width="2.2" 
        stroke-linecap="round" 
        fill="none" 
      />
    </g>

    <!-- Bottom Tagline Banner in Orange -->
    <g transform="translate(0, 168)">
      <line x1="50" y1="12" x2="88" y2="12" stroke="#E06C2A" stroke-width="3" stroke-linecap="round" />
      
      <!-- Orange Tagline Capsule Pill -->
      <rect x="100" y="0" width="245" height="24" rx="12" fill="#E06C2A" />
      
      <text 
        x="222" 
        y="16.5" 
        font-family="'Plus Jakarta Sans', Arial, Helvetica, sans-serif" 
        font-size="12" 
        font-weight="900" 
        letter-spacing="1.8" 
        fill="#FFFFFF" 
        text-anchor="middle"
      >${tagline}</text>
      
      <line x1="357" y1="12" x2="395" y2="12" stroke="#E06C2A" stroke-width="3" stroke-linecap="round" />
    </g>

  </g>
</svg>`;
}

// -----------------------------------------------------------------------------
// 3. Dark Background / Footer Logo (For deep obsidian footer #0A0A0C)
// -----------------------------------------------------------------------------
function getDarkBgLogoSvg({
  width = 640,
  height = 240,
  tagline = "SHOP MORE, PAY LESS"
} = {}) {
  return `<svg width="${width}" height="${height}" viewBox="0 0 640 240" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow" x="-10%" y="-10%" width="125%" height="125%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#E06C2A" flood-opacity="0.3" />
    </filter>
  </defs>

  <g transform="translate(68, 20)">
    
    <!-- White Shopping Bag with Orange Q -->
    <g transform="rotate(3.5 85 85)" filter="url(#glow)">
      <!-- Arched Bag Handles -->
      <path 
        d="M 60 46 C 60 16, 110 16, 110 46" 
        stroke="#FFFFFF" 
        stroke-width="8.5" 
        stroke-linecap="round" 
        fill="none" 
      />
      <!-- Bag Body -->
      <path 
        d="M 40 48 C 40 40, 46 36, 54 36 L 118 36 C 126 36, 131 40, 131 48 L 143 134 C 144 142, 138 148, 130 148 L 42 148 C 34 148, 28 142, 29 134 Z" 
        fill="#FFFFFF" 
      />
      <!-- Rivets -->
      <circle cx="60" cy="50" r="3.5" fill="#E06C2A" />
      <circle cx="110" cy="50" r="3.5" fill="#E06C2A" />

      <!-- Q Monogram in Bag -->
      <g id="letter-Q">
        <ellipse cx="85" cy="96" rx="24" ry="28" fill="#E06C2A" />
        <ellipse cx="85" cy="95" rx="13" ry="16" fill="#FFFFFF" />
        <path 
          d="M 86 104 C 95 111, 106 119, 118 128 C 112 131, 103 133, 96 126 Z" 
          fill="#E06C2A" 
        />
        <path 
          d="M 96 112 L 120 130 C 123 132, 121 136, 117 136 L 103 134 Z" 
          fill="#E06C2A" 
        />
      </g>
    </g>

    <!-- Wordmark 'atify' in Crisp White #FFFFFF -->
    <text 
      x="172" 
      y="126" 
      font-family="'Plus Jakarta Sans', Arial, Helvetica, sans-serif" 
      font-size="104" 
      font-weight="900" 
      letter-spacing="-2.5" 
      fill="#FFFFFF"
    >atify</text>

    <!-- Smiling Face Dot on 'i' in Signature Orange -->
    <g transform="translate(299, 58)">
      <circle cx="0" cy="0" r="13" fill="#FFFFFF" />
      <circle cx="-4" cy="-2.5" r="1.8" fill="#E06C2A" />
      <circle cx="4" cy="-2.5" r="1.8" fill="#E06C2A" />
      <path 
        d="M -5 1.5 Q 0 7.5 5 1.5" 
        stroke="#E06C2A" 
        stroke-width="2.2" 
        stroke-linecap="round" 
        fill="none" 
      />
    </g>

    <!-- Bottom Tagline Banner: White Capsule with Orange text -->
    <g transform="translate(0, 168)">
      <line x1="50" y1="12" x2="88" y2="12" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" />
      
      <rect x="100" y="0" width="245" height="24" rx="12" fill="#FFFFFF" />
      
      <text 
        x="222" 
        y="16.5" 
        font-family="'Plus Jakarta Sans', Arial, Helvetica, sans-serif" 
        font-size="12" 
        font-weight="900" 
        letter-spacing="1.8" 
        fill="#E06C2A" 
        text-anchor="middle"
      >${tagline}</text>
      
      <line x1="357" y1="12" x2="395" y2="12" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" />
    </g>

  </g>
</svg>`;
}

// -----------------------------------------------------------------------------
// 4. Standalone Q-Bag Brand Icon / Favicon / App Icon (512x512)
// -----------------------------------------------------------------------------
function getIconSvg(size = 512) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="iconOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E86E2A" />
      <stop offset="50%" stop-color="#E06C2A" />
      <stop offset="100%" stop-color="#D65D1E" />
    </linearGradient>
    <filter id="iconShadow" x="-10%" y="-10%" width="125%" height="125%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.18" />
    </filter>
  </defs>

  <!-- Squircle Icon Background -->
  <rect width="512" height="512" rx="115" fill="url(#iconOrangeGrad)"/>

  <!-- Centered Tilted Shopping Bag with Q Monogram -->
  <g transform="translate(68, 48) rotate(3 188 208)" filter="url(#iconShadow)">
    <!-- Arched Bag Handles -->
    <path 
      d="M 132 110 C 132 38, 244 38, 244 110" 
      stroke="#FFFFFF" 
      stroke-width="20" 
      stroke-linecap="round" 
      fill="none" 
    />
    <!-- Bag Body -->
    <path 
      d="M 88 116 C 88 98, 102 88, 120 88 L 256 88 C 274 88, 288 98, 288 116 L 314 316 C 316 334, 302 348, 284 348 L 92 348 C 74 348, 60 334, 62 316 Z" 
      fill="#FFFFFF" 
    />
    <!-- Grommets -->
    <circle cx="132" cy="120" r="8" fill="#E06C2A" />
    <circle cx="244" cy="120" r="8" fill="#E06C2A" />

    <!-- Q Monogram in Signature Orange -->
    <g id="icon-letter-Q">
      <ellipse cx="188" cy="226" rx="55" ry="65" fill="#E06C2A" />
      <ellipse cx="188" cy="224" rx="30" ry="38" fill="#FFFFFF" />
      <path 
        d="M 190 244 C 212 260, 238 278, 264 298 C 251 305, 231 309, 214 294 Z" 
        fill="#E06C2A" 
      />
      <path 
        d="M 212 262 L 268 302 C 274 307, 270 316, 261 316 L 229 312 Z" 
        fill="#E06C2A" 
      />
    </g>
  </g>
</svg>`;
}

async function buildAll() {
  console.log('Generating vector SVGs and PNG assets...');

  // 1. Orange Badge Logo
  const orangeSvg = getOrangeBadgeSvg();
  fs.writeFileSync(path.join(brandDir, 'qatify-logo-orange.svg'), orangeSvg);
  const orangePng = await sharp(Buffer.from(orangeSvg)).png({ quality: 100 }).toBuffer();
  fs.writeFileSync(path.join(brandDir, 'qatify-logo-orange.png'), orangePng);
  console.log('Created qatify-logo-orange.png');

  // 2. White Bg Logo
  const whiteBgSvg = getWhiteBgLogoSvg();
  fs.writeFileSync(path.join(brandDir, 'qatify-logo-white-bg.svg'), whiteBgSvg);
  const whiteBgPng = await sharp(Buffer.from(whiteBgSvg)).png({ quality: 100 }).toBuffer();
  fs.writeFileSync(path.join(brandDir, 'qatify-logo-white-bg.png'), whiteBgPng);
  console.log('Created qatify-logo-white-bg.png');

  // 3. Dark Bg Logo
  const darkBgSvg = getDarkBgLogoSvg();
  fs.writeFileSync(path.join(brandDir, 'qatify-logo-dark-bg.svg'), darkBgSvg);
  const darkBgPng = await sharp(Buffer.from(darkBgSvg)).png({ quality: 100 }).toBuffer();
  fs.writeFileSync(path.join(brandDir, 'qatify-logo-dark-bg.png'), darkBgPng);
  console.log('Created qatify-logo-dark-bg.png');

  // 4. Standalone Icon (512, 192, 180, 32)
  const icon512Svg = getIconSvg(512);
  fs.writeFileSync(path.join(brandDir, 'qatify-icon.svg'), icon512Svg);
  // Also update public/icon.svg
  fs.writeFileSync(path.join(__dirname, '../public/icon.svg'), icon512Svg);

  const icon512Png = await sharp(Buffer.from(icon512Svg)).resize(512, 512).png().toBuffer();
  fs.writeFileSync(path.join(brandDir, 'qatify-icon-512.png'), icon512Png);
  fs.writeFileSync(path.join(__dirname, '../public/icon-512.png'), icon512Png);

  const icon192Png = await sharp(Buffer.from(icon512Svg)).resize(192, 192).png().toBuffer();
  fs.writeFileSync(path.join(brandDir, 'qatify-icon-192.png'), icon192Png);
  fs.writeFileSync(path.join(__dirname, '../public/icon-192.png'), icon192Png);

  const appleTouchPng = await sharp(Buffer.from(icon512Svg)).resize(180, 180).png().toBuffer();
  fs.writeFileSync(path.join(__dirname, '../public/apple-touch-icon.png'), appleTouchPng);

  const icon32Png = await sharp(Buffer.from(icon512Svg)).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.join(__dirname, '../public/icon.png'), icon32Png);

  console.log('All brand logos and favicon assets generated successfully!');
}

buildAll().catch(console.error);
