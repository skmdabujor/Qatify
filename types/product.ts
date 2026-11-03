// =============================================================================
// Qatify — TypeScript Data Types & Interfaces
// =============================================================================

export interface ProductVariantColor {
  name: string;
  hex: string;
  image?: string;
}

export interface ProductVariantOption {
  name: string; // e.g. "Storage" or "Size"
  values: string[];
}

export interface VolumeDiscountTier {
  quantity: number;
  pricePerUnitQAR: number;
  savingsText: string;
}

export interface DropshipLogisticsInfo {
  dispatchHours: number;
  shippingDaysMin: number; // 6
  shippingDaysMax: number; // 10
  freeShippingThresholdQAR: number; // 150
  shippingCostQAR: number; // 25
  airCarrier: string;
  qualityInspected: boolean;
  hubOrigin: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  categorySlug: string;
  subcategory: string;
  brand: string;
  priceQAR: number;
  originalPriceQAR: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  stockPercent: number; // e.g. 78 (% claimed/in stock)
  inStock: boolean;
  isFlashDeal: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  isUnder99: boolean;
  isNewArrival: boolean;
  badge?: string; // e.g. "HOT SELLER", "LIMITED BATCH", "TOP RATED"
  images: string[];
  tags: string[];
  variants?: {
    colors?: ProductVariantColor[];
    options?: ProductVariantOption[];
  };
  volumeDiscounts?: VolumeDiscountTier[];
  specifications: Record<string, string>;
  packageContents: string[];
  dropshipInfo: DropshipLogisticsInfo;
}

export interface CartItem {
  id: string; // unique combo of product.id + variants
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedOption?: string;
}

export interface QatarAddress {
  id?: string;
  // AliExpress DropShipping Delivery Details for Qatar
  country: string; // "Qatar"
  firstName: string; // e.g. "Mohammed"
  lastName: string; // e.g. "Al-Thani"
  phoneCountryCode: string; // e.g. "974"
  phoneNumber: string; // e.g. "44374646"
  streetAddress: string; // e.g. "Street 230, Al Corniche Street"
  apartmentSuite: string; // e.g. "Building 45, Apt 3B"
  municipality: string; // e.g. "Al Daayen", "Doha"
  zoneNumber: string; // e.g. "Zone 69"
  postalCode: string; // e.g. "00974"
  isDefault?: boolean;

  // Compatibility / legacy fields
  fullName?: string;
  phone?: string;
  email?: string;
  streetNumber?: string;
  buildingNumber?: string;
  unitNumber?: string;
  landmark?: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  badge: string;
  duration: string;
  priceQAR: number;
  description: string;
}

export interface OrderTimelineStep {
  stage: string;
  title: string;
  description: string;
  location: string;
  date: string;
  completed: boolean;
  current?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  subtotalQAR: number;
  shippingQAR: number;
  discountQAR: number;
  totalQAR: number;
  address: QatarAddress;
  shippingMethod: ShippingMethod;
  paymentMethod: 'credit_card' | 'apple_pay' | 'cash_on_delivery';
  status: 'Order Confirmed' | 'Air Hub Transit' | 'Qatar Customs (DOH)' | 'Out for Delivery' | 'Delivered';
  trackingNumber: string;
  estimatedDeliveryWindow: string;
  timeline: OrderTimelineStep[];
}

export type SortOption =
  | 'trending'
  | 'price-asc'
  | 'price-desc'
  | 'discount'
  | 'rating'
  | 'newest';

export interface FilterState {
  category?: string;
  subcategories: string[];
  priceMin: number;
  priceMax: number;
  priceTier?: string; // e.g. "under-50" | "50-150" | "150-300" | "300-plus"
  brands: string[];
  minDiscount: number;
  minRating: number;
  inStockOnly: boolean;
  flashDealsOnly: boolean;
  searchQuery: string;
  sortBy: SortOption;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count: number;
}

export function toCategory(doc: any): Category {
  return {
    id: doc.id || doc.categoryId || doc._id,
    name: doc.name,
    slug: doc.slug,
    icon: doc.icon,
    count: doc.count,
  };
}

export function toProduct(doc: any): Product {
  return {
    ...doc,
    id: doc.productId || doc.id || doc._id,
  };
}


