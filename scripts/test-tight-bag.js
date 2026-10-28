const sharp = require('sharp');
const fs = require('fs');

function testLogoLayout() {
  const brandOrange = '#E06C2A';
  
  // Clean SVG Shopping Bag with tight bounding box
  const bagSvg = `<svg width="34" height="38" viewBox="20 15 80 104" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#E86E2A" />
        <stop offset="100%" stop-color="#D65D1E" />
      </linearGradient>
    </defs>
    <!-- Arched Dual Handles -->
    <path
      d="M 45 42 C 45 18, 75 18, 75 42"
      stroke="${brandOrange}"
      stroke-width="7"
      stroke-linecap="round"
      fill="none"
    />
    <!-- Bag Body -->
    <path
      d="M 32 44 C 32 38, 36 34, 42 34 L 78 34 C 84 34, 88 38, 88 44 L 97 106 C 98 112, 93 117, 87 117 L 33 117 C 27 117, 22 112, 23 106 Z"
      fill="url(#bagGrad)"
    />
    <!-- Rivets -->
    <circle cx="45" cy="46" r="3" fill="#FFFFFF" />
    <circle cx="75" cy="46" r="3" fill="#FFFFFF" />
    <!-- White 'Q' inside the bag -->
    <ellipse cx="60" cy="80" rx="16.5" ry="19.5" fill="#FFFFFF" />
    <ellipse cx="60" cy="79.5" rx="8.5" ry="11" fill="${brandOrange}" />
    <path
      d="M 61 85 C 67 90, 75 96, 83 102 C 79 104, 73 106, 68 101 Z"
      fill="#FFFFFF"
    />
    <path
      d="M 67 91 L 84 104 C 86 105, 85 107, 82 107 L 72 106 Z"
      fill="#FFFFFF"
    />
  </svg>`;

  fs.writeFileSync('scripts/test-bag.svg', bagSvg);
  console.log('Saved test bag SVG');
}

testLogoLayout();

