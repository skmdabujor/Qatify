const sharp = require('sharp');

async function checkAlignment() {
  const { data, info } = await sharp('public/qatify-logo-v1.png').raw().toBuffer({ resolveWithObject: true });
  const width = info.width;
  
  // Find stem of 'i'
  // In font size 98, 'i' stem is around y=85 to 115
  let stemXs = [];
  for (let x = 250; x <= 320; x++) {
    const idx = (100 * width + x) * 4;
    if (data[idx] > 220 && data[idx+1] > 220 && data[idx+2] > 220) {
      stemXs.push(x);
    }
  }
  const minStem = Math.min(...stemXs);
  const maxStem = Math.max(...stemXs);
  const centerStem = (minStem + maxStem) / 2;
  console.log(`Stem of 'i' at y=100 is between ${minStem} and ${maxStem}, center = ${centerStem}`);
}

checkAlignment();
