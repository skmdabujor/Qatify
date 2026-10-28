const sharp = require('sharp');

async function checkNativeDot() {
  const svg = `<svg width="460" height="210" xmlns="http://www.w3.org/2000/svg">
    <rect width="460" height="210" fill="#000" />
    <text x="162" y="120" font-family="Arial, Helvetica, sans-serif" font-size="98" font-weight="900" fill="#FFF">atify</text>
  </svg>`;
  const { data, info } = await sharp(Buffer.from(svg)).raw().toBuffer({ resolveWithObject: true });
  for (let y = 40; y <= 80; y += 2) {
    let r = data[(y * 460 + 281) * 4];
    if (r > 100) console.log(`native dot y=${y}`);
  }
}

checkNativeDot();
