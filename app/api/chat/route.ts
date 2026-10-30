import { NextRequest, NextResponse } from 'next/server';
import { PRODUCTS, CATEGORIES, QATAR_MUNICIPALITIES } from '@/data/products';

interface ChatHistoryItem {
  sender: 'user' | 'agent' | 'system';
  text: string;
}

interface ActiveOrderInfo {
  orderNumber: string;
  status: string;
  totalQAR: number;
  itemsCount?: number;
  trackingNumber: string;
}

// Compact product representation for prompt context
const catalogContext = PRODUCTS.map((p) => ({
  title: p.title,
  slug: p.slug,
  category: p.category,
  brand: p.brand,
  priceQAR: p.priceQAR,
  originalPrice: p.originalPriceQAR,
  inStock: p.inStock,
  badge: p.badge || (p.isBestSeller ? 'Best Seller' : p.isFlashDeal ? 'Flash Deal' : ''),
  shortDesc: p.shortDescription,
}));

const SYSTEM_PROMPT = `You are Tariq, the senior Doha customer support & shopping assistant for "Qatify Qatar" (https://qatify.com).
Qatify is Qatar's premier curated online tech & gadget store, delivering high-grade electronics directly across Qatar.

### CORE STORE POLICIES & KNOWLEDGE (STRICT):
1. **Currency**: All prices are strictly in Qatari Riyal (QAR).
2. **Doorstep Delivery Across Qatar**:
   - Express air-cargo doorstep delivery to Doha, Lusail City, Al Rayyan, Al Wakrah, Al Khor, Umm Salal, Al Daayen, and Al Shamal.
   - Transit time is 6–8 business days (air cargo directly cleared through Hamad International Airport - DOH).
   - Standard Delivery fee is 20 QAR, or FREE for orders over 150 QAR.
3. **Plugs & Power Compatibility**:
   - 100% of electronic gadgets & chargers comply with Qatar's 220V–240V, 50Hz electrical system and standard UK Type-G (British 3-pin) plugs or include certified adapters.
4. **Quality Guarantee & Customer Support**:
   - 100% genuine, factory-sealed products. Every unit is inspected before dispatch.
   - Dedicated customer assistance via WhatsApp and live chat for order guidance and questions.
5. **Payment Methods**:
   - Apple Pay, Google Pay, Visa, Mastercard, and Qatar debit cards. Zero foreign currency conversion markup.
   - Cash on Delivery (COD) is currently unavailable; all orders are processed via 256-bit encrypted online checkout.
6. **Support Channels**:
   - WhatsApp Customer Support Hotline: +974 5512 8894 (or Doha office).
   - Orders & Air Tracking Dashboard: /dashboard

### PRODUCT CATALOG CONTEXT:
${JSON.stringify(catalogContext, null, 1)}

### INSTRUCTIONS:
- You are polite, knowledgeable, and helpful. You can greet warmly (e.g. "Marhaba! 👋" or "Hello! 👋").
- **Language**: Respond in the language the customer used (English, Bengali, Arabic, etc.). If asked in Bengali/Banglish, reply warmly in natural Bengali/Banglish.
- **Product recommendations**: When recommending a product, mention its exact title, price in QAR, why it's great, and provide its link in markdown: [View Product](/products/[slug]).
- **Order Tracking**:
  - If the user asks to track their order and active order details are provided in the prompt, tell them their order status, order number, and tracking number, and link to /dashboard.
  - If no order number or details exist, ask them politely for their Order ID (format: QAT-XXXX-XXXX) or suggest visiting the /dashboard tracking page.
- Keep responses concise, clear, formatting with bullet points when listing items. Avoid overly verbose filler.
`;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    const body = await req.json();
    const { message, history = [], activeOrder } = body as {
      message: string;
      history?: ChatHistoryItem[];
      activeOrder?: ActiveOrderInfo | null;
    };

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // If no API key is provided, return status so frontend can use smart local fallback
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        reason: 'NO_API_KEY',
        fallback: true,
      });
    }

    // Build Gemini contents payload from history + current message
    const formattedContents = [];

    // Include recent history (up to last 6 messages)
    const recentHistory = (history || []).slice(-6);
    for (const h of recentHistory) {
      if (h.sender === 'user') {
        formattedContents.push({
          role: 'user',
          parts: [{ text: h.text }],
        });
      } else if (h.sender === 'agent') {
        formattedContents.push({
          role: 'model',
          parts: [{ text: h.text }],
        });
      }
    }

    // Add current user prompt, enriched with active order context if present
    let enrichedPrompt = message;
    if (activeOrder) {
      enrichedPrompt += `\n\n[System Context: User has active order #${activeOrder.orderNumber}, Status: "${activeOrder.status}", Total: QAR ${activeOrder.totalQAR}, Tracking: ${activeOrder.trackingNumber}]`;
    }

    formattedContents.push({
      role: 'user',
      parts: [{ text: enrichedPrompt }],
    });

    // Try the best available Gemini Flash models in priority order
    const models = ['gemini-3-flash-preview', 'gemini-flash-latest', 'gemini-3.1-flash-lite-preview'];
    let aiResponseText = '';
    let lastError = null;

    for (const model of models) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: formattedContents,
              systemInstruction: {
                parts: [{ text: SYSTEM_PROMPT }],
              },
              generationConfig: {
                temperature: 0.5,
                maxOutputTokens: 800,
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const candidateText =
            data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            aiResponseText = candidateText;
            break;
          }
        } else {
          const errData = await geminiRes.text();
          console.warn(`Gemini ${model} failed:`, errData);
          lastError = errData;
        }
      } catch (err) {
        console.warn(`Gemini fetch error on ${model}:`, err);
        lastError = err;
      }
    }

    if (!aiResponseText) {
      return NextResponse.json({
        success: false,
        reason: 'GEMINI_CALL_FAILED',
        error: String(lastError),
        fallback: true,
      });
    }

    // Extract suggested actions (e.g. product links mentioned in the response)
    const actions: Array<{
      label: string;
      actionType: 'link' | 'chip';
      url?: string;
      payload?: string;
    }> = [];

    // Find product links in the markdown like /products/[slug]
    const productLinkRegex = /\/products\/([a-zA-Z0-9_-]+)/g;
    let match;
    const matchedSlugs = new Set<string>();

    while ((match = productLinkRegex.exec(aiResponseText)) !== null) {
      const slug = match[1];
      if (!matchedSlugs.has(slug)) {
        matchedSlugs.add(slug);
        const prod = PRODUCTS.find((p) => p.slug === slug);
        if (prod) {
          actions.push({
            label: `🛍️ ${prod.title.slice(0, 32)}... (QAR ${prod.priceQAR})`,
            actionType: 'link',
            url: `/products/${slug}`,
          });
        }
      }
    }

    // If user asked about order or tracking, provide dashboard link
    if (
      message.toLowerCase().includes('track') ||
      message.toLowerCase().includes('order') ||
      aiResponseText.toLowerCase().includes('/dashboard')
    ) {
      actions.push({
        label: '📦 View Orders & Air Tracking',
        actionType: 'link',
        url: '/dashboard',
      });
    }

    return NextResponse.json({
      success: true,
      text: aiResponseText,
      actions: actions.slice(0, 3), // limit to max 3 quick action links
    });
  } catch (error) {
    console.error('Chat API Route Error:', error);
    return NextResponse.json(
      {
        success: false,
        reason: 'SERVER_ERROR',
        fallback: true,
      },
      { status: 500 }
    );
  }
}

