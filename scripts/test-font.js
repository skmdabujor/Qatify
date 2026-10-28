const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function testFont() {
  const svg = `<svg width="500" height="150" viewBox="0 0 500 150" xmlns="http://www.w3.org/2000/svg">
    <rect width="500" height="150" fill="#E06C2A" rx="12"/>
    <text x="250" y="85" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="64" fill="#FFFFFF" text-anchor="middle">atify</text>
  </svg>`;

  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  fs.writeFileSync('scripts/test-render.png', buf);
  console.log('Saved test-render.png, bytes:', buf.length);
}

testFont().catch(console.error);
