const sharp = require('sharp');
const fs = require('fs');

async function renderNavbarLogo() {
  const brandOrange = '#E06C2A';
  
  // High-res SVG of the Navbar Logo: Bag Icon + SHOP Badge + QATIFY (with tight 6px gap)
  const svg = `<svg width="260" height="70" viewBox="0 0 260 70" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Clean white background to simulate header -->
    <rect width="260" height="70" fill="#FFFFFF"/>

    <defs>
      <linearGradient id="navBagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#E86E2A" />
        <stop offset="100%" stop-color="#D65D1E" />
      </linearGradient>
      <filter id="navShadow" x="-10%" y="-10%" width="125%" height="125%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#E06C2A" flood-opacity="0.30" />
      </filter>
    </defs>

    <!-- Flex Row: Icon (at x=16) + Wordmark (at x=56, gap=6px) -->
    <g transform="translate(14, 14)">
      
      <!-- Shopping Bag Icon (34x38) -->
      <g filter="url(#navShadow)">
        <!-- Handles -->
        <path
          d="M 12 11 C 12 -1, 24 -1, 24 11"
          stroke="${brandOrange}"
          stroke-width="3"
          stroke-linecap="round"
          fill="none"
        />
        <!-- Bag Body -->
        <path
          d="M 5 12 C 5 9, 8 7, 11 7 L 25 7 C 28 7, 31 9, 31 12 L 35 37 C 35.5 39.5, 33 42, 30.5 42 L 5.5 42 C 3 42, 0.5 39.5, 1 37 Z"
          fill="url(#navBagGrad)"
        />
        <!-- Rivets -->
        <circle cx="12" cy="13" r="1.3" fill="#FFFFFF" />
        <circle cx="24" cy="13" r="1.3" fill="#FFFFFF" />
        <!-- Q Monogram -->
        <ellipse cx="18" cy="27" rx="6.5" ry="7.5" fill="#FFFFFF" />
        <ellipse cx="18" cy="26.8" rx="3.3" ry="4.2" fill="${brandOrange}" />
        <path d="M 18.5 29 C 21 31, 24 33.5, 27 36 C 25.5 37, 23 37.5, 21 35.5 Z" fill="#FFFFFF" />
      </g>

      <!-- Wordmark Column (Tight 6px gap from bag) -->
      <g transform="translate(42, 2)">
        
        <!-- SHOP Badge -->
        <g transform="translate(0, 0)">
          <!-- Box Badge Background with 2px border radius -->
          <rect width="42" height="13" rx="2" fill="url(#navBagGrad)" />
          
          <!-- Mini Shopping Bag Icon -->
          <path
            d="M 5 4.5 L 3.5 6.5 V 10.5 C 3.5 11, 4 11.5, 4.5 11.5 H 9.5 C 10 11.5, 10.5 11, 10.5 10.5 V 6.5 L 9 4.5 Z"
            stroke="#FFFFFF"
            stroke-width="0.9"
            fill="none"
          />
          <path d="M 5.5 7.5 C 5.5 8.5, 8.5 8.5, 8.5 7.5" stroke="#FFFFFF" stroke-width="0.9" fill="none" />
          
          <!-- SHOP Text -->
          <text
            x="24"
            y="9.8"
            font-family="'Plus Jakarta Sans', Arial, sans-serif"
            font-size="7.5"
            font-weight="900"
            letter-spacing="1"
            fill="#FFFFFF"
            text-anchor="middle"
          >SHOP</text>
        </g>

        <!-- QATIFY Brand Text -->
        <g transform="translate(0, 31)">
          <text
            x="0"
            y="0"
            font-family="'Plus Jakarta Sans', Arial, sans-serif"
            font-size="22"
            font-weight="900"
            letter-spacing="-0.8"
            fill="#0A0A0C"
          >QAT<tspan dx="0">I</tspan><tspan dx="0">FY</tspan></text>
          
          <!-- Signature Orange Dot on I -->
          <circle cx="49" cy="-18" r="2.3" fill="${brandOrange}" />
        </g>

      </g>
    </g>
  </svg>`;

  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  fs.writeFileSync('public/brand/qatify-nav-logo-preview.png', buf);
  fs.writeFileSync('C:/Users/Tafsir Ahmed/.gemini/antigravity/brain/288cdabb-3caa-4d58-94fd-a24e415a09cd/qatify-nav-logo-preview.png', buf);
  console.log('Saved qatify-nav-logo-preview.png');
}

renderNavbarLogo();

