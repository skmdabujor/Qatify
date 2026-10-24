# Polar 2026-10 API Introduction & SDK Setup

> **Official Reference**: [Polar API Reference (2026-10)](https://polar.sh/docs/api-reference/2026-10/introduction)  
> **Official Website**: [polar.sh](https://polar.sh)  
> **Package**: `@polar-sh/sdk`

---

## 1. What is Polar?

**Polar** is a modern developer-first payment and billing platform built for digital products, e-commerce checkouts, and recurring subscriptions.

Key advantages for Qatify:
- **Hosted Checkout Sessions**: High-converting, mobile-friendly hosted checkout pages with global credit/debit card support, Apple Pay, and Google Pay.
- **Dynamic & Fixed Pricing**: Support for catalog products or custom on-the-fly checkout totals.
- **Standard Webhooks**: Built on the HMAC Standard Webhook specification for instant, tamper-proof payment notifications.
- **Developer Sandbox**: Full-featured test environment (`sandbox.polar.sh`) with test card numbers for risk-free integration.

---

## 2. API Versioning (2026-10)

Polar uses dated API versions to maintain backwards compatibility. The current stable version is **`2026-10`**.

### Base URLs
- **Production API**: `https://api.polar.sh/v1`
- **Sandbox API**: `https://sandbox-api.polar.sh/v1`

---

## 3. Authentication & API Tokens

Polar uses Bearer Token authentication via the standard HTTP `Authorization` header:

```http
Authorization: Bearer <POLAR_ACCESS_TOKEN>
```

### Obtaining an Access Token:
1. Log in to your Polar account:
   - Sandbox: [sandbox.polar.sh](https://sandbox.polar.sh)
   - Production: [polar.sh](https://polar.sh)
2. Navigate to **Settings ➔ Developers ➔ Access Tokens**.
3. Create a token with the following required scopes:
   - `checkouts:write` & `checkouts:read`
   - `orders:read`
   - `products:read`
   - `webhooks:read` & `webhooks:write`
4. Copy the token (starts with `polar_oat_...` or `polar_pat_...`).

---

## 4. Installing the Official TypeScript SDK

Inside the Qatify project root:

```bash
npm install @polar-sh/sdk
```

---

## 5. Initializing the SDK Client

You can initialize the SDK with the `2026-10` specification:

### Example: Helper Utility (`lib/polar.ts` or `convex/polar.ts`)

```typescript
import { createPolar } from "@polar-sh/sdk/2026-10";

// Determine environment
const isSandbox = process.env.POLAR_ENVIRONMENT === "sandbox";

export const polar = createPolar({
  accessToken: process.env.POLAR_ACCESS_TOKEN || "",
  server: isSandbox ? "sandbox" : "production",
});
```

### Environment Variables Required
In your `.env.local` (for Next.js) and Convex Environment:

```env
# Polar Environment ('sandbox' or 'production')
POLAR_ENVIRONMENT=sandbox

# Polar Organization Access Token
POLAR_ACCESS_TOKEN=polar_oat_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Polar Standard Webhook Secret (from Webhooks dashboard)
POLAR_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 6. Testing Connectivity

Verify your Polar client is connected:

```typescript
async function testPolarConnection() {
  try {
    const products = await polar.products.list({ limit: 1 });
    console.log("Polar connected successfully. Products count:", products.result.items.length);
  } catch (error) {
    console.error("Failed to connect to Polar:", error);
  }
}
```

