const sharp = require('sharp');

async function checkY() {
  const { data, info } = await sharp('public/qatify-logo-v1.png').raw().toBuffer({ resolveWithObject: true });
  const width = info.width;
  
  for (let y = 40; y <= 75; y += 2) {
    let r_center = data[(y * width + 281) * 4];
    console.log(`y=${y}, val=${r_center}`);
  }
}

checkY();
