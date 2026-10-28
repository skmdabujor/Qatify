const sharp = require('sharp');
const fs = require('fs');

async function run() {
  const iconSvg = `<svg width="512" height="512" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="qatifyRedGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F43F5E" />
      <stop offset="1" stop-color="#BE123C" />
    </linearGradient>
    <linearGradient id="sparkYellowGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FEF08A" />
      <stop offset="1" stop-color="#EAB308" />
    </linearGradient>
  </defs>

  <!-- Squircle Badge in Qatar Red / Crimson -->
  <rect
    x="4"
    y="4"
    width="92"
    height="92"
    rx="24"
    fill="url(#qatifyRedGrad)"
  />

  <!-- Geometric "Q" Body Outer White Ring -->
  <circle
    cx="48"
    cy="46"
    r="26"
    stroke="#FFFFFF"
    stroke-width="11"
    stroke-linecap="round"
  />

  <!-- Dynamic Forward-Leaning Lightning Bolt in Electric Yellow -->
  <path
    d="M 52 50 L 66 32 L 60 52 L 78 50 L 46 80 L 52 58 Z"
    fill="url(#sparkYellowGrad)"
    stroke="#0A0A0C"
    stroke-width="2.5"
    stroke-linejoin="round"
  />

  <!-- Forward Speed Dot in Yellow -->
  <circle cx="28" cy="28" r="3.5" fill="#FACC15" />
</svg>`;

  const fullLockupSvg = `<svg width="400" height="80" viewBox="0 0 400 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="lockupRedGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F43F5E" />
      <stop offset="1" stop-color="#BE123C" />
    </linearGradient>
    <linearGradient id="lockupSparkGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FEF08A" />
      <stop offset="1" stop-color="#EAB308" />
    </linearGradient>
  </defs>

  <!-- Icon (x=8, y=10, size=60) -->
  <g transform="translate(8, 10)">
    <rect x="2.4" y="2.4" width="55.2" height="55.2" rx="14.4" fill="url(#lockupRedGrad)" />
    <circle cx="28.8" cy="27.6" r="15.6" stroke="#FFFFFF" stroke-width="6.6" stroke-linecap="round" />
    <path d="M 31.2 30 L 39.6 19.2 L 36 31.2 L 46.8 30 L 27.6 48 L 31.2 34.8 Z" fill="url(#lockupSparkGrad)" stroke="#0A0A0C" stroke-width="1.5" stroke-linejoin="round" />
    <circle cx="16.8" cy="16.8" r="2.1" fill="#FACC15" />
  </g>

  <!-- Wordmark: QATIFY -->
  <text x="82" y="52" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-size="34" font-weight="900" letter-spacing="-0.5">QATIFY</text>

  <!-- .QA Gold Badge (x=228, y=27, width=54, height=28) -->
  <rect x="228" y="27" width="54" height="28" rx="6" fill="#FACC15" />
  <text x="255" y="47" fill="#0A0A0C" font-family="monospace, -apple-system, sans-serif" font-size="16" font-weight="900" text-anchor="middle">.QA</text>
</svg>`;

  const iconBuffer = await sharp(Buffer.from(iconSvg)).resize(512, 512).png().toBuffer();
  const lockupBuffer = await sharp(Buffer.from(fullLockupSvg)).png().toBuffer();

  fs.writeFileSync('public/brand/qatify-official-icon.png', iconBuffer);
  fs.writeFileSync('public/brand/qatify-official-lockup.png', lockupBuffer);
  console.log('Saved PNG files locally to public/brand/');

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || 'https://mellow-puma-618.eu-west-1.convex.cloud';
  
  // 1. Get upload URL for Icon
  const res1 = await fetch(`${convexUrl}/api/mutation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      path: 'products:generateUploadUrl',
      args: { adminEmail: 'sheakmohammadabujor@gmail.com' },
      format: 'json',
    }),
  });
  const data1 = await res1.json();
  const uploadUrl1 = data1.value;

  const uploadRes1 = await fetch(uploadUrl1, {
    method: 'POST',
    headers: { 'Content-Type': 'image/png' },
    body: iconBuffer,
  });
  const { storageId: iconStorageId } = await uploadRes1.json();
  const iconPermanentUrl = `${convexUrl}/api/storage/${iconStorageId}`;
  console.log('Uploaded Official Icon to Convex Storage:', iconPermanentUrl);

  // 2. Get upload URL for Full Lockup
  const res2 = await fetch(`${convexUrl}/api/mutation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      path: 'products:generateUploadUrl',
      args: { adminEmail: 'sheakmohammadabujor@gmail.com' },
      format: 'json',
    }),
  });
  const data2 = await res2.json();
  const uploadUrl2 = data2.value;

  const uploadRes2 = await fetch(uploadUrl2, {
    method: 'POST',
    headers: { 'Content-Type': 'image/png' },
    body: lockupBuffer,
  });
  const { storageId: lockupStorageId } = await uploadRes2.json();
  const lockupPermanentUrl = `${convexUrl}/api/storage/${lockupStorageId}`;
  console.log('Uploaded Official Lockup to Convex Storage:', lockupPermanentUrl);

  console.log('SUCCESSFUL UPLOAD RESULTS:');
  console.log('ICON URL:', iconPermanentUrl);
  console.log('LOCKUP URL:', lockupPermanentUrl);
}

run().catch(console.error);
