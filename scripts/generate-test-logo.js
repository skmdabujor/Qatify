const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

function createSignatureLogoSvg({
  width = 640,
  height = 260,
  isTransparent = false,
  tagline = "SHOP MORE, PAY LESS"
} = {}) {
  const bgFill = isTransparent 
    ? 'none' 
    : 'url(#orangeGrad)';

  return `<svg width="${width}" height="${height}" viewBox="0 0 640 260" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E56925" />
      <stop offset="50%" stop-color="#E06C2A" />
      <stop offset="100%" stop-color="#D95F1E" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#000000" flood-opacity="0.12" />
    </filter>
  </defs>

  ${!isTransparent ? `<rect width="640" height="260" rx="20" fill="${bgFill}"/>` : ''}

  <!-- Brand Container Group -->
  <g transform="translate(30, 20)">
    
    <!-- Shopping Bag (Tilted 3.5 deg for dynamic energy) -->
    <g transform="rotate(3.5 95 105)" filter="url(#shadow)">
      <!-- Bag Handles (Curved loops) -->
      <path 
        d="M 72 58 C 72 26, 118 26, 118 58" 
        stroke="#FFFFFF" 
        stroke-width="8.5" 
        stroke-linecap="round" 
        fill="none" 
      />
      <!-- Bag Body -->
      <path 
        d="M 52 60 C 52 54, 57 50, 64 50 L 126 50 C 133 50, 138 54, 138 60 L 149 146 C 150 154, 144 160, 136 160 L 54 160 C 46 160, 40 154, 41 146 Z" 
        fill="#FFFFFF" 
      />
      <!-- Handle Rivets / Grommets -->
      <circle cx="72" cy="62" r="3.5" fill="#E06C2A" />
      <circle cx="118" cy="62" r="3.5" fill="#E06C2A" />

      <!-- Monogram 'Q' inside the bag (Cutout style in Orange #E06C2A) -->
      <g id="letter-Q">
        <!-- Outer Ring of Q -->
        <ellipse cx="95" cy="110" rx="26" ry="31" fill="#E06C2A" />
        <!-- Inner Counter of Q (matches bag fill #FFFFFF) -->
        <ellipse cx="95" cy="109" rx="14" ry="18" fill="#FFFFFF" />
        <!-- Dynamic Kicking Tail of Q -->
        <path 
          d="M 95 119 C 104 125, 115 133, 126 142 C 122 145, 114 148, 105 142 C 100 137, 95 129, 95 119 Z" 
          fill="#E06C2A" 
        />
        <!-- Tail Accent / Energy Sweep -->
        <path 
          d="M 103 125 L 128 144 C 131 146 130 149 126 149 L 110 147 Z" 
          fill="#E06C2A" 
        />
      </g>
    </g>

    <!-- Wordmark 'atify' -->
    <!-- We hide the native dot of 'i' and replace it with a playful smiling face dot -->
    <text 
      x="180" 
      y="142" 
      font-family="'Plus Jakarta Sans', 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif" 
      font-size="82" 
      font-weight="900" 
      letter-spacing="-1.5" 
      fill="#FFFFFF"
    >at<tspan fill="transparent">i</tspan>fy</text>

    <!-- The stem of letter 'i' (drawn cleanly so we control the dot) -->
    <rect x="290" y="87" width="16.5" height="55" rx="3" fill="#FFFFFF" />

    <!-- Playful Smiling Face Dot on 'i' -->
    <g transform="translate(298, 66)">
      <!-- Dot Base -->
      <circle cx="0" cy="0" r="10.5" fill="#FFFFFF" />
      <!-- Left Eye -->
      <circle cx="-3.5" cy="-2" r="1.5" fill="#E06C2A" />
      <!-- Right Eye -->
      <circle cx="3.5" cy="-2" r="1.5" fill="#E06C2A" />
      <!-- Sweet Smile Curve -->
      <path 
        d="M -4.5 1.5 Q 0 6 4.5 1.5" 
        stroke="#E06C2A" 
        stroke-width="1.8" 
        stroke-linecap="round" 
        fill="none" 
      />
    </g>

    <!-- Bottom Slogan Ribbon / Pill: — SHOP MORE, PAY LESS — -->
    <g transform="translate(180, 186)">
      <!-- Left Dash -->
      <line x1="-3" y1="12" x2="25" y2="12" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" />
      
      <!-- White Tagline Pill Badge -->
      <rect x="35" y="0" width="224" height="24" rx="12" fill="#FFFFFF" />
      
      <!-- Tagline Text inside the white pill -->
      <text 
        x="147" 
        y="16.5" 
        font-family="'Plus Jakarta Sans', 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif" 
        font-size="11.5" 
        font-weight="900" 
        letter-spacing="1.8" 
        fill="#E06C2A" 
        text-anchor="middle"
      >${tagline}</text>
      
      <!-- Right Dash -->
      <line x1="269" y1="12" x2="297" y2="12" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" />
    </g>

  </g>
</svg>`;
}

async function run() {
  const svgOrange = createSignatureLogoSvg({ isTransparent: false });
  fs.writeFileSync('public/qatify-logo-orange.svg', svgOrange);
  
  const bufOrange = await sharp(Buffer.from(svgOrange)).png({ quality: 100 }).toBuffer();
  fs.writeFileSync('public/qatify-logo-orange.png', bufOrange);
  console.log('Orange logo created, bytes:', bufOrange.length);
}

run().catch(console.error);
