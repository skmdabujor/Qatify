// =============================================================================
// Qatify — Authentic Product Catalog for Qatar Electronics & Gadgets Store
// Currency: QAR (Qatari Riyal) | Fast Doorstep Express Delivery Across Qatar
// =============================================================================

import { Product, Order, QatarAddress, ShippingMethod } from '@/types/product';

export const QATAR_MUNICIPALITIES = [
  { name: 'Doha (العاصمة)', code: 'DOH', transitDaysOffset: 0, popularZones: ['Zone 22', 'Zone 24', 'Zone 45', 'Zone 66'] },
  { name: 'Lusail City (مدينة لوسيل)', code: 'LUS', transitDaysOffset: 0, popularZones: ['Zone 69', 'Zone 70'] },
  { name: 'Al Rayyan (الريان)', code: 'RAY', transitDaysOffset: 1, popularZones: ['Zone 51', 'Zone 53', 'Zone 55'] },
  { name: 'Al Wakrah (الوكرة)', code: 'WAK', transitDaysOffset: 1, popularZones: ['Zone 90', 'Zone 91'] },
  { name: 'Al Khor (الخور)', code: 'KHO', transitDaysOffset: 2, popularZones: ['Zone 74', 'Zone 75'] },
  { name: 'Umm Salal (أم صلال)', code: 'UMS', transitDaysOffset: 1, popularZones: ['Zone 71'] },
  { name: 'Al Daayen (الظعاين)', code: 'DAA', transitDaysOffset: 1, popularZones: ['Zone 68'] },
  { name: 'Al Shamal (الشمال)', code: 'SHA', transitDaysOffset: 2, popularZones: ['Zone 79'] },
];

export const CATEGORIES = [
  { id: 'mobile-acc', name: 'Mobile Accessories', slug: 'mobile-accessories', icon: 'Smartphone', count: 42 },
  { id: 'smartwatches', name: 'Smartwatches & Fit', slug: 'smartwatches', icon: 'Watch', count: 28 },
  { id: 'tws-audio', name: 'TWS & Spatial Audio', slug: 'tws-audio', icon: 'Headphones', count: 35 },
  { id: 'power-chargers', name: 'GaN Chargers & Banks', slug: 'chargers-powerbanks', icon: 'Zap', count: 29 },
  { id: 'car-tech', name: 'Car Tech & Mounts', slug: 'car-accessories', icon: 'Car', count: 19 },
  { id: 'gaming-gear', name: 'Gaming & Desk Tech', slug: 'gaming-gear', icon: 'Gamepad2', count: 24 },
  { id: 'drones-cameras', name: 'Drones & Vlogging', slug: 'drones-cameras', icon: 'Camera', count: 16 },
  { id: 'smart-home', name: 'Smart Home & Ambience', slug: 'smart-home', icon: 'Home', count: 22 },
  { id: 'laptop-gear', name: 'Laptop Hubs & Stands', slug: 'laptop-gear', icon: 'Laptop', count: 18 },
  { id: 'cables-adapters', name: 'Fast Cables & OTG', slug: 'cables-adapters', icon: 'Cable', count: 31 },
];

export const PRODUCTS: Product[] = [
  {
    id: 'qat-001',
    slug: 'pulse-pro-active-noise-cancelling-wireless-earbuds',
    title: 'Soundcore by Anker Liberty 4 NC Wireless Noise Cancelling Earbuds (48dB Hybrid ANC)',
    shortDescription: 'Adaptive 48dB active noise cancellation, Hi-Res wireless LDAC audio, 50h total playtime, and Qi wireless fast charging.',
    fullDescription: 'Engineered for crystal-clear sound anywhere in Qatar. The Soundcore Liberty 4 NC reduces environmental noise by up to 98.5% with high-sensitivity in-ear sound sensors and customized acoustic chambers. Features 6 beamforming microphones with AI noise reduction for crystal-clear phone calls in Doha traffic or breezy corniche strolls.',
    category: 'TWS & Spatial Audio',
    categorySlug: 'tws-audio',
    subcategory: 'Earbuds',
    brand: 'Soundcore',
    priceQAR: 149,
    originalPriceQAR: 269,
    discountPercent: 45,
    rating: 4.88,
    reviewCount: 412,
    soldCount: 1240,
    stockPercent: 84,
    inStock: true,
    isFlashDeal: true,
    isTrending: true,
    isBestSeller: true,
    isUnder99: false,
    isNewArrival: false,
    badge: 'HOT DEAL',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop&q=80',
    ],
    tags: ['ANC', 'Spatial Audio', 'Soundcore', 'Wireless Earbuds', 'Best Price in Qatar'],
    variants: {
      colors: [
        { name: 'Obsidian Black', hex: '#18181b' },
        { name: 'Frost White', hex: '#f8fafc' },
        { name: 'Desert Dune Gold', hex: '#d4af37' },
      ],
      options: [
        { name: 'Edition', values: ['Standard Qi Case', 'Pro LED Display Case (+QAR 25)'] },
      ],
    },
    volumeDiscounts: [
      { quantity: 1, pricePerUnitQAR: 149, savingsText: 'Best Price in Qatar' },
      { quantity: 2, pricePerUnitQAR: 135, savingsText: 'Save QAR 28 (Multi-Buy)' },
      { quantity: 3, pricePerUnitQAR: 122, savingsText: 'Save QAR 81 (Free Express Delivery)' },
    ],
    specifications: {
      'ANC Depth': 'Up to 48dB Adaptive Hybrid Active Noise Cancelling',
      'Audio Drivers': '11mm Custom Drivers with Hi-Res Wireless & LDAC',
      'Battery Life': '10 Hours (Earbuds) / 50 Hours (With Charging Case)',
      'Water Resistance': 'IPX4 Water & Sweat Resistant',
      'Connectivity': 'Bluetooth 5.3 Multi-Point Fast Connection',
      'Fast Charging': '10-minute charge gives 4 hours of playtime',
    },
    packageContents: [
      'Soundcore Liberty 4 NC Earbuds (Pair)',
      'Wireless Qi Fast Charging Case',
      '4 Pairs Medical-Grade Silicone Ear Tips (XS/S/M/L)',
      'USB-C Fast Charging Cable',
      'Official User Manual & Warranty Card',
    ],
    dropshipInfo: {
      dispatchHours: 24,
      shippingDaysMin: 6,
      shippingDaysMax: 8,
      freeShippingThresholdQAR: 150,
      shippingCostQAR: 20,
      airCarrier: 'Express Air Freight to Hamad Int’l (DOH)',
      qualityInspected: true,
      hubOrigin: 'Regional Tech Distribution Hub',
    },
  },
  {
    id: 'qat-002',
    slug: 'hypercharge-100w-gan-prime-4-port-desktop-travel-charger',
    title: 'Anker Prime 100W GaN 3-Port Fast Wall Charger with PowerIQ 4.0 (UK 3-Pin)',
    shortDescription: 'Ultra-compact GaNPrime wall charger powering MacBook Pro, iPhone 16 Pro Max, and iPad simultaneously at top speed.',
    fullDescription: 'Equipped with 2x USB-C Power Delivery 3.0 ports and 1x USB-A port with PowerIQ 4.0 dynamic power balancing up to 100W Max. Universal 100-240V input with standard Qatar UK 3-pin plug. Features ActiveShield 2.0 real-time temperature monitoring for safe fast charging in West Bay offices or home setups.',
    category: 'GaN Chargers & Banks',
    categorySlug: 'chargers-powerbanks',
    subcategory: 'Wall Chargers',
    brand: 'Anker',
    priceQAR: 129,
    originalPriceQAR: 219,
    discountPercent: 41,
    rating: 4.92,
    reviewCount: 388,
    soldCount: 960,
    stockPercent: 72,
    inStock: true,
    isFlashDeal: true,
    isTrending: true,
    isBestSeller: true,
    isUnder99: false,
    isNewArrival: false,
    badge: 'TOP RATED',
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1770417999483-e5a313b33468?w=800&auto=format&fit=crop&q=80',
    ],
    tags: ['Anker', 'GaN', '100W Charger', 'Laptop Fast Charger', 'UK Plug'],
    variants: {
      colors: [
        { name: 'Space Gray', hex: '#4b5563' },
        { name: 'Matte White', hex: '#f3f4f6' },
      ],
      options: [
        { name: 'Plug Type', values: ['UK 3-Pin (Qatar Standard)', 'Universal Multi-Plug'] },
      ],
    },
    volumeDiscounts: [
      { quantity: 1, pricePerUnitQAR: 129, savingsText: 'Base Price' },
      { quantity: 2, pricePerUnitQAR: 115, savingsText: 'Save QAR 28' },
    ],
    specifications: {
      'Total Output': '100W Max GaNPrime III Architecture',
      'Port Configuration': '2x USB-C (100W Max PD 3.0), 1x USB-A (22.5W)',
      'Safety System': 'ActiveShield 2.0 Dynamic Temperature Monitoring',
      'Dimensions': '65mm x 65mm x 32mm',
      'Weight': '205g',
    },
    packageContents: [
      'Anker Prime 100W GaN Wall Charger (UK Plug)',
      '100W 1.5m 5A E-Marker USB-C Cable',
      'Official User Guide & Warranty Document',
    ],
    dropshipInfo: {
      dispatchHours: 24,
      shippingDaysMin: 6,
      shippingDaysMax: 8,
      freeShippingThresholdQAR: 150,
      shippingCostQAR: 20,
      airCarrier: 'Express Air Freight to Hamad Int’l (DOH)',
      qualityInspected: true,
      hubOrigin: 'Regional Tech Distribution Hub',
    },
  },
  {
    id: 'qat-003',
    slug: 'aerovolt-magsafe-active-cooling-wireless-car-mount',
    title: 'Joyroom JR-ZS240 15W Magnetic Fast Wireless Car Charger Mount with Active Cooling',
    shortDescription: 'Built-in semiconductor refrigeration fan protects your phone from overheating during intense Qatar summer driving.',
    fullDescription: 'Engineered specifically for hot Gulf climates. Built-in thermoelectric peltier cooling and a 5,500 RPM silent turbofan drop device temperature by up to 18°C while providing rapid 15W MagSafe wireless charging. Strong N52 neodymium magnets hold your phone securely over desert speed bumps and highways.',
    category: 'Car Tech & Mounts',
    categorySlug: 'car-accessories',
    subcategory: 'Car Mounts',
    brand: 'Joyroom',
    priceQAR: 99,
    originalPriceQAR: 169,
    discountPercent: 41,
    rating: 4.85,
    reviewCount: 279,
    soldCount: 810,
    stockPercent: 65,
    inStock: true,
    isFlashDeal: false,
    isTrending: true,
    isBestSeller: true,
    isUnder99: true,
    isNewArrival: true,
    badge: 'SUMMER MUST-HAVE',
    images: [
      'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop&q=80',
    ],
    tags: ['Joyroom', 'MagSafe Car Mount', 'Active Cooling', 'Summer Tech', 'Fast Wireless'],
    variants: {
      colors: [
        { name: 'Stealth Black', hex: '#111827' },
        { name: 'Metallic Silver', hex: '#9ca3af' },
      ],
      options: [
        { name: 'Mounting Style', values: ['Heavy-Duty Air Vent Hook', 'Dashboard Suction Arm (+QAR 15)'] },
      ],
    },
    volumeDiscounts: [
      { quantity: 1, pricePerUnitQAR: 99, savingsText: 'Super Deal Under 100' },
      { quantity: 2, pricePerUnitQAR: 89, savingsText: 'Save QAR 20' },
    ],
    specifications: {
      'Cooling Technology': 'Peltier Semiconductor Cooler + 5500 RPM Silent Turbofan',
      'Wireless Output': 'Qi Fast Charge 15W / 10W / 7.5W',
      'Magnetic Strength': '16x N52 Neodymium Magnetic Ring (Holds up to 1.8kg)',
      'Input Port': 'USB Type-C (9V/2A or 12V/2A required)',
    },
    packageContents: [
      'Joyroom Magnetic Active Cooling Car Mount',
      'Anti-Fall Dual Clamp Air Vent Clip',
      '1m Braided Fast USB-C Cable',
      'Magnetic Ring Adapter (for non-MagSafe devices)',
    ],
    dropshipInfo: {
      dispatchHours: 24,
      shippingDaysMin: 6,
      shippingDaysMax: 8,
      freeShippingThresholdQAR: 150,
      shippingCostQAR: 20,
      airCarrier: 'Express Air Freight to Hamad Int’l (DOH)',
      qualityInspected: true,
      hubOrigin: 'Regional Tech Distribution Hub',
    },
  },
  {
    id: 'qat-004',
    slug: 'lumix-rgb-monitor-light-bar-with-wireless-puck',
    title: 'Baseus i-wok Series 3 USB Asymmetric Screen Hanging Light Bar with 2.4G Dial',
    shortDescription: 'Asymmetric eye-care illumination with dual ambient RGB backlighting and weighted wireless desktop rotary control dial.',
    fullDescription: 'Illuminate your workspace with zero screen glare and zero eye strain. The Baseus i-wok 3 clamps securely onto flat or curved monitors. Includes a premium weighted 2.4G wireless rotary puck to tune stepless brightness, color temperature (2700K–6500K), and ambient rear ARGB backlight effects.',
    category: 'Gaming & Desk Tech',
    categorySlug: 'gaming-gear',
    subcategory: 'Desk Lighting',
    brand: 'Baseus',
    priceQAR: 139,
    originalPriceQAR: 249,
    discountPercent: 44,
    rating: 4.94,
    reviewCount: 310,
    soldCount: 750,
    stockPercent: 91,
    inStock: true,
    isFlashDeal: true,
    isTrending: true,
    isBestSeller: false,
    isUnder99: false,
    isNewArrival: false,
    badge: 'BEST FOR WORKSPACE',
    images: [
      'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=800&auto=format&fit=crop&q=80',
    ],
    tags: ['Baseus', 'ScreenBar', 'Desk Light', 'Wireless Dial', 'Eye Care Setup'],
    variants: {
      colors: [
        { name: 'Anodized Black', hex: '#18181b' },
        { name: 'Silver Lunar', hex: '#e2e8f0' },
      ],
    },
    volumeDiscounts: [
      { quantity: 1, pricePerUnitQAR: 139, savingsText: 'Special Deal' },
      { quantity: 2, pricePerUnitQAR: 125, savingsText: 'Save QAR 28' },
    ],
    specifications: {
      'Light Source': 'Asymmetric 80-LED Eye Care Array (Ra > 97)',
      'Color Temperature': '2700K (Warm Sunset) to 6500K (Daylight Cool)',
      'Backlight': '16-Million Color ARGB Ambience Strip',
      'Controller': '2.4GHz Wireless Magnetic Rotary Puck',
      'Power Source': 'USB-C 5V/2A',
    },
    packageContents: [
      'Baseus i-wok 3 ScreenBar Light Fixture',
      'Counterweight Clamp Mount for Flat/Curved Monitors',
      'Wireless Desktop Controller Dial (Batteries included)',
      '1.8m Braided USB-C Cable',
    ],
    dropshipInfo: {
      dispatchHours: 24,
      shippingDaysMin: 6,
      shippingDaysMax: 8,
      freeShippingThresholdQAR: 150,
      shippingCostQAR: 20,
      airCarrier: 'Express Air Freight to Hamad Int’l (DOH)',
      qualityInspected: true,
      hubOrigin: 'Regional Tech Distribution Hub',
    },
  },
  {
    id: 'qat-005',
    slug: 'titan-smartwatch-ultra-amoled-rugged-gps',
    title: 'Green Lion Monaco Rugged Smartwatch with 2.04" AMOLED Display & Bluetooth Calling',
    shortDescription: 'Military-grade titanium alloy casing, 1000-nit sunlight AMOLED screen, Bluetooth HD calling, and up to 14 days battery life.',
    fullDescription: 'Built for Qatar outdoor adventures, gym workouts, and daily elegance. The Green Lion Monaco boasts a brilliant 1000-nit always-on AMOLED display easily readable in dazzling Arabian sunlight. Features dual-mode Bluetooth calling, 120+ sports tracking modes, 24/7 heart rate/SpO2 health sensors, and IP68 water resistance.',
    category: 'Smartwatches & Fit',
    categorySlug: 'smartwatches',
    subcategory: 'Smartwatches',
    brand: 'Green Lion',
    priceQAR: 189,
    originalPriceQAR: 349,
    discountPercent: 46,
    rating: 4.87,
    reviewCount: 520,
    soldCount: 1680,
    stockPercent: 88,
    inStock: true,
    isFlashDeal: true,
    isTrending: true,
    isBestSeller: true,
    isUnder99: false,
    isNewArrival: false,
    badge: 'POPULAR IN DOHA',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
    ],
    tags: ['Green Lion', 'Smartwatch', 'AMOLED', 'Bluetooth Calling', 'Best Price in Qatar'],
    variants: {
      colors: [
        { name: 'Titanium Grey + Orange Alpine Loop', hex: '#ea580c' },
        { name: 'Deep Space Black + Silicone Strap', hex: '#111827' },
        { name: 'Desert Khaki + Trail Loop', hex: '#a16207' },
      ],
      options: [
        { name: 'Extra Band', values: ['Single Band Included', 'Includes 2 Extra Luxury Bands (+QAR 30)'] },
      ],
    },
    volumeDiscounts: [
      { quantity: 1, pricePerUnitQAR: 189, savingsText: 'Free Express Delivery in Qatar' },
      { quantity: 2, pricePerUnitQAR: 169, savingsText: 'Save QAR 40' },
    ],
    specifications: {
      'Display': '2.04-inch HD AMOLED 368x448, 1000 nits Always-On Display',
      'Battery Capacity': '450mAh Li-Po (10-14 days typical use)',
      'Water Resistance': 'IP68 / 5ATM Water Resistant',
      'Health Sensors': 'PPG Heart Rate, Blood Oxygen SpO2, Sleep Tracker, Compass',
      'OS Compatibility': 'iOS & Android via Green Lion App (Arabic & English)',
    },
    packageContents: [
      'Green Lion Monaco Smartwatch',
      'Magnetic Fast Wireless Charging Dock',
      'Breathable Alpine/Ocean Strap',
      'Tempered Glass Screen Protector (Pre-installed)',
      'Bilingual User Manual (English & Arabic)',
    ],
    dropshipInfo: {
      dispatchHours: 24,
      shippingDaysMin: 6,
      shippingDaysMax: 8,
      freeShippingThresholdQAR: 150,
      shippingCostQAR: 0,
      airCarrier: 'Express Air Freight to Hamad Int’l (DOH)',
      qualityInspected: true,
      hubOrigin: 'Regional Tech Distribution Hub',
    },
  },
  {
    id: 'qat-006',
    slug: 'powercore-25000mah-145w-laptop-power-bank-with-smart-tft',
    title: 'Anker 737 Power Bank (PowerCore 24K) 140W 3-Port Portable Charger with Smart Display',
    shortDescription: 'Airline-approved 24,000mAh external battery with smart digital color TFT screen, 140W two-way fast charging.',
    fullDescription: 'Ultra-powerful two-way charging power bank equipped with the latest Power Delivery 3.1 and bi-directional technology. Delivers up to 140W fast charge to your MacBook Pro 16", iPhone, or iPad. The integrated smart digital display shows output/input power, battery health, and estimated full recharge time.',
    category: 'GaN Chargers & Banks',
    categorySlug: 'chargers-powerbanks',
    subcategory: 'Power Banks',
    brand: 'Anker',
    priceQAR: 219,
    originalPriceQAR: 379,
    discountPercent: 42,
    rating: 4.96,
    reviewCount: 440,
    soldCount: 920,
    stockPercent: 62,
    inStock: true,
    isFlashDeal: false,
    isTrending: true,
    isBestSeller: true,
    isUnder99: false,
    isNewArrival: false,
    badge: 'AIRLINE APPROVED',
    images: [
      'https://images.unsplash.com/photo-1525858907241-d230b66fb9fa?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1639574657398-a2c1ab5b2e7b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582993960106-20fb1755f556?w=800&auto=format&fit=crop&q=80',
    ],
    tags: ['Anker', '140W', 'Power Bank', 'MacBook Charging', 'Smart Screen'],
    variants: {
      colors: [
        { name: 'Metallic Cyber Slate', hex: '#334155' },
        { name: 'Carbon Black', hex: '#09090b' },
      ],
    },
    volumeDiscounts: [
      { quantity: 1, pricePerUnitQAR: 219, savingsText: 'Free Delivery Across Qatar' },
      { quantity: 2, pricePerUnitQAR: 199, savingsText: 'Save QAR 40' },
    ],
    specifications: {
      'Capacity': '24,000mAh / 86.4Wh (Airline Approved < 100Wh)',
      'Total Output': '140W Max Simultaneous Output',
      'Port 1 (USB-C)': '140W PD 3.1 Input & Output',
      'Port 2 (USB-C)': '140W PD 3.1 Output',
      'Port 3 (USB-A)': '18W Quick Charge 3.0',
      'Display': 'Color TFT Smart Screen showing live Watts, Temp & Battery Health',
    },
    packageContents: [
      'Anker 737 Power Bank (PowerCore 24K)',
      '140W Heavy-Duty Braided USB-C to USB-C Cable (60cm)',
      'Travel Protective Pouch & Welcome Guide',
    ],
    dropshipInfo: {
      dispatchHours: 24,
      shippingDaysMin: 6,
      shippingDaysMax: 8,
      freeShippingThresholdQAR: 150,
      shippingCostQAR: 0,
      airCarrier: 'Express Air Freight to Hamad Int’l (DOH)',
      qualityInspected: true,
      hubOrigin: 'Regional Tech Distribution Hub',
    },
  },
  {
    id: 'qat-007',
    slug: 'lumos-cinema-portable-mini-smart-projector-4k-android',
    title: 'Wanbo T2 Max Pro Full HD 1080P Native Smart Android Portable Projector',
    shortDescription: 'Auto-focus & keystone correction, built-in Android OS with YouTube & Netflix, dual stereo Hi-Fi speakers.',
    fullDescription: 'Turn your bedroom, living room, or outdoor majlis into an immersive 150-inch cinematic experience. The Wanbo T2 Max Pro features native 1080P resolution with 4K decoding support, 900 ANSI lumens, AI auto-focus within 2 seconds, and wireless screen mirroring for iPhone, iPad, and Android devices.',
    category: 'Smart Home & Ambience',
    categorySlug: 'smart-home',
    subcategory: 'Home Entertainment',
    brand: 'Wanbo',
    priceQAR: 289,
    originalPriceQAR: 499,
    discountPercent: 42,
    rating: 4.82,
    reviewCount: 195,
    soldCount: 460,
    stockPercent: 77,
    inStock: true,
    isFlashDeal: false,
    isTrending: true,
    isBestSeller: false,
    isUnder99: false,
    isNewArrival: true,
    badge: 'NEW GENERATION',
    images: [
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=800&auto=format&fit=crop&q=80',
    ],
    tags: ['Wanbo', 'Projector', 'Android 11', 'Home Theater', 'Cinema Qatar'],
    variants: {
      colors: [
        { name: 'Ceramic White', hex: '#f8fafc' },
        { name: 'Midnight Navy', hex: '#1e293b' },
      ],
    },
    volumeDiscounts: [
      { quantity: 1, pricePerUnitQAR: 289, savingsText: 'Free Express Air Delivery' },
      { quantity: 2, pricePerUnitQAR: 259, savingsText: 'Save QAR 60' },
    ],
    specifications: {
      'Native Resolution': '1920 x 1080 Full HD (4K Decoded Support)',
      'Brightness': '900 ANSI Lumens',
      'Focus & Keystone': 'Full Omni-directional Auto Keystone + 2s Auto Focus',
      'Operating System': 'Android 11 with Google Play Store, Netflix, YouTube',
      'Audio': 'Dual 5W Dolby Surround Chamber Speakers',
    },
    packageContents: [
      'Wanbo T2 Max Pro Projector',
      'Bluetooth Voice Remote Control',
      'Power Adapter with UK 3-Pin Plug',
      '1.5m High-Speed HDMI Cable',
    ],
    dropshipInfo: {
      dispatchHours: 24,
      shippingDaysMin: 6,
      shippingDaysMax: 8,
      freeShippingThresholdQAR: 150,
      shippingCostQAR: 0,
      airCarrier: 'Express Air Freight to Hamad Int’l (DOH)',
      qualityInspected: true,
      hubOrigin: 'Regional Tech Distribution Hub',
    },
  },
  {
    id: 'qat-008',
    slug: 'maglock-3-in-1-foldable-wireless-charging-stand',
    title: 'Porodo 3-in-1 Foldable Magnetic Wireless Charging Station 15W for iPhone, Watch & AirPods',
    shortDescription: 'Folds completely flat for travel, simultaneous 15W fast magnetic charging for iPhone, Apple Watch, and AirPods.',
    fullDescription: 'The ultimate compact charging dock for home, office, and travel. Crafted with premium aerospace-grade aluminum joints, it powers your iPhone (15W MagSafe), Apple Watch, and wireless earbuds all in one neat footprint. Compatible with StandBy nightstand mode and easy to pack in your carry-on luggage.',
    category: 'Mobile Accessories',
    categorySlug: 'mobile-accessories',
    subcategory: 'Wireless Stands',
    brand: 'Porodo',
    priceQAR: 99,
    originalPriceQAR: 179,
    discountPercent: 45,
    rating: 4.89,
    reviewCount: 360,
    soldCount: 1100,
    stockPercent: 93,
    inStock: true,
    isFlashDeal: true,
    isTrending: true,
    isBestSeller: true,
    isUnder99: true,
    isNewArrival: false,
    badge: 'BEST VALUE',
    images: [
      'https://images.unsplash.com/photo-1681382659831-2f3b16748a64?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1789499519702-756d2f8a1d7f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616876195047-522271be4e66?w=800&auto=format&fit=crop&q=80',
    ],
    tags: ['Porodo', 'MagSafe', '3-in-1 Charger', 'Apple Watch', 'Travel Gear'],
    variants: {
      colors: [
        { name: 'Matte Space Grey', hex: '#374151' },
        { name: 'Cloud White', hex: '#f9fafb' },
      ],
    },
    volumeDiscounts: [
      { quantity: 1, pricePerUnitQAR: 99, savingsText: 'Special Price' },
      { quantity: 2, pricePerUnitQAR: 89, savingsText: 'Save QAR 20' },
    ],
    specifications: {
      'Phone Wireless Output': '15W / 10W / 7.5W Qi Magnetic Fast Charge',
      'Watch Output': '3W (Apple Watch Series 4-10 / Ultra)',
      'Earbuds Output': '5W Qi Wireless Charging Pad',
      'Materials': 'CNC Aluminum Alloy + Soft-Touch Leatherette Pad',
    },
    packageContents: [
      'Porodo 3-in-1 Foldable Magnetic Dock',
      '1m Braided USB-C to USB-C Fast Cable',
      'Protective Travel Zipper Case',
    ],
    dropshipInfo: {
      dispatchHours: 24,
      shippingDaysMin: 6,
      shippingDaysMax: 8,
      freeShippingThresholdQAR: 150,
      shippingCostQAR: 20,
      airCarrier: 'Express Air Freight to Hamad Int’l (DOH)',
      qualityInspected: true,
      hubOrigin: 'Regional Tech Distribution Hub',
    },
  },
  {
    id: 'qat-009',
    slug: 'apex-pro-wireless-tri-mode-gaming-mouse-lightweight',
    title: 'VGN Dragonfly F1 Pro Max 49g Ultralight Wireless Gaming Mouse (PAW3395 / 26K DPI)',
    shortDescription: 'Featherweight 49-gram solid chassis, PixArt PAW3395 optical sensor, Nordic 52840 MCU, and up to 80 hours battery.',
    fullDescription: 'Engineered for competitive esports gamers in Qatar. The VGN Dragonfly F1 Pro Max offers flagship-grade PixArt PAW3395 sensor precision with up to 26,000 DPI and 650 IPS tracking speed. Ultra-low latency tri-mode wireless (2.4GHz / Bluetooth / Wired) with Huano blue shell pink dot 80M micro-switches.',
    category: 'Gaming & Desk Tech',
    categorySlug: 'gaming-gear',
    subcategory: 'Gaming Mice',
    brand: 'VGN',
    priceQAR: 119,
    originalPriceQAR: 199,
    discountPercent: 40,
    rating: 4.91,
    reviewCount: 220,
    soldCount: 580,
    stockPercent: 82,
    inStock: true,
    isFlashDeal: false,
    isTrending: false,
    isBestSeller: false,
    isUnder99: false,
    isNewArrival: true,
    badge: 'PRO ESPORTS',
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
    ],
    tags: ['VGN', 'Gaming Mouse', 'PAW3395', '49g Ultralight', 'Esports Qatar'],
    variants: {
      colors: [
        { name: 'Phantom White', hex: '#f8fafc' },
        { name: 'Viper Black', hex: '#0f172a' },
      ],
      options: [
        { name: 'Polling Dongle', values: ['Includes 1000Hz Nano Dongle', 'Includes 4K Super Polling Dongle (+QAR 35)'] },
      ],
    },
    volumeDiscounts: [
      { quantity: 1, pricePerUnitQAR: 119, savingsText: 'Gamer Value Deal' },
      { quantity: 2, pricePerUnitQAR: 105, savingsText: 'Save QAR 28' },
    ],
    specifications: {
      'Sensor': 'PixArt PAW3395 Optical (26,000 DPI, 650 IPS, 50G Acceleration)',
      'Weight': '49g ± 2g Solid Shell (No holes)',
      'Switches': 'Huano Blue Shell Pink Dot (80 Million Click Lifespan)',
      'Battery Life': 'Up to 80 hours continuous gameplay at 1000Hz',
    },
    packageContents: [
      'VGN Dragonfly F1 Pro Max Mouse',
      '2.4GHz Wireless USB Dongle',
      '1.8m Paracord Superflex USB-C Cable',
      'Pre-cut Anti-Slip Grip Tape & Extra PTFE Skates',
    ],
    dropshipInfo: {
      dispatchHours: 24,
      shippingDaysMin: 6,
      shippingDaysMax: 8,
      freeShippingThresholdQAR: 150,
      shippingCostQAR: 20,
      airCarrier: 'Express Air Freight to Hamad Int’l (DOH)',
      qualityInspected: true,
      hubOrigin: 'Regional Tech Distribution Hub',
    },
  },
  {
    id: 'qat-010',
    slug: 'falcon-4k-mini-gps-drone-brushless-obstacle-avoidance',
    title: 'SJRC F22S 4K Pro GPS Drone with 2-Axis Gimbal & EIS 4K UHD Camera',
    shortDescription: 'Sub-250g aerial drone with 4K UHD stabilized camera, 35-minute flight time, 3.5km video transmission, and GPS auto return.',
    fullDescription: 'Capture stunning aerial 4K footage across Lusail Marina, Zubarah Fort, and the Inland Sea dunes. The SJRC F22S 4K Pro features a 2-axis mechanical gimbal with Electronic Image Stabilization (EIS), level 5 desert wind resistance, optical flow hover, and smart Return-to-Home failsafe.',
    category: 'Drones & Vlogging',
    categorySlug: 'drones-cameras',
    subcategory: 'GPS Drones',
    brand: 'SJRC',
    priceQAR: 449,
    originalPriceQAR: 799,
    discountPercent: 44,
    rating: 4.86,
    reviewCount: 165,
    soldCount: 390,
    stockPercent: 68,
    inStock: true,
    isFlashDeal: false,
    isTrending: true,
    isBestSeller: false,
    isUnder99: false,
    isNewArrival: true,
    badge: 'FLAGSHIP DRONE',
    images: [
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80',
    ],
    tags: ['SJRC', '4K Drone', 'Gimbal Camera', 'GPS', 'Desert Friendly'],
    variants: {
      colors: [
        { name: 'Titanium Grey', hex: '#64748b' },
      ],
      options: [
        { name: 'Battery Bundle', values: ['1 Battery Pack (35 Mins)', 'Fly More 3-Battery Combo + Bag (+QAR 120)'] },
      ],
    },
    volumeDiscounts: [
      { quantity: 1, pricePerUnitQAR: 449, savingsText: 'Free Express Delivery in Qatar' },
      { quantity: 2, pricePerUnitQAR: 410, savingsText: 'Save QAR 78' },
    ],
    specifications: {
      'Weight': '246g Ultra-Portable (Exempt from registration in most areas)',
      'Camera Sensor': '1/2.3" Sony CMOS 4K/30fps Video, 48MP Stills',
      'Transmission Range': 'Up to 3.5km Real-time HD Video Feed',
      'Wind Resistance': 'Level 5 (Handles desert wind up to 38 km/h)',
      'Intelligent Modes': 'QuickShots, Follow Me, Point of Interest, Auto Return-to-Home',
    },
    packageContents: [
      'SJRC F22S 4K Pro Aircraft',
      'Ergonomic Smartphone Remote Controller',
      'Intelligent Flight Battery',
      '3 Pairs Low-Noise Spare Propellers',
      'Gimbal Cover, Tools & Travel Shoulder Bag',
    ],
    dropshipInfo: {
      dispatchHours: 24,
      shippingDaysMin: 6,
      shippingDaysMax: 8,
      freeShippingThresholdQAR: 150,
      shippingCostQAR: 0,
      airCarrier: 'Express Air Freight to Hamad Int’l (DOH)',
      qualityInspected: true,
      hubOrigin: 'Regional Tech Distribution Hub',
    },
  },
  {
    id: 'qat-011',
    slug: 'pureglow-smart-temperature-display-stainless-insulated-bottle',
    title: 'Porodo Smart Vacuum Insulated Stainless Steel Water Bottle with LED Temp Display (500ml)',
    shortDescription: 'Touch LED temperature cap, double-wall 316 medical stainless steel, keeps drinks ice cold for 24 hours in Qatar heat.',
    fullDescription: 'A daily essential for living and commuting in Qatar. Touch the waterproof cap to check the liquid temperature instantly. Double-wall vacuum insulation keeps iced drinks freezing cold for 24 hours or hot tea/Karak piping hot for 12 hours with zero sweat or condensation.',
    category: 'Smart Home & Ambience',
    categorySlug: 'smart-home',
    subcategory: 'Smart Living',
    brand: 'Porodo',
    priceQAR: 49,
    originalPriceQAR: 89,
    discountPercent: 45,
    rating: 4.81,
    reviewCount: 310,
    soldCount: 1450,
    stockPercent: 95,
    inStock: true,
    isFlashDeal: false,
    isTrending: false,
    isBestSeller: true,
    isUnder99: true,
    isNewArrival: false,
    badge: 'UNDER QAR 50',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=800&auto=format&fit=crop&q=80',
    ],
    tags: ['Porodo', 'Smart Flask', 'LED Temperature', 'Under QAR 50', 'Summer Qatar'],
    variants: {
      colors: [
        { name: 'Matte Obsidian Black', hex: '#18181b' },
        { name: 'Rose Gold', hex: '#fb7185' },
        { name: 'Emerald Green', hex: '#059669' },
      ],
    },
    volumeDiscounts: [
      { quantity: 1, pricePerUnitQAR: 49, savingsText: 'Hot Deal' },
      { quantity: 2, pricePerUnitQAR: 42, savingsText: 'Buy 2 for QAR 84' },
      { quantity: 3, pricePerUnitQAR: 38, savingsText: 'Buy 3 for QAR 114' },
    ],
    specifications: {
      'Capacity': '500ml / 17oz',
      'Material': 'Inner 316 Medical-Grade Stainless Steel, BPA Free',
      'Insulation Performance': '24 Hours Ice Cold / 12 Hours Hot Karak',
      'LED Display': 'Waterproof Touch OLED Cap (Battery lasts 500+ days)',
    },
    packageContents: [
      'Porodo 500ml Smart Temperature Bottle',
      'Removable Stainless Tea/Fruit Infuser Filter',
      'Retail Gift Box',
    ],
    dropshipInfo: {
      dispatchHours: 24,
      shippingDaysMin: 6,
      shippingDaysMax: 8,
      freeShippingThresholdQAR: 150,
      shippingCostQAR: 20,
      airCarrier: 'Express Air Freight to Hamad Int’l (DOH)',
      qualityInspected: true,
      hubOrigin: 'Regional Tech Distribution Hub',
    },
  },
  {
    id: 'qat-012',
    slug: 'silicone-liquid-armor-240w-fast-charging-cable-zinc-alloy',
    title: 'Baseus 240W PD 3.1 Type-C to Type-C Ultra-Fast Liquid Silicone Cable with LED Wattage Meter (1.8m)',
    shortDescription: 'Tangle-free skin-friendly food-grade silicone cable, 240W Power Delivery 3.1 fast charging with real-time digital power display.',
    fullDescription: 'Built for maximum charging performance and durability. Powers high-spec gaming laptops, MacBook Pro, and smartphones up to 240W (48V/5A). The zinc-alloy connector features a real-time digital wattage display so you can verify live charging output at a glance. Tested for 30,000+ bends.',
    category: 'Fast Cables & OTG',
    categorySlug: 'cables-adapters',
    subcategory: 'Cables',
    brand: 'Baseus',
    priceQAR: 39,
    originalPriceQAR: 69,
    discountPercent: 43,
    rating: 4.93,
    reviewCount: 480,
    soldCount: 2200,
    stockPercent: 92,
    inStock: true,
    isFlashDeal: true,
    isTrending: true,
    isBestSeller: true,
    isUnder99: true,
    isNewArrival: false,
    badge: 'SUPER SELLER',
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=800&auto=format&fit=crop&q=80',
    ],
    tags: ['Baseus', '240W Cable', 'Type-C Fast Charge', 'Silicone Cable', 'Wattage Display'],
    variants: {
      colors: [
        { name: 'Sky Cyan', hex: '#06b6d4' },
        { name: 'Midnight Charcoal', hex: '#1e293b' },
        { name: 'Sunset Orange', hex: '#f97316' },
      ],
      options: [
        { name: 'Cable Length', values: ['1.2 Meter (Everyday)', '1.8 Meter (Bedside & Couch)'] },
      ],
    },
    volumeDiscounts: [
      { quantity: 1, pricePerUnitQAR: 39, savingsText: 'Bestseller' },
      { quantity: 2, pricePerUnitQAR: 32, savingsText: 'Buy 2 for QAR 64' },
      { quantity: 3, pricePerUnitQAR: 29, savingsText: 'Buy 3 for QAR 87' },
    ],
    specifications: {
      'Maximum Power': '240W PD 3.1 Extended Power Range (48V/5A)',
      'Data Transfer': 'USB 2.0 (480 Mbps)',
      'Material': 'Food-Grade Liquid Silicone Jacket + Zinc-Alloy Housings',
      'Bend Test Lifespan': '30,000+ Severe Bends Tested',
      'Smart Chip': 'E-Marker Certified with Real-Time Wattage LED Display',
    },
    packageContents: [
      'Baseus 240W Silicone Cable (1.8m)',
      'Silicone Cable Organizer Strap',
    ],
    dropshipInfo: {
      dispatchHours: 24,
      shippingDaysMin: 6,
      shippingDaysMax: 8,
      freeShippingThresholdQAR: 150,
      shippingCostQAR: 15,
      airCarrier: 'Express Air Freight to Hamad Int’l (DOH)',
      qualityInspected: true,
      hubOrigin: 'Regional Tech Distribution Hub',
    },
  },
  {
    id: 'qat-013',
    slug: 'gravity-grip-heavy-duty-metal-car-headrest-tablet-mount',
    title: 'Baseus Backseat 360-Degree Swivel Heavy-Duty Car Headrest Mount Holder for iPad & Tablets',
    shortDescription: 'All-metal anti-vibration mount keeps kids and passengers entertained on road trips. Fits devices from 4.7" to 12.9".',
    fullDescription: 'Machined with aluminum alloy arms for rock-solid stability even on rough desert roads and speed bumps. Dual ball joints allow 360-degree rotation and extendable arms let you position the iPad or tablet directly between the front seats for shared passenger viewing.',
    category: 'Car Tech & Mounts',
    categorySlug: 'car-accessories',
    subcategory: 'Car Mounts',
    brand: 'Baseus',
    priceQAR: 69,
    originalPriceQAR: 129,
    discountPercent: 47,
    rating: 4.79,
    reviewCount: 142,
    soldCount: 610,
    stockPercent: 79,
    inStock: true,
    isFlashDeal: false,
    isTrending: false,
    isBestSeller: false,
    isUnder99: true,
    isNewArrival: false,
    badge: 'FAMILY FAVORITE',
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=800&auto=format&fit=crop&q=80',
    ],
    tags: ['Baseus', 'Tablet Car Mount', 'iPad Holder', 'Car Accessories', 'Road Trip Qatar'],
    variants: {
      colors: [
        { name: 'Matte Space Black', hex: '#0f172a' },
      ],
    },
    volumeDiscounts: [
      { quantity: 1, pricePerUnitQAR: 69, savingsText: 'Road Trip Deal' },
      { quantity: 2, pricePerUnitQAR: 59, savingsText: 'Save QAR 20' },
    ],
    specifications: {
      'Compatibility': 'Devices 4.7 inches to 12.9 inches (All iPads, Galaxy Tabs, Mobile Phones)',
      'Headrest Bar Spacing': 'Fits headrest bar width between 110mm and 150mm',
      'Materials': 'Anodized Aluminum Alloy + Non-Slip Silicone Padding',
      'Load Bearing': 'Up to 3.5kg steady hold without drooping or shaking',
    },
    packageContents: [
      'Baseus Backseat Headrest Clamping Arm',
      'Heavy-Duty Device Cradle',
      'Hex Key for custom tension adjustment',
    ],
    dropshipInfo: {
      dispatchHours: 24,
      shippingDaysMin: 6,
      shippingDaysMax: 8,
      freeShippingThresholdQAR: 150,
      shippingCostQAR: 20,
      airCarrier: 'Express Air Freight to Hamad Int’l (DOH)',
      qualityInspected: true,
      hubOrigin: 'Regional Tech Distribution Hub',
    },
  },
  {
    id: 'qat-014',
    slug: 'rgb-sound-activated-ambient-pickup-rhythm-light-bar',
    title: 'Porodo Sound Reactive RGB Music Rhythm Pickup Ambient Light Bar (32-Bit LED)',
    shortDescription: 'Studio voice-sensing rhythm visualizer with 32 ARGB LED beads, 18 color modes, and AGC noise reduction.',
    fullDescription: 'Transform your gaming desk, home theater, or car dashboard. Built-in high-sensitivity microphone captures surrounding music and translates sound into dynamic rhythm light waves with zero lag. Features 8 dynamic display modes, 4 brightness levels, and 18 vibrant color presets.',
    category: 'Smart Home & Ambience',
    categorySlug: 'smart-home',
    subcategory: 'Desk Lighting',
    brand: 'Porodo',
    priceQAR: 45,
    originalPriceQAR: 79,
    discountPercent: 43,
    rating: 4.87,
    reviewCount: 390,
    soldCount: 1850,
    stockPercent: 88,
    inStock: true,
    isFlashDeal: true,
    isTrending: true,
    isBestSeller: true,
    isUnder99: true,
    isNewArrival: false,
    badge: 'TRENDING TECH',
    images: [
      'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&auto=format&fit=crop&q=80',
    ],
    tags: ['Porodo', 'RGB Light Bar', 'Sound Reactive', 'Desk Setup', 'Under QAR 50'],
    variants: {
      colors: [
        { name: 'Matte Black', hex: '#18181b' },
        { name: 'Silver Aluminum', hex: '#e2e8f0' },
      ],
      options: [
        { name: 'Power Version', values: ['USB Plug-in Model (QAR 45)', 'Built-in 300mAh Rechargeable (+QAR 10)'] },
      ],
    },
    volumeDiscounts: [
      { quantity: 1, pricePerUnitQAR: 45, savingsText: 'Trending Deal' },
      { quantity: 2, pricePerUnitQAR: 39, savingsText: 'Pair for QAR 78' },
    ],
    specifications: {
      'LED Bead Count': '32 Independent High-Brightness ARGB Beads',
      'Processor': '32-bit ARM Cortex M0 with AGC Automatic Gain Control',
      'Lighting Modes': '8 Display Modes, 4 Brightness Levels, 5 Speed Levels, 18 Color Styles',
      'Dimensions': '181mm x 16mm x 18.5mm',
    },
    packageContents: [
      'Porodo RGB Rhythm Light Bar',
      'Vertical Desktop Base Stand',
      '4x Double-Sided Adhesive Mount Pads',
      '1m USB-C Power Cable',
    ],
    dropshipInfo: {
      dispatchHours: 24,
      shippingDaysMin: 6,
      shippingDaysMax: 8,
      freeShippingThresholdQAR: 150,
      shippingCostQAR: 15,
      airCarrier: 'Express Air Freight to Hamad Int’l (DOH)',
      qualityInspected: true,
      hubOrigin: 'Regional Tech Distribution Hub',
    },
  },
  {
    id: 'qat-015',
    slug: 'anker-313-fast-wireless-charging-stand',
    title: 'Anker 313 Fast Wireless Charging Stand (10W/7.5W Qi Certified)',
    shortDescription: 'Dual-coil wireless desk stand charging in both landscape and portrait orientations for video calls.',
    fullDescription: 'Charge effortlessly while video calling or watching tutorials. Dual charging coils allow portrait and landscape charging with case compatibility up to 5mm thick. Features PowerWave temperature control and foreign object detection.',
    category: 'GaN Chargers & Banks',
    categorySlug: 'chargers-powerbanks',
    subcategory: 'Wireless Chargers',
    brand: 'Anker',
    priceQAR: 79,
    originalPriceQAR: 139,
    discountPercent: 43,
    rating: 4.86,
    reviewCount: 215,
    soldCount: 640,
    stockPercent: 74,
    inStock: true,
    isFlashDeal: false,
    isTrending: false,
    isBestSeller: false,
    isUnder99: true,
    isNewArrival: true,
    badge: 'DESK ESSENTIAL',
    images: [
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616876195047-522271be4e66?w=800&auto=format&fit=crop&q=80',
    ],
    tags: ['Anker', 'Wireless Charger', 'Qi Fast Charge', 'Desk Stand'],
    variants: {
      colors: [
        { name: 'Midnight Black', hex: '#18181b' },
        { name: 'Arctic White', hex: '#f8fafc' },
      ],
    },
    volumeDiscounts: [
      { quantity: 1, pricePerUnitQAR: 79, savingsText: 'Super Deal' },
      { quantity: 2, pricePerUnitQAR: 69, savingsText: 'Save QAR 20' },
    ],
    specifications: {
      'Wireless Output': '10W (Samsung Galaxy) / 7.5W (iPhone) / 5W standard',
      'Input Port': 'Micro-USB / Type-C compatible adapter required (5V/2A or 9V/2A)',
      'Charging Distance': 'Up to 5mm (non-metal cases)',
      'Protection': 'MultiProtect Safety System with Radiation Shielding',
    },
    packageContents: [
      'Anker 313 Wireless Charging Stand',
      '1m Micro-USB Charging Cable',
      'Welcome Guide & 18-Month Warranty Card',
    ],
    dropshipInfo: {
      dispatchHours: 24,
      shippingDaysMin: 6,
      shippingDaysMax: 8,
      freeShippingThresholdQAR: 150,
      shippingCostQAR: 15,
      airCarrier: 'Express Air Freight to Hamad Int’l (DOH)',
      qualityInspected: true,
      hubOrigin: 'Regional Tech Distribution Hub',
    },
  },
  {
    id: 'qat-016',
    slug: 'baseus-magnetic-ring-kickstand-zinc-alloy',
    title: 'Baseus Magnetic Phone Ring Holder Kickstand (Ultra Slim Zinc Alloy)',
    shortDescription: '360° rotating double-ring foldable metal kickstand and magnetic finger grip for all smartphones.',
    fullDescription: 'Crafted from aircraft-grade zinc alloy with polished chamfered edges. Features dual folding arms offering 360-degree rotation and 180-degree flip angles for portrait streaming or hands-free kitchen recipe viewing. Strong N52 magnetic grip attaches securely to magnetic car holders.',
    category: 'Mobile Accessories',
    categorySlug: 'mobile-accessories',
    subcategory: 'Grips & Stands',
    brand: 'Baseus',
    priceQAR: 29,
    originalPriceQAR: 55,
    discountPercent: 47,
    rating: 4.82,
    reviewCount: 310,
    soldCount: 1420,
    stockPercent: 89,
    inStock: true,
    isFlashDeal: false,
    isTrending: false,
    isBestSeller: false,
    isUnder99: true,
    isNewArrival: false,
    badge: 'UNDER QAR 30',
    images: [
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop&q=80',
    ],
    tags: ['Baseus', 'Phone Ring', 'Magnetic Holder', 'MagSafe Compatible', 'Slim Grip'],
    variants: {
      colors: [
        { name: 'Space Gray', hex: '#4b5563' },
        { name: 'Silver Chrome', hex: '#d1d5db' },
        { name: 'Rose Gold', hex: '#f43f5e' },
      ],
    },
    volumeDiscounts: [
      { quantity: 1, pricePerUnitQAR: 29, savingsText: 'Pocket Deal' },
      { quantity: 2, pricePerUnitQAR: 24, savingsText: 'Pair for QAR 48' },
    ],
    specifications: {
      'Material': 'High-Density Zinc Alloy + Silicone Non-Scratch Core',
      'Thickness': 'Only 3.2mm ultra-flat profile',
      'Load Capacity': 'Up to 5kg tested tensile force',
      'Rotation': '360° Base Swivel + 180° Dual Hinges',
    },
    packageContents: [
      'Baseus Ultra-Slim Dual Ring Stand',
      'Extra 3M VHB Adhesive Pad',
      'Electrostatic Film for phone glass backing',
    ],
    dropshipInfo: {
      dispatchHours: 24,
      shippingDaysMin: 6,
      shippingDaysMax: 8,
      freeShippingThresholdQAR: 150,
      shippingCostQAR: 15,
      airCarrier: 'Express Air Freight to Hamad Int’l (DOH)',
      qualityInspected: true,
      hubOrigin: 'Regional Tech Distribution Hub',
    },
  },
  {
    id: 'qat-017',
    slug: 'porodo-7-in-1-electronic-earbud-cleaning-kit',
    title: 'Porodo Multi-Functional 7-in-1 Electronic & Earbud Cleaning Kit',
    shortDescription: 'All-in-one precision cleaning tool with keyboard keycap puller, flocking sponge, and high-density brush.',
    fullDescription: 'Keep AirPods, keyboards, screens, and cameras impeccably clean. Integrates high-density nylon brush, silicone crevice nib, flocking micro-sponge pen for earbud charging cases, spray bottle nozzle, and microfiber polishing pad in a compact travel cylinder.',
    category: 'Mobile Accessories',
    categorySlug: 'mobile-accessories',
    subcategory: 'Cleaning Accessories',
    brand: 'Porodo',
    priceQAR: 35,
    originalPriceQAR: 69,
    discountPercent: 49,
    rating: 4.88,
    reviewCount: 420,
    soldCount: 2100,
    stockPercent: 92,
    inStock: true,
    isFlashDeal: false,
    isTrending: false,
    isBestSeller: false,
    isUnder99: true,
    isNewArrival: true,
    badge: 'SUPER CLEAN',
    images: [
      'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    ],
    tags: ['Porodo', 'Cleaning Kit', 'AirPods Cleaner', 'Keyboard Brush', 'Gadget Care'],
    variants: {
      colors: [
        { name: 'Clean White', hex: '#f8fafc' },
        { name: 'Pastel Blue', hex: '#60a5fa' },
      ],
    },
    volumeDiscounts: [
      { quantity: 1, pricePerUnitQAR: 35, savingsText: 'Everyday Deal' },
      { quantity: 2, pricePerUnitQAR: 29, savingsText: 'Save QAR 12' },
    ],
    specifications: {
      'Functions': '7-in-1 (Keycap puller, Large brush, Sponge pen, Silicone tip, Screen wipe, Spray bottle, Lens brush)',
      'Dimensions': '125mm x 44mm x 28mm pocket size',
      'Weight': '82g lightweight design',
    },
    packageContents: [
      'Porodo 7-in-1 Multi-Tool Enclosure',
      'Refillable Screen Cleaner Spray Bottle (5ml)',
      'Keycap Extractor Tool',
    ],
    dropshipInfo: {
      dispatchHours: 24,
      shippingDaysMin: 6,
      shippingDaysMax: 8,
      freeShippingThresholdQAR: 150,
      shippingCostQAR: 15,
      airCarrier: 'Express Air Freight to Hamad Int’l (DOH)',
      qualityInspected: true,
      hubOrigin: 'Regional Tech Distribution Hub',
    },
  },
  {
    id: 'qat-018',
    slug: 'joyroom-30w-dual-usb-fast-car-charger-mini',
    title: 'Joyroom 30W Dual USB Fast Car Charger Mini Metal Adapter (PD + QC 3.0)',
    shortDescription: 'Flush-fit mini zinc alloy cigarette lighter adapter delivering simultaneous 30W Power Delivery.',
    fullDescription: 'Disappears almost completely flush into your 12V/24V cigarette lighter socket. Features dual high-output ports: 30W USB-C PD 3.0 and 18W USB-A Quick Charge 3.0. Solid all-metal zinc alloy housing dissipates heat rapidly during hot Qatar summers.',
    category: 'Car Tech & Mounts',
    categorySlug: 'car-accessories',
    subcategory: 'Car Chargers',
    brand: 'Joyroom',
    priceQAR: 49,
    originalPriceQAR: 89,
    discountPercent: 45,
    rating: 4.84,
    reviewCount: 260,
    soldCount: 980,
    stockPercent: 68,
    inStock: true,
    isFlashDeal: false,
    isTrending: false,
    isBestSeller: false,
    isUnder99: true,
    isNewArrival: false,
    badge: 'HOT VALUE',
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=800&auto=format&fit=crop&q=80',
    ],
    tags: ['Joyroom', 'Car Charger', 'Mini Fast Adapter', '30W PD', 'Zinc Alloy'],
    variants: {
      colors: [
        { name: 'Gunmetal Silver', hex: '#64748b' },
        { name: 'Obsidian Black', hex: '#0f172a' },
      ],
    },
    volumeDiscounts: [
      { quantity: 1, pricePerUnitQAR: 49, savingsText: 'Road Ready' },
      { quantity: 2, pricePerUnitQAR: 42, savingsText: 'Save QAR 14' },
    ],
    specifications: {
      'Total Output': '30W Max (PD 3.0 + QC 3.0)',
      'Input': 'DC 12V-24V for cars, SUVs, and trucks',
      'Protection': 'Over-current, Over-voltage, Over-temperature, Short-circuit protection',
      'Size': '39.8mm x 20.5mm ultra-compact',
    },
    packageContents: [
      'Joyroom 30W Zinc Alloy Mini Car Charger',
      'User Manual & Certification Slip',
    ],
    dropshipInfo: {
      dispatchHours: 24,
      shippingDaysMin: 6,
      shippingDaysMax: 8,
      freeShippingThresholdQAR: 150,
      shippingCostQAR: 15,
      airCarrier: 'Express Air Freight to Hamad Int’l (DOH)',
      qualityInspected: true,
      hubOrigin: 'Regional Tech Distribution Hub',
    },
  },
  {
    id: 'qat-019',
    slug: 'baseus-bowie-e16-tws-wireless-earbuds-ipx4',
    title: 'Baseus Bowie E16 True Wireless Stereo Earbuds with Bluetooth 5.3',
    shortDescription: '30-hour battery life with 13mm dynamic neodymium drivers and ultra-lightweight 3.8g ergonomic design.',
    fullDescription: 'High quality wireless audio at an unbelievable price point. Built with 13mm dynamic drivers delivering punchy bass and clear vocals. Bluetooth 5.3 ensures low latency gaming and instant auto-pairing when you pop open the clamshell case.',
    category: 'TWS & Spatial Audio',
    categorySlug: 'tws-audio',
    subcategory: 'Earbuds',
    brand: 'Baseus',
    priceQAR: 69,
    originalPriceQAR: 119,
    discountPercent: 42,
    rating: 4.81,
    reviewCount: 340,
    soldCount: 1150,
    stockPercent: 81,
    inStock: true,
    isFlashDeal: false,
    isTrending: false,
    isBestSeller: false,
    isUnder99: true,
    isNewArrival: false,
    badge: 'GREAT VALUE',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop&q=80',
    ],
    tags: ['Baseus', 'Bowie E16', 'TWS Earbuds', 'Bluetooth 5.3', 'Under QAR 70'],
    variants: {
      colors: [
        { name: 'Starlight White', hex: '#f8fafc' },
        { name: 'Cosmic Black', hex: '#18181b' },
      ],
    },
    volumeDiscounts: [
      { quantity: 1, pricePerUnitQAR: 69, savingsText: 'Best TWS Deal' },
      { quantity: 2, pricePerUnitQAR: 59, savingsText: 'Save QAR 20' },
    ],
    specifications: {
      'Playtime': '6 Hours (Earbuds) / 30 Hours (With Charging Case)',
      'Bluetooth Version': 'Bluetooth 5.3 with 0.06s Low Latency Mode',
      'Driver Unit': '13mm Large Composite Diaphragm',
      'Waterproof Rating': 'IPX4 Splash & Sweat Proof',
    },
    packageContents: [
      'Baseus Bowie E16 Earbuds (Left & Right)',
      'Compact Charging Case',
      'Type-C Fast Charging Cable',
      'Quick Start Manual',
    ],
    dropshipInfo: {
      dispatchHours: 24,
      shippingDaysMin: 6,
      shippingDaysMax: 8,
      freeShippingThresholdQAR: 150,
      shippingCostQAR: 15,
      airCarrier: 'Express Air Freight to Hamad Int’l (DOH)',
      qualityInspected: true,
      hubOrigin: 'Regional Tech Distribution Hub',
    },
  },
  {
    id: 'qat-020',
    slug: 'anker-322-braided-fast-lightning-cable-1-8m',
    title: 'Anker 322 USB-C to Lightning Braided Fast Cable (1.8m MFi Certified)',
    shortDescription: 'Apple MFi-certified double-braided nylon cable supporting 0 to 50% iPhone charging in 30 minutes.',
    fullDescription: 'Built to withstand over 12,000 rigorous bends. Apple MFi certified with genuine C94 Lightning connector chip for error-free high speed syncing and fast Power Delivery charging with any USB-C wall charger or power bank.',
    category: 'Fast Cables & OTG',
    categorySlug: 'cables-adapters',
    subcategory: 'Lightning Cables',
    brand: 'Anker',
    priceQAR: 45,
    originalPriceQAR: 79,
    discountPercent: 43,
    rating: 4.91,
    reviewCount: 380,
    soldCount: 1670,
    stockPercent: 85,
    inStock: true,
    isFlashDeal: false,
    isTrending: false,
    isBestSeller: false,
    isUnder99: true,
    isNewArrival: false,
    badge: 'APPLE MFi',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
    ],
    tags: ['Anker', 'Lightning Cable', 'MFi Certified', 'Fast PD Charge', 'Braided Nylon'],
    variants: {
      colors: [
        { name: 'Braided Black', hex: '#18181b' },
        { name: 'Cloud White', hex: '#f8fafc' },
      ],
    },
    volumeDiscounts: [
      { quantity: 1, pricePerUnitQAR: 45, savingsText: 'MFi Cable Deal' },
      { quantity: 2, pricePerUnitQAR: 39, savingsText: 'Pair for QAR 78' },
    ],
    specifications: {
      'Length': '1.8 Meters (6 Feet)',
      'Certification': 'Apple MFi Authorized C94 Terminal',
      'Bend Lifespan': '12,000+ Verified Bends',
      'Max Power': 'Supports up to 27W Power Delivery fast charging',
    },
    packageContents: [
      'Anker 322 USB-C to Lightning Cable (1.8m)',
      'Silicone Cable Tie Strap',
    ],
    dropshipInfo: {
      dispatchHours: 24,
      shippingDaysMin: 6,
      shippingDaysMax: 8,
      freeShippingThresholdQAR: 150,
      shippingCostQAR: 15,
      airCarrier: 'Express Air Freight to Hamad Int’l (DOH)',
      qualityInspected: true,
      hubOrigin: 'Regional Tech Distribution Hub',
    },
  },
  {
    id: 'qat-021',
    slug: 'porodo-smart-key-finder-bluetooth-tracker-tag',
    title: 'Porodo Smart Key Finder & Anti-Lost Bluetooth Tracker Tag',
    shortDescription: 'Locate keys, wallets, and bags using the Apple Find My network with 1-year replaceable battery.',
    fullDescription: 'Never lose your keys or luggage in Doha again. Officially certified with Apple Find My network. When you leave items behind, your iPhone instantly alerts you. Emits an 85dB chime to guide you to misplaced belongings under cushions or inside car seats.',
    category: 'Smart Home & Ambience',
    categorySlug: 'smart-home',
    subcategory: 'Smart Trackers',
    brand: 'Porodo',
    priceQAR: 39,
    originalPriceQAR: 69,
    discountPercent: 43,
    rating: 4.83,
    reviewCount: 290,
    soldCount: 1340,
    stockPercent: 77,
    inStock: true,
    isFlashDeal: false,
    isTrending: false,
    isBestSeller: false,
    isUnder99: true,
    isNewArrival: true,
    badge: 'APPLE FIND MY',
    images: [
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=800&auto=format&fit=crop&q=80',
    ],
    tags: ['Porodo', 'Find My Tag', 'Smart Tracker', 'Key Finder', 'Bluetooth Tag'],
    variants: {
      colors: [
        { name: 'Matte White', hex: '#f8fafc' },
        { name: 'Graphite Black', hex: '#18181b' },
      ],
    },
    volumeDiscounts: [
      { quantity: 1, pricePerUnitQAR: 39, savingsText: 'Smart Tracker Deal' },
      { quantity: 2, pricePerUnitQAR: 34, savingsText: 'Save QAR 10' },
    ],
    specifications: {
      'Compatibility': 'Apple Find My App (iOS / iPadOS / macOS)',
      'Speaker Output': '85dB High-Pitch Buzzer',
      'Battery Type': 'Standard CR2032 Coin Battery (Over 1 Year Lifespan)',
      'Water Resistance': 'IP67 Water and Dust Resistant',
    },
    packageContents: [
      'Porodo Smart Finder Tag',
      'Pre-installed CR2032 Battery',
      'Silicone Keychain Lanyard',
    ],
    dropshipInfo: {
      dispatchHours: 24,
      shippingDaysMin: 6,
      shippingDaysMax: 8,
      freeShippingThresholdQAR: 150,
      shippingCostQAR: 15,
      airCarrier: 'Express Air Freight to Hamad Int’l (DOH)',
      qualityInspected: true,
      hubOrigin: 'Regional Tech Distribution Hub',
    },
  },
  {
    id: 'qat-022',
    slug: 'baseus-gravitational-air-vent-car-mount',
    title: 'Baseus Gravitational Air Vent Car Phone Mount Holder',
    shortDescription: 'One-hand auto clamping mechanical car mount with triangle locking stability and 360° ball joint.',
    fullDescription: 'Drop your phone in and gravity auto-clamps the side arms instantly. Designed with internal mechanical gear linkage that never rattles or drops your phone over Qatar speed bumps. Soft silicone cushions prevent scratches on air vent slats.',
    category: 'Car Tech & Mounts',
    categorySlug: 'car-accessories',
    subcategory: 'Car Mounts',
    brand: 'Baseus',
    priceQAR: 59,
    originalPriceQAR: 99,
    discountPercent: 40,
    rating: 4.80,
    reviewCount: 220,
    soldCount: 890,
    stockPercent: 73,
    inStock: true,
    isFlashDeal: false,
    isTrending: false,
    isBestSeller: false,
    isUnder99: true,
    isNewArrival: false,
    badge: 'AUTO LOCK',
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=800&auto=format&fit=crop&q=80',
    ],
    tags: ['Baseus', 'Gravity Mount', 'Car Air Vent Holder', 'Auto Clamp'],
    variants: {
      colors: [
        { name: 'Dark Slate Gray', hex: '#334155' },
        { name: 'Metallic Silver', hex: '#94a3b8' },
      ],
    },
    volumeDiscounts: [
      { quantity: 1, pricePerUnitQAR: 59, savingsText: 'Road Trip Deal' },
      { quantity: 2, pricePerUnitQAR: 49, savingsText: 'Save QAR 20' },
    ],
    specifications: {
      'Clamp Mechanism': 'Automatic Gravitational Gear Lock',
      'Phone Compatibility': '4.7 inches to 6.9 inches screen size',
      'Installation': 'Steel Core Extended Air Vent Hook Clip',
    },
    packageContents: [
      'Baseus Gravity Car Air Vent Mount',
      'Upgraded Anti-Shake Vent Hook Bracket',
    ],
    dropshipInfo: {
      dispatchHours: 24,
      shippingDaysMin: 6,
      shippingDaysMax: 8,
      freeShippingThresholdQAR: 150,
      shippingCostQAR: 15,
      airCarrier: 'Express Air Freight to Hamad Int’l (DOH)',
      qualityInspected: true,
      hubOrigin: 'Regional Tech Distribution Hub',
    },
  },
  {
    id: 'qat-023',
    slug: 'green-lion-20w-gan-super-mini-wall-charger',
    title: 'Green Lion 20W GaN Super Mini Type-C Wall Charger (UK 3-Pin)',
    shortDescription: 'Thumb-sized 20W PD fast wall charger designed for Qatar standard UK sockets with ActiveGuard.',
    fullDescription: 'Remarkably compact GaN wall charger tailored for Gulf power standards (220V–240V UK 3-Pin). Delivers fast 20W Power Delivery charging for iPhone 16/15, iPad, and AirPods. High efficiency gallium nitride keeps the adapter cool even during continuous charging.',
    category: 'GaN Chargers & Banks',
    categorySlug: 'chargers-powerbanks',
    subcategory: 'Wall Chargers',
    brand: 'Green Lion',
    priceQAR: 55,
    originalPriceQAR: 95,
    discountPercent: 42,
    rating: 4.87,
    reviewCount: 310,
    soldCount: 1220,
    stockPercent: 82,
    inStock: true,
    isFlashDeal: false,
    isTrending: false,
    isBestSeller: false,
    isUnder99: true,
    isNewArrival: true,
    badge: 'SUPER MINI',
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1770417999483-e5a313b33468?w=800&auto=format&fit=crop&q=80',
    ],
    tags: ['Green Lion', '20W GaN', 'UK 3-Pin', 'Fast Wall Charger', 'Qatar Standard'],
    variants: {
      colors: [
        { name: 'Pure White', hex: '#f8fafc' },
        { name: 'Charcoal Black', hex: '#18181b' },
      ],
    },
    volumeDiscounts: [
      { quantity: 1, pricePerUnitQAR: 55, savingsText: 'Mini Charger Deal' },
      { quantity: 2, pricePerUnitQAR: 48, savingsText: 'Save QAR 14' },
    ],
    specifications: {
      'Input': 'AC 100-240V, 50/60Hz, 0.6A Max',
      'Output': 'USB-C: 5V/3A, 9V/2.22A, 12V/1.67A (20W Max PD 3.0)',
      'Plug Standard': 'Qatar / UK Standard 3-Pin Fixed Plug (BS 1363)',
      'Dimensions': '32mm x 32mm x 48mm (Excluding pins)',
    },
    packageContents: [
      'Green Lion 20W GaN UK Fast Charger',
      'Safety Warranty Card',
    ],
    dropshipInfo: {
      dispatchHours: 24,
      shippingDaysMin: 6,
      shippingDaysMax: 8,
      freeShippingThresholdQAR: 150,
      shippingCostQAR: 15,
      airCarrier: 'Express Air Freight to Hamad Int’l (DOH)',
      qualityInspected: true,
      hubOrigin: 'Regional Tech Distribution Hub',
    },
  }
,
  {
    "id": "qat-024",
    "slug": "keychron-q1-pro-wireless-custom-mechanical-keyboard",
    "title": "Keychron Q1 Pro QMK/VIA Wireless Custom Mechanical Keyboard (Gateron Jupiter Red)",
    "shortDescription": "Full aluminum CNC body, double-gasket acoustic mount, hot-swappable PCB, and Bluetooth 5.1 multi-device pairing.",
    "fullDescription": "Crafted for productivity and elite gaming in Qatar. The Keychron Q1 Pro features an aircraft-grade 6063 CNC machined aluminum body, KSA profile double-shot PBT keycaps, and south-facing RGB backlighting.",
    "category": "Gaming & Desk Tech",
    "categorySlug": "gaming-gear",
    "subcategory": "Keyboards",
    "brand": "Keychron",
    "priceQAR": 689,
    "originalPriceQAR": 689,
    "discountPercent": 0,
    "rating": 4.94,
    "reviewCount": 182,
    "soldCount": 420,
    "stockPercent": 88,
    "inStock": true,
    "isFlashDeal": false,
    "isTrending": true,
    "isBestSeller": true,
    "isUnder99": false,
    "isNewArrival": true,
    "badge": "HOT DROP",
    "images": [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80"
    ],
    "tags": [
      "Keychron",
      "Mechanical Keyboard",
      "Custom Keyboard",
      "Wireless",
      "Hot-swap"
    ],
    "variants": {
      "colors": [
        {
          "name": "Carbon Black",
          "hex": "#18181b"
        },
        {
          "name": "Silver Gray",
          "hex": "#71717a"
        }
      ],
      "options": [
        {
          "name": "Switch Type",
          "values": [
            "Gateron Red (Linear)",
            "Gateron Brown (Tactile)"
          ]
        }
      ]
    },
    "volumeDiscounts": [
      {
        "quantity": 1,
        "pricePerUnitQAR": 689,
        "savingsText": "VIP Tech Piece"
      }
    ],
    "specifications": {
      "Body Material": "Full CNC Machined 6063 Aluminum",
      "Mounting Style": "Double Gasket Acoustic Mount",
      "Battery": "4000mAh Rechargeable Li-polymer (Up to 300 Hours)",
      "Connectivity": "Bluetooth 5.1 + Type-C Wired"
    },
    "packageContents": [
      "Keychron Q1 Pro Fully Assembled",
      "Type-C to Type-C Cable",
      "Type-A Adapter",
      "Switch & Keycap Puller"
    ],
    "dropshipInfo": {
      "dispatchHours": 24,
      "shippingDaysMin": 6,
      "shippingDaysMax": 8,
      "freeShippingThresholdQAR": 150,
      "shippingCostQAR": 0,
      "airCarrier": "Express Air Freight to Hamad Int’l (DOH)",
      "qualityInspected": true,
      "hubOrigin": "Regional Tech Distribution Hub"
    }
  },
  {
    "id": "qat-025",
    "slug": "sony-wh-1000xm5-wireless-noise-cancelling-headphones",
    "title": "Sony WH-1000XM5 Wireless Industry-Leading Noise Cancelling Over-Ear Headphones",
    "shortDescription": "Dual-processor Auto NC Optimizer, 8 beamforming microphones, 30-hour battery life, and ultra-comfortable soft fit leather.",
    "fullDescription": "The pinnacle of acoustic silence in Doha. Featuring two processors controlling eight microphones, the Sony WH-1000XM5 provides unparalleled noise cancellation for air travel, office focus, and everyday luxury audio.",
    "category": "TWS & Spatial Audio",
    "categorySlug": "tws-audio",
    "subcategory": "Headphones",
    "brand": "Sony",
    "priceQAR": 1199,
    "originalPriceQAR": 1199,
    "discountPercent": 0,
    "rating": 4.96,
    "reviewCount": 520,
    "soldCount": 940,
    "stockPercent": 92,
    "inStock": true,
    "isFlashDeal": false,
    "isTrending": true,
    "isBestSeller": true,
    "isUnder99": false,
    "isNewArrival": false,
    "badge": "FLAGSHIP",
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80"
    ],
    "tags": [
      "Sony",
      "WH-1000XM5",
      "ANC",
      "Wireless Headphones",
      "Hi-Res Audio"
    ],
    "variants": {
      "colors": [
        {
          "name": "Black",
          "hex": "#0a0a0c"
        },
        {
          "name": "Silver / Cream",
          "hex": "#e2e8f0"
        }
      ]
    },
    "volumeDiscounts": [
      {
        "quantity": 1,
        "pricePerUnitQAR": 1199,
        "savingsText": "Qatar Official"
      }
    ],
    "specifications": {
      "Noise Cancellation": "Industry Leading Auto NC Optimizer with V1 + QN1 Processors",
      "Battery Life": "30 Hours with ANC / 40 Hours without ANC",
      "Audio Drivers": "30mm Carbon Fiber Composite Dome"
    },
    "packageContents": [
      "Sony WH-1000XM5 Headphones",
      "Collapsible Carrying Case",
      "Audio Cable 1.2m",
      "USB-C Charging Cable"
    ],
    "dropshipInfo": {
      "dispatchHours": 24,
      "shippingDaysMin": 6,
      "shippingDaysMax": 8,
      "freeShippingThresholdQAR": 150,
      "shippingCostQAR": 0,
      "airCarrier": "Express Air Freight to Hamad Int’l (DOH)",
      "qualityInspected": true,
      "hubOrigin": "Regional Tech Distribution Hub"
    }
  },
  {
    "id": "qat-026",
    "slug": "anker-prime-20000mah-200w-power-bank",
    "title": "Anker Prime 20,000mAh Power Bank (200W Multi-Port Fast Output with Smart Digital Display)",
    "shortDescription": "Simultaneous 2x 100W USB-C output, smart LCD power status monitor, compact soda-can form factor.",
    "fullDescription": "Power two high-spec MacBook Pros simultaneously anywhere in Qatar. Compact enough to slip into a backpack, the Anker Prime 20K features intelligent ActiveShield 2.0 safety and a rich real-time digital display.",
    "category": "GaN Chargers & Banks",
    "categorySlug": "chargers-powerbanks",
    "subcategory": "Power Banks",
    "brand": "Anker",
    "priceQAR": 499,
    "originalPriceQAR": 499,
    "discountPercent": 0,
    "rating": 4.91,
    "reviewCount": 310,
    "soldCount": 880,
    "stockPercent": 85,
    "inStock": true,
    "isFlashDeal": false,
    "isTrending": true,
    "isBestSeller": true,
    "isUnder99": false,
    "isNewArrival": true,
    "badge": "BESTSELLER",
    "images": [
      "https://images.unsplash.com/photo-1609592426815-f5b2fa012017?w=800&auto=format&fit=crop&q=80"
    ],
    "tags": [
      "Anker",
      "Power Bank",
      "200W",
      "Laptop Charger",
      "Fast Charge"
    ],
    "variants": {
      "colors": [
        {
          "name": "Graphite Black",
          "hex": "#27272a"
        }
      ]
    },
    "volumeDiscounts": [
      {
        "quantity": 1,
        "pricePerUnitQAR": 499,
        "savingsText": "Base Price"
      }
    ],
    "specifications": {
      "Capacity": "20,000mAh / 72Wh Airline Approved",
      "Total Output": "200W Max Shared Output",
      "Screen": "Full Color TFT Smart Power Display"
    },
    "packageContents": [
      "Anker Prime 20,000mAh Power Bank",
      "0.6m 140W USB-C Cable",
      "Travel Pouch",
      "Welcome Guide"
    ],
    "dropshipInfo": {
      "dispatchHours": 24,
      "shippingDaysMin": 6,
      "shippingDaysMax": 8,
      "freeShippingThresholdQAR": 150,
      "shippingCostQAR": 0,
      "airCarrier": "Express Air Freight to Hamad Int’l (DOH)",
      "qualityInspected": true,
      "hubOrigin": "Regional Tech Distribution Hub"
    }
  },
  {
    "id": "qat-027",
    "slug": "benq-screenbar-halo-wireless-monitor-light",
    "title": "BenQ ScreenBar Halo Wireless Asymmetric Monitor Light Bar with Backlight Ambience",
    "shortDescription": "Patented asymmetric optical design, 3 ambient lighting modes, wireless rotary controller, and curved monitor bracket.",
    "fullDescription": "The ultimate monitor lighting bar in Qatar. Eliminates screen reflection with zero eye strain, featuring an integrated rear ambient backlight and a magnetic wireless control puck with touch controls.",
    "category": "Gaming & Desk Tech",
    "categorySlug": "gaming-gear",
    "subcategory": "Desk Lighting",
    "brand": "BenQ",
    "priceQAR": 549,
    "originalPriceQAR": 549,
    "discountPercent": 0,
    "rating": 4.93,
    "reviewCount": 220,
    "soldCount": 390,
    "stockPercent": 90,
    "inStock": true,
    "isFlashDeal": false,
    "isTrending": true,
    "isBestSeller": false,
    "isUnder99": false,
    "isNewArrival": false,
    "badge": "PREMIUM",
    "images": [
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop&q=80"
    ],
    "tags": [
      "BenQ",
      "ScreenBar",
      "Desk Setup",
      "Monitor Light",
      "RGB"
    ],
    "variants": {
      "colors": [
        {
          "name": "Space Gray Metallic",
          "hex": "#3f3f46"
        }
      ]
    },
    "volumeDiscounts": [
      {
        "quantity": 1,
        "pricePerUnitQAR": 549,
        "savingsText": "Regular Price"
      }
    ],
    "specifications": {
      "Optical Design": "Patented Asymmetric Optics with Dual Rear Ambient Light",
      "Color Temperature": "2700K to 6500K Stepless",
      "Control": "Wireless Smart Rotary Puck 2.4GHz"
    },
    "packageContents": [
      "BenQ ScreenBar Halo Light Bar",
      "Wireless Smart Controller",
      "Curved Monitor Adapter Accessory",
      "Batteries & Manual"
    ],
    "dropshipInfo": {
      "dispatchHours": 24,
      "shippingDaysMin": 6,
      "shippingDaysMax": 8,
      "freeShippingThresholdQAR": 150,
      "shippingCostQAR": 0,
      "airCarrier": "Express Air Freight to Hamad Int’l (DOH)",
      "qualityInspected": true,
      "hubOrigin": "Regional Tech Distribution Hub"
    }
  },
  {
    "id": "qat-028",
    "slug": "dji-mini-3-ultralight-foldable-4k-camera-drone",
    "title": "DJI Mini 3 Ultralight Foldable 4K HDR Camera Drone (Sub-249g with True Vertical Shooting)",
    "shortDescription": "Extended 38-min battery life, 4K HDR video, level-5 wind resistance, and rotating gimbal for portrait social media clips.",
    "fullDescription": "Weighing under 249 grams, no registration required in most jurisdictions. Captures vibrant 4K HDR footage along Doha Corniche and Katara beach with effortless true vertical shooting for TikTok and Instagram.",
    "category": "Drones & Vlogging",
    "categorySlug": "drones-cameras",
    "subcategory": "Drones",
    "brand": "DJI",
    "priceQAR": 1499,
    "originalPriceQAR": 1499,
    "discountPercent": 0,
    "rating": 4.97,
    "reviewCount": 380,
    "soldCount": 650,
    "stockPercent": 86,
    "inStock": true,
    "isFlashDeal": false,
    "isTrending": true,
    "isBestSeller": true,
    "isUnder99": false,
    "isNewArrival": false,
    "badge": "BESTSELLER",
    "images": [
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80"
    ],
    "tags": [
      "DJI",
      "Mini 3",
      "4K Drone",
      "Camera Drone",
      "Aerial"
    ],
    "variants": {
      "colors": [
        {
          "name": "Classic Gray",
          "hex": "#cbd5e1"
        }
      ]
    },
    "volumeDiscounts": [
      {
        "quantity": 1,
        "pricePerUnitQAR": 1499,
        "savingsText": "Official Tech"
      }
    ],
    "specifications": {
      "Takeoff Weight": "< 249 g Regulation-Friendly",
      "Max Flight Time": "38 Minutes per Battery",
      "Video Resolution": "4K HDR at 30fps with 4x Digital Zoom"
    },
    "packageContents": [
      "DJI Mini 3 Aircraft",
      "DJI RC-N1 Remote Controller",
      "Intelligent Flight Battery",
      "Spare Propellers (Pair)",
      "Gimbal Protector"
    ],
    "dropshipInfo": {
      "dispatchHours": 24,
      "shippingDaysMin": 6,
      "shippingDaysMax": 8,
      "freeShippingThresholdQAR": 150,
      "shippingCostQAR": 0,
      "airCarrier": "Express Air Freight to Hamad Int’l (DOH)",
      "qualityInspected": true,
      "hubOrigin": "Regional Tech Distribution Hub"
    }
  },
  {
    "id": "qat-029",
    "slug": "razer-deathadder-v3-pro-wireless-gaming-mouse",
    "title": "Razer DeathAdder V3 Pro Ultra-Lightweight Wireless Ergonomic Esports Gaming Mouse (63g)",
    "shortDescription": "Focus Pro 30K Optical Sensor, Gen-3 optical switches, 90-hour battery life, and hyperpolling wireless compatibility.",
    "fullDescription": "The icon of esports refinement. Refined by top pro gamers with zero dead weight at 63 grams, the Razer DeathAdder V3 Pro delivers flawless tracking over desk pads with seamless wireless speed.",
    "category": "Gaming & Desk Tech",
    "categorySlug": "gaming-gear",
    "subcategory": "Gaming Mice",
    "brand": "Razer",
    "priceQAR": 449,
    "originalPriceQAR": 449,
    "discountPercent": 0,
    "rating": 4.89,
    "reviewCount": 290,
    "soldCount": 710,
    "stockPercent": 89,
    "inStock": true,
    "isFlashDeal": false,
    "isTrending": true,
    "isBestSeller": true,
    "isUnder99": false,
    "isNewArrival": false,
    "badge": "ESPORTS",
    "images": [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80"
    ],
    "tags": [
      "Razer",
      "Gaming Mouse",
      "Wireless",
      "Esports",
      "DeathAdder"
    ],
    "variants": {
      "colors": [
        {
          "name": "Matte Black",
          "hex": "#0a0a0c"
        },
        {
          "name": "Mercury White",
          "hex": "#f8fafc"
        }
      ]
    },
    "volumeDiscounts": [
      {
        "quantity": 1,
        "pricePerUnitQAR": 449,
        "savingsText": "Pro Gaming"
      }
    ],
    "specifications": {
      "Sensor": "Focus Pro 30K Optical Sensor (30,000 DPI)",
      "Weight": "63 grams Ultra-Lightweight",
      "Switches": "Optical Mouse Switches Gen-3 (90M Clicks)"
    },
    "packageContents": [
      "Razer DeathAdder V3 Pro",
      "Wireless USB Dongle + Adapter",
      "Type-A to Type-C Speedflex Cable",
      "Razer Grip Tape"
    ],
    "dropshipInfo": {
      "dispatchHours": 24,
      "shippingDaysMin": 6,
      "shippingDaysMax": 8,
      "freeShippingThresholdQAR": 150,
      "shippingCostQAR": 0,
      "airCarrier": "Express Air Freight to Hamad Int’l (DOH)",
      "qualityInspected": true,
      "hubOrigin": "Regional Tech Distribution Hub"
    }
  },
  {
    "id": "qat-030",
    "slug": "caldigit-ts4-thunderbolt-4-18-port-dock-station",
    "title": "CalDigit TS4 Thunderbolt 4 18-Port Premium Desktop Docking Station (98W Laptop Charging)",
    "shortDescription": "18 ports of extreme connectivity, 2.5GbE Ethernet, 8K single or dual 6K display support, and SD/microSD 4.0 slots.",
    "fullDescription": "The undisputed king of Thunderbolt docks. Connect your entire workstation with one single cable to your MacBook Pro or Windows PC, delivering 98W fast charging and high-speed data transfer.",
    "category": "Laptop Hubs & Stands",
    "categorySlug": "laptop-gear",
    "subcategory": "Docking Stations",
    "brand": "CalDigit",
    "priceQAR": 1399,
    "originalPriceQAR": 1399,
    "discountPercent": 0,
    "rating": 4.97,
    "reviewCount": 140,
    "soldCount": 310,
    "stockPercent": 91,
    "inStock": true,
    "isFlashDeal": false,
    "isTrending": false,
    "isBestSeller": true,
    "isUnder99": false,
    "isNewArrival": false,
    "badge": "PRO WORKSTATION",
    "images": [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80"
    ],
    "tags": [
      "CalDigit",
      "Thunderbolt 4",
      "Docking Station",
      "MacBook Dock",
      "2.5GbE"
    ],
    "variants": {
      "colors": [
        {
          "name": "Space Gray Aluminum",
          "hex": "#4b5563"
        }
      ]
    },
    "volumeDiscounts": [
      {
        "quantity": 1,
        "pricePerUnitQAR": 1399,
        "savingsText": "Pro Dock"
      }
    ],
    "specifications": {
      "Ports": "18 Total Ports (3x TB4, 5x USB-A, 3x USB-C, 2.5GbE, DisplayPort 1.4)",
      "Power Delivery": "98W Continuous Host Charging",
      "Cooling": "Full Metal Extruded Heat Sink Architecture"
    },
    "packageContents": [
      "CalDigit TS4 Dock",
      "Thunderbolt 4 Cable (0.8m)",
      "230W Power Supply Unit (UK 3-Pin)",
      "Rubber Strips"
    ],
    "dropshipInfo": {
      "dispatchHours": 24,
      "shippingDaysMin": 6,
      "shippingDaysMax": 8,
      "freeShippingThresholdQAR": 150,
      "shippingCostQAR": 0,
      "airCarrier": "Express Air Freight to Hamad Int’l (DOH)",
      "qualityInspected": true,
      "hubOrigin": "Regional Tech Distribution Hub"
    }
  },
  {
    "id": "qat-031",
    "slug": "elgato-stream-deck-mk2-15-lcd-keys-controller",
    "title": "Elgato Stream Deck MK.2 15 Customizable LCD Macro Keys Studio Controller",
    "shortDescription": "Tactile LCD keys, multi-action macro automation, interchangeable faceplate, and plug-in store ecosystem.",
    "fullDescription": "Streamline your Qatar streaming, editing, and office workflow. One-touch operation triggers audio effects, OBS scene switching, smart home lighting, and complex keyboard macros effortlessly.",
    "category": "Gaming & Desk Tech",
    "categorySlug": "gaming-gear",
    "subcategory": "Studio Controllers",
    "brand": "Elgato",
    "priceQAR": 529,
    "originalPriceQAR": 529,
    "discountPercent": 0,
    "rating": 4.92,
    "reviewCount": 340,
    "soldCount": 890,
    "stockPercent": 88,
    "inStock": true,
    "isFlashDeal": false,
    "isTrending": true,
    "isBestSeller": true,
    "isUnder99": false,
    "isNewArrival": false,
    "badge": "CREATOR PICK",
    "images": [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80"
    ],
    "tags": [
      "Elgato",
      "Stream Deck",
      "Macro Controller",
      "Streaming Gear",
      "Content Creator"
    ],
    "variants": {
      "colors": [
        {
          "name": "Deep Black",
          "hex": "#09090b"
        },
        {
          "name": "White",
          "hex": "#f8fafc"
        }
      ]
    },
    "volumeDiscounts": [
      {
        "quantity": 1,
        "pricePerUnitQAR": 529,
        "savingsText": "Streamer Ready"
      }
    ],
    "specifications": {
      "Keys": "15 Customizable LCD Keys",
      "Interface": "USB 2.0 Detachable Cable (1.5m)",
      "Stand": "45-Degree Fixed Desktop Ergonomic Stand"
    },
    "packageContents": [
      "Stream Deck MK.2",
      "Desktop Stand",
      "USB-C to USB-A Cable",
      "Quick Start Guide"
    ],
    "dropshipInfo": {
      "dispatchHours": 24,
      "shippingDaysMin": 6,
      "shippingDaysMax": 8,
      "freeShippingThresholdQAR": 150,
      "shippingCostQAR": 0,
      "airCarrier": "Express Air Freight to Hamad Int’l (DOH)",
      "qualityInspected": true,
      "hubOrigin": "Regional Tech Distribution Hub"
    }
  },
  {
    "id": "qat-032",
    "slug": "bose-quietcomfort-ultra-wireless-spatial-earbuds",
    "title": "Bose QuietComfort Ultra Wireless Spatial Noise Cancelling In-Ear Earbuds",
    "shortDescription": "Breakthrough Bose Immersive Audio, world-class noise cancellation, and CustomTune personalized ear fit.",
    "fullDescription": "Experience groundbreaking spatial audio that places what you hear right in front of you. CustomTune technology automatically analyzes your unique ear canal acoustics to calibrate noise cancellation in real-time.",
    "category": "TWS & Spatial Audio",
    "categorySlug": "tws-audio",
    "subcategory": "Earbuds",
    "brand": "Bose",
    "priceQAR": 949,
    "originalPriceQAR": 949,
    "discountPercent": 0,
    "rating": 4.88,
    "reviewCount": 260,
    "soldCount": 570,
    "stockPercent": 84,
    "inStock": true,
    "isFlashDeal": false,
    "isTrending": true,
    "isBestSeller": true,
    "isUnder99": false,
    "isNewArrival": true,
    "badge": "NEW DROP",
    "images": [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80"
    ],
    "tags": [
      "Bose",
      "QuietComfort",
      "Ultra Earbuds",
      "Spatial Audio",
      "ANC"
    ],
    "variants": {
      "colors": [
        {
          "name": "Black",
          "hex": "#18181b"
        },
        {
          "name": "White Smoke",
          "hex": "#f1f5f9"
        }
      ]
    },
    "volumeDiscounts": [
      {
        "quantity": 1,
        "pricePerUnitQAR": 949,
        "savingsText": "Ultra Audio"
      }
    ],
    "specifications": {
      "Audio Mode": "Bose Immersive Spatial Audio + Quiet & Aware Modes",
      "Battery": "Up to 6 Hours (24 Hours with Case)",
      "Water Resistance": "IPX4 Sweat and Splash Proof"
    },
    "packageContents": [
      "Bose QC Ultra Earbuds",
      "Bose Fit Kit (3 pairs eartips + 3 pairs stability bands)",
      "Charging Case",
      "USB-C Cable"
    ],
    "dropshipInfo": {
      "dispatchHours": 24,
      "shippingDaysMin": 6,
      "shippingDaysMax": 8,
      "freeShippingThresholdQAR": 150,
      "shippingCostQAR": 0,
      "airCarrier": "Express Air Freight to Hamad Int’l (DOH)",
      "qualityInspected": true,
      "hubOrigin": "Regional Tech Distribution Hub"
    }
  },
  {
    "id": "qat-033",
    "slug": "shure-mv7-usb-xlr-dynamic-podcast-microphone",
    "title": "Shure MV7 Dual USB/XLR Dynamic Broadcast & Podcasting Microphone",
    "shortDescription": "Voice Isolation Technology, built-in 3.5mm headphone monitor, digital touch panel, and ShurePlus MOTIV app tuning.",
    "fullDescription": "Inspired by the legendary SM7B, the Shure MV7 features both USB and XLR outputs for podcasters, gamers, and vocalists. Auto Level Mode dynamically adjusts gain on the fly so your voice sounds studio-grade consistently.",
    "category": "Gaming & Desk Tech",
    "categorySlug": "gaming-gear",
    "subcategory": "Microphones",
    "brand": "Shure",
    "priceQAR": 849,
    "originalPriceQAR": 849,
    "discountPercent": 0,
    "rating": 4.95,
    "reviewCount": 310,
    "soldCount": 620,
    "stockPercent": 90,
    "inStock": true,
    "isFlashDeal": false,
    "isTrending": true,
    "isBestSeller": true,
    "isUnder99": false,
    "isNewArrival": false,
    "badge": "STUDIO GRADE",
    "images": [
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80"
    ],
    "tags": [
      "Shure",
      "MV7",
      "Podcast Mic",
      "USB Mic",
      "Studio Audio"
    ],
    "variants": {
      "colors": [
        {
          "name": "Matte Black",
          "hex": "#111827"
        },
        {
          "name": "Silver Gray",
          "hex": "#9ca3af"
        }
      ]
    },
    "volumeDiscounts": [
      {
        "quantity": 1,
        "pricePerUnitQAR": 849,
        "savingsText": "Podcast King"
      }
    ],
    "specifications": {
      "Capsule": "Dynamic (Cardioid Polar Pattern)",
      "Connectivity": "Micro-B to USB-C + XLR 3-Pin Balanced",
      "Headphone Monitoring": "Zero-Latency 3.5mm Output"
    },
    "packageContents": [
      "Shure MV7 Microphone with Integrated Swivel Mount",
      "Micro-B to USB-C Cable (3m)",
      "Micro-B to USB-A Cable (3m)"
    ],
    "dropshipInfo": {
      "dispatchHours": 24,
      "shippingDaysMin": 6,
      "shippingDaysMax": 8,
      "freeShippingThresholdQAR": 150,
      "shippingCostQAR": 0,
      "airCarrier": "Express Air Freight to Hamad Int’l (DOH)",
      "qualityInspected": true,
      "hubOrigin": "Regional Tech Distribution Hub"
    }
  },
  {
    "id": "qat-034",
    "slug": "belkin-boostcharge-pro-3-in-1-magsafe-wireless-stand",
    "title": "Belkin BoostCharge Pro 3-in-1 Fast Wireless Charger Stand with 15W Official MagSafe",
    "shortDescription": "Official Made for Apple MagSafe 15W fast charging for iPhone 16/15, Apple Watch Series 10 fast charging, and AirPods tray.",
    "fullDescription": "The cleanest nightstand and desk charging setup in Qatar. Premium stainless steel branches suspend your iPhone and Apple Watch securely with authentic 15W MagSafe magnetic alignment.",
    "category": "GaN Chargers & Banks",
    "categorySlug": "chargers-powerbanks",
    "subcategory": "Wireless Chargers",
    "brand": "Belkin",
    "priceQAR": 429,
    "originalPriceQAR": 429,
    "discountPercent": 0,
    "rating": 4.91,
    "reviewCount": 420,
    "soldCount": 1100,
    "stockPercent": 85,
    "inStock": true,
    "isFlashDeal": false,
    "isTrending": true,
    "isBestSeller": true,
    "isUnder99": false,
    "isNewArrival": false,
    "badge": "APPLE CERTIFIED",
    "images": [
      "https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=800&auto=format&fit=crop&q=80"
    ],
    "tags": [
      "Belkin",
      "MagSafe",
      "3-in-1 Charger",
      "Apple Watch",
      "iPhone Stand"
    ],
    "variants": {
      "colors": [
        {
          "name": "White Ceramic",
          "hex": "#ffffff"
        },
        {
          "name": "Matte Black",
          "hex": "#18181b"
        }
      ]
    },
    "volumeDiscounts": [
      {
        "quantity": 1,
        "pricePerUnitQAR": 429,
        "savingsText": "Certified MagSafe"
      }
    ],
    "specifications": {
      "Charging Speeds": "15W MagSafe iPhone, Fast Apple Watch, 5W Qi AirPods",
      "Materials": "Stainless Steel Arms with Soft-Touch Base",
      "Power Adapter": "Official 40W AC Adapter (UK 3-Pin included)"
    },
    "packageContents": [
      "Belkin 3-in-1 Wireless Charger Stand",
      "AC Power Adapter (UK 3-Pin)",
      "Documentation"
    ],
    "dropshipInfo": {
      "dispatchHours": 24,
      "shippingDaysMin": 6,
      "shippingDaysMax": 8,
      "freeShippingThresholdQAR": 150,
      "shippingCostQAR": 0,
      "airCarrier": "Express Air Freight to Hamad Int’l (DOH)",
      "qualityInspected": true,
      "hubOrigin": "Regional Tech Distribution Hub"
    }
  },
  {
    "id": "qat-035",
    "slug": "asus-rog-strix-scope-ii-96-wireless-gaming-keyboard",
    "title": "ASUS ROG Strix Scope II 96 Wireless Gaming Keyboard with ROG NX Snow Mechanical Switches",
    "shortDescription": "96% compact layout, tri-mode connectivity (2.4G SpeedNova, Bluetooth, wired), sound-dampening foam, and multi-wheel.",
    "fullDescription": "Retains all function and number keys while freeing up desktop space. Pre-lubed ROG NX Snow linear switches offer creamy acoustics, paired with silicone dampening foam and hot-swappable switch sockets.",
    "category": "Gaming & Desk Tech",
    "categorySlug": "gaming-gear",
    "subcategory": "Keyboards",
    "brand": "ASUS ROG",
    "priceQAR": 629,
    "originalPriceQAR": 629,
    "discountPercent": 0,
    "rating": 4.93,
    "reviewCount": 160,
    "soldCount": 390,
    "stockPercent": 87,
    "inStock": true,
    "isFlashDeal": false,
    "isTrending": true,
    "isBestSeller": false,
    "isUnder99": false,
    "isNewArrival": true,
    "badge": "ROG GAMING",
    "images": [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=80"
    ],
    "tags": [
      "ASUS ROG",
      "Gaming Keyboard",
      "Wireless Keyboard",
      "NX Snow",
      "96% Layout"
    ],
    "variants": {
      "colors": [
        {
          "name": "Obsidian Black",
          "hex": "#0f172a"
        }
      ]
    },
    "volumeDiscounts": [
      {
        "quantity": 1,
        "pricePerUnitQAR": 629,
        "savingsText": "Pro Gaming"
      }
    ],
    "specifications": {
      "Layout": "96% Compact (Retains Full NumPad)",
      "Switches": "ROG NX Snow Pre-Lubed Linear Switches (Hot-Swappable)",
      "Battery Life": "Up to 1500 Hours without RGB"
    },
    "packageContents": [
      "ROG Strix Scope II 96 Keyboard",
      "Detachable Magnetic Wrist Rest",
      "2-in-1 Switch & Keycap Puller",
      "Type-C Braided Cable"
    ],
    "dropshipInfo": {
      "dispatchHours": 24,
      "shippingDaysMin": 6,
      "shippingDaysMax": 8,
      "freeShippingThresholdQAR": 150,
      "shippingCostQAR": 0,
      "airCarrier": "Express Air Freight to Hamad Int’l (DOH)",
      "qualityInspected": true,
      "hubOrigin": "Regional Tech Distribution Hub"
    }
  },
  {
    "id": "qat-036",
    "slug": "insta360-link-4k-ai-gimbal-webcam",
    "title": "Insta360 Link 4K AI Gimbal Webcam with Gesture Control & 1/2\" Sensor",
    "shortDescription": "AI auto-tracking 3-axis motorized gimbal, true 4K resolution, HDR mode, DeskView top-down angle, and privacy mode.",
    "fullDescription": "The most intelligent 4K webcam ever built. The motorized 3-axis gimbal keeps you perfectly centered as you move around your office in Doha, responding seamlessly to hand gesture commands.",
    "category": "Gaming & Desk Tech",
    "categorySlug": "gaming-gear",
    "subcategory": "Webcams",
    "brand": "Insta360",
    "priceQAR": 1099,
    "originalPriceQAR": 1099,
    "discountPercent": 0,
    "rating": 4.95,
    "reviewCount": 190,
    "soldCount": 480,
    "stockPercent": 91,
    "inStock": true,
    "isFlashDeal": false,
    "isTrending": true,
    "isBestSeller": true,
    "isUnder99": false,
    "isNewArrival": false,
    "badge": "AI POWERED",
    "images": [
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&auto=format&fit=crop&q=80"
    ],
    "tags": [
      "Insta360",
      "Webcam",
      "4K Camera",
      "AI Gimbal",
      "Streaming"
    ],
    "variants": {
      "colors": [
        {
          "name": "Gunmetal Gray",
          "hex": "#334155"
        }
      ]
    },
    "volumeDiscounts": [
      {
        "quantity": 1,
        "pricePerUnitQAR": 1099,
        "savingsText": "AI Creator"
      }
    ],
    "specifications": {
      "Resolution": "4K Ultra HD at 30fps / 1080p at 60fps",
      "Sensor Size": "Large 1/2\" CMOS Sensor (Outstanding Low-Light)",
      "Gimbal": "3-Axis Motorized Gimbal with AI Subject Tracking"
    },
    "packageContents": [
      "Insta360 Link 4K Webcam",
      "USB-C Cable with USB-A Adapter",
      "Recognition Markers",
      "Clip Mount"
    ],
    "dropshipInfo": {
      "dispatchHours": 24,
      "shippingDaysMin": 6,
      "shippingDaysMax": 8,
      "freeShippingThresholdQAR": 150,
      "shippingCostQAR": 0,
      "airCarrier": "Express Air Freight to Hamad Int’l (DOH)",
      "qualityInspected": true,
      "hubOrigin": "Regional Tech Distribution Hub"
    }
  },
  {
    "id": "qat-037",
    "slug": "nanoleaf-lines-smarter-modular-rgb-wall-bars",
    "title": "Nanoleaf Lines Smarter Kit (9-Pack) Modular Backlit RGBIC LED Smart Wall Light Bars",
    "shortDescription": "Modular geometric backlighting, dynamic color animations, music visualizer sync, and Apple HomeKit/Matter support.",
    "fullDescription": "Transform your gaming room or home office wall into a futuristic ambient masterpiece. Connect lightweight dual-color modular light bars into infinite geometric patterns with ultra-vibrant backlit diffusion.",
    "category": "Smart Home & Ambience",
    "categorySlug": "smart-home",
    "subcategory": "Smart Lighting",
    "brand": "Nanoleaf",
    "priceQAR": 699,
    "originalPriceQAR": 699,
    "discountPercent": 0,
    "rating": 4.89,
    "reviewCount": 240,
    "soldCount": 520,
    "stockPercent": 88,
    "inStock": true,
    "isFlashDeal": false,
    "isTrending": true,
    "isBestSeller": false,
    "isUnder99": false,
    "isNewArrival": false,
    "badge": "AMBIENT TECH",
    "images": [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80"
    ],
    "tags": [
      "Nanoleaf",
      "RGB Lighting",
      "Smart Home",
      "Gaming Room",
      "Lines"
    ],
    "variants": {
      "colors": [
        {
          "name": "Matte White Lines",
          "hex": "#f8fafc"
        },
        {
          "name": "Black Skins Included",
          "hex": "#1e293b"
        }
      ]
    },
    "volumeDiscounts": [
      {
        "quantity": 1,
        "pricePerUnitQAR": 699,
        "savingsText": "Kit Price"
      }
    ],
    "specifications": {
      "Components": "9 Light Lines, 9 Mounting Connectors & Caps",
      "Color Palette": "16M+ Colors with Dynamic Rhythm Music Sync",
      "Smart Compatibility": "Matter, Apple Home, Google Home, Alexa, Razer Chroma"
    },
    "packageContents": [
      "9x Light Lines",
      "9x Mounting Connectors",
      "Controller Cap",
      "100-240V Power Supply Unit (UK 3-Pin)",
      "Mounting Tape"
    ],
    "dropshipInfo": {
      "dispatchHours": 24,
      "shippingDaysMin": 6,
      "shippingDaysMax": 8,
      "freeShippingThresholdQAR": 150,
      "shippingCostQAR": 0,
      "airCarrier": "Express Air Freight to Hamad Int’l (DOH)",
      "qualityInspected": true,
      "hubOrigin": "Regional Tech Distribution Hub"
    }
  },
  {
    "id": "qat-038",
    "slug": "steelseries-arctis-nova-pro-wireless-gaming-headset",
    "title": "SteelSeries Arctis Nova Pro Wireless Multi-System Gaming Headset with Active Noise Cancellation",
    "shortDescription": "Infinity Power System hot-swap dual batteries, multi-system OLED wireless base station, and 360 Spatial Audio.",
    "fullDescription": "Never take a break to charge. The Infinity Power System includes two batteries—one charges in the OLED base station while the other powers your headset. Switch between PC and PS5 with a single touch.",
    "category": "Gaming & Desk Tech",
    "categorySlug": "gaming-gear",
    "subcategory": "Gaming Headsets",
    "brand": "SteelSeries",
    "priceQAR": 1299,
    "originalPriceQAR": 1299,
    "discountPercent": 0,
    "rating": 4.96,
    "reviewCount": 310,
    "soldCount": 780,
    "stockPercent": 90,
    "inStock": true,
    "isFlashDeal": false,
    "isTrending": true,
    "isBestSeller": true,
    "isUnder99": false,
    "isNewArrival": false,
    "badge": "ESPORTS CROWN",
    "images": [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80"
    ],
    "tags": [
      "SteelSeries",
      "Arctis Nova Pro",
      "Wireless Headset",
      "ANC",
      "Gaming Audio"
    ],
    "variants": {
      "colors": [
        {
          "name": "Stellar Black",
          "hex": "#1e1e24"
        },
        {
          "name": "Glacier White",
          "hex": "#f8fafc"
        }
      ]
    },
    "volumeDiscounts": [
      {
        "quantity": 1,
        "pricePerUnitQAR": 1299,
        "savingsText": "Pro Audio"
      }
    ],
    "specifications": {
      "Base Station": "Wireless Base Station with OLED Display and Audio DAC",
      "Battery System": "Dual Hot-Swappable Battery Packs (Infinite Playtime)",
      "Audio Drivers": "Premium High-Fidelity Drivers with 360 Spatial Audio"
    },
    "packageContents": [
      "Arctis Nova Pro Wireless Headset",
      "Wireless Base Station",
      "2x Lithium-ion Batteries",
      "2x USB-C to USB-A Cables",
      "Microphone Pop Filter"
    ],
    "dropshipInfo": {
      "dispatchHours": 24,
      "shippingDaysMin": 6,
      "shippingDaysMax": 8,
      "freeShippingThresholdQAR": 150,
      "shippingCostQAR": 0,
      "airCarrier": "Express Air Freight to Hamad Int’l (DOH)",
      "qualityInspected": true,
      "hubOrigin": "Regional Tech Distribution Hub"
    }
  },
  {
    "id": "qat-039",
    "slug": "ugreen-nexode-300w-5-port-gan-desktop-fast-charger",
    "title": "Ugreen Nexode 300W 5-Port GaN Desktop Fast Charger with 140W Single Port PD 3.1 Output",
    "shortDescription": "Powers 3 laptops simultaneously, GaNFast III technology, thermal guard monitoring, and UK 3-pin desktop cord.",
    "fullDescription": "The ultimate desktop power station for heavy tech users in Qatar. Outputs an astonishing 140W on a single port for the 16\" MacBook Pro, while simultaneously fast-charging two additional laptops and two smartphones.",
    "category": "GaN Chargers & Banks",
    "categorySlug": "chargers-powerbanks",
    "subcategory": "Desktop Chargers",
    "brand": "Ugreen",
    "priceQAR": 649,
    "originalPriceQAR": 649,
    "discountPercent": 0,
    "rating": 4.92,
    "reviewCount": 175,
    "soldCount": 420,
    "stockPercent": 88,
    "inStock": true,
    "isFlashDeal": false,
    "isTrending": true,
    "isBestSeller": false,
    "isUnder99": false,
    "isNewArrival": true,
    "badge": "300W MONSTER",
    "images": [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80"
    ],
    "tags": [
      "Ugreen",
      "300W Charger",
      "GaNFast",
      "140W PD",
      "Desktop Charger"
    ],
    "variants": {
      "colors": [
        {
          "name": "Deep Space Gray",
          "hex": "#374151"
        }
      ]
    },
    "volumeDiscounts": [
      {
        "quantity": 1,
        "pricePerUnitQAR": 649,
        "savingsText": "Mega Output"
      }
    ],
    "specifications": {
      "Total Output": "300W Max Continuous Output",
      "Port Array": "4x USB-C (Port 1 up to 140W PD 3.1), 1x USB-A (22.5W)",
      "Safety": "Thermal Guard Dual-Core Sensor Monitoring 6,000 times/min"
    },
    "packageContents": [
      "Ugreen Nexode 300W Charger",
      "AC Power Cord 2m (UK 3-Pin)",
      "240W USB-C to USB-C Fast Cable (1.5m)",
      "Manual"
    ],
    "dropshipInfo": {
      "dispatchHours": 24,
      "shippingDaysMin": 6,
      "shippingDaysMax": 8,
      "freeShippingThresholdQAR": 150,
      "shippingCostQAR": 0,
      "airCarrier": "Express Air Freight to Hamad Int’l (DOH)",
      "qualityInspected": true,
      "hubOrigin": "Regional Tech Distribution Hub"
    }
  },
  {
    "id": "qat-040",
    "slug": "garmin-forerunner-265-gps-amoled-running-smartwatch",
    "title": "Garmin Forerunner 265 GPS AMOLED Running & Triathlon Smartwatch with Training Readiness",
    "shortDescription": "Brilliant 1.3\" AMOLED touchscreen, multi-band GNSS satIQ GPS, morning report, HRV status, and 13-day battery.",
    "fullDescription": "Train smarter under Qatar conditions. Features a vibrant AMOLED display readable in direct Arabian sun, providing advanced running dynamics, wrist-based running power, and accurate multi-band satellite GPS.",
    "category": "Smartwatches & Fit",
    "categorySlug": "smartwatches",
    "subcategory": "Sports Watches",
    "brand": "Garmin",
    "priceQAR": 1449,
    "originalPriceQAR": 1449,
    "discountPercent": 0,
    "rating": 4.97,
    "reviewCount": 220,
    "soldCount": 510,
    "stockPercent": 86,
    "inStock": true,
    "isFlashDeal": false,
    "isTrending": true,
    "isBestSeller": true,
    "isUnder99": false,
    "isNewArrival": false,
    "badge": "ATHLETE CHOICE",
    "images": [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80"
    ],
    "tags": [
      "Garmin",
      "Forerunner 265",
      "Running Watch",
      "AMOLED",
      "GPS Smartwatch"
    ],
    "variants": {
      "colors": [
        {
          "name": "Black with Amp Yellow Strap",
          "hex": "#18181b"
        },
        {
          "name": "Whitestone with Tidal Blue",
          "hex": "#e0f2fe"
        }
      ]
    },
    "volumeDiscounts": [
      {
        "quantity": 1,
        "pricePerUnitQAR": 1449,
        "savingsText": "Pro Athlete"
      }
    ],
    "specifications": {
      "Screen": "1.3\" Vivid AMOLED Display (Corning Gorilla Glass 3)",
      "Battery Life": "Up to 13 Days in Smartwatch Mode / 20 Hours in GPS Mode",
      "Water Rating": "5 ATM (Swim and Shower Proof)"
    },
    "packageContents": [
      "Garmin Forerunner 265 Watch",
      "USB-C Charging/Data Cable",
      "Quick Start Documentation"
    ],
    "dropshipInfo": {
      "dispatchHours": 24,
      "shippingDaysMin": 6,
      "shippingDaysMax": 8,
      "freeShippingThresholdQAR": 150,
      "shippingCostQAR": 0,
      "airCarrier": "Express Air Freight to Hamad Int’l (DOH)",
      "qualityInspected": true,
      "hubOrigin": "Regional Tech Distribution Hub"
    }
  },
  {
    "id": "qat-041",
    "slug": "logitech-mx-master-3s-wireless-performance-mouse",
    "title": "Logitech MX Master 3S Wireless Performance Mouse with Quiet Clicks & 8K DPI Any-Surface Tracking",
    "shortDescription": "MagSpeed electromagnetic scroll wheel, 8,000 DPI sensor on glass, ergonomic thumb rest, and Easy-Switch multi-computer flow.",
    "fullDescription": "The gold standard for office and creative productivity. Quiet clicks reduce noise by 90% while the MagSpeed scroll wheel zips through 1,000 lines of code or spreadsheets in one single second.",
    "category": "Gaming & Desk Tech",
    "categorySlug": "gaming-gear",
    "subcategory": "Mice",
    "brand": "Logitech",
    "priceQAR": 349,
    "originalPriceQAR": 349,
    "discountPercent": 0,
    "rating": 4.96,
    "reviewCount": 680,
    "soldCount": 1850,
    "stockPercent": 94,
    "inStock": true,
    "isFlashDeal": false,
    "isTrending": true,
    "isBestSeller": true,
    "isUnder99": false,
    "isNewArrival": false,
    "badge": "LEGENDARY",
    "images": [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80"
    ],
    "tags": [
      "Logitech",
      "MX Master 3S",
      "Ergonomic Mouse",
      "Quiet Clicks",
      "Productivity"
    ],
    "variants": {
      "colors": [
        {
          "name": "Graphite",
          "hex": "#262626"
        },
        {
          "name": "Pale Gray",
          "hex": "#e5e7eb"
        }
      ]
    },
    "volumeDiscounts": [
      {
        "quantity": 1,
        "pricePerUnitQAR": 349,
        "savingsText": "Office Pro"
      }
    ],
    "specifications": {
      "Sensor": "Darkfield High Precision (200 - 8000 DPI tracks on glass)",
      "Scroll Wheel": "MagSpeed Smart Electromagnetic Auto-Shift",
      "Battery": "500mAh Li-Po (Up to 70 days per full charge)"
    },
    "packageContents": [
      "MX Master 3S Mouse",
      "Logi Bolt USB Receiver",
      "USB-C Charging Cable",
      "User Documentation"
    ],
    "dropshipInfo": {
      "dispatchHours": 24,
      "shippingDaysMin": 6,
      "shippingDaysMax": 8,
      "freeShippingThresholdQAR": 150,
      "shippingCostQAR": 0,
      "airCarrier": "Express Air Freight to Hamad Int’l (DOH)",
      "qualityInspected": true,
      "hubOrigin": "Regional Tech Distribution Hub"
    }
  },
  {
    "id": "qat-042",
    "slug": "rode-wireless-pro-dual-channel-compact-mic-system",
    "title": "Rode Wireless PRO Dual-Channel Compact Wireless Microphone System with 32-Bit Float On-Board Recording",
    "shortDescription": "Never clip audio again with 32-bit float, universal camera & smartphone compatibility, 260m line-of-sight range, smart charge case.",
    "fullDescription": "The ultimate wireless audio revolution for creators in Qatar. Includes two transmitters with lavalier microphones and a receiver. 32-bit float on-board recording ensures pure audio recovery even if the speaker screams.",
    "category": "Drones & Vlogging",
    "categorySlug": "drones-cameras",
    "subcategory": "Wireless Microphones",
    "brand": "Rode",
    "priceQAR": 1299,
    "originalPriceQAR": 1299,
    "discountPercent": 0,
    "rating": 4.95,
    "reviewCount": 165,
    "soldCount": 410,
    "stockPercent": 87,
    "inStock": true,
    "isFlashDeal": false,
    "isTrending": true,
    "isBestSeller": true,
    "isUnder99": false,
    "isNewArrival": true,
    "badge": "32-BIT FLOAT",
    "images": [
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80"
    ],
    "tags": [
      "Rode",
      "Wireless PRO",
      "Lavalier Mic",
      "32-Bit Float",
      "Vlogging"
    ],
    "variants": {
      "colors": [
        {
          "name": "Matte Black",
          "hex": "#18181b"
        }
      ]
    },
    "volumeDiscounts": [
      {
        "quantity": 1,
        "pricePerUnitQAR": 1299,
        "savingsText": "Pro Audio"
      }
    ],
    "specifications": {
      "Transmission": "Series IV 2.4GHz Digital Transmission with 128-bit encryption",
      "Range": "Up to 260m Line of Sight",
      "On-Board Memory": "32GB Internal Storage per Transmitter (>40 hours recording)"
    },
    "packageContents": [
      "2x Transmitters",
      "1x Dual Receiver",
      "Smart Charge Case",
      "2x Lavalier II Microphones",
      "Complete Cable Kit"
    ],
    "dropshipInfo": {
      "dispatchHours": 24,
      "shippingDaysMin": 6,
      "shippingDaysMax": 8,
      "freeShippingThresholdQAR": 150,
      "shippingCostQAR": 0,
      "airCarrier": "Express Air Freight to Hamad Int’l (DOH)",
      "qualityInspected": true,
      "hubOrigin": "Regional Tech Distribution Hub"
    }
  },
  {
    "id": "qat-043",
    "slug": "xiaomi-smart-laser-projector-2-pro-1080p",
    "title": "Xiaomi Smart Laser Projector 2 Pro 1080P FHD (1300 ANSI Lumens with Android TV & Auto Focus)",
    "shortDescription": "1300 ANSI Lumens, 60\" to 120\" cinematic display, omnidirectional auto-keystone correction, and dual 10W Dolby audio.",
    "fullDescription": "Bring true cinema home to your living room in Qatar. The 4-channel LED light source delivers 1300 ANSI Lumens bright enough for daytime viewing, complete with built-in Netflix and Google Assistant.",
    "category": "Smart Home & Ambience",
    "categorySlug": "smart-home",
    "subcategory": "Projectors",
    "brand": "Xiaomi",
    "priceQAR": 1499,
    "originalPriceQAR": 1499,
    "discountPercent": 0,
    "rating": 4.88,
    "reviewCount": 130,
    "soldCount": 290,
    "stockPercent": 84,
    "inStock": true,
    "isFlashDeal": false,
    "isTrending": false,
    "isBestSeller": true,
    "isUnder99": false,
    "isNewArrival": false,
    "badge": "HOME CINEMA",
    "images": [
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80"
    ],
    "tags": [
      "Xiaomi",
      "Smart Projector",
      "Laser Projector",
      "1080P FHD",
      "Android TV"
    ],
    "variants": {
      "colors": [
        {
          "name": "White Fabric Blend",
          "hex": "#f8fafc"
        }
      ]
    },
    "volumeDiscounts": [
      {
        "quantity": 1,
        "pricePerUnitQAR": 1499,
        "savingsText": "Cinema Pro"
      }
    ],
    "specifications": {
      "Brightness": "1300 ANSI Lumens High-Luminance",
      "Resolution": "1920x1080 Full HD Native with 4K Decoding Support",
      "Speakers": "Dual 10W Full-Frequency Speakers with Dolby Audio & DTS-HD"
    },
    "packageContents": [
      "Xiaomi Projector 2 Pro",
      "Bluetooth Remote Control",
      "UK 3-Pin Power Cord",
      "Lens Cleaning Cloth",
      "Manual"
    ],
    "dropshipInfo": {
      "dispatchHours": 24,
      "shippingDaysMin": 6,
      "shippingDaysMax": 8,
      "freeShippingThresholdQAR": 150,
      "shippingCostQAR": 0,
      "airCarrier": "Express Air Freight to Hamad Int’l (DOH)",
      "qualityInspected": true,
      "hubOrigin": "Regional Tech Distribution Hub"
    }
  },
  {
    "id": "qat-044",
    "slug": "baseus-blade-hd-100w-ultra-slim-laptop-power-bank",
    "title": "Baseus Blade HD 100W Ultra-Slim Laptop Power Bank (20,000mAh with Digital Battery Status)",
    "shortDescription": "Razor-thin 18mm profile fits seamlessly into briefcase pockets, 100W Power Delivery output, dual USB-C + dual USB-A.",
    "fullDescription": "Designed specifically for traveling executives and digital nomads in Doha. At just 18mm thin, it charges your MacBook Pro at full 100W speed while lying flat beneath your laptop or inside your slim sleeve.",
    "category": "GaN Chargers & Banks",
    "categorySlug": "chargers-powerbanks",
    "subcategory": "Power Banks",
    "brand": "Baseus",
    "priceQAR": 289,
    "originalPriceQAR": 289,
    "discountPercent": 0,
    "rating": 4.89,
    "reviewCount": 280,
    "soldCount": 680,
    "stockPercent": 88,
    "inStock": true,
    "isFlashDeal": false,
    "isTrending": true,
    "isBestSeller": true,
    "isUnder99": false,
    "isNewArrival": false,
    "badge": "ULTRA SLIM",
    "images": [
      "https://images.unsplash.com/photo-1609592426815-f5b2fa012017?w=800&auto=format&fit=crop&q=80"
    ],
    "tags": [
      "Baseus",
      "Blade HD",
      "100W Power Bank",
      "Slim Power Bank",
      "Laptop Charger"
    ],
    "variants": {
      "colors": [
        {
          "name": "Space Black",
          "hex": "#18181b"
        }
      ]
    },
    "volumeDiscounts": [
      {
        "quantity": 1,
        "pricePerUnitQAR": 289,
        "savingsText": "Base Price"
      }
    ],
    "specifications": {
      "Thickness": "18mm Ultra-Slim Profile",
      "Capacity": "20,000mAh / 74Wh Airline Certified",
      "Max Output": "100W Max USB-C Fast Charging"
    },
    "packageContents": [
      "Baseus Blade HD 100W Power Bank",
      "100W USB-C to USB-C Cable (50cm)",
      "Storage Pouch",
      "User Manual"
    ],
    "dropshipInfo": {
      "dispatchHours": 24,
      "shippingDaysMin": 6,
      "shippingDaysMax": 8,
      "freeShippingThresholdQAR": 150,
      "shippingCostQAR": 0,
      "airCarrier": "Express Air Freight to Hamad Int’l (DOH)",
      "qualityInspected": true,
      "hubOrigin": "Regional Tech Distribution Hub"
    }
  },
  {
    "id": "qat-045",
    "slug": "kanto-yu2-desktop-reference-bookshelf-audio-speakers",
    "title": "Kanto YU2 Powered Desktop Reference Bookshelf Audio Speakers (Built-in USB DAC & Sub Out)",
    "shortDescription": "100W peak power, 3\" Kevlar drivers, 3/4\" silk dome tweeters, internal digital USB soundcard, and sub output.",
    "fullDescription": "Audiophile acoustics tailored for modern desk spaces. The Kanto YU2 connects directly to your Mac or PC via USB, bypassing noisy onboard computer audio cards for crystalline highs and warm acoustic mids.",
    "category": "TWS & Spatial Audio",
    "categorySlug": "tws-audio",
    "subcategory": "Speakers",
    "brand": "Kanto",
    "priceQAR": 799,
    "originalPriceQAR": 799,
    "discountPercent": 0,
    "rating": 4.93,
    "reviewCount": 145,
    "soldCount": 310,
    "stockPercent": 91,
    "inStock": true,
    "isFlashDeal": false,
    "isTrending": false,
    "isBestSeller": true,
    "isUnder99": false,
    "isNewArrival": false,
    "badge": "AUDIOPHILE",
    "images": [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80"
    ],
    "tags": [
      "Kanto",
      "Desktop Speakers",
      "Bookshelf Speakers",
      "USB DAC",
      "Hi-Fi Audio"
    ],
    "variants": {
      "colors": [
        {
          "name": "Matte Black",
          "hex": "#18181b"
        },
        {
          "name": "Matte White",
          "hex": "#f8fafc"
        },
        {
          "name": "Walnut Wood",
          "hex": "#78350f"
        }
      ]
    },
    "volumeDiscounts": [
      {
        "quantity": 1,
        "pricePerUnitQAR": 799,
        "savingsText": "Studio Pair"
      }
    ],
    "specifications": {
      "Amplifier": "Class D Amplifier with 100W Peak Power (50W RMS)",
      "Drivers": "3\" Kevlar Woofers and 3/4\" Silk Dome Tweeters",
      "Inputs": "USB DAC Input (16-bit/48kHz), 3.5mm AUX, Subwoofer Output"
    },
    "packageContents": [
      "Pair of Kanto YU2 Speakers",
      "Power Supply (UK 3-Pin)",
      "USB DAC Cable",
      "3.5mm AUX Cable",
      "Speaker Wire"
    ],
    "dropshipInfo": {
      "dispatchHours": 24,
      "shippingDaysMin": 6,
      "shippingDaysMax": 8,
      "freeShippingThresholdQAR": 150,
      "shippingCostQAR": 0,
      "airCarrier": "Express Air Freight to Hamad Int’l (DOH)",
      "qualityInspected": true,
      "hubOrigin": "Regional Tech Distribution Hub"
    }
  },
  {
    "id": "qat-046",
    "slug": "epomaker-rt100-retro-97-key-gasket-mechanical-keyboard",
    "title": "EPOMAKER RT100 Retro 97-Key Gasket Mechanical Keyboard with Smart Mini TV Screen & Volume Knob",
    "shortDescription": "Detachable customizable mini LCD screen, gasket-mounted structure, south-facing RGB, Sea Salt Silent Switches.",
    "fullDescription": "The sensation of desk aesthetics. The EPOMAKER RT100 includes a nostalgic mini TV screen that displays real-time weather, clock, CPU temperature, or custom animated GIFs alongside a tactile multi-function knob.",
    "category": "Gaming & Desk Tech",
    "categorySlug": "gaming-gear",
    "subcategory": "Keyboards",
    "brand": "EPOMAKER",
    "priceQAR": 379,
    "originalPriceQAR": 379,
    "discountPercent": 0,
    "rating": 4.88,
    "reviewCount": 210,
    "soldCount": 590,
    "stockPercent": 87,
    "inStock": true,
    "isFlashDeal": false,
    "isTrending": true,
    "isBestSeller": true,
    "isUnder99": false,
    "isNewArrival": false,
    "badge": "VIRAL TECH",
    "images": [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80"
    ],
    "tags": [
      "EPOMAKER",
      "RT100",
      "Retro Keyboard",
      "Mini TV Screen",
      "Mechanical Keyboard"
    ],
    "variants": {
      "colors": [
        {
          "name": "Retro Gray & Cream",
          "hex": "#d1d5db"
        },
        {
          "name": "Deep Sea Blue",
          "hex": "#1e3a8a"
        }
      ]
    },
    "volumeDiscounts": [
      {
        "quantity": 1,
        "pricePerUnitQAR": 379,
        "savingsText": "Base Price"
      }
    ],
    "specifications": {
      "Mount Type": "Gasket-Mounted Sound Absorbing Architecture",
      "Display": "Detachable 1.3\" Color Mini TV Screen",
      "Connectivity": "Bluetooth 5.0, 2.4GHz Wireless, Type-C Wired"
    },
    "packageContents": [
      "EPOMAKER RT100 Keyboard",
      "Mini Smart TV Display",
      "Type-C Cable",
      "2-in-1 Keycap Puller",
      "Manual"
    ],
    "dropshipInfo": {
      "dispatchHours": 24,
      "shippingDaysMin": 6,
      "shippingDaysMax": 8,
      "freeShippingThresholdQAR": 150,
      "shippingCostQAR": 0,
      "airCarrier": "Express Air Freight to Hamad Int’l (DOH)",
      "qualityInspected": true,
      "hubOrigin": "Regional Tech Distribution Hub"
    }
  },
  {
    "id": "qat-047",
    "slug": "70mai-omni-360-full-view-smart-dash-cam",
    "title": "70mai Omni 360 Full-View 1080P Smart Dash Cam with AI Motion Detection & 4G Cloud Monitoring",
    "shortDescription": "Patented 340-degree motorized pan rotation, 60fps high frame rate, F1.5 aperture night owl vision, and GPS logger.",
    "fullDescription": "Zero blind spots when parked in Doha heat. The 70mai Omni automatically detects suspicious impacts or motion around your vehicle, rotating its motorized camera directly toward the source to capture instant evidence.",
    "category": "Car Tech & Mounts",
    "categorySlug": "car-accessories",
    "subcategory": "Dash Cams",
    "brand": "70mai",
    "priceQAR": 529,
    "originalPriceQAR": 529,
    "discountPercent": 0,
    "rating": 4.91,
    "reviewCount": 195,
    "soldCount": 540,
    "stockPercent": 89,
    "inStock": true,
    "isFlashDeal": false,
    "isTrending": true,
    "isBestSeller": true,
    "isUnder99": false,
    "isNewArrival": false,
    "badge": "360 SECURITY",
    "images": [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80"
    ],
    "tags": [
      "70mai",
      "Omni Dash Cam",
      "360 Camera",
      "Car Security",
      "AI Motion"
    ],
    "variants": {
      "colors": [
        {
          "name": "Black & Red Racing",
          "hex": "#18181b"
        }
      ],
      "options": [
        {
          "name": "Storage",
          "values": [
            "64GB eMMC Built-in",
            "128GB eMMC Built-in (+QAR 40)"
          ]
        }
      ]
    },
    "volumeDiscounts": [
      {
        "quantity": 1,
        "pricePerUnitQAR": 529,
        "savingsText": "Full Protection"
      }
    ],
    "specifications": {
      "View Angle": "340° Motorized Pan with 140° Field of View (Full 360°)",
      "Night Vision": "PureCel Plus-S HDR with Ultra-Wide F1.5 Aperture",
      "GPS & ADAS": "Built-in GPS Logger with Lane Departure & Forward Collision Alerts"
    },
    "packageContents": [
      "70mai Dash Cam Omni",
      "Car Power Adapter (Dual USB)",
      "Power Cord 3.5m",
      "Electrostatic Stickers",
      "Crowbar"
    ],
    "dropshipInfo": {
      "dispatchHours": 24,
      "shippingDaysMin": 6,
      "shippingDaysMax": 8,
      "freeShippingThresholdQAR": 150,
      "shippingCostQAR": 0,
      "airCarrier": "Express Air Freight to Hamad Int’l (DOH)",
      "qualityInspected": true,
      "hubOrigin": "Regional Tech Distribution Hub"
    }
  },
  {
    "id": "qat-048",
    "slug": "govee-glide-hexa-light-panels-3d-ultra-rgbic",
    "title": "Govee Glide Hexa Light Panels 3D Ultra RGBIC (10-Pack) Modular Geometric Wall Ambient Lights",
    "shortDescription": "3D dimensional lighting effect, RGBIC segmented color gradients, music sync visualizer, and Matter compatibility.",
    "fullDescription": "Step beyond flat wall lighting. The Govee Glide Hexa 3D panels create a stunning visual optical illusion of cubes protruding from your wall, blending vivid 16-million-color ambient effects across your room.",
    "category": "Smart Home & Ambience",
    "categorySlug": "smart-home",
    "subcategory": "Smart Lighting",
    "brand": "Govee",
    "priceQAR": 599,
    "originalPriceQAR": 599,
    "discountPercent": 0,
    "rating": 4.92,
    "reviewCount": 230,
    "soldCount": 470,
    "stockPercent": 88,
    "inStock": true,
    "isFlashDeal": false,
    "isTrending": true,
    "isBestSeller": false,
    "isUnder99": false,
    "isNewArrival": true,
    "badge": "3D LIGHTING",
    "images": [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80"
    ],
    "tags": [
      "Govee",
      "Hexa Panels",
      "3D Wall Lights",
      "RGBIC",
      "Gaming Setup"
    ],
    "variants": {
      "colors": [
        {
          "name": "Frost White Diffusion",
          "hex": "#ffffff"
        }
      ]
    },
    "volumeDiscounts": [
      {
        "quantity": 1,
        "pricePerUnitQAR": 599,
        "savingsText": "10-Pack Kit"
      }
    ],
    "specifications": {
      "Quantity": "10 Modular 3D Hexagonal Panels",
      "Lighting Technology": "RGBIC Segmented Individual Color Control",
      "Connectivity": "Wi-Fi 2.4GHz + Bluetooth 5.0 with App Control"
    },
    "packageContents": [
      "10x Hexa 3D Light Panels",
      "Control Box",
      "Power Adapter (UK 3-Pin)",
      "Connecting Cables",
      "Mounting Tape"
    ],
    "dropshipInfo": {
      "dispatchHours": 24,
      "shippingDaysMin": 6,
      "shippingDaysMax": 8,
      "freeShippingThresholdQAR": 150,
      "shippingCostQAR": 0,
      "airCarrier": "Express Air Freight to Hamad Int’l (DOH)",
      "qualityInspected": true,
      "hubOrigin": "Regional Tech Distribution Hub"
    }
  },
  {
    "id": "qat-049",
    "slug": "sandisk-professional-pro-blade-1tb-transport-nvme-ssd",
    "title": "SanDisk Professional PRO-BLADE 1TB Transport Modular High-Speed NVMe USB-C SSD (2000MB/s)",
    "shortDescription": "Blazing 2000MB/s read/write speeds, solid aluminum heatsink enclosure, modular interchangeable PRO-BLADE SSD mags.",
    "fullDescription": "Built for video editors and creative professionals in Qatar working with 4K and 8K ProRes footage. Swap SSD magazines instantly while the rugged aluminum core dissipates heat continuously during heavy render exports.",
    "category": "Laptop Hubs & Stands",
    "categorySlug": "laptop-gear",
    "subcategory": "Storage & SSDs",
    "brand": "SanDisk Professional",
    "priceQAR": 649,
    "originalPriceQAR": 649,
    "discountPercent": 0,
    "rating": 4.95,
    "reviewCount": 160,
    "soldCount": 380,
    "stockPercent": 92,
    "inStock": true,
    "isFlashDeal": false,
    "isTrending": false,
    "isBestSeller": true,
    "isUnder99": false,
    "isNewArrival": false,
    "badge": "FAST NVME",
    "images": [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80"
    ],
    "tags": [
      "SanDisk",
      "PRO-BLADE",
      "NVMe SSD",
      "1TB External SSD",
      "2000MB/s"
    ],
    "variants": {
      "colors": [
        {
          "name": "Industrial Gray",
          "hex": "#4b5563"
        }
      ]
    },
    "volumeDiscounts": [
      {
        "quantity": 1,
        "pricePerUnitQAR": 649,
        "savingsText": "Pro Storage"
      }
    ],
    "specifications": {
      "Speed": "Up to 2,000 MB/s Read and Write over USB 3.2 Gen 2x2",
      "Durability": "Up to 3-Meter Drop Protection and 4,000 lbs Crush Resistance",
      "Capacity": "1TB Modular PRO-BLADE NVMe Mag"
    },
    "packageContents": [
      "PRO-BLADE Transport Enclosure",
      "1TB PRO-BLADE Mag NVMe SSD",
      "20Gbps USB-C to USB-C Cable",
      "Quick Start Guide"
    ],
    "dropshipInfo": {
      "dispatchHours": 24,
      "shippingDaysMin": 6,
      "shippingDaysMax": 8,
      "freeShippingThresholdQAR": 150,
      "shippingCostQAR": 0,
      "airCarrier": "Express Air Freight to Hamad Int’l (DOH)",
      "qualityInspected": true,
      "hubOrigin": "Regional Tech Distribution Hub"
    }
  },
  {
    "id": "qat-050",
    "slug": "marshall-emberton-ii-portable-bluetooth-speaker",
    "title": "Marshall Emberton II Portable Bluetooth Speaker with True Stereophonic 360 Sound (30+ Hours Playtime)",
    "shortDescription": "Signature Marshall vintage brass knob, IP67 dust & water resistance, Stack Mode pairing, and 30+ hours of battery life.",
    "fullDescription": "Rich, clear, and loud sound wherever life takes you across Qatar. Emberton II utilizes True Stereophonic, a unique form of multi-directional 360-degree sound from Marshall that fills the room completely.",
    "category": "TWS & Spatial Audio",
    "categorySlug": "tws-audio",
    "subcategory": "Speakers",
    "brand": "Marshall",
    "priceQAR": 579,
    "originalPriceQAR": 579,
    "discountPercent": 0,
    "rating": 4.93,
    "reviewCount": 310,
    "soldCount": 840,
    "stockPercent": 91,
    "inStock": true,
    "isFlashDeal": false,
    "isTrending": true,
    "isBestSeller": true,
    "isUnder99": false,
    "isNewArrival": false,
    "badge": "ICONIC VINTAGE",
    "images": [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80"
    ],
    "tags": [
      "Marshall",
      "Emberton II",
      "Bluetooth Speaker",
      "IP67 Waterproof",
      "360 Audio"
    ],
    "variants": {
      "colors": [
        {
          "name": "Black & Brass",
          "hex": "#1c1917"
        },
        {
          "name": "Cream & Gold",
          "hex": "#fef3c7"
        }
      ]
    },
    "volumeDiscounts": [
      {
        "quantity": 1,
        "pricePerUnitQAR": 579,
        "savingsText": "Rock Legend"
      }
    ],
    "specifications": {
      "Sound System": "Two 2\" 10W Full Range Drivers with Two Passive Radiators",
      "Battery": "30+ Hours of Portable Playtime (20-min quick charge gives 4 hours)",
      "Protection": "IP67 Dust and Water Resistant (Submersible in 1m water for 30 mins)"
    },
    "packageContents": [
      "Marshall Emberton II Speaker",
      "USB-C Charging Cable",
      "User Manual and Legal Information"
    ],
    "dropshipInfo": {
      "dispatchHours": 24,
      "shippingDaysMin": 6,
      "shippingDaysMax": 8,
      "freeShippingThresholdQAR": 150,
      "shippingCostQAR": 0,
      "airCarrier": "Express Air Freight to Hamad Int’l (DOH)",
      "qualityInspected": true,
      "hubOrigin": "Regional Tech Distribution Hub"
    }
  },
  {
    "id": "qat-051",
    "slug": "zhiyun-smooth-5s-ai-3-axis-smartphone-gimbal-stabilizer",
    "title": "Zhiyun Smooth 5S AI 3-Axis Professional Smartphone Gimbal Stabilizer with Magnetic Fill Light",
    "shortDescription": "Orthogonal 3-axis cinema movements, 650-lux built-in fill light, magnetic AI tracker sensor, and heavy payload capacity.",
    "fullDescription": "Transform your iPhone or Samsung into a professional Hollywood cinema camera. The orthogonal 3-axis structure allows full 360-degree vortex rotation without motors bumping into phone lenses.",
    "category": "Drones & Vlogging",
    "categorySlug": "drones-cameras",
    "subcategory": "Gimbals",
    "brand": "Zhiyun",
    "priceQAR": 699,
    "originalPriceQAR": 699,
    "discountPercent": 0,
    "rating": 4.87,
    "reviewCount": 165,
    "soldCount": 390,
    "stockPercent": 88,
    "inStock": true,
    "isFlashDeal": false,
    "isTrending": false,
    "isBestSeller": true,
    "isUnder99": false,
    "isNewArrival": true,
    "badge": "CINEMATIC",
    "images": [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80"
    ],
    "tags": [
      "Zhiyun",
      "Smooth 5S",
      "Gimbal",
      "Phone Stabilizer",
      "Mobile Filmmaking"
    ],
    "variants": {
      "colors": [
        {
          "name": "Classic Slate Gray",
          "hex": "#374151"
        },
        {
          "name": "White Edition",
          "hex": "#f8fafc"
        }
      ]
    },
    "volumeDiscounts": [
      {
        "quantity": 1,
        "pricePerUnitQAR": 699,
        "savingsText": "Mobile Cinema"
      }
    ],
    "specifications": {
      "Motors": "Heavy-Duty 3-Axis Orthogonal Motors (Supports iPhone 16 Pro Max with lenses)",
      "Fill Light": "Built-in 650-Lux Tilt Axis Light (5000K Color Temp)",
      "Battery": "Up to 24 Hours Runtime with 2-Hour PD Fast Recharging"
    },
    "packageContents": [
      "Zhiyun Smooth 5S Gimbal",
      "Mini Tripod Stand",
      "USB-C Charging Cable",
      "Quick Start Guide"
    ],
    "dropshipInfo": {
      "dispatchHours": 24,
      "shippingDaysMin": 6,
      "shippingDaysMax": 8,
      "freeShippingThresholdQAR": 150,
      "shippingCostQAR": 0,
      "airCarrier": "Express Air Freight to Hamad Int’l (DOH)",
      "qualityInspected": true,
      "hubOrigin": "Regional Tech Distribution Hub"
    }
  },
  {
    "id": "qat-052",
    "slug": "torras-coolify-3-neck-air-conditioner-wearable",
    "title": "Torras Coolify 3 Wearable Personal Neck Air Conditioner with Semiconductor Peltier Cooling",
    "shortDescription": "Quad-motor 360-degree airflow, semiconductor peltier cooling plates, drops body temperature by up to 18°C in 3 seconds.",
    "fullDescription": "Beat the scorching Qatar summer with personal air conditioning wherever you walk. Featuring 3 semiconductor peltier cooling plates and 7 air ducts that blow chilly air directly across your neck and face.",
    "category": "Smart Home & Ambience",
    "categorySlug": "smart-home",
    "subcategory": "Personal Cooling",
    "brand": "Torras",
    "priceQAR": 749,
    "originalPriceQAR": 749,
    "discountPercent": 0,
    "rating": 4.94,
    "reviewCount": 310,
    "soldCount": 920,
    "stockPercent": 86,
    "inStock": true,
    "isFlashDeal": false,
    "isTrending": true,
    "isBestSeller": true,
    "isUnder99": false,
    "isNewArrival": false,
    "badge": "SUMMER ESSENTIAL",
    "images": [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80"
    ],
    "tags": [
      "Torras",
      "Coolify 3",
      "Neck AC",
      "Wearable Air Conditioner",
      "Summer Tech"
    ],
    "variants": {
      "colors": [
        {
          "name": "Midnight Black",
          "hex": "#0f172a"
        },
        {
          "name": "Titanium White",
          "hex": "#f8fafc"
        }
      ]
    },
    "volumeDiscounts": [
      {
        "quantity": 1,
        "pricePerUnitQAR": 749,
        "savingsText": "Stay Chilled"
      }
    ],
    "specifications": {
      "Cooling System": "Dual-Layer Semiconductor Peltier Engine with 38-Watt Cooling Power",
      "Airflow": "7 Directional Wind Ducts with 4 Silent Turbofans",
      "Battery": "6000mAh Battery (Up to 13 Hours runtime in Eco mode)"
    },
    "packageContents": [
      "Torras Coolify 3 Neck Air Conditioner",
      "Hard EVA Travel Protective Case",
      "USB-C Fast Charging Cable",
      "User Manual"
    ],
    "dropshipInfo": {
      "dispatchHours": 24,
      "shippingDaysMin": 6,
      "shippingDaysMax": 8,
      "freeShippingThresholdQAR": 150,
      "shippingCostQAR": 0,
      "airCarrier": "Express Air Freight to Hamad Int’l (DOH)",
      "qualityInspected": true,
      "hubOrigin": "Regional Tech Distribution Hub"
    }
  },
  {
    "id": "qat-053",
    "slug": "elgato-wave-mic-arm-lp-low-profile-boom-arm",
    "title": "Elgato Wave Mic Arm LP Low Profile Premium All-Metal Desk Microphone Boom Arm",
    "shortDescription": "All-metal anti-torsion construction, cable management magnetic channels, 360-degree rotation, under-monitor clearance.",
    "fullDescription": "The cleanest microphone arm for modern desk setups. Sits low below your monitor line-of-sight so your camera view remains unobstructed, complete with magnetic hide-away cable channels.",
    "category": "Gaming & Desk Tech",
    "categorySlug": "gaming-gear",
    "subcategory": "Studio Arms",
    "brand": "Elgato",
    "priceQAR": 329,
    "originalPriceQAR": 329,
    "discountPercent": 0,
    "rating": 4.96,
    "reviewCount": 390,
    "soldCount": 1100,
    "stockPercent": 93,
    "inStock": true,
    "isFlashDeal": false,
    "isTrending": true,
    "isBestSeller": true,
    "isUnder99": false,
    "isNewArrival": false,
    "badge": "DESK SETUP ESSENTIAL",
    "images": [
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80"
    ],
    "tags": [
      "Elgato",
      "Wave Mic Arm LP",
      "Low Profile Arm",
      "Desk Setup",
      "Microphone Boom"
    ],
    "variants": {
      "colors": [
        {
          "name": "Matte Black",
          "hex": "#18181b"
        },
        {
          "name": "White Edition",
          "hex": "#f8fafc"
        }
      ]
    },
    "volumeDiscounts": [
      {
        "quantity": 1,
        "pricePerUnitQAR": 329,
        "savingsText": "Base Price"
      }
    ],
    "specifications": {
      "Build": "Full Heavy-Duty Metal Anti-Torsion Construction",
      "Max Weight Capacity": "Up to 2kg / 4.4 lbs",
      "Desk Clamp": "Padded Clamp expandable up to 60mm / 2.4\""
    },
    "packageContents": [
      "Wave Mic Arm LP",
      "1/4\" to 3/8\" and 1/4\" to 5/8\" Thread Adapters",
      "Allen Wrench",
      "Desk Clamp"
    ],
    "dropshipInfo": {
      "dispatchHours": 24,
      "shippingDaysMin": 6,
      "shippingDaysMax": 8,
      "freeShippingThresholdQAR": 150,
      "shippingCostQAR": 0,
      "airCarrier": "Express Air Freight to Hamad Int’l (DOH)",
      "qualityInspected": true,
      "hubOrigin": "Regional Tech Distribution Hub"
    }
  }
];

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'standard-air',
    name: 'Standard Express Doorstep Delivery',
    badge: 'POPULAR IN QATAR',
    duration: '6–8 Business Days',
    priceQAR: 20,
    description: 'Tracked express courier delivery directly to your doorstep across Doha, Lusail, Al Rayyan, and all Qatar municipalities.',
  },
  {
    id: 'priority-air',
    name: 'Priority Fast-Track Delivery',
    badge: 'FASTEST OPTION',
    duration: '4–6 Business Days',
    priceQAR: 45,
    description: 'Expedited dispatch with priority customs clearance and live SMS tracking straight to your phone.',
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-9021',
    orderNumber: 'QTF-78291-QA',
    date: '2026-10-18',
    items: [
      {
        id: 'qat-001-obsidian',
        product: PRODUCTS[0],
        quantity: 1,
        selectedColor: 'Obsidian Black',
        selectedOption: 'Pro LED Display Case (+QAR 25)',
      },
      {
        id: 'qat-012-cyan',
        product: PRODUCTS[11],
        quantity: 2,
        selectedColor: 'Sky Cyan',
        selectedOption: '1.8 Meter (Bedside & Couch)',
      },
    ],
    subtotalQAR: 252,
    shippingQAR: 0,
    discountQAR: 15,
    totalQAR: 237,
    address: {
      fullName: 'Tariq Al-Mansoor',
      phone: '+974 5512 8894',
      municipality: 'Lusail City (مدينة لوسيل)',
      zoneNumber: 'Zone 69',
      streetNumber: 'Street 312',
      buildingNumber: 'Building 18 (Fox Hills North)',
      landmark: 'Near Crescent Park, Apt 402',
      isDefault: true,
    },
    shippingMethod: SHIPPING_METHODS[0],
    paymentMethod: 'apple_pay',
    status: 'Qatar Customs (DOH)',
    trackingNumber: 'QA-EXP-8849201',
    estimatedDeliveryWindow: 'Oct 26 – Oct 28, 2026',
    timeline: [
      {
        stage: 'Order Confirmed',
        title: 'Order Placed & Payment Verified',
        description: 'Payment authorized via Apple Pay. Order confirmed and routed for fulfillment.',
        location: 'Qatify Online System (Doha, QA)',
        date: 'Oct 18, 2026 — 14:20 GMT+3',
        completed: true,
      },
      {
        stage: 'Quality Checked & Packed',
        title: '100% Quality Inspected & Barcoded',
        description: 'Physical inspection completed. Devices power-tested and wrapped in protective sealed packaging.',
        location: 'Regional Tech Distribution Hub',
        date: 'Oct 19, 2026 — 09:45 GMT+3',
        completed: true,
      },
      {
        stage: 'Air Hub Transit',
        title: 'Departed Global Hub via Express Air',
        description: 'Loaded onto Qatar Airways Flight destined for Hamad International Airport.',
        location: 'Air Cargo Freight Terminal',
        date: 'Oct 21, 2026 — 23:10 GMT+3',
        completed: true,
      },
      {
        stage: 'Qatar Customs (DOH)',
        title: 'Arrived at Hamad Int’l Airport (Customs Clearance)',
        description: 'Air cargo unloaded at Hamad International Airport (DOH). Electronic customs clearance completed.',
        location: 'Hamad International Airport Cargo Terminal, Doha, Qatar',
        date: 'Oct 22, 2026 — 18:30 GMT+3',
        completed: false,
        current: true,
      },
      {
        stage: 'Out for Delivery',
        title: 'Dispatched with Local Qatar Courier',
        description: 'Handed to Qatar express delivery courier for final doorstep drop in Lusail.',
        location: 'Doha Central Sorting Facility',
        date: 'Estimated: Oct 26, 2026',
        completed: false,
      },
    ],
  },
  {
    id: 'ord-9018',
    orderNumber: 'QTF-74102-QA',
    date: '2026-10-12',
    items: [
      {
        id: 'qat-002-spacegray',
        product: PRODUCTS[1],
        quantity: 1,
        selectedColor: 'Space Gray',
        selectedOption: 'UK 3-Pin (Qatar Standard)',
      },
    ],
    subtotalQAR: 129,
    shippingQAR: 20,
    discountQAR: 0,
    totalQAR: 149,
    address: {
      fullName: 'Tariq Al-Mansoor',
      phone: '+974 5512 8894',
      municipality: 'Doha (العاصمة)',
      zoneNumber: 'Zone 24',
      streetNumber: 'Street 840',
      buildingNumber: 'Building 12',
      landmark: 'Behind Al Meera Rawdat Al Khail',
      isDefault: false,
    },
    shippingMethod: SHIPPING_METHODS[0],
    paymentMethod: 'credit_card',
    status: 'Delivered',
    trackingNumber: 'QA-EXP-7729104',
    estimatedDeliveryWindow: 'Delivered on Oct 20, 2026',
    timeline: [
      {
        stage: 'Order Confirmed',
        title: 'Order Placed',
        description: 'Confirmed and verified',
        location: 'Doha, QA',
        date: 'Oct 12, 2026',
        completed: true,
      },
      {
        stage: 'Quality Checked & Packed',
        title: 'Quality Check Passed',
        description: 'Passed 100% inspection',
        location: 'Fulfillment Hub',
        date: 'Oct 13, 2026',
        completed: true,
      },
      {
        stage: 'Air Hub Transit',
        title: 'Express Transit to Qatar',
        description: 'Air dispatch in transit',
        location: 'Air Cargo',
        date: 'Oct 15, 2026',
        completed: true,
      },
      {
        stage: 'Qatar Customs (DOH)',
        title: 'Customs Cleared',
        description: 'Cleared Hamad Airport',
        location: 'Hamad Int’l Airport (DOH)',
        date: 'Oct 18, 2026',
        completed: true,
      },
      {
        stage: 'Delivered',
        title: 'Delivered to Doorstep',
        description: 'Delivered successfully and signed by customer in Doha.',
        location: 'Rawdat Al Khail, Doha',
        date: 'Oct 20, 2026 — 16:15 GMT+3',
        completed: true,
      },
    ],
  },
];
