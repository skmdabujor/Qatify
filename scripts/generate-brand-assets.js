// =============================================================================
// Qatify — Brand Asset Pipeline & Generator
// Generates ultra-crisp, multi-resolution brand assets from the official Canva logo:
// Storage ID: kg281amad6cc3w8tx1fztmkrts8j4y2s ("NPC Project IMG - Shop Qatify Logo")
// =============================================================================

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const BRAND_DIR = path.join(__dirname, '..', 'public', 'brand');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const MASTER_RAW = path.join(BRAND_DIR, 'uploaded-new-logo.png');

async function main() {
  console.log('🚀 Starting Qatify brand asset generation...');

  if (!fs.existsSync(MASTER_RAW)) {
    throw new Error(`Master file not found: ${MASTER_RAW}`);
  }

  // 1. Trim transparent padding for tight master
  console.log('1. Processing master trimmed logo (2200x1040)...');
  const trimmed = sharp(MASTER_RAW).trim();
  const trimmedBuffer = await trimmed.toBuffer();
  const meta = await sharp(trimmedBuffer).metadata();
  console.log(`   Dimensions: ${meta.width}x${meta.height}`);

  // Save master dark variant (for light backgrounds)
  const masterDarkPng = path.join(BRAND_DIR, 'qatify-final-logo.png');
  const masterDarkWebp = path.join(BRAND_DIR, 'qatify-final-logo.webp');
  await sharp(trimmedBuffer).png({ quality: 100, compressionLevel: 9 }).toFile(masterDarkPng);
  await sharp(trimmedBuffer).webp({ quality: 95, lossless: true }).toFile(masterDarkWebp);
  console.log('   Saved master dark PNG & WebP');

  // Also update standard legacy brand references
  await sharp(trimmedBuffer).png().toFile(path.join(BRAND_DIR, 'qatify-logo-full.png'));
  await sharp(trimmedBuffer).png().toFile(path.join(BRAND_DIR, 'qatify-logo-white-bg.png'));
  await sharp(trimmedBuffer).png().toFile(path.join(BRAND_DIR, 'qatify-new-logo-trimmed.png'));

  // 2. Generate Light Variant (White text & white handle for dark backgrounds)
  console.log('2. Generating light variant (for dark backgrounds)...');
  const { data, info } = await sharp(trimmedBuffer).raw().toBuffer({ resolveWithObject: true });
  const lightData = Buffer.from(data);

  for (let i = 0; i < lightData.length; i += 4) {
    const a = lightData[i + 3];
    if (a > 20) {
      const r = lightData[i], g = lightData[i + 1], b = lightData[i + 2];
      // Black/dark charcoal text and handle -> crisp white
      if (r < 80 && g < 80 && b < 80) {
        lightData[i] = 255;
        lightData[i + 1] = 255;
        lightData[i + 2] = 255;
      }
    }
  }

  const masterLightPng = path.join(BRAND_DIR, 'qatify-final-logo-light.png');
  const masterLightWebp = path.join(BRAND_DIR, 'qatify-final-logo-light.webp');
  await sharp(lightData, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(masterLightPng);
  await sharp(lightData, { raw: { width: info.width, height: info.height, channels: 4 } })
    .webp({ quality: 95, lossless: true })
    .toFile(masterLightWebp);

  // Update legacy dark-bg asset
  await sharp(lightData, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile(path.join(BRAND_DIR, 'qatify-logo-dark-bg.png'));
  console.log('   Saved light variant PNG & WebP');

  // 3. Extract the Official Shopping Bag Emblem (Icon Only)
  console.log('3. Extracting official shopping bag emblem...');
  const bagData = Buffer.alloc(info.width * info.height * 4, 0);
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * 4;
      const a = data[idx + 3];
      if (a > 20) {
        const isHandle = y < 380 && x < 800;
        const isLeftBody = x < 450;
        const isSwoop = y > 720 && x < 1020;
        if (isHandle || isLeftBody || isSwoop) {
          bagData[idx] = data[idx];
          bagData[idx + 1] = data[idx + 1];
          bagData[idx + 2] = data[idx + 2];
          bagData[idx + 3] = data[idx + 3];
        }
      }
    }
  }

  const iconTrimmedBuffer = await sharp(bagData, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim()
    .png()
    .toBuffer();

  const iconPng = path.join(BRAND_DIR, 'qatify-icon.png');
  const iconWebp = path.join(BRAND_DIR, 'qatify-icon.webp');
  await sharp(iconTrimmedBuffer).toFile(iconPng);
  await sharp(iconTrimmedBuffer).webp().toFile(iconWebp);

  // 4. Generate App Icons & Favicons (512x512, 192x192, 180x180, 64x64, 32x32)
  console.log('4. Generating app icons and favicons...');
  
  // Create 512x512 square canvas with centered bag icon (fit with pleasant breathing padding)
  const icon512 = await sharp(iconTrimmedBuffer)
    .resize(410, 410, { fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const icon512Meta = await sharp(icon512).metadata();
  const padLeft = Math.floor((512 - icon512Meta.width) / 2);
  const padTop = Math.floor((512 - icon512Meta.height) / 2);

  const canvas512 = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: icon512, left: padLeft, top: padTop }])
    .png()
    .toBuffer();

  // Save 512x512
  await sharp(canvas512).toFile(path.join(BRAND_DIR, 'qatify-icon-512.png'));
  await sharp(canvas512).toFile(path.join(PUBLIC_DIR, 'icon-512.png'));

  // Save 192x192
  const icon192 = await sharp(canvas512).resize(192, 192).png().toBuffer();
  await sharp(icon192).toFile(path.join(BRAND_DIR, 'qatify-icon-192.png'));
  await sharp(icon192).toFile(path.join(PUBLIC_DIR, 'icon-192.png'));

  // Save 180x180 Apple Touch Icon (solid white/soft rounded background looks best on iOS homescreen)
  await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{
      input: await sharp(iconTrimmedBuffer).resize(140, 140, { fit: 'inside' }).toBuffer(),
      gravity: 'centre',
    }])
    .png()
    .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));

  // Save 32x32 / 48x48 favicons
  await sharp(canvas512).resize(32, 32).png().toFile(path.join(PUBLIC_DIR, 'icon.png'));
  await sharp(canvas512).resize(48, 48).png().toFile(path.join(PUBLIC_DIR, 'favicon.ico'));

  // Save SVG Favicons & SVG Brand wraps with high-res embedded data
  const iconBase64 = canvas512.toString('base64');
  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image href="data:image/png;base64,${iconBase64}" width="512" height="512" />
</svg>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'icon.svg'), iconSvg);
  fs.writeFileSync(path.join(BRAND_DIR, 'qatify-icon.svg'), iconSvg);
  fs.writeFileSync(path.join(BRAND_DIR, 'qatify-icon-new.svg'), iconSvg);

  const logoBase64 = (await sharp(trimmedBuffer).png().toBuffer()).toString('base64');
  const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${meta.width} ${meta.height}" width="${meta.width}" height="${meta.height}">
  <image href="data:image/png;base64,${logoBase64}" width="${meta.width}" height="${meta.height}" />
</svg>`;
  fs.writeFileSync(path.join(BRAND_DIR, 'qatify-final-logo.svg'), logoSvg);
  fs.writeFileSync(path.join(BRAND_DIR, 'qatify-logo-white-bg.svg'), logoSvg);
  fs.writeFileSync(path.join(BRAND_DIR, 'qatify-new-logo.svg'), logoSvg);

  console.log('✅ All brand assets successfully generated!');
}

main().catch((err) => {
  console.error('❌ Error generating brand assets:', err);
  process.exit(1);
});
