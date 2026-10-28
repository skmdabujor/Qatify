const sharp = require('sharp');

async function inspect() {
  const { data, info } = await sharp('public/qatify-logo-orange.png').raw().toBuffer({ resolveWithObject: true });
  console.log(`Rendered info: ${info.width}x${info.height}`);
}

inspect();
