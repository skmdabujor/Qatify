import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import { PRODUCTS, CATEGORIES } from "../data/products.js";
import * as fs from "fs";
import * as path from "path";

// Read NEXT_PUBLIC_CONVEX_URL and ADMIN_SECRET_KEY from environment or .env.local
let convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
let adminKey = process.env.ADMIN_SECRET_KEY || "";

if (!convexUrl || !adminKey) {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    if (!convexUrl) {
      const match = envContent.match(/NEXT_PUBLIC_CONVEX_URL=(.+)/);
      if (match) convexUrl = match[1].trim();
    }
    if (!adminKey) {
      const matchKey = envContent.match(/ADMIN_SECRET_KEY=(.+)/);
      if (matchKey) adminKey = matchKey[1].trim();
    }
  }
}

if (!convexUrl) {
  console.error("❌ NEXT_PUBLIC_CONVEX_URL not found in environment or .env.local");
  process.exit(1);
}

if (!adminKey) {
  console.error("❌ ADMIN_SECRET_KEY not found in environment or .env.local");
  process.exit(1);
}

const client = new ConvexHttpClient(convexUrl);

async function main() {
  console.log(`🌱 Connecting to Convex deployment at ${convexUrl}...`);
  console.log(`📦 Found ${PRODUCTS.length} products and ${CATEGORIES.length} categories to seed.`);

  // 1. Seed Categories
  const mappedCategories = CATEGORIES.map((c) => ({
    categoryId: c.id,
    name: c.name,
    slug: c.slug,
    icon: c.icon,
    count: c.count,
  }));

  try {
    const catResult = await client.mutation(api.categories.seedCategories, {
      adminKey,
      items: mappedCategories,
    });
    console.log(`✅ Successfully seeded categories! Inserted: ${catResult.count} categories.`);
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
  }

  // 2. Seed Products
  const mappedItems = PRODUCTS.map((p) => ({
    productId: p.id,
    slug: p.slug,
    title: p.title,
    shortDescription: p.shortDescription,
    fullDescription: p.fullDescription,
    category: p.category,
    categorySlug: p.categorySlug,
    subcategory: p.subcategory,
    brand: p.brand,
    priceQAR: p.priceQAR,
    originalPriceQAR: p.originalPriceQAR,
    discountPercent: p.discountPercent,
    rating: p.rating,
    reviewCount: p.reviewCount,
    soldCount: p.soldCount,
    stockPercent: p.stockPercent,
    inStock: p.inStock,
    isFlashDeal: p.isFlashDeal,
    isTrending: p.isTrending,
    isBestSeller: p.isBestSeller,
    isUnder99: p.isUnder99,
    isNewArrival: p.isNewArrival,
    badge: p.badge,
    images: p.images,
    tags: p.tags,
    variants: p.variants,
    volumeDiscounts: p.volumeDiscounts,
    specifications: p.specifications,
    packageContents: p.packageContents,
    dropshipInfo: p.dropshipInfo,
  }));

  try {
    const result = await client.mutation(api.products.seedProducts, {
      adminKey,
      items: mappedItems,
    });
    console.log(`✅ Successfully seeded products! Inserted: ${result.count} products.`);
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    process.exit(1);
  }
}

main();
