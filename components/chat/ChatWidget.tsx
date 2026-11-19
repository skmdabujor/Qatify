'use client';

// =============================================================================
// Qatify — Live Customer Support Chat Widget
// Features:
// - Light, clean, professional UI (White theme matching AliExpress/Daraz/Intercom)
// - Removable/Dismissible floating launcher (User can remove icon from screen)
// - Ultra-fast responses powered directly by live site state & data
// - Backend order tracking & customer name extraction (greets users by real order name)
// - Real-time order lookup (Checks active orders: "Amr ki kono order ache?")
// - Live Qatify catalog search (Smartwatch, GaN chargers, Earbuds, Gaming, etc.)
// - Strict domain guardrails (Only answers Qatify store questions; politely declines off-topic)
// =============================================================================

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageCircle,
  X,
  Send,
  RotateCcw,
  Package,
  CheckCheck,
  ExternalLink,
  ArrowRight,
  Headphones,
} from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { PRODUCTS } from '@/data/products';
import { Order, QatarAddress } from '@/types/product';
import styles from './ChatWidget.module.scss';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  agentName?: string;
  text: string;
  timestamp: string;
  actions?: Array<{
    label: string;
    actionType: 'link' | 'whatsapp' | 'chip';
    url?: string;
    payload?: string;
  }>;
  orderCard?: {
    orderNumber: string;
    status: string;
    totalQAR: number;
    itemsCount: number;
    trackingNumber: string;
  };
}

const SUGGESTED_QUESTIONS = [
  { label: '📦 Track my order', query: 'Amr ki kono order ache?' },
  { label: '✈️ Delivery time to Qatar', query: 'How long does delivery take to Doha?' },
  { label: '💳 Payment & Apple Pay', query: 'What payment methods do you accept in Qatar?' },
  { label: '🔌 UK 3-pin plug compatibility', query: 'Are plugs compatible with Qatar wall sockets?' },
  { label: '🛡️ 14-day warranty & returns', query: 'What is your warranty and return policy?' },
  { label: '🔥 Top trending gadgets', query: 'What are your top trending products?' },
];

export const ChatWidget: React.FC = () => {
  const pathname = usePathname();
  const {
    isChatOpen,
    openChat,
    closeChat,
    orders,
    activeOrder,
    savedAddresses,
    chatInitialPrompt,
    clearChatInitialPrompt,
  } = useShop();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLauncherDismissed, setIsLauncherDismissed] = useState(false);
  const [customerName, setCustomerName] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Helper to extract clean first name from full name or first name
  const extractFirstName = (nameStr?: string | null): string | null => {
    if (!nameStr) return null;
    const clean = nameStr.trim();
    if (!clean) return null;
    const firstWord = clean.split(' ')[0].replace(/[^a-zA-Z\u0980-\u09FF\u0600-\u06FF]/g, '');
    if (!firstWord) return null;
    return firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
  };

  // Resolve customer name from active order, previous orders or saved addresses
  const resolveCustomerNameFromContext = (
    ord?: Order | null,
    orderList?: Order[],
    addresses?: QatarAddress[]
  ): string | null => {
    if (ord?.address) {
      const fromFirst = extractFirstName(ord.address.firstName);
      if (fromFirst) return fromFirst;
      const fromFull = extractFirstName(ord.address.fullName);
      if (fromFull) return fromFull;
    }

    if (orderList && orderList.length > 0) {
      for (const o of orderList) {
        if (o.address) {
          const fromFirst = extractFirstName(o.address.firstName);
          if (fromFirst) return fromFirst;
          const fromFull = extractFirstName(o.address.fullName);
          if (fromFull) return fromFull;
        }
      }
    }

    if (addresses && addresses.length > 0) {
      for (const a of addresses) {
        const fromFirst = extractFirstName(a.firstName);
        if (fromFirst) return fromFirst;
        const fromFull = extractFirstName(a.fullName);
        if (fromFull) return fromFull;
      }
    }

    return null;
  };

  // Initial greeting
  const getInitialWelcomeMessages = (name?: string | null): ChatMessage[] => [
    {
      id: 'msg-welcome-1',
      sender: 'agent',
      agentName: 'Qatify Support',
      text: name
        ? `Marhaba ${name}! 👋 Welcome to Qatify Customer Care. How can we assist you with your orders or delivery across Qatar today?`
        : 'Marhaba! 👋 Welcome to Qatify Customer Care. How can we assist you with our products, orders, or delivery across Qatar today?',
      timestamp: formatCurrentTime(),
    },
  ];

  // Detect and synchronize customer name from context or storage
  useEffect(() => {
    try {
      const cached = sessionStorage.getItem('qatify_customer_name');
      if (cached) {
        setCustomerName(cached);
        return;
      }
    } catch {}

    const detected = resolveCustomerNameFromContext(activeOrder, orders, savedAddresses);
    if (detected) {
      setCustomerName(detected);
      try {
        sessionStorage.setItem('qatify_customer_name', detected);
      } catch {}
    }
  }, [activeOrder, orders, savedAddresses]);

  // Lifecycle rule:
  // 1. Homepage reload OR redirect to homepage -> ALWAYS show icon again!
  // 2. Other pages (shop, products, etc.) reload -> does NOT show if previously dismissed!
  // 3. Stays visible on all pages until user explicitly clicks the cross (dismiss) icon!
  useEffect(() => {
    setIsHydrated(true);

    if (pathname === '/') {
      // User is on homepage (either by reload or navigation from another page):
      // Always restore launcher visibility!
      setIsLauncherDismissed(false);
      try {
        sessionStorage.removeItem('qatify_chat_dismissed');
      } catch {}
    } else {
      // User is on another page: check if dismissed in this session
      try {
        const isDismissed = sessionStorage.getItem('qatify_chat_dismissed') === 'true';
        setIsLauncherDismissed(isDismissed);
      } catch {
        setIsLauncherDismissed(false);
      }
    }

    // Load persistent chat messages
    try {
      const stored = localStorage.getItem('qatify_chat_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        } else {
          setMessages(getInitialWelcomeMessages(customerName));
        }
      } else {
        setMessages(getInitialWelcomeMessages(customerName));
      }
    } catch {
      setMessages(getInitialWelcomeMessages(customerName));
    }
  }, [pathname]);

  // Sync to LocalStorage
  useEffect(() => {
    if (isHydrated && messages.length > 0) {
      try {
        localStorage.setItem('qatify_chat_history', JSON.stringify(messages));
      } catch (err) {
        console.error('Failed to save chat history:', err);
      }
    }
  }, [messages, isHydrated]);

  // Scroll to bottom when messages update or typing starts
  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isChatOpen]);

  // Handle initial prompt passed from other components (e.g. Product Page)
  useEffect(() => {
    if (isChatOpen && chatInitialPrompt) {
      setIsLauncherDismissed(false);
      handleSendMessage(chatInitialPrompt);
      clearChatInitialPrompt();
    }
  }, [isChatOpen, chatInitialPrompt]);

  // Focus input on open
  useEffect(() => {
    if (isChatOpen) {
      setUnreadCount(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isChatOpen]);

  const handleClearHistory = () => {
    const welcome = getInitialWelcomeMessages(customerName);
    setMessages(welcome);
    try {
      localStorage.setItem('qatify_chat_history', JSON.stringify(welcome));
    } catch {}
  };

  // User dismisses launcher: hides from other pages until user goes to homepage or reloads homepage
  const handleDismissLauncher = () => {
    setIsLauncherDismissed(true);
    try {
      sessionStorage.setItem('qatify_chat_dismissed', 'true');
    } catch {}
  };

  const formatLine = (lineText: string) => {
    const parts: React.ReactNode[] = [];
    let remaining = lineText;
    let keyIdx = 0;
    const tokenRegex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*)/;

    while (remaining) {
      const match = remaining.match(tokenRegex);
      if (!match || match.index === undefined) {
        parts.push(remaining);
        break;
      }

      if (match.index > 0) {
        parts.push(remaining.substring(0, match.index));
      }

      if (match[2] && match[3]) {
        const label = match[2];
        const url = match[3];
        parts.push(
          <Link
            key={keyIdx++}
            href={url}
            onClick={() => closeChat()}
            style={{ color: '#8A1538', textDecoration: 'underline', fontWeight: 600 }}
          >
            {label}
          </Link>
        );
      } else if (match[4]) {
        parts.push(<strong key={keyIdx++}>{match[4]}</strong>);
      }

      remaining = remaining.substring(match.index + match[0].length);
    }

    return parts;
  };

  const renderFormattedText = (rawText: string) => {
    const paragraphs = rawText.split('\n\n');
    return paragraphs.map((para, pIdx) => (
      <p key={pIdx} className={styles.paragraph}>
        {para.split('\n').map((line, lIdx) => (
          <React.Fragment key={lIdx}>
            {lIdx > 0 && <br />}
            {formatLine(line)}
          </React.Fragment>
        ))}
      </p>
    ));
  };

  // Helper to detect out-of-scope non-Qatify questions
  const isOutOfScopeQuery = (text: string) => {
    const lower = text.toLowerCase().trim();

    // Math & calculations
    if (/^(\d+\s*[\+\-\*\/]\s*\d+|what is \d+|\d+\s*plus\s*\d+|\d+\s*minus\s*\d+)/.test(lower)) {
      return true;
    }

    // Coding / Software engineering outside of shopping
    if (
      (lower.includes('write code') ||
        lower.includes('write python') ||
        lower.includes('javascript') ||
        lower.includes('react component') ||
        lower.includes('html code') ||
        lower.includes('sql query')) &&
      !lower.includes('charger') &&
      !lower.includes('cable') &&
      !lower.includes('keyboard') &&
      !lower.includes('mouse')
    ) {
      return true;
    }

    // Non-store trivia, politics, recipes, poems
    const offTopicList = [
      'poem',
      'poetry',
      'essay',
      'homework',
      'capital of',
      'weather in',
      'president',
      'prime minister',
      'politics',
      'election',
      'recipe',
      'joke',
      'story',
      'crypto',
      'bitcoin',
      'fifa winner',
      'world cup winner',
    ];

    if (offTopicList.some((k) => lower.includes(k))) {
      return true;
    }

    // Unrelated company customer care
    if (
      (lower.includes('amazon') ||
        lower.includes('daraz') ||
        lower.includes('aliexpress') ||
        lower.includes('noon') ||
        lower.includes('ebay')) &&
      (lower.includes('my order in') || lower.includes('helpline') || lower.includes('complaint'))
    ) {
      return true;
    }

    return false;
  };

  // High-precision live Qatify Site Data Intelligence Engine
  const generateBotReply = (userQuery: string): ChatMessage => {
    const q = userQuery.toLowerCase().trim();
    const time = formatCurrentTime();
    const id = 'msg-reply-' + Date.now();

    const isBengali =
      /[\u0980-\u09FF]/.test(userQuery) ||
      q.includes('amr') ||
      q.includes('amar') ||
      q.includes('ache') ||
      q.includes('kono') ||
      q.includes('koro') ||
      q.includes('bolo') ||
      q.includes('kivabe') ||
      q.includes('kemon') ||
      q.includes('koto');

    // 1. Check if user typed or mentioned an order number in their message
    const orderCodeMatch = userQuery.match(/(QA-\d+|QAT-[A-Z0-9-]+|[A-Z]{2,4}-\d{4,8})/i);
    let locatedOrder: Order | null = null;

    if (orderCodeMatch) {
      const code = orderCodeMatch[0].toUpperCase();
      const matched = orders?.find(
        (o) => o.orderNumber.toUpperCase() === code || o.trackingNumber.toUpperCase() === code
      );
      if (matched) {
        locatedOrder = matched;
      } else if (code === 'QA-89421' || code === 'QAT-AIR-89421' || code === 'QA-896533') {
        // Backend sample tracked order (from convex/tracking.ts)
        locatedOrder = {
          id: code,
          orderNumber: code,
          trackingNumber: code,
          date: 'Nov 14, 2026',
          items: [
            {
              id: 'item-1',
              productId: 'porodo-7-in-1-cleaning-kit',
              title: 'Porodo Multi-Functional 7-in-1 Electronic Cleaning Kit',
              quantity: 1,
              priceQAR: 49,
              slug: 'porodo-7-in-1-electronic-earbud-cleaning-kit',
              image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=400',
            } as any,
          ],
          subtotalQAR: 49,
          shippingQAR: 0,
          discountQAR: 0,
          totalQAR: 49,
          address: {
            firstName: 'Tafsir',
            lastName: 'Ahmed',
            fullName: 'Tafsir Ahmed',
            municipality: 'Doha',
            zoneNumber: '45',
            streetAddress: 'Al Sadd, Street 920',
            apartmentSuite: 'Building 12, Apt 4B',
            country: 'Qatar',
            phoneCountryCode: '974',
            phoneNumber: '44374646',
            postalCode: '00974',
          },
          shippingMethod: {
            id: 'express_air',
            name: 'Direct Air Express',
            badge: '6-10 Days',
            duration: '6-10 Days',
            priceQAR: 0,
            description: 'Priority Air Cargo',
          },
          paymentMethod: 'apple_pay',
          status: 'Order Confirmed',
          estimatedDeliveryWindow: '6-10 Business Days',
          timeline: [],
        };
      }
    }

    const currentOrder = locatedOrder || activeOrder || (orders && orders[0]) || null;

    // 2. Extract customer name from order or session
    const resolvedName =
      resolveCustomerNameFromContext(currentOrder, orders, savedAddresses) ||
      customerName ||
      (typeof window !== 'undefined' ? sessionStorage.getItem('qatify_customer_name') : null);

    if (resolvedName && resolvedName !== customerName) {
      setCustomerName(resolvedName);
      try {
        sessionStorage.setItem('qatify_customer_name', resolvedName);
      } catch {}
    }

    // 3. Mandatory personalized greeting prefix
    const activeName = resolvedName || customerName;
    const greeting = activeName
      ? isBengali
        ? `হ্যালো ${activeName}!`
        : `Hi ${activeName}!`
      : isBengali
      ? `হ্যালো!`
      : `Hello!`;

    // 0. Strict Out-of-Scope Check
    if (isOutOfScopeQuery(userQuery)) {
      if (isBengali) {
        return {
          id,
          sender: 'agent',
          agentName: 'Qatify Support',
          text: `${greeting} আমি শুধুমাত্র Qatify কাতার-এর প্রোডাক্ট, অর্ডার, ডেলিভারি এবং ওয়েবসাইট সংক্রান্ত বিষয়ে সহায়তা করতে পারি। এর বাইরের কোনো বিষয়ে সহায়তা করা সম্ভব নয়।\n\nQatify-এর প্রোডাক্ট, ডেলিভারি বা সার্ভিস সম্পর্কে যেকোনো প্রশ্ন থাকলে নির্দ্বিধায় জিজ্ঞাসা করতে পারেন!`,
          timestamp: time,
          actions: [
            { label: 'Track my order', actionType: 'chip', payload: 'Amr ki kono order ache?' },
            { label: 'Delivery time to Qatar', actionType: 'chip', payload: 'How long does delivery take to Doha?' },
            { label: 'Browse Store', actionType: 'link', url: '/shop' },
          ],
        };
      }

      return {
        id,
        sender: 'agent',
        agentName: 'Qatify Support',
        text: `${greeting} I am specialized exclusively in assisting with Qatify Qatar orders, products, delivery, and store services. I cannot assist with external or unrelated topics.\n\nPlease feel free to ask me anything about our gadgets, order tracking, 6–10 days delivery across Qatar, or 14-day warranty!`,
        timestamp: time,
        actions: [
          { label: 'Track my order', actionType: 'chip', payload: 'Amr ki kono order ache?' },
          { label: 'Delivery time to Qatar', actionType: 'chip', payload: 'How long does delivery take to Doha?' },
          { label: 'Browse Store', actionType: 'link', url: '/shop' },
        ],
      };
    }

    // 1. Live Order Lookup ("Amr ki kono order ache?", "Track my order", "Where is my parcel")
    if (
      q.includes('order ache') ||
      q.includes('kono order') ||
      q.includes('amr order') ||
      q.includes('amar order') ||
      q.includes('track') ||
      q.includes('where is my package') ||
      q.includes('where is my order') ||
      q.includes('shipment') ||
      q.includes('order status') ||
      q.includes('qat-') ||
      orderCodeMatch ||
      (q.includes('order') && (q.includes('track') || q.includes('status') || q.includes('check') || q.includes('locate') || q.includes('kivabe')))
    ) {
      if (currentOrder) {
        const orderCustomer = extractFirstName(currentOrder.address?.firstName) || extractFirstName(currentOrder.address?.fullName);
        const nameToUse = orderCustomer || activeName;
        const personalizedGreeting = nameToUse
          ? isBengali
            ? `হ্যালো ${nameToUse}!`
            : `Hi ${nameToUse}!`
          : greeting;

        const replyText = isBengali
          ? `${personalizedGreeting} আপনার অর্ডার #${currentOrder.orderNumber} সিস্টেমে ট্র্যাক করা হয়েছে (স্ট্যাটাস: "${currentOrder.status}", সর্বমোট: QAR ${currentOrder.totalQAR})। নিচে লাইভ ট্র্যাকিং কার্ড দেওয়া হলো:`
          : `${personalizedGreeting} I located your order #${currentOrder.orderNumber}! Current status: "${currentOrder.status}" (Total: QAR ${currentOrder.totalQAR}). Here are the live air tracking details:`;

        return {
          id,
          sender: 'agent',
          agentName: 'Qatify Support',
          text: replyText,
          timestamp: time,
          orderCard: {
            orderNumber: currentOrder.orderNumber,
            status: currentOrder.status,
            totalQAR: currentOrder.totalQAR,
            itemsCount: currentOrder.items.length,
            trackingNumber: currentOrder.trackingNumber,
          },
          actions: [
            {
              label: 'Open Tracking Dashboard',
              actionType: 'link',
              url: `/dashboard?tab=tracking&order=${currentOrder.orderNumber}`,
            },
            {
              label: 'Delivery Timeline',
              actionType: 'chip',
              payload: 'How long does delivery take to Doha?',
            },
          ],
        };
      }

      // No active order found in session
      const noOrderText = isBengali
        ? `${greeting} আপনার বর্তমান ব্রাউজার সেশনে কোনো সক্রিয় অর্ডার পাওয়া যায়নি।\n\nআপনি আমাদের ক্যাটালগ থেকে যেকোনো অথেনটিক প্রোডাক্ট অর্ডার করতে পারেন। যদি আপনার পূর্বের কোনো অর্ডার রেফারেন্স নম্বর (যেমন: QAT-XXXX বা QA-89421) থাকে, তা লিখলে আমি সরাসরি ট্র্যাক করে দিতে পারব!`
        : `${greeting} You currently have no active orders in this session.\n\nYou can browse our latest genuine electronics in the shop, or if you have an Order Reference (format: QA-89421 or QAT-XXXX), send it here and I will look up your shipment!`;

      return {
        id,
        sender: 'agent',
        agentName: 'Qatify Support',
        text: noOrderText,
        timestamp: time,
        actions: [
          {
            label: '🛍️ Browse Tech Catalog',
            actionType: 'link',
            url: '/shop',
          },
          {
            label: '📦 Open Tracking Dashboard',
            actionType: 'link',
            url: '/dashboard',
          },
        ],
      };
    }

    // 2. Specific Product Category / Catalog Lookups (Live data from PRODUCTS)
    const productKeywords: Record<string, string[]> = {
      smartwatches: ['watch', 'smartwatch', 'amoled', 'fitness tracker', 'band'],
      'chargers-powerbanks': ['charger', 'power bank', 'powerbank', 'gan', 'magsafe', 'wireless charger'],
      'mobile-accessories': ['earbud', 'earbuds', 'headphone', 'headset', 'anc', 'soundcore', 'case', 'screen protector'],
      'gaming-gear': ['keyboard', 'mouse', 'gaming', 'desk mat', 'rgb'],
      'car-tech': ['car mount', 'car charger', 'dash cam', 'tire inflator', 'car'],
      'smart-home': ['smart home', 'wifi plug', 'light bar', 'lamp'],
      'laptop-gear': ['laptop stand', 'usb-c hub', 'docking', 'stand'],
    };

    for (const [catSlug, terms] of Object.entries(productKeywords)) {
      if (terms.some((term) => q.includes(term))) {
        const matchedProducts = PRODUCTS.filter((p) => p.category === catSlug || terms.some((t) => p.title.toLowerCase().includes(t))).slice(0, 3);

        if (matchedProducts.length > 0) {
          const listText = matchedProducts
            .map(
              (p) =>
                `• **${p.title}** — **QAR ${p.priceQAR}** ${p.originalPriceQAR ? `(Was QAR ${p.originalPriceQAR})` : ''}\n  [View Product](/products/${p.slug})`
            )
            .join('\n\n');

          const intro = isBengali
            ? `${greeting} Qatify-এর লাইভ ক্যাটালগ থেকে পাওয়া টপ-রেটেড জেনুইন প্রোডাক্টসমূহ (কাতারে ৬–১০ দিনে ডোরস্টেপ ডেলিভারি):\n\n${listText}`
            : `${greeting} Here are our top-rated genuine products in this category available with 6–10 days delivery across Qatar:\n\n${listText}`;

          return {
            id,
            sender: 'agent',
            agentName: 'Qatify Support',
            text: intro,
            timestamp: time,
            actions: [
              {
                label: 'Browse All in Category',
                actionType: 'link',
                url: `/shop?cat=${catSlug}`,
              },
            ],
          };
        }
      }
    }

    // 3. Trending Products / Best Sellers
    if (q.includes('trending') || q.includes('best seller') || q.includes('recommend') || q.includes('popular') || q.includes('ki ki product') || q.includes('what to buy')) {
      const topProducts = PRODUCTS.filter((p) => p.isBestSeller || p.badge).slice(0, 3);
      const listText = topProducts
        .map(
          (p) =>
            `• **${p.title}** — **QAR ${p.priceQAR}**\n  [View Product](/products/${p.slug})`
        )
        .join('\n\n');

      const intro = isBengali
        ? `${greeting} বর্তমানে Qatify কাতারে সর্বাধিক জনপ্রিয় গ্যাজেটসমূহ:\n\n${listText}\n\n১৫০ QAR বা তার বেশি অর্ডারে কাতারের যেকোনো স্থানে সম্পূর্ণ **ফ্রি ডেলিভারি**!`
        : `${greeting} Here are the top trending electronics on Qatify right now:\n\n${listText}\n\nAll orders over QAR 150 qualify for **FREE Delivery** across Qatar!`;

      return {
        id,
        sender: 'agent',
        agentName: 'Qatify Support',
        text: intro,
        timestamp: time,
        actions: [
          {
            label: 'Explore Full Catalog',
            actionType: 'link',
            url: '/shop',
          },
        ],
      };
    }

    // 4. Delivery Times / Shipping Policy
    if (
      q.includes('delivery') ||
      q.includes('shipping') ||
      q.includes('how long') ||
      q.includes('days') ||
      q.includes('doha') ||
      q.includes('lusail') ||
      q.includes('al rayyan') ||
      q.includes('al wakrah') ||
      q.includes('air') ||
      q.includes('kobe pabo') ||
      q.includes('charge koto')
    ) {
      const deliveryText = isBengali
        ? `${greeting} Qatify-এর প্রতিটি অর্ডার সরাসরি শিডিউলড এয়ার এক্সপ্রেসের মাধ্যমে হামাদ আন্তর্জাতিক বিমানবন্দরে (DOH) পৌঁছায় এবং কাস্টমস ক্লিয়ারেন্স সম্পন্ন করে দোহা, লুসাইল, আল রাইয়ান, আল ওয়াকরাহ সহ কাতারের সব মিউনিসিপ্যালিটিতে **৬ থেকে ১০ কার্যদিবসে** ডেলিভারি করা হয়।\n\n• **ফ্রি ডেলিভারি**: ১৫০ QAR বা তার বেশি মূল্যের অর্ডারে সম্পূর্ণ ফ্রি।\n• **স্ট্যান্ডার্ড রেট**: ১৫০ QAR-এর নিচের অর্ডারে ফ্ল্যাট ১৫ QAR।`
        : `${greeting} All Qatify orders are flown via scheduled direct air express to Hamad International Airport (DOH) with customs pre-cleared. Doorstep delivery takes **6 to 10 business days** across Doha, Lusail, Al Rayyan, Al Wakrah, and all Qatar municipalities.\n\n• **FREE Delivery**: On orders QAR 150 and above\n• **Standard Rate**: Flat QAR 15 for orders under QAR 150`;

      return {
        id,
        sender: 'agent',
        agentName: 'Qatify Support',
        text: deliveryText,
        timestamp: time,
        actions: [
          {
            label: 'Browse Catalog',
            actionType: 'link',
            url: '/shop',
          },
        ],
      };
    }

    // 5. Payment / Apple Pay / QAR
    if (
      q.includes('pay') ||
      q.includes('apple pay') ||
      q.includes('google pay') ||
      q.includes('card') ||
      q.includes('currency') ||
      q.includes('qar') ||
      q.includes('riyal') ||
      q.includes('payment')
    ) {
      const payText = isBengali
        ? `${greeting} আমরা **Apple Pay**, **Google Pay**, **Visa**, **Mastercard** এবং **American Express** সাপোর্ট করি। সমস্ত লেনদেন সরাসরি **কাতারি রিয়াল (QAR)**-এ প্রসেস হয়, তাই কাতারি ব্যাংক কার্ডে (QNB, CBQ, QIB, Doha Bank ইত্যাদি) কোনো ফরেন কারেন্সি কনভার্সন ফি লাগে না।`
        : `${greeting} We accept **Apple Pay**, **Google Pay**, **Visa**, **Mastercard**, and **American Express**. All transactions are processed strictly in **Qatari Riyal (QAR)** with **0% foreign exchange fees** on cards issued by Qatari banks (QNB, CBQ, QIB, Doha Bank, etc.).`;

      return {
        id,
        sender: 'agent',
        agentName: 'Qatify Support',
        text: payText,
        timestamp: time,
        actions: [
          {
            label: 'View Shopping Cart',
            actionType: 'link',
            url: '/cart',
          },
        ],
      };
    }

    // 6. UK Plug & Voltage Compatibility
    if (
      q.includes('plug') ||
      q.includes('socket') ||
      q.includes('pin') ||
      q.includes('voltage') ||
      q.includes('uk') ||
      q.includes('adapter') ||
      q.includes('compatible')
    ) {
      const plugText = isBengali
        ? `${greeting} হ্যাঁ, সম্পূর্ণ নিশ্চিত! আমাদের সব ইলেকট্রনিক্স ও চার্জার কাতারের **220V–240V, 50Hz** গ্রিডের সাথে শতভাগ মানানসই এবং স্ট্যান্ডার্ড **UK Type-G (ব্রিটিশ ৩-পিন)** প্লাগযুক্ত অথবা অনুমোদিত কাতার অ্যাডাপ্টার সহ আসে।`
        : `${greeting} Yes! 100% of our electronic chargers and accessories are certified for Qatar’s **220V–240V, 50Hz** electrical standard. Products feature standard **Type-G (British 3-pin)** plugs or include certified Qatar wall adapters.`;

      return {
        id,
        sender: 'agent',
        agentName: 'Qatify Support',
        text: plugText,
        timestamp: time,
        actions: [
          {
            label: 'GaN Chargers & Cables',
            actionType: 'link',
            url: '/shop?cat=chargers-powerbanks',
          },
        ],
      };
    }

    // 7. Warranty & 14-day Returns
    if (
      q.includes('warranty') ||
      q.includes('return') ||
      q.includes('refund') ||
      q.includes('replace') ||
      q.includes('defective') ||
      q.includes('broken') ||
      q.includes('guarantee')
    ) {
      const warrantyText = isBengali
        ? `${greeting} Qatify-এর প্রতিটি অর্ডারে শতভাগ বায়ার প্রটেকশন রয়েছে:\n\n• **১৪ দিনের ওয়ারেন্টি ও রিটার্ন**: ম্যানুফ্যাকচারিং কোনো সমস্যা থাকলে দ্রুত রিপ্লেসমেন্ট বা রিফান্ড পাবেন (জিরো রিস্টকিং ফি)।\n• **১০০% ট্রানজিট গ্যারান্টি**: পার্সেল কুরিয়ার ট্রানজিটে কোনো সমস্যা হলে সম্পূর্ণ রিফান্ড বা ফ্রি রি-শিপমেন্ট দেওয়া হয়।`
        : `${greeting} Every purchase on Qatify includes full buyer protection:\n\n• **14-Day Warranty & Returns**: For any functional manufacturing defects, we offer rapid replacement or refund with zero restocking fee.\n• **100% Transit Guarantee**: If your parcel is lost or delayed in transit, you receive an immediate full refund or priority reshipment.`;

      return {
        id,
        sender: 'agent',
        agentName: 'Qatify Support',
        text: warrantyText,
        timestamp: time,
        actions: [
          {
            label: 'Read Return Policy',
            actionType: 'link',
            url: '/refund-policy',
          },
        ],
      };
    }

    // 8. Discounts / Promo Code
    if (
      q.includes('discount') ||
      q.includes('coupon') ||
      q.includes('code') ||
      q.includes('promo') ||
      q.includes('offer')
    ) {
      const promoText = isBengali
        ? `${greeting} চেকআউটে কুপন কোড **WELCOME10** ব্যবহার করে আপনার অর্ডারে তাৎক্ষণিক **১০% অতিরিক্ত ছাড়** উপভোগ করতে পারেন! এছাড়া ১৫০ QAR বা ততোধিক মূল্যের অর্ডারে ফ্রি ডেলিভারি স্বয়ংক্রিয়ভাবে প্রযোজ্য।`
        : `${greeting} You can use promo code **WELCOME10** at checkout for **10% off** your order! Plus, orders of QAR 150 or more automatically receive **FREE express air delivery**.`;

      return {
        id,
        sender: 'agent',
        agentName: 'Qatify Support',
        text: promoText,
        timestamp: time,
        actions: [
          {
            label: 'Start Shopping',
            actionType: 'link',
            url: '/shop',
          },
        ],
      };
    }

    // 9. Greetings
    if (
      q.includes('salam') ||
      q.includes('marhaba') ||
      q.includes('hello') ||
      q.includes('hi') ||
      q.includes('hey')
    ) {
      const greetText = isBengali
        ? `${greeting} Marhaba! مرحباً بك! Qatify কাস্টমার সাপোর্টে স্বাগতম। আপনার প্রোডাক্ট অর্ডার, ডেলিভারি বা ট্র্যাকিং বিষয়ে কীভাবে সহায়তা করতে পারি?`
        : `${greeting} Marhaba! Welcome to Qatify. How can we assist you with our electronics catalog, order status, or delivery across Qatar today?`;

      return {
        id,
        sender: 'agent',
        agentName: 'Qatify Support',
        text: greetText,
        timestamp: time,
      };
    }

    // 10. Default Store Fallback
    const defaultText = isBengali
      ? `${greeting} Qatify কাস্টমার কেয়ারে যোগাযোগ করার জন্য ধন্যবাদ। আপনি আপনার অর্ডার ট্র্যাক করতে পারেন, কাতারের মিউনিসিপ্যালিটিগুলোতে ৬–১০ দিনের ডেলিভারি সম্পর্কে জানতে পারেন অথবা আমাদের গ্যাজেট ক্যাটালগ ব্রাউজ করতে পারেন।`
      : `${greeting} Thank you for reaching out to Qatify Customer Care. How can we assist you with this? You can track an order, inquire about 6–10 days delivery to your municipality in Qatar, or browse genuine electronics.`;

    return {
      id,
      sender: 'agent',
      agentName: 'Qatify Support',
      text: defaultText,
      timestamp: time,
      actions: [
        {
          label: 'Track my order',
          actionType: 'chip',
          payload: 'Amr ki kono order ache?',
        },
        {
          label: 'Delivery time to Qatar',
          actionType: 'chip',
          payload: 'How long does delivery take to Doha?',
        },
        {
          label: 'Browse All Products',
          actionType: 'link',
          url: '/shop',
        },
      ],
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMessage: ChatMessage = {
      id: 'msg-user-' + Date.now(),
      sender: 'user',
      text,
      timestamp: formatCurrentTime(),
    };

    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInputText('');
    setIsTyping(true);

    const q = text.toLowerCase();

    // Check if this is an immediate store query where local data is authoritative and instant
    const isDirectStoreQuery =
      q.includes('order') ||
      q.includes('track') ||
      q.includes('delivery') ||
      q.includes('shipping') ||
      q.includes('pay') ||
      q.includes('card') ||
      q.includes('plug') ||
      q.includes('warranty') ||
      q.includes('refund') ||
      q.includes('coupon') ||
      q.includes('discount') ||
      q.includes('watch') ||
      q.includes('charger') ||
      q.includes('earbud') ||
      q.includes('keyboard') ||
      q.includes('mouse') ||
      q.includes('car') ||
      q.includes('hello') ||
      q.includes('salam') ||
      /(QA-\d+|QAT-[A-Z0-9-]+|[A-Z]{2,4}-\d{4,8})/i.test(text) ||
      isOutOfScopeQuery(text);

    if (isDirectStoreQuery) {
      // Respond ultra-fast with natural 350ms typing delay using live store data
      setTimeout(() => {
        const botReply = generateBotReply(text);
        setMessages((prev) => [...prev, botReply]);
        setIsTyping(false);

        if (!isChatOpen) {
          setUnreadCount((c) => c + 1);
        }
      }, 350);
      return;
    }

    // For open-ended queries, try the fast Gemini route with 2.2s client timeout
    try {
      const activeOrderData = activeOrder
        ? {
            orderNumber: activeOrder.orderNumber,
            status: activeOrder.status,
            totalQAR: activeOrder.totalQAR,
            itemsCount: activeOrder.items.length,
            trackingNumber: activeOrder.trackingNumber,
            customerName: customerName || undefined,
          }
        : orders && orders[0]
        ? {
            orderNumber: orders[0].orderNumber,
            status: orders[0].status,
            totalQAR: orders[0].totalQAR,
            itemsCount: orders[0].items.length,
            trackingNumber: orders[0].trackingNumber,
            customerName: customerName || undefined,
          }
        : null;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2200);

      const response = await fetch('/api/chat', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: updatedHistory.slice(-6).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
          activeOrder: activeOrderData,
          customerName: customerName || undefined,
        }),
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.text) {
          const aiReply: ChatMessage = {
            id: 'msg-ai-' + Date.now(),
            sender: 'agent',
            agentName: 'Qatify Support',
            text: data.text,
            timestamp: formatCurrentTime(),
            actions: data.actions || [],
          };

          setMessages((prev) => [...prev, aiReply]);
          setIsTyping(false);

          if (!isChatOpen) {
            setUnreadCount((c) => c + 1);
          }
          return;
        }
      }
    } catch {
      // On timeout or network failure, immediately generate local reply
    }

    // Fast fallback with live store data
    setTimeout(() => {
      const botReply = generateBotReply(text);
      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);

      if (!isChatOpen) {
        setUnreadCount((c) => c + 1);
      }
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickQuestion = (query: string) => {
    handleSendMessage(query);
  };

  return (
    <>
      {/* 1. FLOATING LAUNCHER BUTTON (Bottom-Right, Modern Clean Light FAB) */}
      {!isLauncherDismissed && (
        <div className={styles.launcherWrapper}>
          <div className={styles.btnContainer}>
            {/* Small dismiss cross button to let user dismiss the launcher */}
            {!isChatOpen && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDismissLauncher();
                }}
                className={styles.dismissBtn}
                title="Hide chat button"
                aria-label="Hide live support chat button"
              >
                <X size={11} strokeWidth={2.4} />
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (isChatOpen) {
                  closeChat();
                } else {
                  openChat();
                }
              }}
              className={`${styles.floatingBtn} ${isChatOpen ? styles.btnActive : ''}`}
              aria-label={isChatOpen ? 'Close support chat' : 'Open support chat'}
              title={isChatOpen ? 'Close chat' : 'Customer Support'}
            >
              <div className={styles.btnInner}>
                {isChatOpen ? (
                  <X size={18} className={styles.btnIcon} strokeWidth={2.2} />
                ) : (
                  <>
                    <MessageCircle size={22} className={styles.btnIcon} strokeWidth={2} />
                    <span className={styles.pulseDot} />
                  </>
                )}

                {!isChatOpen && unreadCount > 0 && (
                  <span className={styles.unreadBadge}>{unreadCount}</span>
                )}
              </div>
            </button>
          </div>
        </div>
      )}

      {/* 2. CHAT WINDOW / MODAL (Modern Clean White Light Theme) */}
      {isChatOpen && (
        <>
          <div className={styles.chatBackdrop} onClick={closeChat} aria-hidden="true" />
          <div className={styles.chatWindow} role="dialog" aria-label="Customer Support Live Chat">
            {/* Clean Light Professional Header */}
            <div className={styles.header}>
              <div className={styles.agentInfo}>
                <div className={styles.avatarWrap}>
                  <div className={styles.avatarGroup}>
                    <Headphones size={15} className={styles.avatarIcon} />
                  </div>
                  <span className={styles.onlineStatusRing} />
                </div>

                <div className={styles.titleCol}>
                  <div className={styles.brandTitleRow}>
                    <h3 className={styles.supportTitle}>Qatify Support</h3>
                    <span className={styles.qatarFlagBadge}>🇶🇦 Qatar</span>
                  </div>
                  <div className={styles.supportMeta}>
                    <span className={styles.greenDot} />
                    <span>Online • Instant replies</span>
                  </div>
                </div>
              </div>

              <div className={styles.headerActions}>
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className={styles.headerActionBtn}
                  title="Reset conversation"
                  aria-label="Reset chat history"
                >
                  <RotateCcw size={14} />
                </button>

                <button
                  type="button"
                  onClick={closeChat}
                  className={styles.closeBtn}
                  title="Close chat"
                  aria-label="Close chat window"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages Stream */}
            <div className={styles.messagesContainer}>
              <div className={styles.dayDivider}>
                <span>Support Assistant • Qatify Qatar</span>
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`${styles.messageRow} ${
                    msg.sender === 'user' ? styles.userRow : styles.agentRow
                  }`}
                >
                  {msg.sender === 'agent' && (
                    <div className={styles.agentAvatarMini}>
                      <span>Q</span>
                    </div>
                  )}

                  <div className={styles.messageBubble}>
                    {msg.sender === 'agent' && msg.agentName && (
                      <span className={styles.agentNameLabel}>{msg.agentName}</span>
                    )}

                    <div className={styles.messageContent}>
                      {renderFormattedText(msg.text)}
                    </div>

                    {/* Render Live Order Card if included */}
                    {msg.orderCard && (
                      <div className={styles.orderSnippetCard}>
                        <div className={styles.orderSnippetHeader}>
                          <Package size={15} className={styles.orderSnippetIcon} />
                          <span className={styles.orderSnippetNum}>
                            Order #{msg.orderCard.orderNumber}
                          </span>
                          <span className={styles.orderSnippetBadge}>
                            {msg.orderCard.status}
                          </span>
                        </div>
                        <div className={styles.orderSnippetBody}>
                          <div className={styles.orderSnippetRow}>
                            <span>Total Amount:</span>
                            <strong>QAR {msg.orderCard.totalQAR}</strong>
                          </div>
                          <div className={styles.orderSnippetRow}>
                            <span>Items:</span>
                            <span>{msg.orderCard.itemsCount} products</span>
                          </div>
                          <div className={styles.orderSnippetRow}>
                            <span>Tracking Code:</span>
                            <span className={styles.monoCode}>
                              {msg.orderCard.trackingNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons if provided */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className={styles.messageActionsList}>
                        {msg.actions.map((act, aIdx) => {
                          if (act.actionType === 'chip') {
                            return (
                              <button
                                key={aIdx}
                                type="button"
                                onClick={() => handleSendMessage(act.payload || act.label)}
                                className={styles.actionBtnLink}
                              >
                                <span>{act.label}</span>
                                <ArrowRight size={12} />
                              </button>
                            );
                          }
                          if (act.url?.startsWith('http')) {
                            return (
                              <a
                                key={aIdx}
                                href={act.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.actionBtnLink}
                              >
                                <span>{act.label}</span>
                                <ExternalLink size={12} />
                              </a>
                            );
                          }
                          return (
                            <Link
                              key={aIdx}
                              href={act.url || '#'}
                              onClick={() => closeChat()}
                              className={styles.actionBtnLink}
                            >
                              <span>{act.label}</span>
                              <ArrowRight size={12} />
                            </Link>
                          );
                        })}
                      </div>
                    )}

                    <div className={styles.messageFooter}>
                      <span className={styles.timestamp}>{msg.timestamp}</span>
                      {msg.sender === 'user' && (
                        <CheckCheck size={14} className={styles.readCheck} />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className={`${styles.messageRow} ${styles.agentRow}`}>
                  <div className={styles.agentAvatarMini}>
                    <span>Q</span>
                  </div>
                  <div className={styles.typingBubble}>
                    <span className={styles.typingDot} />
                    <span className={styles.typingDot} />
                    <span className={styles.typingDot} />
                    <span className={styles.typingHint}>Replying...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Quick Questions Chips */}
            <div className={styles.suggestionChipsContainer}>
              <span className={styles.chipsLabel}>Suggested:</span>
              <div className={styles.chipsScroll}>
                {SUGGESTED_QUESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickQuestion(item.query)}
                    className={styles.chipBtn}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Input Bar */}
            <div className={styles.inputArea}>
              <div className={styles.inputWrapper}>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about products, orders, or delivery..."
                  className={styles.chatInput}
                  maxLength={400}
                />

                {/* Send Button */}
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim()}
                  className={`${styles.sendBtn} ${inputText.trim() ? styles.sendActive : ''}`}
                  aria-label="Send message"
                >
                  <Send size={15} />
                </button>
              </div>

              <div className={styles.inputBottomNote}>
                <span>🔒 Secure chat • Official Qatify Qatar Store</span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
