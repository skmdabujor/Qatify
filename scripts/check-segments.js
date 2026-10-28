const sharp = require('sharp');

async function checkSegments() {
  const { data, info } = await sharp('public/qatify-logo-v1.png').raw().toBuffer({ resolveWithObject: true });
  const width = info.width;
  
  let inWhite = false;
  let startX = 0;
  for (let x = 160; x <= 420; x++) {
    const idx = (100 * width + x) * 4;
    const isWhite = (data[idx] > 220 && data[idx+1] > 220 && data[idx+2] > 220);
    if (isWhite && !inWhite) {
      inWhite = true;
      startX = x;
    } else if (!isWhite && inWhite) {
      inWhite = false;
      console.log(`Segment: ${startX} to ${x-1} (width ${x - startX})`);
    }
  }
}

checkSegments();
