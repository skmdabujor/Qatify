'use client';

// =============================================================================
// Qatify — Global Shop Context (Cart, Wishlist, Compare, Search, Orders, Toasts)
// LocalStorage Persisted with Hydration Safety
// =============================================================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, QatarAddress, Order, ShippingMethod } from '@/types/product';
import { PRODUCTS, MOCK_ORDERS, SHIPPING_METHODS } from '@/data/products';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description?: string;
}

interface ShopContextType {
  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  appliedCoupon: string | null;
  appliedDiscountQAR: number;
  setCoupon: (code: string | null, discount?: number) => void;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  isFreeShipping: boolean;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedOption?: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;

  // Bundle Promotion (Tiered 5-20 Items, >= 180 QAR)
  bundleItemCount: number;
  bundleTierPercent: number;
  bundleDiscountQAR: number;
  addBundleToCart: (products: Product[]) => void;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;

  // Compare
  compareList: Product[];
  toggleCompare: (product: Product) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;

  // Search & Global Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;

  // Orders & Addresses
  orders: Order[];
  activeOrder: Order | null;
  savedAddresses: QatarAddress[];
  addAddress: (address: QatarAddress) => void;
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'timeline' | 'status' | 'trackingNumber'>) => Order;

  // Toasts
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Live Chat
  isChatOpen: boolean;
  openChat: (initialPrompt?: string) => void;
  closeChat: () => void;
  toggleChat: () => void;
  chatInitialPrompt: string;
  clearChatInitialPrompt: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 150; // QAR 150 for free air shipping in Qatar

const INITIAL_ADDRESSES: QatarAddress[] = [
  {
    id: 'addr-1',
    fullName: 'Tariq Al-Mansoor',
    phone: '+974 5512 8894',
    municipality: 'Lusail City (مدينة لوسيل)',
    zoneNumber: 'Zone 69',
    streetNumber: 'Street 312',
    buildingNumber: 'Building 18 (Fox Hills North)',
    landmark: 'Near Crescent Park, Apt 402',
    isDefault: true,
  },
  {
    id: 'addr-2',
    fullName: 'Tariq Al-Mansoor',
    phone: '+974 5512 8894',
    municipality: 'Doha (العاصمة)',
    zoneNumber: 'Zone 24',
    streetNumber: 'Street 840',
    buildingNumber: 'Building 12',
    landmark: 'Behind Al Meera Rawdat Al Khail',
    isDefault: false,
  },
];

export function ShopProvider({ children }: { children: ReactNode }) {
  // Hydration guard
  const [isHydrated, setIsHydrated] = useState(false);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [appliedDiscountQAR, setAppliedDiscountQAR] = useState(0);

  const setCoupon = (code: string | null, discount = 0) => {
    setAppliedCoupon(code);
    setAppliedDiscountQAR(discount);
  };

  // Wishlist & Compare
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Orders & Addresses
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [savedAddresses, setSavedAddresses] = useState<QatarAddress[]>(INITIAL_ADDRESSES);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Live Chat
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState('');

  const openChat = (initialPrompt?: string) => {
    if (initialPrompt) {
      setChatInitialPrompt(initialPrompt);
    }
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const clearChatInitialPrompt = () => {
    setChatInitialPrompt('');
  };

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('qatify_cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      } else {
        // Pre-populate with 1 realistic starter item so cart preview is vibrant
        setCart([
          {
            id: 'qat-001-starter',
            product: PRODUCTS[0],
            quantity: 1,
            selectedColor: 'Obsidian Black',
            selectedOption: 'Standard Qi Case',
          },
        ]);
      }

      const storedWishlist = localStorage.getItem('qatify_wishlist');
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      } else {
        setWishlist([PRODUCTS[1], PRODUCTS[4]]);
      }

      const storedOrders = localStorage.getItem('qatify_orders');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }

      const storedAddresses = localStorage.getItem('qatify_addresses');
      if (storedAddresses) {
        setSavedAddresses(JSON.parse(storedAddresses));
      }
    } catch (e) {
      console.error('Error hydrating state from localStorage:', e);
    }
    setIsHydrated(true);
  }, []);

  // Sync to LocalStorage on updates
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('qatify_cart', JSON.stringify(cart));
      } catch (e) {
        console.error('Error saving cart:', e);
      }
    }
  }, [cart, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('qatify_wishlist', JSON.stringify(wishlist));
      } catch (e) {
        console.error('Error saving wishlist:', e);
      }
    }
  }, [wishlist, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('qatify_orders', JSON.stringify(orders));
      } catch (e) {
        console.error('Error saving orders:', e);
      }
    }
  }, [orders, isHydrated]);

  // Toast Helpers
  const showToast = (
    title: string,
    description?: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'success'
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.priceQAR * item.quantity, 0);
  const isFreeShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD;
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);

  // Bundle Promotion Calculation (Qualifying bundle when 5 or more items in cart)
  const bundleItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  let bundleTierPercent = 0;
  if (bundleItemCount >= 20) {
    bundleTierPercent = 20;
  } else if (bundleItemCount >= 15) {
    bundleTierPercent = 15;
  } else if (bundleItemCount >= 10) {
    bundleTierPercent = 10;
  } else if (bundleItemCount >= 5) {
    bundleTierPercent = 5;
  }

  const qualifyingBundleSubtotal = cart.reduce(
    (acc, item) => acc + item.product.priceQAR * item.quantity,
    0
  );
  const bundleDiscountQAR =
    bundleTierPercent > 0
      ? Math.round((qualifyingBundleSubtotal * bundleTierPercent) / 100)
      : 0;

  // Cart Actions
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedColor?: string,
    selectedOption?: string
  ) => {
    const color = selectedColor || product.variants?.colors?.[0]?.name;
    const option = selectedOption || product.variants?.options?.[0]?.values?.[0];
    const itemUniqueId = `${product.id}-${color || 'default'}-${option || 'default'}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === itemUniqueId);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      } else {
        return [
          ...prev,
          {
            id: itemUniqueId,
            product,
            quantity,
            selectedColor: color,
            selectedOption: option,
          },
        ];
      }
    });

    showToast(
      'Added to Cart! 🛒',
      `${product.title.slice(0, 32)}... (QAR ${product.priceQAR})`,
      'success'
    );
    setIsCartOpen(true);
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Item Removed', 'The item was removed from your cart.', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const addBundleToCart = (products: Product[]) => {
    setCart((prev) => {
      const next = [...prev];
      for (const product of products) {
        const color = product.variants?.colors?.[0]?.name;
        const option = product.variants?.options?.[0]?.values?.[0];
        const itemUniqueId = `${product.id}-${color || 'default'}-${option || 'default'}`;
        const existingIndex = next.findIndex((item) => item.id === itemUniqueId);

        if (existingIndex > -1) {
          next[existingIndex] = {
            ...next[existingIndex],
            quantity: next[existingIndex].quantity + 1,
          };
        } else {
          next.push({
            id: itemUniqueId,
            product,
            quantity: 1,
            selectedColor: color,
            selectedOption: option,
          });
        }
      }
      return next;
    });

    showToast(
      'Bundle Added to Cart! 🎁',
      `${products.length} products added with Tiered Bundle Discount.`,
      'success'
    );
  };

  // Wishlist Actions
  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      showToast('Removed from Wishlist', product.title.slice(0, 32), 'info');
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast('Saved to Wishlist! ❤️', product.title.slice(0, 32), 'success');
    }
  };

  const removeFromWishlist = (productId: string) => {
    const item = wishlist.find((p) => p.id === productId);
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
    showToast(
      'Removed from Wishlist',
      item ? item.title.slice(0, 32) : 'Item removed from your wishlist.',
      'info'
    );
  };

  // Compare Actions
  const isInCompare = (productId: string) => {
    return compareList.some((item) => item.id === productId);
  };

  const toggleCompare = (product: Product) => {
    if (isInCompare(product.id)) {
      setCompareList((prev) => prev.filter((item) => item.id !== product.id));
      showToast('Removed from Compare', product.title.slice(0, 32), 'info');
    } else {
      if (compareList.length >= 4) {
        showToast('Compare Limit Reached', 'You can compare up to 4 items simultaneously.', 'warning');
        return;
      }
      setCompareList((prev) => [...prev, product]);
      showToast('Added to Compare ⚖️', product.title.slice(0, 32), 'success');
    }
  };

  const clearCompare = () => setCompareList([]);

  // Address Actions
  const addAddress = (address: QatarAddress) => {
    const newAddr: QatarAddress = {
      ...address,
      id: `addr-${Date.now()}`,
    };
    setSavedAddresses((prev) => [newAddr, ...prev]);
    showToast('Address Saved', 'Qatar delivery address updated successfully.');
  };

  // Order Actions
  const createOrder = (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'timeline' | 'status' | 'trackingNumber'>
  ): Order => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `QTF-${randomDigits}-QA`;
    const trackingNumber = `QA-EXP-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      trackingNumber,
      date: new Date().toISOString().split('T')[0],
      status: 'Order Confirmed',
      timeline: [
        {
          stage: 'Order Confirmed',
          title: 'Order Placed & Payment Verified',
          description: `Authorized with ${orderData.paymentMethod.replace('_', ' ').toUpperCase()}. Transmitted to dropshipping hub.`,
          location: 'Qatify Online System (Doha, QA)',
          date: 'Just Now',
          completed: true,
          current: true,
        },
        {
          stage: 'Quality Checked & Packed',
          title: '100% Quality Inspection',
          description: 'Package being verified, sealed with tamper-proof security tape, and weighed.',
          location: 'Global Air Hub (Direct Air Logistics)',
          date: 'Scheduled: Within 24 Hours',
          completed: false,
        },
        {
          stage: 'Air Hub Transit',
          title: 'Direct Air Flight to Qatar',
          description: 'International air express priority freight to Hamad International Airport (DOH).',
          location: 'In Air Transit',
          date: 'Scheduled: Days 2–4',
          completed: false,
        },
        {
          stage: 'Qatar Customs (DOH)',
          title: 'Hamad Int’l Airport Customs Clearance',
          description: 'Expedited customs clearance under Qatar General Authority of Customs.',
          location: 'Hamad Int’l Airport (DOH)',
          date: 'Scheduled: Days 5–6',
          completed: false,
        },
        {
          stage: 'Out for Delivery',
          title: 'Doorstep Courier Dispatch in Qatar',
          description: `Dispatched to ${orderData.address.municipality}, ${orderData.address.zoneNumber}.`,
          location: `${orderData.address.municipality}, Qatar`,
          date: 'Scheduled: Days 6–10',
          completed: false,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showToast('Order Placed Successfully! 🎉', `Ref: ${orderNumber} | Tracked Air 6–10 Days`, 'success');
    return newOrder;
  };

  const activeOrder = orders[0] || null;

  return (
    <ShopContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        appliedCoupon,
        appliedDiscountQAR,
        setCoupon,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        freeShippingRemaining,
        isFreeShipping,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        bundleItemCount,
        bundleTierPercent,
        bundleDiscountQAR,
        addBundleToCart,
        wishlist,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        compareList,
        toggleCompare,
        isInCompare,
        clearCompare,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        orders,
        activeOrder,
        savedAddresses,
        addAddress,
        createOrder,
        toasts,
        showToast,
        removeToast,
        isChatOpen,
        openChat,
        closeChat,
        toggleChat,
        chatInitialPrompt,
        clearChatInitialPrompt,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}

