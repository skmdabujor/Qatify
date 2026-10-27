// =============================================================================
// Qatify — Circular Category Navigation Data (Qatar Electronics & Tech Catalog)
// Strictly Electric / Electronic Gadgets & Tech Accessories
// =============================================================================

export interface CircularCategory {
  id: string;
  name: string;
  slug: string;
  href: string;
  image?: string;
  iconName: string;
  badgeText: string;
  badgeVariant?: 'red' | 'yellow' | 'green' | 'gold';
  ringVariant?: 'red' | 'gold' | 'green';
  isMoreButton?: boolean;
}

export const CIRCULAR_CATEGORIES: CircularCategory[] = [
  {
    id: 'cat-mobiles',
    name: 'Smartphones',
    slug: 'mobiles',
    href: '/shop?cat=mobiles',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&auto=format&fit=crop&q=80',
    iconName: 'Smartphone',
    badgeText: 'FROM 189 QR',
    badgeVariant: 'red',
    ringVariant: 'red',
  },
  {
    id: 'cat-laptops',
    name: 'Laptops & Mac',
    slug: 'laptops',
    href: '/shop?cat=laptop-gear',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&auto=format&fit=crop&q=80',
    iconName: 'Laptop',
    badgeText: 'FROM 899 QR',
    badgeVariant: 'red',
    ringVariant: 'red',
  },
  {
    id: 'cat-smartwatches',
    name: 'Smart Watches',
    slug: 'smartwatches',
    href: '/shop?cat=smartwatches',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80',
    iconName: 'Watch',
    badgeText: 'UP TO 50%',
    badgeVariant: 'red',
    ringVariant: 'red',
  },
  {
    id: 'cat-earbuds',
    name: 'Wireless Earbuds',
    slug: 'tws-audio',
    href: '/shop?cat=tws-audio',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&auto=format&fit=crop&q=80',
    iconName: 'Headphones',
    badgeText: 'FROM 49 QR',
    badgeVariant: 'red',
    ringVariant: 'red',
  },
  {
    id: 'cat-gaming',
    name: 'Gaming Consoles',
    slug: 'gaming-gear',
    href: '/shop?cat=gaming-gear',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=300&auto=format&fit=crop&q=80',
    iconName: 'Gamepad2',
    badgeText: 'FROM 99 QR',
    badgeVariant: 'red',
    ringVariant: 'red',
  },
  {
    id: 'cat-speakers',
    name: 'Bluetooth Audio',
    slug: 'bluetooth-speakers',
    href: '/shop?cat=bluetooth-speakers',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&auto=format&fit=crop&q=80',
    iconName: 'Volume2',
    badgeText: 'FROM 59 QR',
    badgeVariant: 'red',
    ringVariant: 'red',
  },
  {
    id: 'cat-tablets',
    name: 'Tablets & iPads',
    slug: 'tablets',
    href: '/shop?cat=tablets',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&auto=format&fit=crop&q=80',
    iconName: 'Tablet',
    badgeText: 'FROM 249 QR',
    badgeVariant: 'red',
    ringVariant: 'red',
  },
  {
    id: 'cat-chargers',
    name: 'Power & GaN',
    slug: 'chargers-powerbanks',
    href: '/shop?cat=chargers-powerbanks',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&auto=format&fit=crop&q=80',
    iconName: 'BatteryCharging',
    badgeText: 'FROM 39 QR',
    badgeVariant: 'red',
    ringVariant: 'red',
  },
  {
    id: 'cat-smart-home',
    name: 'Smart Home Tech',
    slug: 'smart-home',
    href: '/shop?cat=smart-home',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80',
    iconName: 'Home',
    badgeText: 'FROM 49 QR',
    badgeVariant: 'red',
    ringVariant: 'red',
  },
  {
    id: 'cat-cameras',
    name: 'Cameras & Drones',
    slug: 'drones-cameras',
    href: '/shop?cat=drones-cameras',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&auto=format&fit=crop&q=80',
    iconName: 'Camera',
    badgeText: 'UP TO 40%',
    badgeVariant: 'red',
    ringVariant: 'red',
  },
  {
    id: 'cat-electric-trimmers',
    name: 'Electric Grooming',
    slug: 'electric-trimmers',
    href: '/shop?cat=electric-trimmers',
    image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=300&auto=format&fit=crop&q=80',
    iconName: 'Zap',
    badgeText: 'FROM 35 QR',
    badgeVariant: 'red',
    ringVariant: 'red',
  },
  {
    id: 'cat-more',
    name: 'More Categories',
    slug: 'all-categories',
    href: '/shop',
    iconName: 'ChevronsRight',
    badgeText: 'VIEW ALL',
    badgeVariant: 'red',
    ringVariant: 'gold',
    isMoreButton: true,
  },
];
