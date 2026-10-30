'use client';

// =============================================================================
// Qatify — Live Customer Support Chat Widget
// Features:
// - Floating bottom-right launcher with pulsing active status
// - Proactive Doha support invitation bubble
// - In-app conversational assistant for orders, shipping, payment, tech specs
// - Direct WhatsApp 1-tap handoff (+974 5512 8894)
// - Direct Doha hotline link (+974 4492 8100)
// - Real-time order lookup from active shop context
// - Quick FAQ suggestion chips & typing simulator
// - Persistent chat history with localStorage
// =============================================================================

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  X,
  Send,
  RotateCcw,
  Package,
  Plane,
  ShieldCheck,
  CreditCard,
  CheckCheck,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Minimize2,
  Plug,
  HelpCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useShop } from '@/context/ShopContext';
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
  { label: '📦 Track my order', query: 'Can you help track my order?' },
  { label: '✈️ Delivery time to Qatar', query: 'How long does delivery take to Doha?' },
  { label: '💳 Payment & Apple Pay', query: 'What payment methods do you accept?' },
  { label: '🔌 UK 3-pin plug compatibility', query: 'Are plugs compatible with Qatar wall sockets?' },
  { label: '🎧 Customer Support & Help', query: 'How can I contact customer support?' },
  { label: '💬 Talk to Live Support Agent', query: 'I want to talk to a customer support agent' },
];

export const ChatWidget: React.FC = () => {
  const {
    isChatOpen,
    openChat,
    closeChat,
    orders,
    activeOrder,
    cartSubtotal,
    freeShippingThreshold,
    chatInitialPrompt,
    clearChatInitialPrompt,
  } = useShop();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Initial greeting
  const getInitialWelcomeMessages = (): ChatMessage[] => [
    {
      id: 'msg-welcome-1',
      sender: 'agent',
      agentName: 'Tariq (Doha Support)',
      text: 'Marhaba! 👋 Welcome to Qatify Customer Support. I am here to assist you with orders, fast delivery across Qatar, or product inquiries.',
      timestamp: formatCurrentTime(),
    },
    {
      id: 'msg-welcome-2',
      sender: 'agent',
      agentName: 'Tariq (Doha Support)',
      text: 'How can we help you today? You can select a quick topic below or type your question directly.',
      timestamp: formatCurrentTime(),
    },
  ];

  // Hydration & LocalStorage load
  useEffect(() => {
    setIsHydrated(true);

    try {
      const stored = localStorage.getItem('qatify_chat_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        } else {
          setMessages(getInitialWelcomeMessages());
        }
      } else {
        setMessages(getInitialWelcomeMessages());
      }
    } catch {
      setMessages(getInitialWelcomeMessages());
    }
  }, []);

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
    const welcome = getInitialWelcomeMessages();
    setMessages(welcome);
    try {
      localStorage.setItem('qatify_chat_history', JSON.stringify(welcome));
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

  const generateBotReply = (userQuery: string): ChatMessage => {
    const q = userQuery.toLowerCase().trim();
    const time = formatCurrentTime();
    const id = 'msg-reply-' + Date.now();

    // 1. Order Tracking (Prioritized so questions like "Can you help track my order?" work accurately)
    if (
      q.includes('track') ||
      q.includes('where is my package') ||
      q.includes('where is my order') ||
      q.includes('shipment') ||
      q.includes('order status') ||
      q.includes('qat-') ||
      (q.includes('order') && (q.includes('track') || q.includes('status') || q.includes('check') || q.includes('locate')))
    ) {
      const foundOrder = activeOrder || (orders && orders[0]);

      if (foundOrder) {
        return {
          id,
          sender: 'agent',
          agentName: 'Tariq (Doha Support)',
          text: `I located your most recent order #${foundOrder.orderNumber}! Here are the live air tracking details:`,
          timestamp: time,
          orderCard: {
            orderNumber: foundOrder.orderNumber,
            status: foundOrder.status,
            totalQAR: foundOrder.totalQAR,
            itemsCount: foundOrder.items.length,
            trackingNumber: foundOrder.trackingNumber,
          },
          actions: [
            {
              label: '🔎 View Detailed Air Route & Timeline',
              actionType: 'link',
              url: '/dashboard',
            },
            {
              label: '✈️ Delivery Details & Timeline',
              actionType: 'chip',
              payload: 'How long does delivery take to Doha?',
            },
          ],
        };
      }

      return {
        id,
        sender: 'agent',
        agentName: 'Tariq (Doha Support)',
        text: 'To track your shipment, please visit your Orders Dashboard or provide your Order ID (format: QAT-XXXX-XXXX). Every Qatify shipment to Qatar includes full 6–8 Days tracked air transit directly to Hamad Airport (DOH).',
        timestamp: time,
        actions: [
          {
            label: '📦 Open Tracking Dashboard',
            actionType: 'link',
            url: '/dashboard',
          },
        ],
      };
    }

    // 2. Live Support Agent handoff (Strict intent only, avoids false positives on words like "help")
    if (
      q.includes('talk to human') ||
      q.includes('talk to agent') ||
      q.includes('live agent') ||
      q.includes('real person') ||
      q.includes('speak with agent') ||
      q.includes('customer care agent') ||
      q.includes('talk to someone') ||
      q.includes('representative')
    ) {
      return {
        id,
        sender: 'agent',
        agentName: 'Maryam (Senior Care)',
        text: 'Our Doha customer support team is active right now! You are chatting directly with live Qatify support. How can we assist you with your order, shipping, or product selection today?',
        timestamp: time,
        actions: [
          {
            label: '📦 Track My Order',
            actionType: 'chip',
            payload: 'Can you help track my order?',
          },
          {
            label: '✈️ Delivery Times to Qatar',
            actionType: 'chip',
            payload: 'How long does delivery take to Doha?',
          },
          {
            label: '🎧 Customer Support Help',
            actionType: 'chip',
            payload: 'How can I contact customer support?',
          },
        ],
      };
    }

    // 3. Delivery Times / Shipping
    if (
      q.includes('delivery') ||
      q.includes('shipping') ||
      q.includes('how long') ||
      q.includes('days') ||
      q.includes('doha') ||
      q.includes('lusail') ||
      q.includes('al rayyan') ||
      q.includes('air')
    ) {
      return {
        id,
        sender: 'agent',
        agentName: 'Tariq (Doha Support)',
        text: 'All orders are processed promptly with express delivery directly to your doorstep across Doha, Lusail, Al Rayyan, Al Wakrah, and Al Khor. We handle 100% of customs clearance and deliver safely within 6–8 business days.',
        timestamp: time,
        actions: [
          {
            label: '🛍️ Browse Trending Gadgets',
            actionType: 'link',
            url: '/shop',
          },
        ],
      };
    }

    // 4. Payment / Apple Pay / QAR
    if (
      q.includes('pay') ||
      q.includes('apple pay') ||
      q.includes('card') ||
      q.includes('cod') ||
      q.includes('cash') ||
      q.includes('currency') ||
      q.includes('qar') ||
      q.includes('riyal')
    ) {
      return {
        id,
        sender: 'agent',
        agentName: 'Maryam (Senior Care)',
        text: 'We accept Apple Pay, Google Pay, Visa, Mastercard, and local Qatar debit cards. All prices and transactions are processed strictly in Qatari Riyal (QAR) with ZERO foreign conversion fees.\n\n(Note: Cash on Delivery is currently unavailable; orders are processed safely online with 100% buyer protection).',
        timestamp: time,
        actions: [
          {
            label: '🛒 View My Shopping Cart',
            actionType: 'link',
            url: '/cart',
          },
        ],
      };
    }

    // 5. UK Plug & Voltage Compatibility
    if (
      q.includes('plug') ||
      q.includes('socket') ||
      q.includes('pin') ||
      q.includes('voltage') ||
      q.includes('uk') ||
      q.includes('adapter') ||
      q.includes('compatible')
    ) {
      return {
        id,
        sender: 'agent',
        agentName: 'Tariq (Doha Support)',
        text: 'Yes! 100% of our electronic chargers and power accessories are compatible with Qatar’s 220V–240V, 50Hz grid, and feature standard Type-G (British 3-pin) plugs or include certified Qatar wall adapters.',
        timestamp: time,
        actions: [
          {
            label: '⚡ See GaN Chargers & Power Banks',
            actionType: 'link',
            url: '/shop?cat=chargers-powerbanks',
          },
        ],
      };
    }

    // 6. Warranty & 14-day Returns
    if (
      q.includes('warranty') ||
      q.includes('return') ||
      q.includes('refund') ||
      q.includes('replace') ||
      q.includes('defective') ||
      q.includes('broken')
    ) {
      return {
        id,
        sender: 'agent',
        agentName: 'Maryam (Senior Care)',
        text: 'All Qatify electronics are 100% genuine, factory-sealed, and quality tested before dispatch. If you have any inquiries or need assistance with your items, our Doha support team is available via WhatsApp and live chat to assist you promptly.',
        timestamp: time,
        actions: [
          {
            label: '💬 Chat with Support Agent',
            actionType: 'chip',
            payload: 'I want to talk to a customer support agent',
          },
        ],
      };
    }

    // 7. Discounts / Coupons
    if (
      q.includes('discount') ||
      q.includes('coupon') ||
      q.includes('code') ||
      q.includes('promo') ||
      q.includes('offer')
    ) {
      return {
        id,
        sender: 'agent',
        agentName: 'Tariq (Doha Support)',
        text: '🎉 Use coupon code WELCOME10 at checkout to get an extra 10% off your entire first order! It applies on top of our best price guarantee.',
        timestamp: time,
        actions: [
          {
            label: '🛍️ Explore Qatar Catalog',
            actionType: 'link',
            url: '/shop',
          },
        ],
      };
    }

    // 8. Greetings (Salam, Marhaba, Hello)
    if (
      q.includes('salam') ||
      q.includes('marhaba') ||
      q.includes('hello') ||
      q.includes('hi') ||
      q.includes('hey') ||
      q.includes('good morning') ||
      q.includes('good evening')
    ) {
      return {
        id,
        sender: 'agent',
        agentName: 'Tariq (Doha Support)',
        text: 'Marhaba! مرحباً بك! How can I assist you with your tech shopping today? Let me know what products you’re interested in, or if you need help with shipping to your area in Qatar.',
        timestamp: time,
      };
    }

    // 9. Specific product question (from product page button)
    if (q.includes('question about') || q.includes('qar')) {
      return {
        id,
        sender: 'agent',
        agentName: 'Maryam (Senior Care)',
        text: `Thanks for asking about this gadget! It is in high demand in Qatar right now, comes with a 14-day warranty, and qualifies for tracked air shipping to Doha. Would you like to check compatibility or have an agent assist with your order?`,
        timestamp: time,
        actions: [
          {
            label: '🔌 Check Plug & Voltage Compatibility',
            actionType: 'chip',
            payload: 'Are plugs compatible with Qatar wall sockets?',
          },
        ],
      };
    }

    // Default Fallback
    return {
      id,
      sender: 'agent',
      agentName: 'Tariq (Doha Support)',
      text: `Thank you for reaching out! Regarding your inquiry: "${userQuery}", our Doha customer support team is right here to assist you. Feel free to ask about our 6–10 Days delivery to Qatar, UK 3-pin plug compatibility, or tracking your order.`,
      timestamp: time,
      actions: [
        {
          label: '📦 Track My Order',
          actionType: 'chip',
          payload: 'Can you help track my order?',
        },
        {
          label: '✈️ Delivery Times to Doha',
          actionType: 'chip',
          payload: 'How long does delivery take to Doha?',
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

    try {
      // 1. Try real Gemini AI shopping assistant API route
      const activeOrderData = activeOrder
        ? {
            orderNumber: activeOrder.orderNumber,
            status: activeOrder.status,
            totalQAR: activeOrder.totalQAR,
            itemsCount: activeOrder.items.length,
            trackingNumber: activeOrder.trackingNumber,
          }
        : (orders && orders[0])
        ? {
            orderNumber: orders[0].orderNumber,
            status: orders[0].status,
            totalQAR: orders[0].totalQAR,
            itemsCount: orders[0].items.length,
            trackingNumber: orders[0].trackingNumber,
          }
        : null;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: updatedHistory.slice(-6).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
          activeOrder: activeOrderData,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.text) {
          const aiReply: ChatMessage = {
            id: 'msg-ai-' + Date.now(),
            sender: 'agent',
            agentName: 'Tariq (Qatify AI Doha)',
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
    } catch (err) {
      console.warn('API chat route unavailable, using smart local fallback:', err);
    }

    // 2. Fallback to smart local rule-based response
    setTimeout(() => {
      const botReply = generateBotReply(text);
      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);

      if (!isChatOpen) {
        setUnreadCount((c) => c + 1);
      }
    }, 600);
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
      {/* 1. FLOATING LAUNCHER BUTTON (Bottom-Right) */}
      <div className={styles.launcherWrapper}>
        {/* Floating Action Button - Clean Circular Chat Icon */}
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
          aria-label={isChatOpen ? 'Close live support chat' : 'Open live support chat'}
          title={isChatOpen ? 'Close live chat' : 'Chat with live support'}
        >
          <div className={styles.btnInner}>
            {isChatOpen ? (
              <X size={24} className={styles.btnIcon} />
            ) : (
              <>
                <MessageCircle size={24} className={styles.btnIcon} />
                <span className={styles.pulseDot} />
              </>
            )}

            {!isChatOpen && unreadCount > 0 && (
              <span className={styles.unreadBadge}>{unreadCount}</span>
            )}
          </div>
        </button>
      </div>

      {/* 2. CHAT WINDOW / MODAL */}
      {isChatOpen && (
        <div className={styles.chatWindow} role="dialog" aria-label="Customer Support Live Chat">
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.agentInfo}>
              <div className={styles.avatarWrap}>
                <div className={styles.avatarGroup}>
                  <div className={styles.avatarIcon}>
                    <Sparkles size={16} />
                  </div>
                </div>
                <span className={styles.onlineStatusRing} />
              </div>

              <div className={styles.titleCol}>
                <div className={styles.brandTitleRow}>
                  <h3 className={styles.supportTitle}>Qatify Qatar Support</h3>
                  <span className={styles.qatarFlagBadge}>🇶🇦 Doha</span>
                </div>
                <div className={styles.supportMeta}>
                  <span className={styles.greenDot} />
                  <span>Online now • ⚡ Fast response (GMT+3)</span>
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
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick Qatar Presence Banner */}
          <div className={styles.presenceBanner}>
            <div className={styles.presenceText}>
              <span>🚚 <strong>Express Qatar Delivery:</strong> Fast tracked doorstep delivery to Doha, Lusail & all Qatar</span>
            </div>
          </div>

          {/* Messages Stream */}
          <div className={styles.messagesContainer}>
            <div className={styles.dayDivider}>
              <span>Today • Doha Live Care</span>
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
                        <Package size={16} className={styles.orderSnippetIcon} />
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
                          <span>Items in Shipment:</span>
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
                  <span className={styles.typingHint}>Tariq is replying...</span>
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
                placeholder="Ask about orders, delivery, or gadgets..."
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
                <Send size={16} />
              </button>
            </div>

            <div className={styles.inputBottomNote}>
              <span>🔒 256-bit encrypted • Doha office 8 AM – 11 PM</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

