const sharp = require('sharp');

async function findEnd() {
  const svg = `<svg width="640" height="260" viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="260" fill="#E06C2A" />
    <text x="180" y="142" font-family="Arial, Helvetica, sans-serif" font-size="82" font-weight="900" fill="#FFFFFF">atify</text>
  </svg>`;

  const buf = await sharp(Buffer.from(svg)).raw().toBuffer({ resolveWithObject: true });
  const data = buf.data;
  const width = buf.info.width;

  let minX = 999, maxX = 0;
  for (let x = 150; x <= 500; x++) {
    for (let y = 60; y <= 160; y++) {
      const idx = (y * width + x) * 4;
      if (data[idx] > 200 && data[idx+1] > 200 && data[idx+2] > 200) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
      }
    }
  }
  console.log(`Text bounding box: x from ${minX} to ${maxX}, total width = ${maxX - minX}px`);
}

findEnd();
