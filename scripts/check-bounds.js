const sharp = require('sharp');
const fs = require('fs');

async function testBounds() {
  const svg = fs.readFileSync('scripts/test-bag.svg');
  const { data, info } = await sharp(svg).raw().toBuffer({ resolveWithObject: true });
  
  let minX = 999, maxX = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const alpha = data[(y * info.width + x) * 4 + 3];
      if (alpha > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
      }
    }
  }
  console.log(`Rendered size ${info.width}x${info.height}: graphic spans from x=${minX} to x=${maxX}`);
}

testBounds();

