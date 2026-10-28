const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const imgPath = 'C:/Users/Tafsir Ahmed/.gemini/antigravity/brain/288cdabb-3caa-4d58-94fd-a24e415a09cd/.user_uploaded/media_1793181803440_8278e8a1.png';
  const { data, info } = await sharp(imgPath).raw().toBuffer({ resolveWithObject: true });
  
  console.log(`Dimensions: ${info.width}x${info.height}, Channels: ${info.channels}`);

  // Let's sample along horizontal line y = 68 (bottom banner area)
  console.log('--- Sampling y = 68 ---');
  let rowStr = '';
  for (let x = 0; x < info.width; x += 4) {
    const idx = (68 * info.width + x) * info.channels;
    const r = data[idx], g = data[idx+1], b = data[idx+2];
    if (r > 240 && g > 240 && b > 240) {
      rowStr += 'W'; // White
    } else if (r > 180 && g > 70 && b < 80) {
      rowStr += 'O'; // Orange
    } else {
      rowStr += '.';
    }
  }
  console.log(rowStr);
}

main().catch(console.error);
