# Polar Checkouts & Payment Flows

> **Official Reference**: [Polar Checkouts API](https://polar.sh/docs/api-reference/2026-10/checkouts)  
> **Endpoint**: `POST /v1/checkouts`  
> **SDK Method**: `polar.checkouts.create(...)`

---

## 1. Overview of Checkout Sessions

A Polar **Checkout Session** represents a customer's payment intent. It generates a secure, hosted checkout page URL that handles:
- Credit / Debit Cards (Visa, Mastercard, Amex)
- Digital Wallets (Apple Pay, Google Pay)
- Currency Conversion & Display
- Real-time tax handling and discount vouchers

---

## 2. Creating a Checkout Session Programmatically

### Request Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `products` | `string[]` | Conditional | Array of product UUIDs from your Polar catalog |
| `amount` | `number` | Conditional | Custom checkout amount in subunit (e.g., 25000 = 250.00 QAR) |
| `currency` | `string` | Optional | Currency code in lowercase (e.g., `"qar"`, `"usd"`) |
| `customer_email` | `string` | Optional | Pre-fills the customer's email address |
| `customer_name` | `string` | Optional | Pre-fills customer name |
| `allow_discount_codes`| `boolean` | Optional | Allows promo vouchers on the checkout page |
| `require_billing_address`| `boolean`| Optional | Whether to enforce full billing address form |
| `success_url` | `string` | Required | URL to redirect after successful payment (supports `{CHECKOUT_ID}`) |
| `cancel_url` | `string` | Optional | URL to redirect if customer cancels payment |
| `metadata` | `object` | Optional | Custom key-value pairs (order number, delivery zone, etc.) |

---

## 3. Implementation Code Example

### Direct SDK Example (2026-10)

```typescript
import { createPolar } from "@polar-sh/sdk/2026-10";

const polar = createPolar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: process.env.POLAR_ENVIRONMENT === "sandbox" ? "sandbox" : "production",
});

export async function createQatifyCheckout({
  orderNumber,
  orderId,
  customerName,
  customerEmail,
  customerPhone,
  totalQar,
  shippingZone,
  siteUrl,
}: {
  orderNumber: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalQar: number;
  shippingZone: string;
  siteUrl: string;
}) {
  // Convert QAR to minor currency units (1 QAR = 100 Dirhams)
  const amountInSubunits = Math.round(totalQar * 100);

  const checkout = await polar.checkouts.create({
    amount: amountInSubunits,
    currency: "qar",
    customer_email: customerEmail,
    customer_name: customerName,
    allow_discount_codes: true,
    require_billing_address: false,
    success_url: `${siteUrl}/checkout/success?orderNumber=${orderNumber}&session_id={CHECKOUT_ID}`,
    cancel_url: `${siteUrl}/cart`,
    metadata: {
      orderId,
      orderNumber,
      customerPhone,
      shippingZone,
      deliveryModel: "AirExpress_6_10_Days",
    },
  });

  return {
    id: checkout.id,
    url: checkout.url, // Redirect target for the buyer
  };
}
```

---

## 4. Checkout Response Structure

When `polar.checkouts.create` succeeds, it returns a checkout object containing:

```json
{
  "id": "e49f6b98-38bb-4a7b-a0ea-7a2e45da7b51",
  "created_at": "2026-10-24T18:00:00Z",
  "status": "open",
  "client_secret": "polar_cs_...",
  "url": "https://sandbox.polar.sh/checkout/e49f6b98-38bb-4a7b-a0ea-7a2e45da7b51",
  "expires_at": "2026-10-25T18:00:00Z",
  "success_url": "https://qatify.qa/checkout/success?orderNumber=QA-89421&session_id={CHECKOUT_ID}",
  "amount": 28900,
  "currency": "qar",
  "customer_email": "customer@example.qa",
  "metadata": {
    "orderNumber": "QA-89421",
    "deliveryModel": "AirExpress_6_10_Days"
  }
}
```

---

## 5. Redirecting the Customer in Next.js

Once the URL is returned to the Next.js frontend, redirect the window:

```tsx
const { checkoutUrl } = await createCheckoutAction({ orderId });

// Redirect customer to Polar hosted payment page
window.location.href = checkoutUrl;
```

When payment completes successfully, Polar redirects the customer to:
`https://qatify.qa/checkout/success?orderNumber=QA-89421&session_id=e49f6b98-38bb-4a7b-a0ea-7a2e45da7b51`

